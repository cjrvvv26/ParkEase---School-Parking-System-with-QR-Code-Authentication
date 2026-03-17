const Slot = require('../models/slotModel');
const Student = require('../models/studentModel');
const Faculty = require('../models/facultyModel');
const User = require('../models/userModel');

exports.verifyRecord = async (data, session) => {
  const student = await Student.findOne({ QRCode: data }).session(session);
  let message = '';

  if (!student) throw new Error('User not found');

  if (!student.entryTime) {
    student.entryTime = Date.now();
    student.save();
    message = "You're in, thanks for coming!";
  } else {
    student.entryTime = null;
    student.entryTime = Date.now();
    student.save();
    message = 'See you tommorow!';
  }
  return message;
};

exports.verifySlotData = async (data) => {
  const { userId, slotId } = data;

  const user = await User.findById(userId);

  if (!user) {
    throw new Error('User not found');
  }

  let entryTime;

  if (user.role === 'guard') {
    throw new Error('Not authorized for this action');
  }

  if (user.role === 'student') {
    const student = await Student.findOne({ userId: user._id }).select(
      'entryTime',
    );
    entryTime = student?.entryTime;
  } else if (user.role === 'faculty') {
    const faculty = await Faculty.findOne({ userId: user._id }).select(
      'entryTime',
    );
    entryTime = faculty?.entryTime;
  }

  if (entryTime) {
    throw new Error("You're not in school. You can't occupy a slot");
  }

  if (user.emailVerified) {
    throw new Error('Verify your account first');
  }

  let message = '';

  const slot = await Slot.findOne({ slotId });
  if (!slot) throw new Error('Slot not found');
  console.log(slot.occupiedBy?.equals(user._id));

  if (slot.isOccupied && !slot.occupiedBy?.equals(userId)) {
    throw new Error('Slot already occupied');
  }

  if (slot.entryTime && slot.occupiedBy?.equals(userId)) {
    message = "You're already in-slot";
  }

  if (!slot.entryTime && slot.assignedStudentId?.equals(userId)) {
    slot.entryTime = Date.now();
    slot.isOccupied = true;
    slot.occupiedBy = userId;
    slot.status = 'occupied';
    await slot.save();
    message = "You're now in your exclusive slot";
  } else if (
    !slot.entryTime &&
    slot.assignedStudentId &&
    slot.assignedStudentId?.equals(userId)
  ) {
    slot.entryTime = Date.now();
    slot.isOccupied = true;
    slot.status = 'occupied';
    slot.occupiedBy = userId;
    await slot.save();
    message = "Warning: This is someone's slot";
  } else if (!slot.entryTime && !slot.assignedStudentId) {
    slot.entryTime = Date.now();
    slot.isOccupied = true;
    slot.occupiedBy = userId;
    slot.status = 'occupied';
    await slot.save();
    message = 'Thanks for parking!';
  }

  return message;
};
