const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema(
  {
    profileDetails: {
      url: String,
      public_id: String,
    },
    username: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ['super admin', 'student', 'guard'],
      required: true,
    },
    status: {
      type: String,
      enum: ['active', 'offline', 'deactivate'],
      default: 'active',
      required: true,
    },
    emailVerified: { type: Boolean, default: false, required: true },
    recoveryDetails: {
      token: { type: String, default: null },
      expiresAt: { type: Date, default: null },
    },
    lastActive: Date,
  },
  { timestamps: true },
);

module.exports = mongoose.model('user', userSchema);
