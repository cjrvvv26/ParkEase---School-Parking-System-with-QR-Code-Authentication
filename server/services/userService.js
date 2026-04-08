const Guard = require('../models/guardModel');
const Student = require('../models/studentModel');
const Faculty = require('../models/facultyModel');
const SuperAdmin = require('../models/superAdminModel');
const Course = require('../models/courseModel');
const User = require('../models/userModel');
const Semester = require('../models/semesterModel');
const ActivityLog = require('../models/activityModel');
const notificationService = require('../services/notificationService');
const definedFilterData = require('../utils/definedDataFilter');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const generateToken = require('../utils/generateToken');

exports.getUserData = async (id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new Error('Invalid User Id');
  }

  const user = await User.findById(id);

  if (!user) {
    throw new Error('User not found');
  }

  let viewModel = user.toObject();
  let userData = null;

  switch (user.role) {
    case 'super admin':
      userData = await SuperAdmin.findOne({ userId: id }).select('-_id name');
      viewModel = { ...viewModel, ...(userData?.toObject() || {}) };
      break;
    case 'student':
      userData = await Student.findOne({ userId: id }).select(
        '-_id name course phoneNo studentNo payment entryTime outTime yearLevel motorDetails QRCode',
      );
      const course = await Course.findById(userData.course).select(
        'name description',
      );
      console.log(userData);
      console.log(course);

      viewModel = {
        ...viewModel,
        ...userData.toObject(),
        course,
      };
      break;
    case 'faculty':
      userData = await Faculty.findOne({ userId: id }).select(
        '-_id name phoneNo payment entryTime outTime motorDetails QRCode',
      );

      viewModel = {
        ...viewModel,
        ...userData.toObject(),
      };
      break;
    case 'guard':
      userData = await Guard.findOne({ userId: id }).select(
        '-_id name workShift phoneNo permissions',
      );

      viewModel = { ...viewModel, ...userData.toObject() };
      break;

    default:
      throw new Error('Invalid user role');
  }

  return viewModel;
};

exports.getUsersInformation = async (req) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const role = req.query.role || 'all';
  const status = req.query.status || 'all';
  const skip = (page - 1) * limit;

  const query = {
    role: { $nin: ['super admin'] },
  };

  if (role !== 'all') {
    query.role = role;
  }

  if (status !== 'all') {
    query.status = status;
  }

  const users = await User.find(query).skip(skip).limit(limit);

  if (users.length <= 0) {
    throw new Error('No users found');
  }

  const allUsers = [];

  for (const user of users) {
    let viewModel = user.toObject();
    let userVM = null;

    switch (user.role) {
      case 'student':
        userVM = await Student.findOne({ userId: user._id }).select(
          'name phoneNo -_id',
        );
        if (userVM) {
          viewModel.name = userVM.name;
          viewModel.phoneNo = userVM.phoneNo;
        }
        break;
      case 'faculty':
        userVM = await Faculty.findOne({ userId: user._id }).select(
          'name phoneNo -_id',
        );
        if (userVM) {
          viewModel.name = userVM.name;
          viewModel.phoneNo = userVM.phoneNo;
        }
        break;
      case 'guard':
        userVM = await Guard.findOne({ userId: user._id }).select(
          'name phoneNo -_id',
        );
        if (userVM) {
          viewModel.name = userVM.name;
          viewModel.phoneNo = userVM.phoneNo;
        }
        break;
    }

    allUsers.push(viewModel);
  }
  const total = await User.countDocuments(query);
  return { allUsers, current: allUsers.length + skip, total };
};

exports.updateInformation = async (superAdmin, id, data, session) => {
  const { info, role, course } = data;
  console.log(info);

  let nested = {};
  switch (role) {
    case 'student':
      nested = {
        url: 'profileDetails',
        public_id: 'profileDetails',
        firstName: 'name',
        middleName: 'name',
        lastName: 'name',
        plateNo: 'motorDetails',
        brand: 'motorDetails',
        model: 'motorDetails',
        color: 'motorDetails',
        isPaid: 'payment',
        amount: 'payment',
      };
      break;

    case 'faculty':
      nested = {
        url: 'profileDetails',
        public_id: 'profileDetails',
        firstName: 'name',
        middleName: 'name',
        lastName: 'name',
        plateNo: 'motorDetails',
        brand: 'motorDetails',
        model: 'motorDetails',
        color: 'motorDetails',
      };
      break;

    case 'guard':
      nested = {
        url: 'profileDetails',
        public_id: 'profileDetails',
        firstName: 'name',
        lastName: 'name',
        canScan: 'permissions',
        canViewAnalytics: 'permissions',
      };
      break;
  }

  if (!role) throw new Error('User role is null');

  const checkUser = await User.findById(id);
  if (!checkUser) throw new Error('User not found');

  const checkStudentRecord =
    role === 'student' ? await Student.findOne({ userId: id }) : null;

  // Flatten input data
  const flattenData = definedFilterData(info, nested);
  if (!flattenData)
    throw new Error('Something went wrong while updating information');

  // Get active semester early for payment processing
  const activeSem = await Semester.findOne({ status: 'active' });
  let newValue = flattenData['payment.isPaid'];

  if (role === 'student' && newValue !== undefined) {
    const oldValue = checkStudentRecord?.payment?.isPaid || false;

    if (oldValue !== newValue && !activeSem) {
      throw new Error(
        'Cannot change payment status. No active semester found. Please create an active semester first.',
      );
    }
  }

  if (role === 'student' && newValue !== undefined) {
    const amountPaid = newValue && activeSem ? activeSem.slotPrice : 0;
    flattenData['payment.amount'] = amountPaid;
    if (newValue && activeSem) {
      flattenData['payment.semesterId'] = activeSem._id;
    } else {
      flattenData['payment.semesterId'] = null;
    }
  }

  const userFields = [
    'username',
    'email',
    'password',
    'role',
    'status',
    'emailVerified',
    'lastActive',
  ];

  const userUpdateData = Object.fromEntries(
    Object.entries(flattenData).filter(
      ([key, value]) =>
        (userFields.includes(key) ||
          (key.startsWith('profileDetails.') && value !== undefined)) &&
        key !== '_id',
    ),
  );

  const user = await User.findByIdAndUpdate(
    id,
    { $set: userUpdateData, updatedAt: new Date() },
    { new: true, session },
  );

  // Role-specific data
  const roleSpecificData = Object.fromEntries(
    Object.entries(flattenData).filter(
      ([key]) =>
        !userFields.includes(key) &&
        !key.startsWith('profileDetails.') &&
        key !== '_id' &&
        !key.endsWith('._id'),
    ),
  );

  let additionalData = null;
  if (role === 'student') {
    if (course) {
      const courseId = course._id || course;
      const courseData = await Course.findById(courseId);

      if (!courseData) {
        throw new Error('Course not found');
      }

      roleSpecificData.course = courseData._id;
    }
    additionalData = await Student.findOneAndUpdate(
      { userId: id },
      { $set: roleSpecificData },
      { new: true, session },
    );
  } else if (role === 'faculty') {
    additionalData = await Faculty.findOneAndUpdate(
      { userId: id },
      { $set: roleSpecificData },
      { new: true, session },
    );
  } else if (role === 'guard') {
    additionalData = await Guard.findOneAndUpdate(
      { userId: id },
      { $set: roleSpecificData },
      { new: true, session },
    );
  }

  if (!additionalData) additionalData = {};

  // ----- Payment log for students (after student update) -----
  if (role === 'student' && newValue !== undefined) {
    const oldValue = checkStudentRecord?.payment?.isPaid || false;

    if (oldValue !== newValue) {
      const amountPaid = newValue && activeSem ? activeSem.slotPrice : 0;

      if (activeSem) {
        const revenueChange = newValue
          ? activeSem.slotPrice
          : -activeSem.slotPrice;

        await Semester.findByIdAndUpdate(
          activeSem._id,
          { $inc: { revenue: revenueChange } },
          { session },
        );
      }

      const log = new ActivityLog({
        userId: superAdmin,
        actionType: 'users',
        action: 'UPDATE_PAYMENT_STATUS',
        description: newValue
          ? `${checkStudentRecord?.name?.firstName} ${checkStudentRecord?.name?.lastName} sent a payment for exclusive slot.`
          : `${checkStudentRecord?.name?.firstName} ${checkStudentRecord?.name?.lastName} payment status updated to unpaid.`,
        entityType: 'User',
        entityId: id,
        metadata: {
          oldValue: checkStudentRecord?.payment?.amount || 0,
          newValue: amountPaid,
          semesterId: activeSem?._id,
        },
      });

      await log.save({ session });

      const paymentNotif = {
        userId: id,
        message: newValue
          ? `Hey ${info.firstName}! You're now eligible to have an exclusive slot. Your recent payment has been successfully verified and processed. You may now proceed to reserve and secure your preferred slot before it becomes unavailable.`
          : `Hey ${info.firstName}! Your payment status has been reset. This means your previous verification is no longer valid at the moment. Please review your payment details and complete the process again to regain eligibility for an exclusive slot.`,
        title: newValue ? 'Payment Verified' : 'Payment Reset',
      };

      await notificationService.createNotification(paymentNotif, session);
    }
  }

  const log = new ActivityLog({
    userId: superAdmin,
    actionType: 'users',
    action: 'UPDATE_ACCOUNT',
    description: `${info.firstName || ''} ${info.lastName || ''} account has been successfully updated.`,
    entityType: 'User',
    entityId: id,
  });

  await log.save({ session });

  const notifData = {
    userId: id,
    message: `Hey ${info.firstName || 'User'}! Your account has been successfully updated by super admin.`,
    title: 'Account Update',
  };

  await notificationService.createNotification(notifData, session);

  // Prepare additional data for view model
  let moreData = {};
  if (additionalData && additionalData._doc) {
    const { _id, __v, createdAt, updatedAt, ...rest } = additionalData._doc;
    moreData = rest;
  }

  // Final user view model
  const viewModel = {
    _id: user._id,
    profileDetails: user.profileDetails,
    username: user.username,
    email: user.email,
    status: user.status,
    userId: user._id,
    lastActive: user.lastActive,
    role: user.role,
    emailVerified: user.emailVerified,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
    ...moreData,
  };

  return viewModel;
};

exports.storeRecoveryToken = async ({ email, token }) => {
  if (!email || !token) {
    throw new Error('Invalid request');
  }

  const user = await User.findOne({ email });

  if (!user) {
    throw new Error('No user found');
  }

  if (user.recoveryDetails?.token) {
    throw new Error('Already sent an account recovery request.');
  }

  user.recoveryDetails = user.recoveryDetails || {};
  user.recoveryDetails.token = token;
  user.recoveryDetails.expiresAt = new Date(Date.now() + 10 * 60 * 1000);
  await user.save();
};

exports.verifyRecoveryToken = async ({ token }) => {
  if (!token) {
    throw new Error('Invalid request');
  }

  const user = await User.findOne({ 'recoveryDetails.token': token });

  if (!user || !user.recoveryDetails?.token) {
    throw new Error('Unauthorized access');
  }

  if (user.recoveryDetails.expiresAt < new Date()) {
    user.recoveryDetails.token = null;
    user.recoveryDetails.expiresAt = null;
    throw new Error('Request was already expired');
  }
};

exports.updatePassword = async ({ token, password }) => {
  const user = await User.findOne({ 'recoveryDetails.token': token });

  if (!mongoose.Types.ObjectId.isValid(user._id)) {
    throw new Error('Invalid User Id');
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = await User.findByIdAndUpdate(
    user._id,
    { password: hashedPassword },
    { new: true },
  );

  if (!newUser) {
    throw new Error('User not found');
  }

  newUser.recoveryDetails.token = null;
  newUser.recoveryDetails.expiresAt = null;
  await newUser.save();
  return newUser;
};

exports.getSearchUserData = async ({ q }) => {
  const Guard = require('../models/guardModel');
  const Faculty = require('../models/facultyModel');

  // Search users by username or email first
  const usersByCredential = await User.find({
    $or: [
      { username: { $regex: q, $options: 'i' } },
      { email: { $regex: q, $options: 'i' } },
    ],
    role: { $nin: ['super admin'] },
  }).limit(10);

  // Search students/faculty/guards by name
  const nameQuery = { $regex: q, $options: 'i' };
  const [studentMatches, facultyMatches, guardMatches] = await Promise.all([
    Student.find({
      $or: [
        { 'name.firstName': nameQuery },
        { 'name.lastName': nameQuery },
        { 'name.middleName': nameQuery },
      ],
    }).select('userId name').limit(10),
    Faculty.find({
      $or: [
        { 'name.firstName': nameQuery },
        { 'name.lastName': nameQuery },
      ],
    }).select('userId name').limit(10),
    Guard.find({
      $or: [
        { 'name.firstName': nameQuery },
        { 'name.lastName': nameQuery },
      ],
    }).select('userId name').limit(10),
  ]);

  const nameMatchedUserIds = [
    ...studentMatches.map((s) => s.userId?.toString()),
    ...facultyMatches.map((f) => f.userId?.toString()),
    ...guardMatches.map((g) => g.userId?.toString()),
  ].filter(Boolean);

  const usersByName = nameMatchedUserIds.length
    ? await User.find({
        _id: { $in: nameMatchedUserIds },
        role: { $nin: ['super admin'] },
      }).limit(10)
    : [];

  // Merge and deduplicate
  const seen = new Set();
  const merged = [];
  for (const u of [...usersByCredential, ...usersByName]) {
    const key = u._id.toString();
    if (!seen.has(key)) { seen.add(key); merged.push(u); }
  }

  const allNameMaps = [
    ...studentMatches.map((s) => ({ id: s.userId?.toString(), name: s.name })),
    ...facultyMatches.map((f) => ({ id: f.userId?.toString(), name: f.name })),
    ...guardMatches.map((g) => ({ id: g.userId?.toString(), name: g.name })),
  ];

  const userData = [];
  for (const user of merged.slice(0, 6)) {
    const obj = user.toObject();
    const nameEntry = allNameMaps.find((n) => n.id === user._id.toString());
    if (nameEntry) obj.name = nameEntry.name;
    userData.push(obj);
  }
  return userData;
};
