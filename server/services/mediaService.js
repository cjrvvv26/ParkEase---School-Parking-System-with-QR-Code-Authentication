const cloudinary = require("cloudinary").v2;
const User = require("../models/userModel");

exports.replaceProfileImage = async (userId, file, session) => {
  const { filename, path } = file;

  const user = await User.findById(userId).session(session);
  if (!user) throw new Error("User not found");

  const oldPublicId = user.profileDetails?.public_id || null;

  const profileDetails = {
    url: path,
    public_id: filename,
  };

  user.profileDetails = profileDetails;
  await user.save({ session });

  return { profileDetails, oldPublicId };
};
