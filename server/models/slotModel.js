const mongoose = require("mongoose");
const { Schema } = mongoose;

const slotSchema = new Schema(
  {
    assignedStudentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      default: null,
    },
    slotNumber: { type: String, required: true, unique: true },
    slotId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      unique: true,
      ref: "shape",
    },
    isOccupied: { type: Boolean, default: false },
    occupiedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      default: null,
    },
    status: {
      type: String,
      enum: ["exclusive", "available", "occupied"],
      default: "available",
    },
    QRCode: {
      url: { type: String, required: true },
      public_id: { type: String, required: true },
    },
    entryTime: Date,
    endTime: Date,
  },
  { timestamps: true },
);

module.exports = mongoose.model("slot", slotSchema);
