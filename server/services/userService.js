const Guard = require('../models/guardModel');
const Student = require('../models/studentModel');
const User = require('../models/userModel');
const Semester = require('../models/semesterModel');
const ActivityLog = require('../models/activityModel');
const notificationService = require('../services/notificationService');
const definedFilterData = require('../utils/definedDataFilter');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const crypto = require('crypto');

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
    case 'student':
      userData = await Student.findOne({ userId: id }).select(
        '-_id name course phoneNo studentNo payment entryTime outTime yearLevel motorDetails ',
      );
      viewModel = { ...viewModel, ...userData.toObject() };
      break;
    case 'faculty':
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
  const { page } = req.query || 1;
  const { limit } = req.query || 10;
  const { role } = req.query || '';
  const { status } = req.query || '';
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
        viewModel.name = userVM.name;
        viewModel.phoneNo = userVM.phoneNo;
        break;
      case 'guard':
        userVM = await Guard.findOne({ userId: user._id }).select(
          'name phoneNo -_id',
        );
        viewModel.name = userVM.name;
        viewModel.phoneNo = userVM.phoneNo;
        break;
    }

    allUsers.push(viewModel);
  }
  return { allUsers, current: allUsers.length + skip, total: allUsers.length };
};

exports.updateInformation = async (superAdmin, id, data, session) => {
  const { info, role } = data;
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

    case 'guard':
      nested = {
        url: 'profileDetails',
        public_id: 'profileDetails',
        firstName: 'name',
        lastName: 'name',
        canScan: 'permissions',
        canMarkParking: 'permissions',
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
        userFields.includes(key) ||
        (key.startsWith('profileDetails.') && value !== undefined),
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
        !userFields.includes(key) && !key.startsWith('profileDetails.'),
    ),
  );

  let additionalData = null;
  if (role === 'student') {
    additionalData = await Student.findOneAndUpdate(
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
          ? `Hey ${roleSpecificData['name.firstName']}! You're now eligible to have an exclusive slot. Your recent payment has been successfully verified and processed. You may now proceed to reserve and secure your preferred slot before it becomes unavailable.`
          : `Hey ${roleSpecificData['name.firstName']}! Your payment status has been reset. This means your previous verification is no longer valid at the moment. Please review your payment details and complete the process again to regain eligibility for an exclusive slot.`,
        title: newValue ? 'Payment Verified' : 'Payment Reset',
      };

      await notificationService.createNotification(paymentNotif, session);
    }
  }

  const log = new ActivityLog({
    userId: superAdmin,
    actionType: 'users',
    action: 'UPDATE_ACCOUNT',
    description: `${roleSpecificData['name.firstName']} ${roleSpecificData['name.lastName']} account has been successfully updated.`,
    entityType: 'User',
    entityId: id,
  });

  await log.save({ session });

  const notifData = {
    userId: id,
    message: `Hey ${roleSpecificData['name.firstName']}! Your account has been successfully updated by super admin.`,
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
  return newUser;
};
