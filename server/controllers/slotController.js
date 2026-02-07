const mongoose = require("mongoose");
const Slot = require("../models/slotModel");
const User = require("../models/userModel");
const qrService = require("../services/qrService");
const slotService = require("../services/slotService");

exports.getSlotDetails = async (req, res) => {
  try {
    let student = null;

    if (!mongoose.Types.ObjectId.isValid(req.body._id))
      throw new Error("Invalid slot id");
    let slot = await Slot.findOne({ slotId: req.body._id });
    if (slot.assignedStudentId) {
      student = await slotService.getAssignedStudent(slot.assignedStudentId);
    }

    const details = {
      ...(slot ? slot.toObject() : {}),
      ...student,
    };

    res
      .status(201)
      .json({ message: "Successfully fetched slot data", slot: details });
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
};

exports.assignStudentSlot = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { student } = req.body;

    await slotService.verifyStudentInfo(student);
    await slotService.assignStudent(req.body, session);

    await session.commitTransaction();
    session.endSession();

    res.status(200).json({ message: "Successfully assigned student" });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    res.status(500).json({ error: error.message });
  }
};

exports.updateStudentLocation = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { student } = req.body;
    await slotService.verifyStudentInfo(student, true);
    await slotService.assignStudent(req.body, session, true);

    session.commitTransaction();
    session.endSession();
    res.status(200).json({ message: "Student slot has been updated" });
  } catch (error) {
    session.abortTransaction();
    session.endSession();
    res.status(500).json({ error: error.message });
  }
};

exports.removeAssignment = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    if (!mongoose.Types.ObjectId.isValid(req.body)) {
      throw new Error("Invalid Object ID");
    }

    await slotService.removeAssignment(req.body, session);

    await session.commitTransaction();
    session.endSession();
    res.status(200).json({ message: "Successfully removed student" });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    res.status(500).json({ error: error.message });
  }
};

exports.verifyStudentSlot = async (req, res) => {
  try {
    const message = await qrService.verifySlotData(req.body);
    res.status(200).json({ message });
  } catch (error) {
    res.status(403).json({ error: error.message });
  }
};
