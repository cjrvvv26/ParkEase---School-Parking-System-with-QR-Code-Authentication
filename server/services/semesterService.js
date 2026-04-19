const Semester = require('../models/semesterModel');
const Student = require('../models/studentModel');

const isSemesterExpired = (endDate) => {
  const end = new Date(endDate);
  const today = new Date();
  return today > end;
};

const getAllSemesters = async () => {
  const semesters = await Semester.find().sort({ createdAt: -1 });
  return semesters;
};

const getCurrentSemester = async () => {
  const semester = await Semester.findOne({ status: 'active' });
  return semester;
};

const getPreviousSemesters = async () => {
  const semesters = await Semester.find({ status: 'expired' }).sort({
    createdAt: -1,
  });
  return semesters;
};

const createSemester = async (semesterData) => {
  const { name, startDate, endDate, slotPrice } = semesterData;
  console.log(semesterData);

  const semester = new Semester({
    name,
    startDate,
    endDate,
    slotPrice,
    status: 'active',
    revenue: 0,
  });

  await semester.save();
  return semester;
};

// Update semester
const updateSemester = async (id, updateData) => {
  const semester = await Semester.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true,
  });
  return semester;
};

// Format date for display
const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

// Calculate days remaining
const getDaysRemaining = (endDate) => {
  const end = new Date(endDate);
  const today = new Date();
  const diffTime = end - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return Math.max(0, diffDays);
};
const getSemesterStats = async () => {
  // Get all semesters
  const allSemesters = await Semester.find();

  let totalRevenue = 0;
  let highestEarningSemester = null;
  let highestRevenue = 0;

  for (const semester of allSemesters) {
    let semesterRevenue = semester.revenue || 0;

    // If semester is active, calculate real-time revenue
    if (semester.status === 'active') {
      const paidStudentsCount = await Student.countDocuments({
        'payment.isPaid': true,
        'payment.semesterId': semester._id,
      });

      semesterRevenue = paidStudentsCount * semester.slotPrice;
    }

    totalRevenue += semesterRevenue;

    // Track highest earning semester
    if (semesterRevenue > highestRevenue) {
      highestRevenue = semesterRevenue;
      highestEarningSemester = {
        id: semester._id,
        name: semester.name,
        revenue: semesterRevenue,
      };
    }
  }

  const totalSemesters = allSemesters.length;

  const averageRevenue =
    totalSemesters > 0
      ? parseFloat((totalRevenue / totalSemesters).toFixed(2))
      : 0;

  // ✅ FIXED PROJECTED REVENUE (data-driven)
  const activeSemester = await Semester.findOne({ status: 'active' });

  let projectedRevenue = 0;

  if (activeSemester) {
    const paidStudentsCount = await Student.countDocuments({
      'payment.isPaid': true,
      'payment.semesterId': activeSemester._id,
    });

    const totalSlots = activeSemester.totalSlots || 0;

    const currentRevenue = paidStudentsCount * activeSemester.slotPrice;

    const remainingStudents = Math.max(totalSlots - paidStudentsCount, 0);

    // You can tweak this (based on your system behavior)
    const expectedPaymentRate = 0.7; // 70% of remaining students will likely pay

    const expectedFutureRevenue =
      remainingStudents * expectedPaymentRate * activeSemester.slotPrice;

    projectedRevenue = Math.round(currentRevenue + expectedFutureRevenue);
  }

  const stats = [
    { title: 'Total Revenue', data: totalRevenue },
    { title: 'Total Semesters', data: totalSemesters },
    { title: 'Average Revenue', data: averageRevenue },
    { title: 'Projected Revenue', data: projectedRevenue },
  ];

  return {
    stats,
    highestEarningSemester, // optional but useful for dashboard
  };
};

module.exports = {
  isSemesterExpired,
  getAllSemesters,
  getCurrentSemester,
  getPreviousSemesters,
  createSemester,
  updateSemester,
  formatDate,
  getSemesterStats,
  getDaysRemaining,
};
