const slotService = require('../services/slotService');
const reportService = require('../services/reportService');
const semesterService = require('../services/semesterService');
const Map = require('../models/mapModel');
const Slot = require('../models/slotModel');
const Shape = require('../models/shapeModel');

exports.getParkingSummary = async (req, res) => {
  try {
    const reports = await slotService.calculateSummaryReports();

    res.status(200).json({ message: 'Successfully fetched data', reports });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getSystemSummary = async (req, res) => {
  try {
    const result = await reportService.calculateSystemSummary();

    res.status(200).json({ success: true, ...result });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getMonthlyRevenue = async (req, res) => {
  try {
    const monthlyRevenue = await reportService.calculateMonthlyRevenue();

    res.status(200).json({
      success: true,
      data: monthlyRevenue,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getOccupancyByHour = async (req, res) => {
  try {
    const data = await reportService.calculateOccupancyByHour();
    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getAvgParkingByHour = async (req, res) => {
  try {
    const data = await reportService.calculateAvgParkingByHour();
    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getPreferredAreas = async (req, res) => {
  try {
    const data = await reportService.calculatePreferredAreas();
    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getTopParkingDuration = async (req, res) => {
  try {
    const data = await reportService.calculateTopParkingDuration();
    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getWeeklyScans = async (req, res) => {
  try {
    const data = await reportService.calculateWeeklyScans();
    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getRecentActivity = async (req, res) => {
  try {
    const data = await reportService.calculateRecentActivity();
    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getPeakEntryTime = async (req, res) => {
  try {
    const data = await reportService.calculatePeakEntryTime();
    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getUsersByCourse = async (req, res) => {
  try {
    const { courseId } = req.query;
    const data = await reportService.calculateUsersByCourse({ courseId });
    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.generateReport = async (req, res) => {
  try {
    const summary = await reportService.calculateSystemSummary();
    const semester = await semesterService.getSemesterStats();
    const parking = await slotService.calculateSummaryReports();

    const reportData = await reportService.generateReportIntoPDF({
      summary,
      semester,
      parking,
    });
    console.log(reportData);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
      'Content-Disposition',
      `inline; filename=Motorcycle-Parking-Report-${new Date().toLocaleDateString()}.pdf`,
    );

    res.send(reportData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.generateSlotsQRCode = async (req, res) => {
  try {
    const { mapId } = req.params;

    if (!mapId) return res.status(404).json({ error: 'Invalid Map Id' });

    const map = await Map.findById(mapId);

    if (!map) return res.status(404).json({ error: 'Map not found' });

    const shapes = await Shape.find({ mapId }).select('_id metadata.label');

    const shapeIds = shapes.map((s) => s._id);

    const slots = await Slot.find({ slotId: { $in: shapeIds } }).populate(
      'slotId',
      'metadata.label',
    );

    const reportData = await reportService.generateSlotsQRCodeIntoPDF(
      map,
      slots,
    );
    console.log(reportData);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
      'Content-Disposition',
      `inline; filename=Motorcycle-Parking-Report-${new Date().toLocaleDateString()}.pdf`,
    );

    res.send(reportData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
