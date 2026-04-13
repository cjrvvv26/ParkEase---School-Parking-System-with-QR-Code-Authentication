const Otp = require('../models/otpModel');
const User = require('../models/userModel');
const { sendOtp, sendAccountDetails } = require('../emails/index');
const otpService = require('../services/otpServices');
const authService = require('../services/authServices');
const generateToken = require('../utils/generateToken');
const session = require('../utils/setSession');
const otpGenerator = require('otp-generator');

exports.localSignIn = async (req, res) => {
  try {
    const data = req.body;
    const payload = await authService.localSignIn(data);

    const otp = otpGenerator.generate(6, {
      lowerCaseAlphabets: false,
      upperCaseAlphabets: false,
      specialChars: false,
    });

    await otpService.registerOtp({
      email: payload.email,
      payload,
      otp,
      type: 'login',
    });

    try {
      await sendOtp(payload.email, otp);
    } catch (emailError) {
      console.error('[OTP EMAIL ERROR]', emailError.message);
    }

    res
      .status(200)
      .json({ message: 'Successfully sent OTP', email: payload.email });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.localSignUp = async (req, res) => {
  try {
    const data = req.body;
    const payload = await authService.localSignUp(data);

    const otp = otpGenerator.generate(6, {
      lowerCaseAlphabets: false,
      upperCaseAlphabets: false,
      specialChars: false,
    });

    await otpService.registerOtp({
      email: payload.email,
      payload,
      otp,
      type: 'register',
    });

    try {
      await sendOtp(payload.email, otp);
    } catch (emailError) {
      console.error('[OTP EMAIL ERROR]', emailError.message);
    }

    res
      .status(200)
      .json({ message: 'Successfully sent OTP', email: payload.email });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//Only sends email in gmail and stores payload in otp
exports.authWithGoogle = async (req, res) => {
  try {
    const { access_token, code, code_verifier, redirect_uri, type, platform } =
      req.body;
    let payload;
    if (type === 'register') {
      payload = await authService.superAdminSignUpWithGoogle(access_token);
    } else if (type === 'login' && code) {
      payload = await authService.signInWithGoogleCode({
        code,
        code_verifier,
        redirect_uri,
      });
    } else if (type === 'login') {
      payload = await authService.signInWithGoogle(access_token);
    } else {
      payload = null;
    }

    if (!payload) {
      return res.status(401).json({ error: 'Authentication type not found' });
    }

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

    try {
      await sendOtp(payload.email, otp);
    } catch (emailError) {
      console.error('[OTP EMAIL ERROR]', emailError.message);
    }

    res
      .status(200)
      .json({ message: 'Successfully sent OTP', email: payload.email });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

//Verify otp verification
exports.verifyUserOtp = async (req, res) => {
  try {
    const { email, inputOtp, type, platform } = req.body;

    console.log(req.body);
    let viewModel = null;
    let generatedPassword = null;

    if (type === 'login') {
      viewModel = await otpService.verifyOtp(email, inputOtp, type);
      if (platform === 'website' && viewModel?.role !== 'super admin') {
        return res.status(403).json({ error: 'Only super admin accounts are allowed to sign in here.' });
      }
    } else if (type === 'register') {
      const result = await otpService.verifyOtp(email, inputOtp, type);
      viewModel = result.viewModel;
      generatedPassword = result.generatedPassword;
    }

    if (!viewModel) {
      return res.status(401).json({ error: 'Failed to fetch user data' });
    }

    const token = generateToken(viewModel._id, viewModel.role);

    const { tokenName, expiredAt } = session(viewModel.role);
    if (platform === 'website') {
      res.cookie(tokenName, token, {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
        maxAge: expiredAt,
      });
    }

    if (platform === 'mobile') {
      viewModel.token = token;
    }

    if (type === 'register') {
      await sendAccountDetails({
        firstName: viewModel.name.split(' ')[0],
        username: viewModel.username,
        to: viewModel.email,
        password: generatedPassword,
      });
    }

    res
      .status(200)
      .json({ message: 'Your account is now verified', user: viewModel });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.resendOtp = async (req, res) => {
  try {
    const { email, type } = req.body;
    const oldRecord = await Otp.findOne({ email, type });

    if (!oldRecord) {
      return res.status(404).json({ error: 'No OTP request found' });
    }

    //simple resend cooldown
    const now = Date.now();

    if (now - oldRecord.updatedAt.getTime() < 60 * 1000) {
      throw new Error('Please wait before requesting another OTP');
    }

    const otp = otpGenerator.generate(6, {
      lowerCaseAlphabets: false,
      upperCaseAlphabets: false,
      specialChars: false,
    });

    await otpService.updateOtpRecord({ id: oldRecord._id, otp });

    try {
      await sendOtp(oldRecord.email, otp);
    } catch (emailError) {
      console.error('[OTP EMAIL ERROR]', emailError.message);
    }

    res.status(200).json({ message: 'OTP was successfully resend' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.cancelVerification = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: 'Email is required' });
    await Otp.deleteOne({ email });
    res.status(200).json({ message: 'Verification cancelled' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.forgotPasswordSendOtp = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: 'Email is required' });

    const user = await User.findOne({ email });
    if (!user)
      return res
        .status(404)
        .json({ error: 'No account found with that email' });

    const otp = otpGenerator.generate(6, {
      lowerCaseAlphabets: false,
      upperCaseAlphabets: false,
      specialChars: false,
    });

    await otpService.registerOtp({
      email,
      payload: { email, userId: user._id },
      otp,
      type: 'forgot-password',
    });

    await sendOtp(email, otp);
    res.status(200).json({ message: 'OTP sent successfully', email });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.forgotPasswordVerifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp)
      return res.status(400).json({ error: 'Email and OTP are required' });

    const record = await Otp.findOne({ email, type: 'forgot-password' });
    if (!record)
      return res.status(400).json({ error: 'Invalid or expired OTP' });

    const bcrypt = require('bcrypt');
    const valid = await bcrypt.compare(String(otp), record.otp);
    if (!valid) return res.status(400).json({ error: 'Incorrect OTP' });

    // Mark as verified by storing a reset token in payload
    const crypto = require('crypto');
    const resetToken = crypto.randomBytes(32).toString('hex');
    record.payload = { ...record.payload, resetToken, verified: true };
    await record.save();

    res.status(200).json({ message: 'OTP verified', resetToken, email });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.forgotPasswordReset = async (req, res) => {
  try {
    const { email, resetToken, password } = req.body;
    if (!email || !resetToken || !password)
      return res.status(400).json({ error: 'All fields are required' });

    const record = await Otp.findOne({ email, type: 'forgot-password' });
    if (
      !record ||
      !record.payload?.verified ||
      record.payload?.resetToken !== resetToken
    )
      return res
        .status(400)
        .json({ error: 'Invalid or expired reset session' });

    const bcrypt = require('bcrypt');
    const hashed = await bcrypt.hash(password, 10);
    await User.findOneAndUpdate({ email }, { password: hashed });
    await Otp.deleteOne({ _id: record._id });

    res.status(200).json({ message: 'Password reset successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.signOutUser = async (req, res) => {
  try {
    const { user } = req;

    const { tokenName } = session(user.role);

    res.clearCookie(tokenName, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
    });

    res.status(200).json({ message: 'Signed out successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
