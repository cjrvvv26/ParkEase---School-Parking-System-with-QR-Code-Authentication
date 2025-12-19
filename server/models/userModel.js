const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new Schema(
  {
    role: { type: String, enum: ["Super admin", "Student", "Guard"] },
    email: { type: String, required: [true, "Email is required"] },
  },
  { timestamps: true }
);

userSchema.statics.registerUserCredentials = async function (data) {
  const { email, role } = data;
  if (!email || !role) {
    throw new Error("Something went wrong with user credentials");
  }

  let user = await this.findOne({ email });
  if (user) {
    throw new Error("This email is already exists.");
  }

  user = await this.create({ email, role });

  return user;
};

const userModel = mongoose.model("user", userSchema);
module.exports = userModel;
