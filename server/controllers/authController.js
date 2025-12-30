const Otp = require("../models/otpModel");
const User = require("../models/userModel");
const { sendOtp } = require("../emails/index");
const otpService = require("../services/otpServices");
const authService = require("../services/authServices");
const generateToken = require("../utils/generateToken");
const otpGenerator = require("otp-generator");

//Only sends email in gmail and stores payload in otp
exports.authWithGoogle = async (req, res) => {
  try {
    const { access_token, type } = req.body;
    const payload =
      type === "register"
        ? await authService.superAdminSignUpWithGoogle(access_token)
        : type === "login" &&
          (await authService.signInWithGoogle(access_token));

    const otp = otpGenerator.generate(6, {
      lowerCaseAlphabets: false,
      upperCaseAlphabets: false,
      specialChars: false,
    });

    await otpService.registerOtp({
      email: payload.email,
      payload,
      otp,
      type,
    });

    await sendOtp(payload.email, otp);

    res
      .status(200)
      .json({ message: "Successfully sent OTP", email: payload.email });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

//Create user after otp verification
exports.verifyUserOtp = async (req, res) => {
  try {
    const { email, inputOtp, type } = req.body;
    const user = await otpService.verifyOtp(email, inputOtp, type);

    const token = generateToken(user._id, user.role);

    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "strict",
      secure: false,
      expiredAt: 24 * 60 * 60 * 1000,
    });

    res.status(200).json({ message: "OTP verified successfully", user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.resendOtp = async (req, res) => {
  try {
    const { email, type } = req.body;
    const oldRecord = await Otp.findOne({ email, type });

    if (!oldRecord) {
      return res.status(404).json({ error: "No OTP request found" });
    }

    //simple resend cooldown
    const now = Date.now();

    if (now - oldRecord.updatedAt.getTime() < 60 * 1000) {
      throw new Error("Please wait before requesting another OTP");
    }

    const otp = otpGenerator.generate(6, {
      lowerCaseAlphabets: false,
      upperCaseAlphabets: false,
      specialChars: false,
    });

    await otpService.updateOtpRecord({ id: oldRecord._id, otp });

    await sendOtp(oldRecord.email, otp);

    res.status(200).json({ message: "OTP was successfully resend" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
