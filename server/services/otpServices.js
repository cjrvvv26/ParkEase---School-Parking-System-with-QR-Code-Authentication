const bcrypt = require("bcrypt");
const Otp = require("../models/otpModel");
const User = require("../models/userModel");
const SuperAdmin = require("../models/superAdminModel");

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

  const { profileDetails, username, name, password, role } = user.payload;

  if (type === "register") {
    const createUser = await User.create({
      profileDetails,
      username,
      email,
      role,
      emailVerified: true,
      lastActive: Date.now(),
    });

    await SuperAdmin.create({
      userId: createUser._id,
      name,
      password,
    });

    await Otp.deleteOne({ _id: user._id });
    return createUser;
  }

  if (type === "login") {
    const findUser = await User.findOne({ email });
    await Otp.deleteOne({ _id: user._id });
    return findUser;
  }
};

exports.updateOtpRecord = async ({ id, otp }) => {
  const hashedOtp = await bcrypt.hash(otp, 10);

  await Otp.findByIdAndUpdate(id, {
    otp: hashedOtp,
    expiresAt: Date.now() + 5 * 60 * 1000,
  });
};
