const User = require("../models/userModel");
const Guard = require("../models/guardModel");
const Student = require("../models/studentModel");
const SuperAdmin = require("../models/superAdminModel");
const flattenFilteredData = require("../utils/definedDataFilter");
const QRCode = require("qrcode");

exports.getDataBySession = async (data) => {
  const user = await User.findById(data.id).lean();
  const superAdmin = await SuperAdmin.findOne({ userId: user._id }).lean();

  if (!user || !superAdmin) {
    throw new Error("User not found");
  }

  const viewModel = {
    _id: user._id,
    profileDetails: user.profileDetails,
    username: user.username,
    email: user.email,
    status: user.status,
    userId: user._id,
    lastActive: user.lastActive,
    role: user.role,
    emailVerified: user.emailVerified,
    name: superAdmin.name,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };

  for (const [key, value] of Object.entries(user)) {
    if (key === "_id") continue;
    viewModel[key] = value;

    for (const [key, value] of Object.entries(superAdmin)) {
      viewModel[key] = value;
    }
  }

  return viewModel;
};

exports.updateData = async (id, data, session) => {
  const updateFilterData = flattenFilteredData(data);
  let additionalData;
  let updatedData = await User.findByIdAndUpdate(id, updateFilterData, {
    new: true,
    session,
  });

  if (data?.name) {
    additionalData = await SuperAdmin.findOneAndUpdate(
      { userId: id },
      updateFilterData,
      { new: true, session }
    );

    if (!additionalData) {
      throw new Error("Something went wrong while updating information.");
    }
  }

  if (!updateFilterData) {
    throw new Error("Something went wrong while updating information.");
  }

  // const { __v, _id, ...moreData } = additionalData;
  console.log(additionalData);

  return { updatedData };
};

exports.registerUserAccount = async (data) => {
  const { role, username, email, ...info } = data;
  const user = null;

  const verifyEmail = await User.findOne({ email: info.email });

  if (verifyEmail) {
    throw new Error("Email already in use");
  }

  if (role === "student") {
    user = await User.create({ username, email, profileDetails });
    const qrCode = await QRCode.toDataURL(email);
    await Student.create({
      ...info,
      QRCode: qrCode,
    });
  }
  if (role === "guard") {
    user = await User.create({ username, email, profileDetails });
    await Guard.create(info);
  }

  if (!user) throw new Error("An error occurred while creating an account");

  return user;
};

exports.deactivateUserAccount = async (id) => {
  const user = await User.findById(id);

  if (!user) throw new Error("User not found");

  user.status = "deactivate";
  user.save();
};
