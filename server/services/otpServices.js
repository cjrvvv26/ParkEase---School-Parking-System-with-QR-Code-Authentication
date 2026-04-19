const bcrypt = require('bcrypt');
const Otp = require('../models/otpModel');
const User = require('../models/userModel');
const Student = require('../models/studentModel');
const Faculty = require('../models/facultyModel');
const Guard = require('../models/guardModel');
const SuperAdmin = require('../models/superAdminModel');
const generatePassword = require('../utils/generatePassword');
const ActivityLogs = require('../models/activityModel');

exports.registerOtp = async ({ email, payload, otp, type }) => {
  if (!email || !otp) {
    throw new Error('Credentials not found');
  }

  // If an OTP already exists for this email+type, update it (upsert)
  // so refreshing the login page doesn't block re-submission
  const existing = await Otp.findOne({ email, type });

  if (type === 'login') {
    const user = await User.findOne({ email });
    if (!user) throw new Error('Account not found. Please try again.');
  }

  if (type === 'register') {
    const user = await User.findOne({ email });
    if (user) throw new Error('Email already in use.');
  }

  const hashOtp = await bcrypt.hash(otp, 10);
  const expiresAt = new Date(Date.now() + 5 * 60000);

  if (existing) {
    existing.otp = hashOtp;
    existing.payload = payload;
    existing.expiresAt = expiresAt;
    await existing.save();
    return existing;
  }

  const storeTempCredentials = await Otp.create({
    email,
    payload,
    otp: hashOtp,
    type,
    expiresAt,
  });

  if (!storeTempCredentials) {
    throw new Error('Something went wrong while storing credentials.');
  }
  return storeTempCredentials;
};
exports.verifyOtp = async (email, otp, type) => {
  const user = await Otp.findOne({ email, type }).sort({ createdAt: -1 });

  if (!user || !user.payload) {
    throw new Error('Expired OTP');
  }

  const verify = await bcrypt.compare(String(otp), user.otp);

  if (!verify) {
    throw new Error('Incorrect OTP');
  }

  const { profileDetails, username, name, role } = user.payload;

  const generatedPassword = generatePassword();
  const hashedPassword = await bcrypt.hash(generatedPassword, 10);

  // ================= REGISTER =================
  if (type === 'register') {
    const createUser = await User.create({
      profileDetails,
      username,
      email,
      password: hashedPassword,
      role,
      emailVerified: true,
      lastActive: Date.now(),
    });

    let roleData = null;

    if (role === 'super admin') {
      roleData = await SuperAdmin.create({
        userId: createUser._id,
        name,
      });
    }

    if (role === 'student') {
      roleData = await Student.create({
        userId: createUser._id,
        name,
      });
    }

    if (role === 'admin') {
      roleData = await Admin.create({
        userId: createUser._id,
        name,
      });
    }

    const moreData = roleData ? roleData._doc : {};
    delete moreData._id;
    delete moreData.__v;

    const viewModel = {
      _id: createUser._id,
      profileDetails: createUser.profileDetails,
      username: createUser.username,
      email: createUser.email,
      status: createUser.status,
      role: createUser.role,
      emailVerified: createUser.emailVerified,
      lastActive: createUser.lastActive,
      ...moreData,
    };

    await Otp.deleteOne({ _id: user._id });

    return { viewModel, generatedPassword };
  }

  // ================= LOGIN =================
  if (type === 'login') {
    const recordUser = await User.findOne({ email });

    if (!recordUser) {
      throw new Error('User not found');
    }

    let userData = null;

    if (recordUser.role === 'super admin') {
      userData = await SuperAdmin.findOne({ userId: recordUser._id });
    }

    if (recordUser.role === 'student') {
      userData = await Student.findOne({ userId: recordUser._id });
    }

    if (recordUser.role === 'faculty') {
      userData = await Faculty.findOne({ userId: recordUser._id });
    }

    if (recordUser.role === 'guard') {
      userData = await Guard.findOne({ userId: recordUser._id });
    }

    // Generate QR for student/faculty if they don't have one yet
    if (recordUser.role === 'student' || recordUser.role === 'faculty') {
      if (!userData?.QRCode?.url) {
        const generateQR = require('../utils/generateQRCode');
        const qr = await generateQR(`PARKEASE_USER:${recordUser._id}`);
        const Model = recordUser.role === 'student' ? Student : Faculty;
        await Model.findOneAndUpdate(
          { userId: recordUser._id },
          { QRCode: qr },
        );
        if (userData) userData.QRCode = qr;
      }
    }

    // Set emailVerified on first successful OTP login
    if (!recordUser.emailVerified) {
      recordUser.emailVerified = true;
    }

    // Always update lastActive on login
    recordUser.lastActive = new Date();
    await recordUser.save();

    // Activity log
    await ActivityLogs.create({
      userId: recordUser._id,
      actionType: 'system',
      action: 'SIGN_IN',
      description: `${recordUser.email} signed in successfully.`,
      entityType: 'User',
      entityId: recordUser._id,
      metadata: { role: recordUser.role },
    });

    const moreData = userData ? userData._doc : {};
    delete moreData._id;
    delete moreData.__v;

    const viewModel = {
      _id: recordUser._id,
      profileDetails: recordUser.profileDetails,
      username: recordUser.username,
      email: recordUser.email,
      status: recordUser.status,
      role: recordUser.role,
      emailVerified: recordUser.emailVerified,
      lastActive: recordUser.lastActive,
      termsAccepted: recordUser.termsAccepted,
      ...moreData,
    };

    await Otp.deleteOne({ _id: user._id });

    return viewModel;
  }
};

exports.updateOtpRecord = async ({ id, otp }) => {
  const hashedOtp = await bcrypt.hash(otp, 10);

  await Otp.findByIdAndUpdate(id, {
    otp: hashedOtp,
    expiresAt: Date.now() + 5 * 60 * 1000,
  });
};
