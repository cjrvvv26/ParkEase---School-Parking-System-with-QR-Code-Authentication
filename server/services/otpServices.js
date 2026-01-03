const bcrypt = require("bcrypt");
const Otp = require("../models/otpModel");
const User = require("../models/userModel");
const SuperAdmin = require("../models/superAdminModel");
const generatePassword = require("../utils/generatePassword");

exports.registerOtp = async ({ email, payload, otp, type }) => {
  if (!email || !otp) {
    throw new Error("Credentials not found");
  }

  const haveOtp = await Otp.findOne({ email });
  if (haveOtp) {
    throw new Error("OTP was already sent");
  }

  if (type === "login") {
    const user = await User.findOne({ email });
    if (!user) throw new Error("Account not found. Please try again.");
  }

  if (type === "register") {
    const user = await User.findOne({ email });
    if (user) throw new Error("Email already in use.");
  }

  const hashOtp = await bcrypt.hash(otp, 10);

  const storeTempCredentials = await Otp.create({
    email,
    payload,
    otp: hashOtp,
    type,
    expiresAt: new Date(Date.now() + 5 * 60000),
  });

  if (!storeTempCredentials) {
    throw new Error("Something went wrong while storing credentials.");
  }
  return storeTempCredentials;
};

exports.verifyOtp = async (email, otp, type) => {
  const user = await Otp.findOne({ email }).sort({ createdAt: -1 });

  if (!user || !user.payload) {
    throw new Error("Invalid or expired OTP");
  }

  const verify = await bcrypt.compare(String(otp), user.otp);

  if (!verify) {
    throw new Error("Incorrect OTP");
  }

  const { profileDetails, username, name, role } = user.payload;

  const generatedPassword = generatePassword();

  const hashedPassword = await bcrypt.hash(generatedPassword, 10);

  if (type === "register") {
    const createUser = await User.create({
      profileDetails,
      username,
      email,
      password: hashedPassword,
      role,
      emailVerified: true,
      lastActive: Date.now(),
    });

    const userData = await SuperAdmin.create({
      userId: createUser._id,
      name,
    });

    const { _id, __v, ...moreData } = userData._doc;

    const viewModel = {
      _id: createUser._id,
      profileDetails: createUser.profileDetails,
      username: createUser.username,
      email: createUser.email,
      password: createUser.password,
      status: createUser.status,
      role: createUser.role,
      emailVerified: createUser.emailVerified,
      lastActive: createUser.lastActive,
      ...moreData,
    };
    await Otp.deleteOne({ _id: user._id });
    return { viewModel, generatedPassword };
  }

  if (type === "login") {
    const recordUser = await User.findOne({ email });
    const userData = await SuperAdmin.findOne({ userId: recordUser._id });

    const { _id, __v, ...moreData } = userData._doc;

    const viewModel = {
      _id: recordUser._id,
      profileDetails: recordUser.profileDetails,
      username: recordUser.username,
      email: recordUser.email,
      password: recordUser.password,
      status: recordUser.status,
      role: recordUser.role,
      emailVerified: recordUser.emailVerified,
      lastActive: recordUser.lastActive,
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
