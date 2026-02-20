const Guard = require("../models/guardModel");
const Student = require("../models/studentModel");
const User = require("../models/userModel");
const definedFilterData = require("../utils/definedDataFilter");
const mongoose = require("mongoose");

exports.getUserData = async (id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new Error("Invalid User Id");
  }

  const user = await User.findById(id);

  if (!user) {
    throw new Error("User not found");
  }

  let viewModel = user.toObject();
  let userData = null;

  switch (user.role) {
    case "student":
      userData = await Student.findOne({ userId: id }).select(
        "-_id name course phoneNo studentNo payment entryTime outTime yearLevel motorDetails ",
      );
      viewModel = { ...viewModel, ...userData.toObject() };
      break;
    case "faculty":
      break;
    case "guard":
      userData = await Guard.findOne({ userId: id }).select(
        "-_id name workShift phoneNo permissions",
      );

      viewModel = { ...viewModel, ...userData.toObject() };
      break;

    default:
      throw new Error("Invalid user role");
  }

  return viewModel;
};

exports.getUsersInformation = async (req) => {
  const { page } = req.query || 1;
  const { limit } = req.query || 10;
  const { role } = req.query || "";
  const { status } = req.query || "";
  const skip = (page - 1) * limit;

  const query = {
    role: { $nin: ["super admin"] },
  };

  if (role !== "all") {
    query.role = role;
  }

  if (status !== "all") {
    query.status = status;
  }

  const users = await User.find(query).skip(skip).limit(limit);

  if (users.length <= 0) {
    throw new Error("No users found");
  }

  const allUsers = [];

  for (const user of users) {
    let viewModel = user.toObject();
    let userVM = null;

    switch (user.role) {
      case "student":
        userVM = await Student.findOne({ userId: user._id }).select(
          "name phoneNo -_id",
        );
        viewModel.name = userVM.name;
        viewModel.phoneNo = userVM.phoneNo;
        break;
      case "guard":
        userVM = await Guard.findOne({ userId: user._id }).select(
          "name phoneNo -_id",
        );
        viewModel.name = userVM.name;
        viewModel.phoneNo = userVM.phoneNo;
        break;
    }

    allUsers.push(viewModel);
  }
  return { allUsers, current: allUsers.length + skip, total: allUsers.length };
};

exports.updateInformation = async (id, data, session) => {
  const { info, role } = data;
  let nested = {};
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
        (key.startsWith("profileDetails.") && value !== undefined),
    ),
  );

  const user = await User.findByIdAndUpdate(
    id,
    { $set: userUpdateData, updatedAt: new Date() },
    {
      new: true,
      session,
    },
  );

  const roleSpecificData = Object.fromEntries(
    Object.entries(flattenData).filter(
      ([key]) =>
        !userFields.includes(key) && !key.startsWith("profileDetails."),
    ),
  );

  if (role === "student") {
    additionalData = await Student.findOneAndUpdate(
      { userId: id },
      { $set: roleSpecificData },
      {
        new: true,
        session,
      },
    );
  }

  if (role === "guard") {
    additionalData = await Guard.findOneAndUpdate(
      { userId: id },
      { $set: roleSpecificData },
      {
        new: true,
        session,
      },
    );
  }

  if (!additionalData) additionalData = {};

  let moreData = {};

  if (additionalData && additionalData._doc) {
    const { _id, __v, createdAt, updatedAt, ...rest } = additionalData._doc;
    moreData = rest;
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
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
    ...moreData,
  };

  return viewModel;
};
