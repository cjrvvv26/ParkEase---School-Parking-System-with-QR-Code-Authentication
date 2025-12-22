const axios = require("axios");
const mongoose = require("mongoose");
const Otp = require("../models/otpModel");
const otpGenerator = require("otp-generator");
const Student = require("../models/studentModel");
const sendEmailOTP = require("../emails/sendEmailOTP");
const generateToken = require("../utils/generateToken");
const SuperAdmin = require("../models/superAdminModel");
const sendAccountDetails = require("../emails/accountDetails");
const generateEmailToken = require("../utils/generateEmailJWT");
const sendEmailVerification = require("../emails/emailVerification");
const cloudinary = require("../utils/cloudinary");

// ACCOUNT CONTROLLERS
//Continue with google account (login/register)
exports.userContinueGoogle = async (req, res) => {
  try {
    const { access_token, type } = req.body;

    //Verify google token
    const googleUser = await axios.get(
      "https://www.googleapis.com/oauth2/v3/userinfo",
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      }
    );

    if (!googleUser.data) {
      throw new Error("Google is not responding properly. Please try again.");
    }

    //If the google data is verified then it returns the info
    const { email } = googleUser.data;

    //Then checks in database if the email already exists
    await SuperAdmin.continueWithGoogle(googleUser.data, type);
    const hasOtp = await Otp.findOne({ email });

    if (hasOtp) {
      throw new Error("OTP was already sent.");
    }
    const otp = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    });
    sendEmailOTP(email, otp);
    await Otp.registerOtp({ email, otp, type });
    res.status(200).json({ message: "OTP was successfully sent.", email });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

//super admin sign up controller
exports.signUpSuperAdmin = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await SuperAdmin.signUpSuperAdmin(email);

    const hasOtp = await Otp.findOne({ email });
    if (hasOtp) {
      throw new Error("OTP was already sent");
    }

    if (!user) {
      const otp = otpGenerator.generate(6, {
        upperCaseAlphabets: false,
        lowerCaseAlphabets: false,
        specialChars: false,
      });
      sendEmailOTP(email, otp);
      await Otp.registerOtp({ email, otp, type: "register" });

      res.status(200).json({ message: "OTP is successfully sent", email });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

//Verfy the OTP
exports.verifyUserOTP = async (req, res) => {
  try {
    const { email, inputOtp } = req.body;
    const userOtp = await Otp.verifyOtp(email, inputOtp);
    const user = await SuperAdmin.verifyUserOTP(email, userOtp.type);
    if (user) {
      const generatedToken = generateToken(user.userId);
      res.cookie("token", generatedToken, {
        httpOnly: true,
        sameSite: "strict",
        secure: false,
        maxAge: 24 * 60 * 60 * 1000,
      });
      res.status(200).json({
        message: `${
          userOtp.type === "register"
            ? "Account was successfully created."
            : "Successfully login."
        }`,
        user,
      });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

//Handle resend OTP
exports.userResendOtp = async (req, res) => {
  try {
    const { email, otpType } = req.body;
    const hasOldOtp = await Otp.findOne({ email });

    if (hasOldOtp) {
      await Otp.deleteMany({ email });
    }
    const otp = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    });
    sendEmailOTP(email, otp);
    await Otp.registerOtp({ email, otp, type: otpType });
    res.status(200).json({ message: "Successfully resend OTP" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

//Super admin sign in controller
exports.signInSuperAdmin = async (req, res) => {
  try {
    const data = req.body;
    const user = await SuperAdmin.signInSuperAdmin(data);
    const hasOtp = await Otp.findOne({ email: data.email });

    if (hasOtp) {
      throw new Error("OTP already sent.");
    }

    if (user) {
      const otp = otpGenerator.generate(6, {
        upperCaseAlphabets: false,
        lowerCaseAlphabets: false,
        specialChars: false,
      });
      sendEmailOTP(data.email, otp);
      await Otp.registerOtp({ email: data.email, otp, type: "login" });
      res.status(200).json({ message: "OTP was successfully sent." });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Cancel OTP Verification
exports.cancelOtpVerification = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: "Email is required." });
    }

    const result = await Otp.deleteMany({ email });

    if (result.deletedCount === 0) {
      return res
        .status(200)
        .json({ message: "No OTP records found for this email." });
    }

    res
      .status(200)
      .json({ message: "OTP verification cancelled successfully." });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

//Verify user session by cookie w/ JWT
exports.verifyUserSession = async (req, res) => {
  try {
    const { _id } = req.user;
    if (!mongoose.Types.ObjectId.isValid(_id)) {
      throw new Error("Invalid Object Id");
    }
    const user = await SuperAdmin.findOne({ userId: _id });
    if (!user) {
      throw new Error("User not found ");
    }

    res.status(200).json({ message: "Successfully fetch data", user });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

//Update account information
exports.updateSuperAdminData = async (req, res) => {
  try {
    const { _id } = req.user;
    const data = req.body;
    const currentUser = await SuperAdmin.findOne({ userId: _id });

    if (req.file) {
      const { path, filename } = req.file;

      if (currentUser.profileDetails?.public_id) {
        await cloudinary.uploader.destroy(currentUser.profileDetails.public_id);
      }
      console.log(path, filename);

      data.profileDetails = {
        url: path,
        public_id: filename,
      };
    }

    const user = await SuperAdmin.updateSuperAdminData(currentUser._id, data);
    res
      .status(200)
      .json({ message: "Information was successfully updated", user });
  } catch (error) {
    if (req.file) {
      await cloudinary.uploader.destroy(req.file.filename);
    }
    res.status(400).json({ error: error.message });
  }
};

//Verify if the user is super admin
exports.superAdminVerification = (req, res, next) => {
  try {
    const role = req.user?.role;
    if (role !== "Super admin") {
      return res.status(403).json({ error: "Access denied" });
    }

    next();
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

//Sign out controller
exports.signOutSuperAdmin = (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: false,
    sameSite: "strict",
  });
  res.status(200).json({ message: "Successfully signed out" });
};
//USER REGISTRATION CONTROLLERS

//Register student controller
exports.registerStudent = async (req, res) => {
  try {
    const { id } = req;

    const isSuperAdmin = await SuperAdmin.findById(id);
    if (!isSuperAdmin) return res.status(403).json("Access denied");
    const data = req.body;

    if (req.file) {
      const { path, filename } = req.file;
      data.profileDetails = {
        url: path,
        public_id: filename,
      };
    }

    const { student, generatedPassword } = await Student.registerStudent(data);

    if (student) {
      const emailToken = generateEmailToken(student.id);
      const firstName =
        student.name?.firstName.charAt(0).toUpperCase() +
        student.name?.firstName.slice(1);

      sendAccountDetails(
        student.email,
        firstName,
        student.name.firstName +
          " " +
          student.name.middleName +
          " " +
          student.name.lastName,
        generatedPassword
      );
      sendEmailVerification(student.email, firstName.split(" ")[0], emailToken);

      res.status(200).json({
        message: "Account is successfully created",
        student,
        emailToken,
      });
    }
  } catch (error) {
    if (req.file?.filename) {
      await cloudinary.uploader.destroy(req.file.filename);
    }
    res.status(400).json({ error: error.message });
  }
};

//Register security guard controller
exports.registerGuard = async (req, res) => {
  try {
    const { id } = req;
    const data = req.body;

    const isSuperAdmin = await SuperAdmin.findById(id);
    if (!isSuperAdmin) return res.status(403).json("Access denied");

    const { user, generatedPassword } = await Security.registerGuard(data);

    if (user) {
      const emailToken = generateEmailToken(user._id, (role = "Guard"));
      const formattedFirstName =
        user.name.firstName.charAt(0).toUpperCase() +
        user.name.firstName.slice(1);
      formattedFirstName.split(" ")[0];
      //send account details in gmail
      await sendAccountDetails(
        user.email,
        formattedFirstName,
        user.name.firstName +
          " " +
          user.name.middleName +
          " " +
          user.name.lastName,
        generatedPassword
      );
      await sendEmailVerification(user.email, formattedFirstName, emailToken);
      res
        .status(200)
        .json({ message: "Account is successfully created", token, user });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
