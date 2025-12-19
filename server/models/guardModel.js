const mongoose = require("mongoose");
const User = require("../models/userModel");
const generatePassword = require("../utils/generatePassword");
const definedDataFilter = require("../utils/definedDataFilter");
const bcrypt = require("bcrypt");
const { Schema } = mongoose;

const securitySchema = new Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "user",
    },
    profileDetails: {
      url: String,
      public_id: String,
    },
    name: {
      firstName: { type: String, trim: true, lowercase: true },
      middleName: { type: String, trim: true, lowercase: true },
      lastName: { type: String, trim: true, lowercase: true },
    },
    username: { type: String, required: true },
    status: { type: String, default: "Active" },
    workShift: { type: String, default: "Flexible" },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, default: "Security" },
    isVerified: { type: Boolean, default: false },
    permissions: {
      canScan: { type: Boolean, default: true },
      canMarkParking: { type: Boolean, default: false },
      canViewAnalytics: { type: Boolean, default: false },
    },
  },
  { timestamps: true }
);

securitySchema.statics.signUpSecurity = async function (data) {
  const {
    profileDetails,
    firstName,
    middleName,
    lastName,
    email,
    username,
    status,
    workShift,
    canScan,
    canMarkParking,
    canViewAnalytics,
  } = data;

  if (
    !firstName ||
    !middleName ||
    !lastName ||
    !email ||
    !username ||
    !status ||
    !workShift ||
    !canScan ||
    !canMarkParking ||
    !canViewAnalytics
  ) {
    throw new Error("All fields must be filled");
  }

  const baseUser = await User.registerUserCredentials({ email, role: "Guard" });

  const verifyEmail = await this.findOne({ email });
  if (verifyEmail) {
    throw new Error("This email already exists");
  }

  const generatedPassword = generatePassword();
  const hashPassword = await bcrypt.hash(generatedPassword, 10);
  if (!hashPassword) {
    throw new Error("An error occurred while hashing the password");
  }

  const user = await this.create({
    userId: baseUser._id,
    profileDetails,
    name: {
      firstName,
      middleName,
      lastName,
    },
    username,
    email,
    password: hashPassword,
    status,
    workShift,
    permissions: {
      canScan,
      canMarkParking,
      canViewAnalytics,
    },
  });
  if (!user) {
    throw new Error("Failed to create an account");
  }
  return { user, generatedPassword };
};

securitySchema.statics.signInSecurity = async function (data) {
  const { username, password } = data;

  if (!username || !password) {
    throw new Error("All fields must be filled");
  }

  const user = await this.findOne({ username });
  if (!user) {
    throw new Error("Hint: email doesn't exist in database");
  }

  const comparePassword = await bcrypt.compare(password, user.password);

  if (!comparePassword) {
    throw new Error("You input wrong credentials");
  }

  return user;
};

securitySchema.statics.updateGuardData = async function (id, data) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new Error("Invalid Object ID");
  }

  const nestedData = {
    firstname: "name",
    middleName: "name",
    lastName: "name",
    canScan: "permissions",
    canMarkParking: "permissions",
    canViewAnalytics: "permissions",
  };

  const flattenUpdateData = definedDataFilter(data, nestedData);

  const guard = await this.findByIdAndUpdate(id, flattenUpdateData, {
    new: true,
  });

  if (!guard)
    throw new Error("Something went wrong while updating your information");

  return guard;
};

securitySchema.statics.getSecurityData = async function (id) {
  if (!mongoose.Types.ObjectId.isValid(id))
    throw new Error("Invalid Object ID");

  const guard = await this.findById(id);

  if (!guard) throw new Error("User not found");

  return guard;
};

const securityModel = mongoose.model("security", securitySchema);

module.exports = securityModel;
