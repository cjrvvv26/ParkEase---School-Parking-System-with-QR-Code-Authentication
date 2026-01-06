const User = require("../models/userModel");
const SuperAdmin = require("../models/superAdminModel");
const Student = require("../models/studentModel");
const Guard = require("../models/guardModel");
const bcrypt = require("bcrypt");
const generateDefaultName = require("../utils/generateDefaultName");
const axios = require("axios");

exports.signInWithGoogle = async (accessToken) => {
  const googleResponse = await axios.get(
    "https://www.googleapis.com/oauth2/v3/userinfo",
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
  if (!googleResponse?.data) {
    throw new Error("Error google authentication. Please try again");
  }

  const { email } = googleResponse.data;

  const user = await User.findOne({ email });

  if (!user) {
    throw new Error("Email address doesn't exist");
  }

  return user;
};

exports.superAdminSignUpWithGoogle = async (accessToken) => {
  const googleResponse = await axios.get(
    "https://www.googleapis.com/oauth2/v3/userinfo",
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
  if (!googleResponse?.data) {
    throw new Error("Error google authentication. Please try again");
  }

  const { email, name, picture } = googleResponse.data;

  let user = await User.findOne({ email });

  if (user) {
    throw new Error("Email address already exist");
  }

  const generatedUsername = generateDefaultName("superadmin");

  const payload = {
    profileDetails: {
      url: picture,
      public_id: null,
    },
    email,
    username: generatedUsername,
    role: "super admin",
    name,
  };

  return payload;
};

exports.localSignIn = async (data) => {
  const { email, password } = data;

  const user = await User.findOne({ email });

  if (!user) {
    throw new Error("Email doesn't exist in database");
  }

  const userData =
    user.role === "super admin"
      ? await SuperAdmin.findOne({ userId: user._id })
      : user.role === "student"
      ? await Student.findOne({ userId: user._id })
      : user.role === "guard"
      ? await Guard.findOne({ userId: user._id })
      : null;

  if (!userData) {
    throw new Error("User role data not found");
  }

  const comparePassword = await bcrypt.compare(password, user.password);

  if (!comparePassword) {
    throw new Error("Wrong credentials");
  }

  //Remove risky data
  const { _id, __v, ...moreData } = userData._doc;

  const viewModel = {
    _id: user._id,
    profileDetails: user.profileDetails,
    username: user.username,
    email: user.email,
    password: user.password,
    status: user.status,
    role: user.role,
    emailVerified: user.emailVerified,
    lastActive: user.lastActive,
    ...moreData,
  };

  return viewModel;
};

exports.localSignUp = async (data) => {
  const { email, firstName, lastName } = data;

  let user = await User.findOne({ email });

  if (user) {
    throw new Error("Email address already exist");
  }
  const fullName = firstName + " " + lastName;
  const generatedUsername = generateDefaultName(
    fullName.toLowerCase().replaceAll(" ", "")
  );

  const payload = {
    email,
    username: generatedUsername,
    role: "super admin",
    username: generatedUsername,
    name: fullName,
  };

  return payload;
};
