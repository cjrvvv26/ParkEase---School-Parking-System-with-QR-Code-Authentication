const mongoose = require("mongoose");
const qrService = require("../services/qrService");
const slotService = require("../services/slotService");

exports.assignStudentSlot = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { student } = req.body;

    await slotService.verifyStudentInfo(student);
    await slotService.assignStudent(req.body, session);

    session.commitTransaction();
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
    await slotService.removeAssignment(req.body);

    session.commitTransaction();
    session.endSession();
    res.status(200).json({ message: "Successfully removed student" });
  } catch (error) {
    session.abortTransaction();
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
