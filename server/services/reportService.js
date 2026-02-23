const User = require("../models/userModel");
const Slot = require("../models/slotModel");
const Semester = require("../models/semesterModel");
const Student = require("../models/studentModel");
const Activity = require("../models/activityModel");

exports.calculateSystemSummary = async () => {
  // Get active users (not deactivated)
  const activeUsers = await User.find({ status: { $nin: ["deactivate"] } });

  // Get all slots
  const slots = await Slot.find();

  // Get all semesters
  const allSemesters = await Semester.find();

  // Calculate total revenue by counting paid students per semester and multiplying by slot price
  let totalRevenue = 0;
  for (const semester of allSemesters) {
    const paidStudentsCount = await Student.countDocuments({
      "payment.isPaid": true,
      "payment.semesterId": semester._id,
    });
    const semesterRevenue = paidStudentsCount * semester.slotPrice;
    totalRevenue += semesterRevenue;
  }

  // Get paid students count
  const paidStudents = await Student.countDocuments({ "payment.isPaid": true });

  // Calculate average parking duration (in minutes) for the last 30 days
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const parkingActivities = await Activity.find({
    actionType: "parking",
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
    { title: "Total Active Users", data: activeUsers.length },
    { title: "Total Revenue", data: totalRevenue },
    { title: "Total Paid Students", data: paidStudents },
    { title: "Avg Parking (mins)", data: avgParkingDuration },
  ];

  return { data, occupiedSlots, availableSlots };
};

// Calculate monthly revenue for the year based on activity logs
exports.calculateMonthlyRevenue = async () => {
  const currentYear = new Date().getFullYear();
  const monthlyRevenue = [];

  const ActivityLog = require("../models/activityModel");

  // Loop through each month
  for (let month = 0; month < 12; month++) {
    const startDate = new Date(currentYear, month, 1);
    const endDate = new Date(currentYear, month + 1, 0, 23, 59, 59);

    let monthRevenue = 0;

    // Get all payment update logs from activity logs for this month
    const paymentLogs = await ActivityLog.find({
      action: "UPDATE_PAYMENT_STATUS",
      createdAt: { $gte: startDate, $lte: endDate },
      "metadata.newValue": { $gt: 0 }, // Only records where payment was marked (newValue > 0)
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
