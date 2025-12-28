const multer = require("multer");
const cloudinary = require("../utils/cloudinary");
const { CloudinaryStorage } = require("multer-storage-cloudinary");

const allowedFolders = ["avatars"];

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    if (!file) return {};

    const folder = allowedFolders.includes(req.params.folder)
      ? req.params.folder
      : "misc";

    return {
      folder: `ParkEase/${folder}`,
      allowed_formats: ["jpg", "png", "jpeg"],
      public_id: `${Date.now()}-${file.originalname.split(".")[0]}`,
    };
  },
});

const upload = multer({ storage });
module.exports = upload;
