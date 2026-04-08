const User = require('../models/userModel');
const SuperAdmin = require('../models/superAdminModel');
const Student = require('../models/studentModel');
const Guard = require('../models/guardModel');
const Faculty = require('../models/facultyModel');
const bcrypt = require('bcrypt');
const generateDefaultName = require('../utils/generateDefaultName');
const axios = require('axios');

exports.signInWithGoogle = async (accessToken) => {
  const googleResponse = await axios.get(
    'https://www.googleapis.com/oauth2/v3/userinfo',
    { headers: { Authorization: `Bearer ${accessToken}` } }
  );
  if (!googleResponse?.data) throw new Error('Error google authentication. Please try again');
  const { email } = googleResponse.data;
  const user = await User.findOne({ email });
  if (!user) throw new Error("Email address doesn't exist");
  return { _id: user._id, email: user.email, role: user.role, username: user.username };
};

exports.signInWithGoogleCode = async ({ code, code_verifier, redirect_uri }) => {
  const tokenRes = await axios.post(
    'https://oauth2.googleapis.com/token',
    new URLSearchParams({
      code,
      client_id: process.env.GOOGLE_CLIENT_ID,
      client_secret: process.env.GOOGLE_CLIENT_SECRET,
      redirect_uri,
      grant_type: 'authorization_code',
      code_verifier,
    }).toString(),
    { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
  );
  const { access_token } = tokenRes.data;
  const googleResponse = await axios.get(
    'https://www.googleapis.com/oauth2/v3/userinfo',
    { headers: { Authorization: `Bearer ${access_token}` } }
  );
  if (!googleResponse?.data) throw new Error('Error google authentication. Please try again');
  const { email } = googleResponse.data;
  const user = await User.findOne({ email });
  if (!user) throw new Error("Email address doesn't exist");
  return { _id: user._id, email: user.email, role: user.role, username: user.username };
};

exports.superAdminSignUpWithGoogle = async (accessToken) => {
  const googleResponse = await axios.get(
    'https://www.googleapis.com/oauth2/v3/userinfo',
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  );
  if (!googleResponse?.data) {
    throw new Error('Error google authentication. Please try again');
  }

  const { email, name, picture } = googleResponse.data;

  let user = await User.findOne({ email });

  if (user) {
    throw new Error('Email address already exist');
  }

  const generatedUsername = generateDefaultName('superadmin');

  const payload = {
    profileDetails: {
      url: picture,
      public_id: null,
    },
    email,
    username: generatedUsername,
    role: 'super admin',
    name,
  };

  return payload;
};

exports.localSignIn = async (data) => {
  const { email, password, platform } = data;

  const user = await User.findOne({ email });

  if (!user) {
    throw new Error("Email doesn't exist in database");
  }

  if (platform === 'mobile' && user.role === 'super admin') {
    throw new Error("Email doesn't exist in database");
  }

  const userData =
    user.role === 'super admin'
      ? await SuperAdmin.findOne({ userId: user._id })
      : user.role === 'student'
        ? await Student.findOne({ userId: user._id })
        : user.role === 'guard'
          ? await Guard.findOne({ userId: user._id })
          : user.role === 'faculty'
            ? await Faculty.findOne({ userId: user._id })
            : null;

  if (!userData) {
    throw new Error('User role data not found');
  }

  const comparePassword = await bcrypt.compare(password, user.password);

  if (!comparePassword) {
    throw new Error('Wrong credentials');
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
    throw new Error('Email address already exist');
  }
  const fullName = firstName + ' ' + lastName;
  const generatedUsername = generateDefaultName(
    fullName.toLowerCase().replaceAll(' ', ''),
  );

  const payload = {
    email,
    username: generatedUsername,
    role: 'super admin',
    name: fullName,
  };

  return payload;
};
