const User = require("../models/userModel");
const SuperAdmin = require("../models/superAdminModel");
const { getDataBySession } = require("../services/superAdminService");

exports.getDataBySession = async (req, res) => {
  try {
    const { user } = req;
    const data = await getDataBySession(user);

    res.status(200).json({
      message: "Successfully fetched data",
      user: data,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
