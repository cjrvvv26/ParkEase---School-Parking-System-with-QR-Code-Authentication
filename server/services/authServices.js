const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const generatePassword = require("../utils/generatePassword");
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
  const generatedPassword = generatePassword();

  // const hashedPassword = await bcrypt.hash(generatedPassword, 10);

  const payload = {
    profileDetails: {
      url: picture,
      public_id: null,
    },
    email,
    username: generatedUsername,
    role: "super admin",
    name,
    password: generatedPassword,
  };

  return payload;
};
