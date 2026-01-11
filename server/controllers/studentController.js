const mongoose = require("mongoose");
const cloudinary = require("cloudinary").v2;
const Student = require("../models/studentModel");
const mediaService = require("../services/mediaService");
const userService = require("../services/userService");

exports.updateData = async () => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { user } = req;
    const data = req.body;
    let oldPublicId = null;

    if (req.file) {
      const result = await mediaService.replaceProfileImage(
        user._id,
        req.file,
        session
      );

      oldPublicId = result.oldPublicId;
      data.profileDetails = result.profileDetails;
    }

    const student = await userService.updateInformation(data);

    if (oldPublicId) {
      await cloudinary.uploader.destroy(oldPublicId);
    }

    session.commitTransaction();
    session.endSession();

    res
      .status(200)
      .json({ message: "Successfully update information", student });
  } catch (error) {
    if (req.file?.filename) {
      await cloudinary.uploader.destroy(req.file.filename);
    }

    session.abortTransaction();
    session.endSession();
    res.status(500).json({ error: error.message });
  }
};
