const Security = require("../models/guardModel");
const generateEmailToken = require("../utils/generateEmailJWT");
const generateToken = require("../utils/generateToken");
const sendEmailVerification = require("../emails/emailVerification");
const sendAccountDetails = require("../emails/accountDetails");
const cloudinary = require("../utils/cloudinary");

//Security sign in controller
exports.signInSecurity = async (req, res) => {
  try {
    const data = req.body;
    const user = await Security.signInSecurity(data);

    if (user) {
      const token = generateToken(user._id);
      res.cookie("guard_token", token, {
        httpOnly: true,
        sameSite: "strict",
        secure: false,
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      res.status(200).json({ message: "Successfully login in", token, user });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

//Update guard data controller
exports.updateGuardData = async (req, res) => {
  try {
    const { id } = req;

    const data = req.body;
    const currentGuard = await Security.getSecurityData(id);

    if (req.file) {
      const { path, filename } = req.file;

      if (currentGuard.profileDetails?.public_id) {
        await cloudinary.uploader.destroy(
          currentGuard.profileDetails.public_id
        );
      }

      data.profileDetails = {
        url: path,
        public_id: filename,
      };
    }

    const guard = await Security.updateGuardData(id, data);

    res
      .status(200)
      .json({ message: "Information was successfully updated", guard });
  } catch (error) {
    if (req.file) {
      await cloudinary.uploader.destroy(req.file.filename);
    }
    res.status(401).json({ error: error.message });
  }
};

//Use this to verify guard session and get data by id
exports.getGuardData = async (req, res) => {
  try {
    const { id } = req;
    const guard = await Guard.getSecurityData(id);
    res.status(200).json({ message: "Successfully fetched data", guard });
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
};
