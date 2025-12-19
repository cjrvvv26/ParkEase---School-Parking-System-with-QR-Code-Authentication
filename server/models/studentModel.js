const mongoose = require("mongoose");
const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const generatePassword = require("../utils/generatePassword");
const definedDataFilter = require("../utils/definedDataFilter");
const { Schema } = mongoose;

const motorDetailsSchema = new Schema({
  plateNo: { type: String, trim: true, required: true, unique: true },
  brand: { type: String, trim: true, required: true },
  model: { type: String, trim: true, required: true },
  color: { type: String, trim: true, required: true },
});

const studentSchema = new Schema(
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
      firstName: { type: String, trim: true, lowercase: true, required: true },
      middleName: { type: String, trim: true, lowercase: true, required: true },
      lastName: { type: String, trim: true, lowercase: true, required: true },
    },
    studentNo: { type: String, required: true },
    course: { type: String, trim: true, required: true },
    yearLevel: { type: String, trim: true, required: true },
    phoneNo: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, default: "Student" },
    isVerified: { type: Boolean, default: false },
    motorDetails: motorDetailsSchema,
  },
  { timestamps: true }
);

studentSchema.statics.signUpStudent = async function (data) {
  const {
    profileDetails,
    firstName,
    middleName,
    lastName,
    studentNo,
    course,
    yearLevel,
    phoneNo,
    brand,
    model,
    color,
    email,
    plateNo,
  } = data;

  if (
    !firstName ||
    !middleName ||
    !lastName ||
    !studentNo ||
    !course ||
    !yearLevel ||
    !phoneNo ||
    !email ||
    !brand ||
    !model ||
    !color ||
    !plateNo
  ) {
    throw new Error("All fields must be filled.");
  }

  const baseUser = await User.registerUserCredentials({
    email: data.email,
    role: "Student",
  });

  const verifyEmail = await this.findOne({ email });
  if (verifyEmail && baseUser) {
    throw new Error("This email already exists");
  }

  const verifyPlateNo = await this.findOne({ "motorDetails.plateNo": plateNo });
  if (verifyPlateNo) {
    throw new Error("This plate number is already registered");
  }

  const password = generatePassword();

  const user = await this.create({
    userId: baseUser._id,
    profileDetails,
    name: {
      firstName,
      middleName,
      lastName,
    },
    studentNo,
    email,
    password,
    course,
    yearLevel,
    phoneNo,
    motorDetails: {
      brand,
      model,
      color,
      plateNo,
    },
  });

  if (!user) {
    throw new Error("Failed to create an account");
  }

  return user;
};

studentSchema.statics.signInStudent = async function (data) {
  const { email, password } = data;

  if (!email || !password) {
    throw new Error("All fields must be filled");
  }

  const user = await this.findOne({ email });
  if (!user) {
    throw new Error("email doesn't exist");
  }

  // const comparePassword = await bcrypt.compare(password, user.password);

  // if (!comparePassword) {
  //   throw new Error("You input wrong credentials");
  // }

  return user;
};

studentSchema.statics.updateStudentData = async function (id, data) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new Error("Invalid Object ID");
  }

  const nestedData = {
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

  const flattenUpdatedData = definedDataFilter(data, nestedData);

  const user = await this.findByIdAndUpdate(id, flattenUpdatedData, {
    new: true,
  });

  if (!user) {
    throw new Error("Something went wrong while updating information.");
  }
  return user;
};

const studentModel = mongoose.model("student", studentSchema);

module.exports = studentModel;
