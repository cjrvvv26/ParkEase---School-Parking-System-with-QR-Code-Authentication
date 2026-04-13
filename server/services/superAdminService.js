const QRCode = require('qrcode');
const bcrypt = require('bcrypt');
const User = require('../models/userModel');
const Guard = require('../models/guardModel');
const Student = require('../models/studentModel');
const SuperAdmin = require('../models/superAdminModel');
const generatePassword = require('../utils/generatePassword');
const flattenFilteredData = require('../utils/definedDataFilter');
const Course = require('../models/courseModel');
const Faculty = require('../models/facultyModel');

exports.getDataBySession = async (data) => {
  const user = await User.findById(data.id).lean();
  const superAdmin = await SuperAdmin.findOne({ userId: user._id }).lean();

  if (!user || !superAdmin) {
    throw new Error('User not found');
  }

  const viewModel = {
    _id: user._id,
    userId: user._id,
    profileDetails: user.profileDetails,
    username: user.username,
    email: user.email,
    status: user.status,
    lastActive: user.lastActive,
    role: user.role,
    emailVerified: user.emailVerified,
    name: superAdmin.name,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };

  return viewModel;
};

exports.updateData = async (id, data, session) => {
  const updateFilterData = flattenFilteredData(data);
  let additionalData;
  let updatedData = await User.findByIdAndUpdate(id, updateFilterData, {
    new: true,
    session,
  });

  if (data?.name) {
    additionalData = await SuperAdmin.findOneAndUpdate(
      { userId: id },
      updateFilterData,
      { new: true, session },
    );

    if (!additionalData) {
      throw new Error('Something went wrong while updating information.');
    }
  } else {
    additionalData = await SuperAdmin.findOne({ userId: id });
  }

  if (!updateFilterData) {
    throw new Error('Something went wrong while updating information.');
  }
  const updatedObj = updatedData.toObject();
  if (additionalData) updatedObj.name = additionalData.name;
  return updatedObj;
};

exports.registerUserAccount = async (data) => {
  console.log(data);

  const { role, username, email, profileDetails, ...info } = data;
  console.log(info);
  let user = null;
  let specificData = null;

  const verifyEmail = await User.findOne({ email });

  if (verifyEmail) {
    throw new Error('Email already in use');
  }

  if (!username) {
    throw new Error('All fields must be filled');
  }

  const generatedPassword = generatePassword();
  const hashPass = await bcrypt.hash(generatedPassword, 10);

  user = await User.create({
    username,
    email,
    password: hashPass,
    profileDetails,
    role,
  });

  if (role === 'student') {
    const courseInfo = await Course.findOne({ name: info.course });

    //Must be verified first before having a qr code
    specificData = await Student.create({
      userId: user._id,
      studentNo: info.studentNo,
      name: {
        firstName: info.firstName,
        middleName: info.middleName,
        lastName: info.lastName,
      },
      yearLevel: info.yearLevel,
      course: courseInfo._id || null,
      phoneNo: info.phoneNo,
      motorDetails: {
        plateNo: info.plateNo,
        brand: info.brand,
        model: info.model,
        color: info.color,
      },
    });
  }

  if (role === 'faculty') {
    const motorData = (info.plateNo && info.brand && info.model && info.color)
      ? { plateNo: info.plateNo, brand: info.brand, model: info.model, color: info.color }
      : null;
    specificData = await Faculty.create({
      userId: user._id,
      name: {
        firstName: info.firstName,
        middleName: info.middleName,
        lastName: info.lastName,
      },
      phoneNo: info.phoneNo,
      ...(motorData && { motorDetails: motorData }),
    });
  }

  if (role === 'guard') {
    specificData = await Guard.create({
      userId: user._id,
      name: {
        firstName: info.firstName,
        lastName: info.lastName,
      },
      phoneNo: info.phoneNo,
      workShift: info.shift,
      permissions: {
        canScan: info.canScan,
        canViewAnalytics: info.canViewAnalytics,
      },
    });
  }

  if (!user) throw new Error('An error occurred while creating an account');

  const { __v, _id, userId, ...moreData } = specificData._doc;
  const userVM = {
    ...user._doc,
    ...moreData,
    canScan: moreData.permissions?.canScan || false,
    canViewAnalytics: moreData.permissions?.canViewAnalytics || false,
  };

  return { userVM, generatedPassword };
};

exports.deactivateUserAccount = async (id) => {
  const user = await User.findById(id);

  if (!user) throw new Error('User not found');

  user.status = 'deactivate';
  user.save();
};
