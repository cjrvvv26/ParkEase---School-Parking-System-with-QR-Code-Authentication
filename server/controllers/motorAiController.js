const motorAiService = require("../services/motorAiService");

exports.getMotorcycleImage = async (req, res) => {
  try {
    const result = await motorAiService.customizeMotorcyclePrompt(req.body);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
