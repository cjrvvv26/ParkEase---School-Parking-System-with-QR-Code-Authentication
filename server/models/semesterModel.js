const mongoose = require("mongoose");
const { Schema } = mongoose;

const semesterSchema = new Schema(
  {
    name: { type: String, required: true },
    startDate: { type: String, required: true },
    endDate: { type: String, required: true },
    slotPrice: { type: Number, required: true },
    revenue: Number,
    status: { type: String, enum: ["active", "expired"], default: "active" },
  },
  { timestamps: true },
);

module.exports = mongoose.model("semester", semesterSchema);
