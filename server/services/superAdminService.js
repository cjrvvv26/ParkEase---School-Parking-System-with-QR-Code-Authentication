const User = require("../models/userModel");
const SuperAdmin = require("../models/superAdminModel");
const flattenFilteredData = require("../utils/definedDataFilter");

exports.getDataBySession = async (data) => {
  const user = await User.findById(data.id).lean();
  const superAdmin = await SuperAdmin.findOne({ userId: user._id }).lean();

  if (!user || !superAdmin) {
    throw new Error("User not found");
  }

  const viewModel = {
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
