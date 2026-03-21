const mongoose = require("mongoose");
const { Schema } = mongoose;

const otpSchema = new Schema(
  {
    email: { type: String, required: true, unique: true },
    payload: { type: Schema.Types.Mixed, required: true },
    otp: { type: String, required: true },
    type: { type: String, enum: ["register", "login", "forgot-password"] },
    expiresAt: { type: Date, required: true },
  },
  { timestamps: true }
);

//Once the expiresAt is reached, the document will be automatically deleted.
otpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const otpModel = mongoose.model("otp", otpSchema);
module.exports = otpModel;
