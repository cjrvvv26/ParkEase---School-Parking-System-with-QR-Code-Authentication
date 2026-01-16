const Slot = require("../models/slotModel");
const Student = require("../models/studentModel");

exports.verifyRecord = async (data, session) => {
  const student = await Student.findOne({ QRCode: data }).session(session);
  let message = "";

  if (!student) throw new Error("User not found");

  if (!student.entryTime) {
    student.entryTime = Date.now();
    student.save();
    message = "You're in, thanks for coming!";
  } else {
    student.entryTime = null;
    student.entryTime = Date.now();
    student.save();
    message = "See you tommorow!";
  }
  return message;
};

exports.verifySlotData = async (data) => {
  const slot = await Slot.findOne({ QRCode: data });
  let message = "";

  slot.entryTime = Date.now();
  slot.save();
  if (slot) {
    message = "You're in your designated slot";
  } else {
    message = "Slot is now occupied";
  }

  return message;
};
