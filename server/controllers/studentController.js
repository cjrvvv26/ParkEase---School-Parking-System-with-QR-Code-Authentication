const Otp = require("../models/otpModel");
const Student = require("../models/studentModel");
const generateToken = require("../utils/generateToken");
const generateEmailToken = require("../utils/generateEmailJWT");
const sendEmailVerification = require("../emails/emailVerification");

//Fix this once the mobile app is okay
exports.studentWithGoogle = async (req, res) => {
  try {
    const { access_token } = req.body;

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
    const { email } = googleUser.data;
    const student = await Student.continueWithGoogle(googleUser.data);

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
    await Otp.registerOtp({ email, otp, type: "Student" });
    res.status(200).json({ message: "OTP was successfully sent.", email });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

//Student sign in controller
exports.signInStudent = async (req, res) => {
  try {
    const data = req.body;

    const student = await Student.signInStudent(data);

    if (student) {
      const token = generateToken(student.userId, "Student");
      res.cookie("student_token", token, {
        httpOnly: true,
        sameSite: "strict",
        secure: false,
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      res
        .status(200)
        .json({ message: "Successfully login in", token, student });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

//Clear user session
exports.signOutStudent = async (req, res) => {
  res.clearCookie("student_token", {
    httpOnly: true,
    sameSite: "strict",
    secure: false,
  });
  res.status(200).json({ message: "Successfully signed out" });
};

//Update student data
exports.updateStudentData = async (req, res) => {
  try {
    const { _id } = req.user;
    const data = req.body;
    const currentUser = await Student.getStudentData(_id);

    if (req.file) {
      const { path, filename } = req.file;
      if (currentUser.profileDetails?.public_id) {
        await cloudinary.uploader.destroy(currentUser.profileDetails.public_id);
      }
      data.profileDetails = {
        url: path,
        public_id: filename,
      };
    }
    const user = await Student.updateStudentData(currentUser._id, data);
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

//Verify student session and use this to get student data
exports.getStudentData = async (req, res) => {
  try {
    const { _id } = req.user;
    const user = await Student.getStudentData(_id);
    res.status(200).json({ message: "Sucessfully login", user });
  } catch (error) {
    res.status(500).json({ error: message });
  }
};

//Request in mobile app email verification
exports.emailVerificationRequest = async (req, res) => {
  try {
    const { _id } = req.user;

    const student = await Student.findOne({ userId: _id });
    if (!student) {
      return res.status(401).json({ error: "User not found" });
    }

    student.isVerified = true;
    student.save();
    res
      .status(200)
      .json({ message: "Successfully verified your email address" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
