const User = require('../models/userModel');
const Slot = require('../models/slotModel');
const Semester = require('../models/semesterModel');
const Student = require('../models/studentModel');
const Activity = require('../models/activityModel');
const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');
const https = require('https');

const fetchImageBuffer = (url) =>
  new Promise((resolve, reject) => {
    https.get(url, (res) => {
      const chunks = [];
      res.on('data', (chunk) => chunks.push(chunk));
      res.on('end', () => resolve(Buffer.concat(chunks)));
      res.on('error', reject);
    }).on('error', reject);
  });

exports.calculateSystemSummary = async () => {
  // Get active users (not deactivated)
  const activeUsers = await User.find({ status: { $nin: ['deactivate'] } });

  // Get all slots
  const slots = await Slot.find();

  // Get all semesters
  const allSemesters = await Semester.find();

  // Calculate total revenue - use stored revenue for expired semesters, calculate for active
  let totalRevenue = 0;
  for (const semester of allSemesters) {
    let semesterRevenue = semester.revenue || 0;

    // If semester is active, calculate revenue in real-time
    if (semester.status === 'active') {
      const paidStudentsCount = await Student.countDocuments({
        'payment.isPaid': true,
        'payment.semesterId': semester._id,
      });
      semesterRevenue = paidStudentsCount * semester.slotPrice;
    }

    totalRevenue += semesterRevenue;
  }

  // Get paid students count
  const paidStudents = await Student.countDocuments({ 'payment.isPaid': true });

  // Calculate average parking duration (in minutes) for the last 30 days
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const parkingActivities = await Activity.find({
    actionType: 'parking',
    createdAt: { $gte: thirtyDaysAgo },
  });

  let avgParkingDuration = 0;
  if (parkingActivities.length > 0) {
    const totalDuration = parkingActivities.reduce((sum, activity) => {
      const duration = activity.duration || 0; // duration should be in minutes
      return sum + duration;
    }, 0);
    avgParkingDuration = Math.round(totalDuration / parkingActivities.length);
  }

  // Calculate occupied and available slots
  const occupiedSlots = slots.filter((slot) => slot.isOccupied).length;
  const availableSlots = slots.length - occupiedSlots;

  const data = [
    { title: 'Total Active Users', data: activeUsers.length },
    { title: 'Total Revenue', data: totalRevenue },
    { title: 'Total Paid Students', data: paidStudents },
    { title: 'Avg Parking (mins)', data: avgParkingDuration },
  ];

  return { data, occupiedSlots, availableSlots };
};

// Calculate monthly revenue for the year based on activity logs
exports.calculateMonthlyRevenue = async () => {
  const currentYear = new Date().getFullYear();
  const monthlyRevenue = [];

  const ActivityLog = require('../models/activityModel');

  // Loop through each month
  for (let month = 0; month < 12; month++) {
    const startDate = new Date(currentYear, month, 1);
    const endDate = new Date(currentYear, month + 1, 0, 23, 59, 59);

    let monthRevenue = 0;

    // Get all payment update logs from activity logs for this month
    const paymentLogs = await ActivityLog.find({
      action: 'UPDATE_PAYMENT_STATUS',
      createdAt: { $gte: startDate, $lte: endDate },
      'metadata.newValue': { $gt: 0 }, // Only records where payment was marked (newValue > 0)
    });

    // Calculate revenue from payment logs
    for (const log of paymentLogs) {
      if (log.metadata?.newValue) {
        monthRevenue += log.metadata.newValue;
      }
    }

    monthlyRevenue.push(monthRevenue);
  }

  return monthlyRevenue;
};

//Generate info pdf system report summary
exports.generateReportIntoPDF = ({ summary, semester, parking }) => {
  if (!summary || !semester || !parking) return;
  console.log(semester);

  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ size: 'A4', margin: 20 });
    const chunks = [];

    doc.on('data', (chunk) => chunks.push(chunk));
    doc.on('end', () => resolve(Buffer.concat(chunks)));
    doc.on('error', (err) => reject(err));

    // Absolute logo path
    const logoPath = path.join(__dirname, '../images/logo.jpg');

    doc
      .image(logoPath, 20, 20, { valign: 'center', width: 40, height: 40 })
      .fillColor('#2d2d2d')
      .text('University of Rizal System', 70, 30, { align: 'left' })
      .fontSize(10)
      .fillColor('gray')
      .text('Cainta Campus', 70, 43, { align: 'left' })
      .text('Date: ', 20, 30, {
        align: 'right',
      })
      .fillColor('#2d2d2d')
      .text(`${new Date().toLocaleDateString()}`, 0, 43, {
        align: 'right',
      });

    doc
      .fontSize(18)
      .fillColor('#2d2d2d')
      .font('Helvetica-Bold')
      .moveDown(2)
      .text('School Parking Management', 40, 80, {
        align: 'center',
      })
      .text('System Report', {
        align: 'center',
      });

    doc
      .moveDown(1)
      .font('Helvetica-Bold')
      .fontSize(12)
      .fillColor('#2d2d2d')
      .text('System Summary');

    doc.font('Helvetica').fontSize(12);

    doc.table({
      columnStyles: {
        0: { width: 130, align: 'center' },
        1: { width: 130, align: 'center' },
        2: { width: 130, align: 'center' },
        3: { width: 130, align: 'center' },
      },
      defaultStyle: {
        font: 'Helvetica',
        fontSize: 11,
        border: 1,
        borderColor: '#cccccc',
        padding: 8,
      },
      headerStyle: {
        fillColor: '#2f80ed',
        fillOpacity: 0.2,
        font: 'Helvetica-Medium',
        fontSize: 8,
        color: '#2d2d2d',
      },
      data: [summary.data.map((s) => s.title), summary.data.map((s) => s.data)],
    });

    doc
      .moveDown(1)
      .font('Helvetica-Bold')
      .fontSize(12)
      .fillColor('#2d2d2d')
      .text('Parking Summary');

    doc.font('Helvetica').fontSize(12);

    doc.table({
      columnStyles: {
        0: { width: 130, align: 'center' },
        1: { width: 130, align: 'center' },
        2: { width: 130, align: 'center' },
        3: { width: 130, align: 'center' },
      },
      defaultStyle: {
        font: 'Helvetica',
        fontSize: 11,
        border: 1,
        borderColor: '#cccccc',
        padding: 8,
      },
      headerStyle: {
        fillColor: '#2f80ed',
        fillOpacity: 0.2,
        font: 'Helvetica-Medium',
        fontSize: 8,
        color: '#2d2d2d',
      },
      data: [parking.map((p) => p.title), parking.map((p) => p.data)],
    });

    doc
      .moveDown(1)
      .font('Helvetica-Bold')
      .fontSize(12)
      .fillColor('#2d2d2d')
      .text('Semester Summary');

    doc.font('Helvetica').fontSize(12);

    doc.table({
      columnStyles: {
        0: { width: 130, align: 'center' },
        1: { width: 130, align: 'center' },
        2: { width: 130, align: 'center' },
        3: { width: 130, align: 'center' },
      },
      defaultStyle: {
        font: 'Helvetica',
        fontSize: 11,
        border: 1,
        borderColor: '#cccccc',
        padding: 8,
      },
      headerStyle: {
        fillColor: '#2f80ed',
        fillOpacity: 0.2,

        fontSize: 8,
        color: '#2d2d2d',
      },
      data: [
        semester.filter((s) => s.title !== 'Total Revenue').map((s) => s.title),
        semester.filter((s) => s.title !== 'Total Revenue').map((s) => s.data),
      ],
    });

    // doc.font('Helvetica').fontSize(11);

    // const boxY = doc.y + 40;
    // const boxX = 20;
    // const boxWidth = doc.page.width - 40;
    // const boxHeight = 120;

    // doc
    //   .save()
    //   .rect(boxX, boxY, boxWidth, boxHeight)
    //   .fill('#f2f2f2') // light gray
    //   .restore();

    // doc
    //   .fillColor('#2d2d2d')
    //   .font('Helvetica-Bold')
    //   .text('Current Semester Details', boxX + 15, boxY + 10);

    // doc
    //   .font('Helvetica')
    //   .moveDown(0.5)
    //   .text('Semester Name: 1st Semester 2025-2026', boxX + 15)
    //   .text('Start Date: August 2025', boxX + 15)
    //   .text('End Date: December 2025', boxX + 15)
    //   .text('Total Revenue: $5,000', boxX + 15);

    // doc.y = boxY + boxHeight + 15;
    doc.end();
  });
};

//Generate into pdf slots qr code
exports.generateSlotsQRCodeIntoPDF = (map, slots) => {
  return new Promise(async (resolve, reject) => {
    const doc = new PDFDocument({ size: 'A4', margin: 20 });
    const chunks = [];

    doc.on('data', (chunk) => chunks.push(chunk));
    doc.on('end', () => resolve(Buffer.concat(chunks)));
    doc.on('error', (err) => reject(err));

    const startX = 40;
    const startY = 40;

    let x = startX;
    let y = startY;

    const qrSize = 80;
    const colGap = 130;

    doc
      .text(map.name, x - 20, y)
      .fillColor('#2d2d2d')
      .fontSize(16);

    doc.fontSize(11);

    for (let i = 0; slots.length > i; i++) {
      const slot = slots[i];

      const qrImageUrl = slot.QRCode?.url;
      if (!qrImageUrl) continue;

      // Fetch the Cloudinary image as a buffer
      const qrBuffer = await fetchImageBuffer(qrImageUrl);

      // QR
      doc.image(qrBuffer, x, y + 15, {
        width: qrSize,
        height: qrSize,
      });
      // Label
      doc.text(slot.slotId?.metadata?.label, x, y + qrSize + 20, {
        width: qrSize,
        align: 'center',
      });

      x += 130;

      if ((i + 1) % 4 === 0) {
        x = 40;
        y += 130;
      }
    }
    doc.end();
  });
};
