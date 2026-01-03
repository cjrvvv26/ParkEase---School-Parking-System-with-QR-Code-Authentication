const mongoose = require("mongoose");
const { Schema } = mongoose;

const securitySchema = new Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "user",
    },
    name: {
      firstName: { type: String, trim: true, required: true },
      lastName: { type: String, trim: true, required: true },
    },
    workShift: { type: String, default: "flexible" },
    permissions: {
      canScan: { type: Boolean, default: true },
      canMarkParking: { type: Boolean, default: false },
      canViewAnalytics: { type: Boolean, default: false },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("guard", securitySchema);
