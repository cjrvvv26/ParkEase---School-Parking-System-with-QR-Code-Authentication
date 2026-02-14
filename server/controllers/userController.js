const mongoose = require("mongoose");
const Student = require("../models/studentModel");
const Guard = require("../models/guardModel");
const User = require("../models/userModel");
const Slot = require("../models/slotModel");
const userService = require("../services/userService");
const mediaService = require("../services/mediaService");

//GET user by Id
exports.getUserById = async (req, res) => {
  try {
    const user = await userService.getUserData(req.params.id);
    console.log(user);

    res.status(200).json({ message: "User found", user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

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
    const { allUsers, current, total } =
      await userService.getUsersInformation(req);

    res.status(200).json({
      message: "Successfully fetched users data",
      users: allUsers,
      current,
      total,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//Fetch all available users
exports.getAvailableUsers = async (req, res) => {
  try {
    const { id } = req.body;
    let assignedUser = null;

    const selectedSlot = await Slot.findOne({ slotId: id }).populate(
      "assignedStudentId",
      "profileDetails email role",
    );

    if (selectedSlot?.assignedStudentId) {
      assignedUser = selectedSlot.assignedStudentId.toObject();

      const studentData = await Student.findOne({
        userId: assignedUser._id,
      }).select("name -_id");

      assignedUser.name = studentData?.name || assignedUser.name;

      console.log(assignedUser);
    }

    const users = await User.find({
      $or: [{ role: "student" }, { role: "faculty" }],
    });

    const exclusiveSlots = await Slot.find({
      assignedStudentId: { $ne: null },
    });

    const exclusiveUserIds = exclusiveSlots.map((slot) =>
      slot.assignedStudentId?.toString(),
    );

    const availableUsers = [];
    for (const user of users) {
      if (exclusiveUserIds.includes(user._id.toString())) continue;

      const userObj = user.toObject();

      if (user.role === "student") {
        const studentData = await Student.findOne({ userId: user._id }).select(
          "name",
        );
        userObj.profile = studentData;
      }

      // if (user.role === "faculty") {
      //   const facultyData = await Faculty.findOne({ userId: user._id });
      //   userObj.profile = facultyData;
      // }

      availableUsers.push(userObj);
    }

    if (users.length <= 0) {
      throw new Error("No users available");
    }

    res.status(201).json({
      message: "Successfully fetched available users",
      assignedUser,
      users: availableUsers,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
