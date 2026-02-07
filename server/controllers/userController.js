const mongoose = require("mongoose");
const Student = require("../models/studentModel");
const Guard = require("../models/guardModel");
const User = require("../models/userModel");
const Slot = require("../models/slotModel");
const userService = require("../services/userService");
const mediaService = require("../services/mediaService");

exports.updateUserData = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { id } = req;
    const info = req.body;
    let oldPublicId = null;

    if (req.file) {
      const result = await mediaService.replaceProfileImage(
        user._id,
        req.file,
        session,
      );

      oldPublicId = result.oldPublicId;
      info.url = result.profileDetails?.url;
      info.public_id = result.profileDetails?.public_id;
    }

    if (oldPublicId) {
      await cloudinary.uploader.destroy(oldPublicId);
    }

    const user = await userService.updateInformation(id, data, session);

    session.commitTransaction();
    session.endSession();

    res.status(200).json({ message: "Information has be", user });
  } catch (error) {
    if (req.file?.filename) {
      await cloudinary.uploader.destroy(req.file.filename);
    }

    session.abortTransaction();
    session.endSession();
    res.status(500).json({ error: error.message });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const { page } = req.query || 1;
    const { limit } = req.query || 10;
    const skip = (page - 1) * limit;
    const users = await User.find({ role: { $nin: "super admin" } })
      .skip(skip)
      .limit(limit);

    if (users.length <= 0) {
      throw new Error("No users found");
    }

    res.status(200).json({ message: "Successfully fetched users data", users });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//Fetch all available users
exports.getAllPaidUsers = async (req, res) => {
  try {
    const users = await User.find({
      $or: [{ role: "student" }, { role: "faculty" }],
    });

    const exclusiveSlots = await Slot.find({
      assignedStudentId: { $ne: null },
    });

    const exclusiveUserIds = exclusiveSlots.map((slot) =>
      slot.assignedStudentId?.toString(),
    );

    const availableUsers = users.filter(
      (user) => !exclusiveUserIds.includes(user._id?.toString()),
    );

    if (users.length <= 0) {
      throw new Error("No users available");
    }

    res.status(201).json({
      message: "Successfully fetched available users",
      users: availableUsers,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
