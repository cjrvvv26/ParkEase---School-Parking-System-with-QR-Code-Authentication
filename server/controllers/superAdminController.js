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
    const { id: _id } = req.user;
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

    const hasEmptyVal = Object.values(data).every((d) => !d);

    if (hasEmptyVal) {
      return res.status(400).json({ error: 'All fields must be filled' });
    }

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

    const emailToken = generateEmailToken(userVM._id, userVM.role);
    await sendAccountDetails({
      firstName,
      username: userVM.username,
      to: userVM.email,
      password: generatedPassword,
    });

    const notifData = {
      userId: userVM._id,
      message: `Your account has been successfully registered. Welcome to the system! You may now log in, complete your profile, and verify your email to access all available features.`,
      title: 'Account Registration Successful',
    };
    await notificationService.createNotification(notifData);

    await ActivityLogs.create({
      userId: req.user.id,
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
    const { id: _id } = req.user;
    const { password } = req.body;
    await userService.updatePassword(_id, password);
    res.status(200).json({ message: 'Password was successfully updated' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.identifyAccountByEmail = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email }).select(
      'email username role profileDetails _id',
    );
    if (!user) {
      return res.status(404).json({ exists: false, message: 'No account found' });
    }

    const Guard = require('../models/guardModel');
    const Faculty = require('../models/facultyModel');
    const allModels = { 'super admin': SuperAdmin, student: Student, faculty: Faculty, guard: Guard };
    const RoleModel = allModels[user.role];
    const roleRecord = RoleModel ? await RoleModel.findOne({ userId: user._id }).select('name') : null;

    let fullName = null;
    if (roleRecord) {
      if (typeof roleRecord.name === 'string') {
        fullName = roleRecord.name;
      } else if (roleRecord.name?.firstName) {
        fullName = [roleRecord.name.firstName, roleRecord.name.middleName, roleRecord.name.lastName].filter(Boolean).join(' ');
      }
    }

    res.status(200).json({
      exists: true,
      account: {
        email: user.email,
        username: user.username,
        role: user.role,
        profileDetails: user.profileDetails,
        fullName,
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getSuperAdminId = async (req, res) => {
  try {
    const user = await User.findOne({ role: 'super admin' }).sort({ createdAt: 1 }).select('_id');
    if (!user) return res.status(404).json({ error: 'Super admin not found' });
    res.status(200).json({ _id: user._id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getChatMessages = async (req, res) => {
  try {
    const { chatId } = req.params;
    const chatService = require('../services/chatService');
    const messages = await chatService.getMessages(chatId);
    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getChatUsers = async (req, res) => {
  try {
    const Student = require('../models/studentModel');
    const Faculty = require('../models/facultyModel');

    const [students, faculty] = await Promise.all([
      Student.find().populate('userId', 'profileDetails role status').lean(),
      Faculty.find().populate('userId', 'profileDetails role status').lean(),
    ]);

    const map = (list) =>
      list
        .filter((u) => u.userId)
        .map((u) => ({
          _id: u.userId._id,
          name: u.name,
          profileDetails: u.userId.profileDetails,
          role: u.userId.role,
          status: u.userId.status,
        }));

    res.status(200).json([...map(students), ...map(faculty)]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
