const Guard = require("../models/guardModel");
const Student = require("../models/studentModel");
const User = require("../models/userModel");
const definedFilterData = require("../utils/definedDataFilter");

exports.updateInformation = async (id, data, session) => {
  const { info, role } = data;
  const nested = {};
  switch (data.role) {
    case "student":
      nested = {
        url: "profileDetails",
        public_id: "profileDetails",
        firstName: "name",
        middleName: "name",
        lastName: "name",
        plateNo: "motorDetails",
        brand: "motorDetails",
        model: "motorDetails",
        color: "motorDetails",
      };
      break;

    case "guard":
      nested = {
        url: "profileDetails",
        public_id: "profileDetails",
        firstName: "name",
        lastName: "name",
        canScan: "permissions",
        canMarkParking: "permissions",
        canViewAnalytics: "permissions",
      };
      break;
  }

  if (!role) {
    throw new Error("User role is null");
  }

  const checkUser = await User.findById(id);

  if (!checkUser) {
    throw new Error("User not found");
  }

  let additionalData = null;
  const flattenData = definedFilterData(info, nested);

  if (!flattenData)
    throw new Error("Something went wrong while updating information");

  const userFields = [
    "username",
    "email",
    "password",
    "role",
    "status",
    "emailVerified",
    "lastActive",
  ];

  const userUpdateData = Object.fromEntries(
    Object.entries(flattenData).filter(
      ([key, value]) =>
        userFields.includes(key) ||
        (key.startsWith("profileDetails.") && value !== undefined)
    )
  );

  const user = await User.findByIdAndUpdate(
    id,
    { $set: userUpdateData, updatedAt: new Date() },
    {
      new: true,
      session,
    }
  );

  const roleSpecificData = Object.fromEntries(
    Object.entries(flattenData).filter(
      ([key]) => !userFields.includes(key) && !key.startsWith("profileDetails.")
    )
  );

  if (role === "student") {
    additionalData = await Student.findByIdAndUpdate(id, roleSpecificData, {
      new: true,
      session,
    });
  }

  if (role === "guard") {
    additionalData = await Guard.findByIdAndUpdate(id, roleSpecificData, {
      new: true,
      session,
    });
  }

  if (!additionalData) additionalData = {};

  const { _id, __v, createdAt, updatedAt, ...moreData } = additionalData._doc;

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
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
    ...moreData,
  };

  return viewModel;
};
