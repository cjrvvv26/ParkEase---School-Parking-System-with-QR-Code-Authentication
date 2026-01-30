const mongoose = require("mongoose");
const User = require("../models/userModel");
const Student = require("../models/studentModel");
const Slot = require("../models/slotModel");

exports.getAssignedStudent = async (_id) => {
  const user = await User.findById(_id).select(
    "profileDetails -_id status emailVerified lastActive",
  );
  const student = await Student.findOne({ userId: user._id }).select(
    "name yearLevel course QRCode entryTime outTime creditPoints motorDetails studentNo phoneNo",
  );
  return { ...user, ...student };
};

exports.verifyStudentInfo = async (data, reassign = false) => {
  const { _id } = data;
  if (!mongoose.Types.ObjectId.isValid(_id)) {
    throw new Error("Invalid Id");
  }

  const student = await User.findById(_id);
  if (!student) {
    throw new Error("Student not found");
  }

  if (!student.emailVerified) {
    throw new Error("Student account must be verified");
  }

  const studentRecord = await Student.findOne({ userId: student._id });

  if (!studentRecord || !studentRecord.payment?.isPaid) {
    throw new Error("Student must pay ₱20.00 for exclusive slot");
  }

  if (reassign) {
    const alreadyAssigned = await Slot.findOne({
      assignedStudentId: student._id,
    });
    if (alreadyAssigned)
      throw new Error("Student already have an exclusive slot");
  }
};

exports.assignStudent = async (data, session, reassign = false) => {
  const { slot, student } = data;

  if (!slot || !student) throw new Error("Information error. Please try again");

  const isExclusive = await Slot.findOne({ slotId: slot._id }).session(session);

  if (isExclusive.assignedStudentId) {
    throw new Error("This slot is already exclusive");
  }

  const register = await Slot.findOneAndUpdate(
    { slotId: slot._id },
    {
      $set: { assignedStudentId: student._id, status: "exclusive" },
    },
    { new: true, session },
  );

  if (!register) {
    throw new Error("Something went wrong while assigning student");
  }

  if (reassign) {
    await Slot.findOneAndUpdate(
      {
        assignedStudentId: student._id,
        slotId: { $ne: slot._id },
      },
      {
        $set: { assignedStudentId: null, status: "available" },
      },
      { new: true, session },
    );
  }

  return register;
};

exports.removeAssignment = async (data) => {
  const { slot, student } = data;

  const slotRecord = await Slot.findOne({ slotId: slot._id }).session(session);

  if (!slotRecord) throw new Error("Slot not found");

  const assignedSlot = await Slot.updateOne(
    { slotId: slot._id },
    { $set: { assignedStudentId: student._id, status: "available" } },
    { new: true, session },
  );

  if (!assignedSlot) throw new Error("Failed to remove student from slot");
};
