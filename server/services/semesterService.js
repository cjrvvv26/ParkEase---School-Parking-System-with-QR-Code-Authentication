const Semester = require("../models/semesterModel");

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
  const semester = await Semester.findOne({ status: "active" });
  return semester;
};

const getPreviousSemesters = async () => {
  const semesters = await Semester.find({ status: "expired" }).sort({
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
    status: "active",
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
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
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

module.exports = {
  isSemesterExpired,
  getAllSemesters,
  getCurrentSemester,
  getPreviousSemesters,
  createSemester,
  updateSemester,
  formatDate,
  getDaysRemaining,
};
