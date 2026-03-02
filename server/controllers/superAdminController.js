const mongoose = require('mongoose');
const cloudinary = require('cloudinary').v2;
const User = require('../models/userModel');
const SuperAdmin = require('../models/superAdminModel');
const Student = require('../models/studentModel');
const mediaService = require('../services/mediaService');
const superAdminService = require('../services/superAdminService');
const userService = require('../services/userService');
const {
  sendAccountDetails,
  sendAccountVerification,
} = require('../emails/index');
const generateEmailToken = require('../utils/generateEmailJWT');
const notificationService = require('../services/notificationService');
const ActivityLogs = require('../models/activityModel');

exports.getDataBySession = async (req, res) => {
  try {
    const { user } = req;
    const data = await superAdminService.getDataBySession(user);

    res.status(200).json({
      message: 'Successfully fetched data',
      user: data,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateInformation = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { _id } = req.user;
    const data = req.body;
    let oldProfileId = null;

    if (req.file) {
      const result = await mediaService.replaceProfileImage(
        _id,
        req.file,
        session,
      );
      data.profileDetails = result.profileDetails;
      oldProfileId = result.oldPublicId;
    }

    const user = await superAdminService.updateData(_id, data, session);

    await session.commitTransaction();
    session.endSession();

    if (oldProfileId) {
      await cloudinary.uploader.destroy(oldProfileId);
    }

    res
      .status(200)
      .json({ message: 'Information was successfully updated', user });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();

    if (req.file?.filename) {
      await cloudinary.uploader.destroy(req.file.filename);
    }
    res.status(500).json({ error: error.message });
  }
};

exports.registerUser = async (req, res) => {
  try {
    const data = req.body;
    console.log(req.body, 'asd');
    console.log(req.file);

    if (req.file) {
      const { filename, path } = req.file;
      data.profileDetails = {
        url: path,
        public_id: filename,
      };
    }

    const { userVM, generatedPassword } =
      await superAdminService.registerUserAccount(data);

    const firstName =
      userVM.name?.firstName.charAt(0).toUpperCase() +
      userVM.name?.firstName.slice(1);

    console.log(userVM);

    const emailToken = generateEmailToken(userVM._id, userVM.role);
    await sendAccountDetails({
      firstName,
      username: userVM.username,
      to: userVM.email,
      password: generatedPassword,
    });

    await sendAccountVerification({
      email: userVM.email,
      firstName,
      token: emailToken,
    });
    const notifData = {
      userId: userVM._id,
      message: `Your account has been successfully registered. Welcome to the system! You may now log in, complete your profile, and proceed with the next steps to access all available features.`,
      title: 'Account Registration Successful',
    };
    await notificationService.createNotification(notifData);

    await ActivityLogs.create({
      userId: req.user._id, // or adminId if created by admin
      actionType: 'users',
      action: 'REGISTER',
      description: `A new account has been successfully created in the system.`,
      entityType: 'User',
      entityId: userVM._id,
      metadata: {
        role: userVM.role,
        email: userVM.email,
      },
    });

    res
      .status(200)
      .json({ message: 'Account was successfully created', user: userVM });
  } catch (error) {
    if (req.file?.filename) {
      await cloudinary.uploader.destroy(req.file.filename);
    }
    res.status(500).json({ error: error.message });
  }
};

exports.deactivateUser = async (req, res) => {
  try {
    const { id } = req.params;

    await superAdminService.deactivateUserAccount(id);

    res.status(200).json({ message: 'User account is now deactivated' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updatePassword = async (req, res) => {
  try {
    const { _id } = req.user;
    const { password } = req.body;
    await userService.updatePassword(_id, password);
    res.status(200).json({ message: 'Password was successfully updated' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
