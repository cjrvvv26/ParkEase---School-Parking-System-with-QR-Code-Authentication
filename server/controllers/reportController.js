const slotService = require("../services/slotService");

exports.getParkingSummary = async (req, res) => {
  try {
    const reports = await slotService.calculateSummaryReports();

    res.status(200).json({ message: "Successfully fetched data", reports });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
