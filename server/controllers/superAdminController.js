const User = require("../models/userModel");
const SuperAdmin = require("../models/superAdminModel");
const { getDataBySession } = require("../services/superAdminService");

exports.getDataBySession = async (req, res) => {
  try {
    const { data } = req;
    const user = await getDataBySession(data);
    console.log(user);

    res.status(200).json({
      message: "Successfully fetched data",
      user,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
