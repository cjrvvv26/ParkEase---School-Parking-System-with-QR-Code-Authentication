const mongoose = require('mongoose');
const Student = require('../models/studentModel');
const Guard = require('../models/guardModel');
const User = require('../models/userModel');
const Slot = require('../models/slotModel');
const userService = require('../services/userService');
const mediaService = require('../services/mediaService');
const cloudinary = require('../utils/cloudinary');
const { sendAccountRecoveryRequest } = require('../emails/index');
const { randomBytes } = require('crypto');

//GET user by Id
exports.getUserById = async (req, res) => {
  try {
    const user = await userService.getUserData(req.params.id);

    res.status(200).json({ message: 'User found', user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateUserDataBySA = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { id } = req.params;
    let userData = {};
    let oldPublicId = null;

    // Parse user data from FormData
    if (req.body.user) {
      userData =
        typeof req.body.user === 'string'
          ? JSON.parse(req.body.user)
          : req.body.user;
    }

    // Get existing profile details for reference if needed
    const existingProfileDetails = req.body.existingProfileDetails
      ? JSON.parse(req.body.existingProfileDetails)
      : null;

    // Handle profile image upload if provided
    if (req.file) {
      const result = await mediaService.replaceProfileImage(
        id,
        req.file,
        session,
      );

      oldPublicId = result.oldPublicId;
      userData.profileDetails = {
        url: result.profileDetails?.url,
        public_id: result.profileDetails?.public_id,
      };
    }

    // Prepare data structure for updateInformation service
    const updateData = {
      info: userData,
      role: userData.role,
    };

    // Update user information with transaction
    const user = await userService.updateInformation(
      req.user._id,
      id,
      updateData,
      session,
    );

    // Delete old profile image from Cloudinary after successful transaction
    if (oldPublicId) {
      await cloudinary.uploader.destroy(oldPublicId);
    }

    await session.commitTransaction();
    await session.endSession();

    res
      .status(200)
      .json({ message: 'User information updated successfully', user });
  } catch (error) {
    try {
      await session.abortTransaction();
    } catch (abortError) {
      console.log(abortError);
    }

    try {
      await session.endSession();
    } catch (endError) {
      console.log(endError);
    }

    if (req.file?.filename) {
      try {
        await cloudinary.uploader.destroy(req.file.filename);
      } catch (deleteError) {
        console.log(deleteError);
      }
    }

    res.status(500).json({ error: error.message });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const { allUsers, current, total } =
      await userService.getUsersInformation(req);

    res.status(200).json({
      message: 'Successfully fetched users data',
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
      'assignedStudentId',
      'profileDetails email role',
    );

    if (selectedSlot?.assignedStudentId) {
      assignedUser = selectedSlot.assignedStudentId.toObject();

      const studentData = await Student.findOne({
        userId: assignedUser._id,
      }).select('name -_id');

      assignedUser.name = studentData?.name || assignedUser.name;

      console.log(assignedUser);
    }

    const users = await User.find({
      $or: [{ role: 'student' }, { role: 'faculty' }],
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

      if (user.role === 'student') {
        const studentData = await Student.findOne({ userId: user._id }).select(
          'name',
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
      throw new Error('No users available');
    }

    res.status(201).json({
      message: 'Successfully fetched available users',
      assignedUser,
      users: availableUsers,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.sendRecoveryRequest = async (req, res) => {
  try {
    const { email } = req.body;
    const token = randomBytes(32).toString('hex');

    if (!token) {
      throw new Error('Something went wrong. Please try again');
    }

    await userService.storeRecoveryToken({ email, token });
    await sendAccountRecoveryRequest({ email, token });
    res
      .status(200)
      .json({ message: 'Successfully sent the account recovery request.' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.verifyAccountRequest = async (req, res) => {
  try {
    const { token } = req.params;
    await userService.verifyRecoveryToken({ token });
    res
      .status(200)
      .json({ status: 'OK', message: 'Account recovery request granted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.resetUserPassword = async (req, res) => {
  try {
    const { password, token } = req.body;
    await userService.updatePassword({ token, password });
    res.status(200).json({ message: 'Success' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
