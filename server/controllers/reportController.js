const slotService = require("../services/slotService");
const reportService = require("../services/reportService");

exports.getParkingSummary = async (req, res) => {
  try {
    const reports = await slotService.calculateSummaryReports();

    res.status(200).json({ message: "Successfully fetched data", reports });
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
