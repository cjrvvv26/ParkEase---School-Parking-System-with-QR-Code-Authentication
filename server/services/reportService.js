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
    https
      .get(url, (res) => {
        const chunks = [];
        res.on('data', (chunk) => chunks.push(chunk));
        res.on('end', () => resolve(Buffer.concat(chunks)));
        res.on('error', reject);
      })
      .on('error', reject);
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

  // Get paid students count for current active semester
  const activeSemester = await Semester.findOne({ status: 'active' });
  const paidStudents = activeSemester
    ? await Student.countDocuments({
        'payment.isPaid': true,
        'payment.semesterId': activeSemester._id,
      })
    : await Student.countDocuments({ 'payment.isPaid': true });
  const totalActiveStudents = await Student.countDocuments();

  // Active students + faculty count for KPI denominator
  const activeStudentFaculty = await User.countDocuments({
    role: { $in: ['student', 'faculty'] },
    status: 'active',
  });

  // Calculate average unique users who parked per day (last 30 days)
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const parkLogs = await Activity.find({
    actionType: 'parking',
    action: 'PARKED',
    createdAt: { $gte: thirtyDaysAgo },
  })
    .select('userId createdAt')
    .lean();

  let avgParkPerDay = 0;
  if (parkLogs.length > 0) {
    const byDay = {};
    for (const log of parkLogs) {
      const day = new Date(log.createdAt).toDateString();
      if (!byDay[day]) byDay[day] = new Set();
      byDay[day].add(log.userId.toString());
    }
    const days = Object.values(byDay);
    avgParkPerDay = Math.round(
      days.reduce((s, d) => s + d.size, 0) / days.length,
    );
  }

  // Calculate total created slots
  const totalCreatedSlots = slots.length;
  const occupiedSlots = slots.filter((slot) => slot.isOccupied).length;
  const availableSlots = totalCreatedSlots - occupiedSlots;

  const data = [
    { title: 'Total Active Users', data: activeUsers.length },
    { title: 'Total Revenue', data: totalRevenue },
    {
      title: 'Total Paid Students',
      data: paidStudents,
      total: totalActiveStudents,
    },
    {
      title: 'Avg Users Park Per Day',
      data: avgParkPerDay,
      totalActive: activeStudentFaculty,
    },
    {
      title: 'Total Slots',
      data: totalCreatedSlots,
    },
    {
      title: 'Total Occupied',
      data: occupiedSlots,
    },
  ];

  return { data, occupiedSlots, availableSlots, totalCreatedSlots };
};

// Weekly Scans - Current week only (resets Monday)
exports.calculateWeeklyScans = async () => {
  const ActivityLog = require('../models/activityModel');
  const User = require('../models/userModel');

  // Get total active users who can park (students + faculty)
  const activeStudentFaculty = await User.countDocuments({
    role: { $in: ['student', 'faculty'] },
    status: 'active',
  });

  // Current week: Monday to Sunday
  const now = new Date();
  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - now.getDay() + 1); // Monday
  startOfWeek.setHours(0, 0, 0, 0);

  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6); // Sunday
  endOfWeek.setHours(23, 59, 59, 999);

  const logs = await ActivityLog.find({
    actionType: { $in: ['parking', 'scan'] },
    createdAt: { $gte: startOfWeek, $lte: endOfWeek },
  }).lean();

  const dayCounts = [0, 0, 0, 0, 0, 0, 0]; // Mon, Tue, Wed, Thu, Fri, Sat, Sun

  for (const log of logs) {
    const date = new Date(log.createdAt);
    const dayOfWeek = date.getDay(); // 0=Sun, 1=Mon, ..., 6=Sat
    const index = dayOfWeek === 0 ? 6 : dayOfWeek - 1; // Mon=0, Sun=6
    dayCounts[index]++;
  }

  // Calculate percentages based on active users
  const percentages = dayCounts.map((count) =>
    activeStudentFaculty > 0
      ? Math.round((count / activeStudentFaculty) * 100)
      : 0,
  );

  return {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    values: percentages,
    rawCounts: dayCounts, // For tooltip
    totalActiveUsers: activeStudentFaculty,
  };
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

exports.calculateOccupancyByHour = async () => {
  const ActivityLog = require('../models/activityModel');
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const slots = [
    { label: '5-8 AM', start: 5, end: 8 },
    { label: '9-11 AM', start: 9, end: 11 },
    { label: '12-2 PM', start: 12, end: 14 },
    { label: '3-5 PM', start: 15, end: 17 },
    { label: '6-8 PM', start: 18, end: 20 },
  ];

  const logs = await ActivityLog.find({
    actionType: 'parking',
    createdAt: { $gte: today, $lt: tomorrow },
  });

  const values = slots.map(({ start, end }) => {
    return logs.filter((l) => {
      const h = new Date(l.createdAt).getHours();
      return h >= start && h < end;
    }).length;
  });

  return { labels: slots.map((s) => s.label), values };
};

exports.calculateAvgParkingByHour = async () => {
  const ActivityLog = require('../models/activityModel');
  const User = require('../models/userModel');

  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const timeSlots = [
    { label: '5-8 AM', start: 5, end: 8 },
    { label: '9-11 AM', start: 9, end: 11 },
    { label: '12-2 PM', start: 12, end: 14 },
    { label: '3-5 PM', start: 15, end: 17 },
  ];

  const totalActive = await User.countDocuments({
    role: { $in: ['student', 'faculty'] },
    status: 'active',
  });

  // Use PARKED logs — createdAt is when the user started parking
  const logs = await ActivityLog.find({
    actionType: 'parking',
    action: 'PARKED',
    createdAt: { $gte: thirtyDaysAgo },
  })
    .select('userId createdAt')
    .lean();

  // For each time slot: count distinct users who ever parked in that slot
  // then express as % of total active students+faculty
  const values = timeSlots.map(({ start, end }) => {
    const uniqueUsers = new Set(
      logs
        .filter((l) => {
          const h = new Date(l.createdAt).getHours();
          return h >= start && h < end;
        })
        .map((l) => l.userId.toString())
    ).size;

    return totalActive > 0
      ? Math.min(100, Math.round((uniqueUsers / totalActive) * 100))
      : 0;
  });

  return {
    labels: timeSlots.map((s) => s.label),
    values,
    totalActive,
    totalSessions: logs.length,
  };
};

exports.calculatePreferredAreas = async () => {
  const Map = require('../models/mapModel');
  const Shape = require('../models/shapeModel');
  const Slot = require('../models/slotModel');

  const maps = await Map.find().lean();
  const results = [];

  for (const map of maps) {
    const shapes = await Shape.find({ mapId: map._id, 'metadata.type': 'slot' })
      .select('_id')
      .lean();
    const shapeIds = shapes.map((s) => s._id);
    const occupied = await Slot.countDocuments({
      slotId: { $in: shapeIds },
      isOccupied: true,
    });
    const total = shapes.length;
    results.push({ name: map.name, occupied, total });
  }
  return results.sort((a, b) => b.occupied - a.occupied);
};

exports.calculateTopParkingDuration = async () => {
  const ActivityLog = require('../models/activityModel');
  const User = require('../models/userModel');
  const Student = require('../models/studentModel');
  const Faculty = require('../models/facultyModel');

  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const logs = await ActivityLog.aggregate([
    {
      $match: {
        actionType: 'parking',
        action: 'UNPARKED',
        createdAt: { $gte: thirtyDaysAgo },
        'metadata.duration': { $gt: 0 },
      },
    },
    {
      $group: {
        _id: '$userId',
        totalDuration: { $sum: '$metadata.duration' },
        count: { $sum: 1 },
      },
    },
    { $sort: { totalDuration: -1 } },
    { $limit: 5 },
  ]);

  const maxDuration = logs[0]?.totalDuration || 1;
  const results = [];

  for (const log of logs) {
    const user = await User.findById(log._id).select('role').lean();
    if (!user) continue;

    let name = 'Unknown';

    if (user.role === 'student') {
      const s = await Student.findOne({ userId: log._id }).select('name').lean();
      if (s?.name) name = `${s.name.firstName.charAt(0)}. ${s.name.lastName}`;
    } else if (user.role === 'faculty') {
      const f = await Faculty.findOne({ userId: log._id }).select('name').lean();
      if (f?.name) name = `${f.name.firstName.charAt(0)}. ${f.name.lastName}`;
    }

    results.push({
      name,
      duration: log.totalDuration,
      pct: Math.round((log.totalDuration / maxDuration) * 100),
    });
  }

  return results;
};

exports.calculatePeakEntryTime = async () => {
  const ActivityLog = require('../models/activityModel');
  const Map = require('../models/mapModel');
  const Shape = require('../models/shapeModel');
  const Slot = require('../models/slotModel');

  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const logs = await ActivityLog.find({
    actionType: 'parking',
    action: 'ENTRY_TIME',
    createdAt: { $gte: thirtyDaysAgo },
  }).lean();

  if (!logs.length) return { peakTime: null, peakArea: null, peakPct: 0 };

  // Count by hour
  const hourCounts = {};
  for (const log of logs) {
    const h = new Date(log.createdAt).getHours();
    hourCounts[h] = (hourCounts[h] || 0) + 1;
  }
  const peakHour = Object.entries(hourCounts).sort((a, b) => b[1] - a[1])[0];
  const peakHourNum = parseInt(peakHour[0]);
  const total = logs.length;
  const peakPct = Math.round((peakHour[1] / total) * 100);

  const ampm = peakHourNum >= 12 ? 'PM' : 'AM';
  const h12 = peakHourNum % 12 || 12;
  const peakTime = `${h12}:00 ${ampm}`;

  // Find most common area (map name) from peak hour logs
  const peakLogs = logs.filter(
    (l) => new Date(l.createdAt).getHours() === peakHourNum,
  );
  const areaCounts = {};
  for (const log of peakLogs) {
    if (log.metadata?.slotId) {
      const shape = await Shape.findById(log.metadata.slotId)
        .select('mapId')
        .lean();
      if (shape?.mapId) {
        const key = shape.mapId.toString();
        areaCounts[key] = (areaCounts[key] || 0) + 1;
      }
    }
  }
  let peakArea = null;
  if (Object.keys(areaCounts).length) {
    const topMapId = Object.entries(areaCounts).sort(
      (a, b) => b[1] - a[1],
    )[0][0];
    const map = await Map.findById(topMapId).select('name').lean();
    peakArea = map?.name || null;
  }

  return { peakTime, peakArea, peakPct };
};

exports.calculateRecentActivity = async ({ limit = 5 } = {}) => {
  const ActivityLog = require('../models/activityModel');
  const User = require('../models/userModel');
  const Student = require('../models/studentModel');
  const Faculty = require('../models/facultyModel');

  const logs = await ActivityLog.find({ actionType: 'parking' })
    .sort({ createdAt: -1 })
    .limit(limit)
    .lean();

  const formatTimeAgo = (date) => {
    if (!date) return 'unknown';
    const diff = Date.now() - new Date(date).getTime();
    const minutes = Math.floor(diff / 60000);
    if (minutes < 1) return 'just now';
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  const results = [];

  for (const log of logs) {
    const user = await User.findById(log.userId).select('role').lean();
    let roleLabel = user?.role || 'User';
    let name = '';
    if (user?.role === 'student') {
      const student = await Student.findOne({ userId: user._id })
        .select('name')
        .lean();
      name = student?.name
        ? `${student.name.firstName} ${student.name.lastName}`
        : 'Student';
    } else if (user?.role === 'faculty') {
      const faculty = await Faculty.findOne({ userId: user._id })
        .select('name')
        .lean();
      name = faculty?.name
        ? `${faculty.name.firstName} ${faculty.name.lastName}`
        : 'Faculty';
    }

    const actionLabel = log.action === 'PARKED' ? 'Occupied' : 'Released';

    results.push({
      label:
        log.metadata?.slotLabel || `Slot ${log.metadata?.slotNumber || ''}`,
      sub: `${actionLabel} by ${name || roleLabel}`.trim(),
      time: formatTimeAgo(log.createdAt),
      status: log.action === 'PARKED' ? 'occupied' : 'released',
    });
  }

  return results;
};

exports.calculateUsersByCourse = async ({ courseId } = {}) => {
  const Course = require('../models/courseModel');
  const yearLevels = ['1st', '2nd', '3rd', '4th'];

  // If no course selected, use first course
  let course = null;
  if (courseId) {
    course = await Course.findById(courseId).select('_id name').lean();
  } else {
    course = await Course.findOne().select('_id name').lean();
  }

  if (!course) return { results: [], total: 0, course: null, courses: [] };

  const courses = await Course.find().select('_id name').lean();

  const results = await Promise.all(
    yearLevels.map(async (yl) => {
      const count = await Student.countDocuments({
        course: course._id,
        yearLevel: yl,
      });
      return { yearLevel: yl, count };
    }),
  );

  const total = results.reduce((s, r) => s + r.count, 0);
  return { results, total, course, courses };
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
