const mongoose = require("mongoose");
const { Schema } = mongoose;

const penaltySchema = new Schema(
  {
    studentId: { type: Schema.Types.ObjectId, ref: "user" },
    description: String,
    deductedPoints: Number,
  },
  { timestamps: true }
);

module.exports = mongoose.model("penalty", penaltySchema);
