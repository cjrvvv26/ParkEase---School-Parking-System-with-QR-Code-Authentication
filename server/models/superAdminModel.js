const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const User = require("../models/userModel");
const Otp = require("../models/otpModel");
const { Schema } = mongoose;

//Super admin schema
const superAdminSchema = new Schema(
  {
    googleId: { type: String, default: null },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "user",
    },
    profileDetails: {
      url: String,
      public_id: String,
    },
    name: String,
    profile: String,
    email: {
      type: String,
      required: [true, "Email address is required"],
      unique: true,
    },
    password: { type: String, required: false },
    role: { type: String, default: "Super admin" },
  },
  { timestamps: true }
);

//Sign up super admin data validation (CREATE)
superAdminSchema.statics.signUpSuperAdmin = async function (email) {
  if (!email) {
    throw new Error("All fields must be filled");
  }

  const user = await User.findOne({ email });
  const superAdmin = await User.findOne({ email });

  if (user && superAdmin) {
    throw new Error("This email already exists");
  }

  return user;
};

//Verify user account with OTP
superAdminSchema.statics.verifyUserOTP = async function (email, type) {
  if (type === "register") {
    //Generate default super admin name
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let randomUserName = "superadmin";
    for (let i = 0; i < 10; i++) {
      randomUserName += characters.charAt(
        Math.floor(Math.random() * characters.length)
      );
    }

    //Store in User collection
    const baseUser = await User.registerUserCredentials({
      email,
      role: "Super admin",
    });

    //Store in super admin collection
    const superAdminUser = await this.create({
      userId: baseUser._id,
      name: randomUserName,
      email,
    });

    if (!superAdminUser && !baseUser) {
      throw new Error("Something went wrong while creating account.");
    }

    //deletes the otp after a successful authentication
    await Otp.deleteMany({ email });
    return superAdminUser;
  } else if (type === "login") {
    const baseUser = await User.findOne({ email, role: "Super admin" });
    const user = await this.findOne({ email });
    if (!baseUser && !user) {
      throw new Error("Account not found.");
    }

    //deletes the otp after a successful authentication
    await Otp.deleteMany({ email });
    return user;
  }
};

//Continue with google
superAdminSchema.statics.continueWithGoogle = async function (data, type) {
  const { sub, name, email, picture } = data;

  //checks in database if the email already exists
  let user = await User.findOne({ email });
  const superAdminUser = await this.findOne({ email });

  if (user && type === "register" && superAdminUser) {
    throw new Error("This account was already registered");
  }

  if (!user && type === "login") {
    throw new Error("This email doesn't exist in database.");
  }

  return user;
};

//Sign in manually
superAdminSchema.statics.signInSuperAdmin = async function (data) {
  const { email } = data;

  if (!email) {
    throw new Error("All fields must be filled");
  }

  const user = await this.findOne({ email });
  const baseUser = await User.findOne({ email });
  if (!user && !baseUser) {
    throw new Error("Wrong credentials! Please try again.");
  }
  return user;
};

//Update account data
superAdminSchema.statics.updateSuperAdminData = async function (id, data) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new Error("Invalid Object ID");
  }

  const superAdmin = await this.findByIdAndUpdate(id, data, { new: true });
  if (!superAdmin) {
    throw new Error("Something went wrong while updating your information.");
  }
  return superAdmin;
};

const superAdminModel = mongoose.model("superAdmin", superAdminSchema);

module.exports = superAdminModel;
