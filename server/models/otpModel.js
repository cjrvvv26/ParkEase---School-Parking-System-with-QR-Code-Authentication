const mongoose = require("mongoose");
const User = require("../models/userModel");
const { Schema } = mongoose;

const otpSchema = new Schema({
  email: { type: String, required: true, unique: true },
  otp: { type: Number, required: true },
  type: { type: String, enum: ["register", "login"] },
  expiresAt: { type: Date },
});

//Once the expiresAt is reached, the document will be automatically deleted.
otpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

otpSchema.statics.registerOtp = async function ({ email, otp, type }) {
  if (!email || !otp) {
    throw new Error("Credentials not found.");
  }
  if (type === "login") {
    const user = await User.findOne({ email });
    if (!user) throw new Error("Account not found. Please try again.");
  } else if (type === "register") {
    const user = await User.findOne({ email });
    if (user) throw new Error("Email already in use.");
  }
  const storeTempCredentials = await this.create({
    email,
    otp,
    type,
    expiresAt: new Date(Date.now() + 5 * 60000),
  });

  if (!storeTempCredentials) {
    throw new Error("Something went wrong while storing credentials.");
  }
  return storeTempCredentials;
};

otpSchema.statics.verifyOtp = async function (email, inputOtp) {
  let user = await this.findOne({ email, otp: inputOtp });
  if (!user) {
    throw new Error("Invalid or expired OTP");
  }
  return user;
};

const otpModel = mongoose.model("otp", otpSchema);
module.exports = otpModel;
