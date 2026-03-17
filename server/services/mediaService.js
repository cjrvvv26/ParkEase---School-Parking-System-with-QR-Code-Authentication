const cloudinary = require("cloudinary").v2;
const User = require("../models/userModel");
const Shape = require("../models/shapeModel");

exports.replaceProfileImage = async (userId, file, session) => {
  const { filename, path } = file;

  const user = await User.findById(userId);
  if (!user) throw new Error("User not found");

  const oldPublicId = user.profileDetails?.public_id || null;

  const profileDetails = {
    url: path,
    public_id: filename,
  };

  return { profileDetails, oldPublicId };
};

exports.uploadShapeImage = async (shapeId, file, session) => {
  const building = await Shape.findById(shapeId).session(session);
  if (!building) throw new Error("Shape not found");

  const buildingPicture = building.metadata?.information?.picture;
  const oldPublicId = buildingPicture?.public_id || null;

  const pictureDetails = {
    url: file.path,
    public_id: file.filename,
  };

  building.metadata.information.picture = pictureDetails;
  await building.save({ session });

  return { pictureDetails, oldPublicId };
};
