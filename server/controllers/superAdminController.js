const mongoose = require("mongoose");
const cloudinary = require("cloudinary").v2;
const User = require("../models/userModel");
const SuperAdmin = require("../models/superAdminModel");
const mediaService = require("../services/mediaService");
const superAdminService = require("../services/superAdminService");

exports.getDataBySession = async (req, res) => {
  try {
    const { user } = req;
    const data = await superAdminService.getDataBySession(user);

    res.status(200).json({
      message: "Successfully fetched data",
      user: data,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateInformation = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { _id } = req.user;
    const data = req.body;
    let oldProfileId = null;

    if (req.file) {
      const result = await mediaService.replaceProfileImage(
        _id,
        req.file,
        session
      );
      data.profileDetails = result.profileDetails;
      oldProfileId = result.oldPublicId;
    }

    const user = await superAdminService.updateData(_id, data, session);

    await session.commitTransaction();
    session.endSession();

    if (oldProfileId) {
      await cloudinary.uploader.destroy(oldProfileId);
    }

    res
      .status(200)
      .json({ message: "Information was successfully updated", user });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();

    if (req.file?.filename) {
      await cloudinary.uploader.destroy(req.file.filename);
    }
    res.status(500).json({ error: error.message });
  }
};
