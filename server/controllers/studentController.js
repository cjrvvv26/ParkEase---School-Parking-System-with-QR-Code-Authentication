const mongoose = require("mongoose");
const cloudinary = require("cloudinary").v2;
const Slot = require("../models/slotModel");
const Student = require("../models/studentModel");
const qrService = require("../services/qrService");
const mediaService = require("../services/mediaService");
const userService = require("../services/userService");

exports.registerAttendance = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const message = await qrService.verifyRecord(req.body, session);

    res.status(200).json({ message });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
