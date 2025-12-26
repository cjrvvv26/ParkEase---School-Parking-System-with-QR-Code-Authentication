const mongoose = require("mongoose");
const Student = require("../models/studentModel");

const slotSchema = new mongoose.Schema(
  {
    slotNumber: {
      type: String,
      required: true,
      unique: true, // e.g. "M-01", "M-02"
    },

    assignedStudent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "student",
      default: null,
    },

    isOccupied: {
      type: Boolean,
      default: false,
    },

    occupiedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "student",
      default: null,
    },

    status: {
      type: String,
      enum: ["available", "exclusive", "occupied"],
      default: "available",
    },

    lastOccupiedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

//Register student slot
slotSchema.statics.registerStudentSlot = async function (id, slotNumber) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new Error("Invalid ID");
  }

  const student = await Student.findById(id);
  if (!student) {
    throw new Error("User not found! Please try again.");
  }

  if (!student.isVerified) {
    throw new Error("Only verified students can have exclusive slots");
  }

  const existingSlot = await this.findOne({
    assignedStudent: student._id,
  });
  if (existingSlot) {
    throw new Error("Student already has an exclusive slot");
  }

  const checkSlot = await this.findOne({ slotNumber });

  if (!checkSlot) {
    throw new Error("Slot number not found");
  }

  if (checkSlot.status === "exclusive") {
    throw new Error("This slot is already assigned with other student");
  }

  const registerStudentSlot = await this.findOneAndUpdate(
    {
      slotNumber,
    },
    {
      assignedStudent: student._id,
      status: "exclusive",
    },
    { new: true }
  );

  if (!registerStudentSlot) {
    throw new Error(
      "Something went wrong while trying to register student slot."
    );
  }
  return registerStudentSlot;
};

//update slot exclusiveness
slotSchema.statics.updateSlotExclusiveness = async function (id, slotNumber) {
  const verifySlot = await this.findOne({ slotNumber });

  if (!verifySlot) {
    throw new Error("Slot number not found");
  }

  // ASSIGN
  if (id) {
    if (verifySlot.isOccupied) {
      throw new Error("Cannot assign an occupied slot");
    }

    if (verifySlot.status !== "available") {
      throw new Error("Slot is not available");
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new Error("Invalid student ID");
    }

    const student = await Student.findById(id);
    if (!student) {
      throw new Error("User not found! Please try again.");
    }

    if (!student.isVerified) {
      throw new Error("Only verified students can have exclusive slots");
    }

    const existingSlot = await this.findOne({
      assignedStudent: student._id,
    });
    if (existingSlot) {
      throw new Error("Student already has an exclusive slot");
    }

    return await this.findOneAndUpdate(
      { slotNumber },
      {
        assignedStudent: student._id,
        status: "exclusive",
      },
      { new: true }
    );
  }

  // REMOVE
  if (verifySlot.isOccupied) {
    throw new Error("Cannot remove exclusiveness while slot is occupied");
  }

  return await this.findOneAndUpdate(
    { slotNumber },
    {
      assignedStudent: null,
      status: "available",
    },
    { new: true }
  );
};

//Update student slot occupancy
slotSchema.statics.updateSlotOccupancy = async function (
  studentId,
  slotNumber
) {
  if (!mongoose.Types.ObjectId.isValid(studentId)) {
    throw new Error("Invalid Information. Please try again");
  }

  const student = await Student.findById(studentId);
  if (!student) {
    throw new Error("User not found");
  }

  const slot = await this.findOne({ slotNumber });

  if (!slot) {
    throw new Error("Slot number not found");
  }

  // 🚫 Block non-owner from exclusive slot
  if (
    slot.status === "exclusive" &&
    slot.assignedStudent?.toString() !== studentId
  ) {
    throw new Error("This slot is exclusive to another student");
  }

  // SCAN OUT
  if (slot.occupiedBy?.toString() === studentId) {
    return await this.findOneAndUpdate(
      { slotNumber },
      {
        isOccupied: false,
        occupiedBy: null,
        status: slot.assignedStudent ? "exclusive" : "available",
      },
      { new: true }
    );
  }

  // SCAN IN
  if (slot.isOccupied) {
    throw new Error("Slot is already occupied");
  }

  return await this.findOneAndUpdate(
    { slotNumber },
    {
      isOccupied: true,
      occupiedBy: studentId,
      status: "occupied",
      lastOccupiedAt: new Date(),
    },
    { new: true }
  );
};

module.exports = mongoose.model("Slot", slotSchema);
