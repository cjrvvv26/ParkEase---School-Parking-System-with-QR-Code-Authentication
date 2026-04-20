const mongoose = require('mongoose');
const User = require('../models/userModel');
const Student = require('../models/studentModel');
const Faculty = require('../models/facultyModel');
const Semester = require('../models/semesterModel');
const Slot = require('../models/slotModel');
const Map = require('../models/mapModel');
const Shape = require('../models/shapeModel');

exports.getSlotsQRDetails = async (mapId) => {
  const map = await Map.findById(mapId);

  if (!map) {
    throw new Error('Map not found');
  }

  const shapes = await Shape.find({ mapId }).select('metadata.label');

  if (!shapes.length > 0)
    throw new Error('There are no slot shapes in this map');

  const slots = await Slot.find({
    slotId: { $in: shapes.map((s) => s._id) },
  })
    .populate('slotId', 'metadata.label')
    .populate('assignedStudentId', 'role');

  if (!slots.length > 0)
    throw new Error('There are no slot registered in this map');

  const assignedUserIds = slots
    .filter((slot) => slot.assignedStudentId)
    .map((slot) => slot.assignedStudentId._id.toString());

  if (assignedUserIds.length > 0) {
    const users = await User.find({ _id: { $in: assignedUserIds } }).select(
      '_id role',
    );
    const studentUserIds = users
      .filter((user) => user.role === 'student')
      .map((user) => user._id);
    const facultyUserIds = users
      .filter((user) => user.role === 'faculty')
      .map((user) => user._id);

    const students = await Student.find({
      userId: { $in: studentUserIds },
    }).select('userId name.firstName');
    const faculties = await Faculty.find({
      userId: { $in: facultyUserIds },
    }).select('userId name.firstName');

    const nameMap = {};
    students.forEach((student) => {
      if (student.userId && student.name?.firstName) {
        nameMap[student.userId.toString()] = student.name.firstName;
      }
    });
    faculties.forEach((faculty) => {
      if (faculty.userId && faculty.name?.firstName) {
        nameMap[faculty.userId.toString()] = faculty.name.firstName;
      }
    });

    for (const slot of slots) {
      if (slot.assignedStudentId) {
        slot.assignedName =
          nameMap[slot.assignedStudentId._id.toString()] || null;
      }
    }
  }

  return { map, slots };
};

exports.getAssignedStudent = async (_id) => {
  const user = await User.findById(_id).select(
    'profileDetails status emailVerified lastActive role',
  );
  let userVM = { ...(user ? user.toObject() : {}) };
  if (user.role === 'student') {
    const student = await Student.findOne({ userId: user._id }).select(
      '-_id name yearLevel course QRCode entryTime outTime motorDetails studentNo phoneNo payment userId',
    );
    userVM = { ...userVM, ...(student ? student.toObject() : {}) };
  } else if (user.role === 'faculty') {
    const faculty = await Faculty.findOne({ userId: user._id }).select(
      '-_id name phoneNo QRCode entryTime outTime motorDetails',
    );
    userVM = { ...userVM, ...(faculty ? faculty.toObject() : {}) };
  }
  return userVM;
};

exports.verifyStudentInfo = async (data, reassign = false) => {
  const { _id } = data;
  if (!mongoose.Types.ObjectId.isValid(_id)) {
    throw new Error('Invalid Id');
  }

  const user = await User.findById(_id);
  if (!user) {
    throw new Error('User not found');
  }

  if (!user.emailVerified) {
    throw new Error('User account must be verified');
  }

  if (user.role === 'student') {
    const studentRecord = await Student.findOne({ userId: user._id });
    const activeSemester = await Semester.findOne({ status: 'active' });

    if (!studentRecord || !studentRecord.payment?.isPaid) {
      throw new Error('Student must pay for an exclusive slot');
    }

    if (!activeSemester) {
      throw new Error('Student assignment requires an active semester');
    }

    if (!studentRecord.payment.semesterId?.equals(activeSemester._id)) {
      throw new Error('Student payment is not valid for the active semester');
    }
  } else if (user.role === 'faculty') {
    const facultyRecord = await Faculty.findOne({ userId: user._id });
    if (!facultyRecord) {
      throw new Error('Faculty record not found');
    }
  } else {
    throw new Error('User role is not eligible for slot assignment');
  }

  if (reassign) {
    const alreadyAssigned = await Slot.findOne({
      assignedStudentId: user._id,
    });
    if (alreadyAssigned) throw new Error('User already has an exclusive slot');
  }
};

exports.assignStudent = async (data, session, reassign = false) => {
  const { slot, student } = data;

  if (!slot || !student) throw new Error('Information error. Please try again');

  const assignee = await User.findById(student._id).select('name').lean();
  const label = `${assignee?.name?.firstName || 'User'}'s slot`;

  const currentSlot = await Slot.findOne({ slotId: slot._id }).session(session);
  if (!currentSlot) throw new Error('Slot not found');
  if (currentSlot.assignedStudentId) {
    throw new Error('This slot is already exclusive');
  }

  const register = await Slot.findOneAndUpdate(
    { slotId: slot._id },
    {
      $set: { assignedStudentId: student._id, status: 'exclusive' },
    },
    { new: true, session },
  ).populate({
    path: 'slotId',
    select: 'metadata -_id',
  });

  if (!register) {
    throw new Error('Something went wrong while assigning user');
  }

  await Shape.findByIdAndUpdate(
    slot._id,
    { 'metadata.label': label },
    { new: true, session },
  );

  if (reassign) {
    await Slot.findOneAndUpdate(
      {
        assignedStudentId: student._id,
        slotId: { $ne: slot._id },
      },
      {
        $set: { assignedStudentId: null, status: 'available' },
      },
      { new: true, session },
    );
  }

  const plainSlot = {
    _id: register._id,
    assignedStudentId: register.assignedStudentId,
    status: register.status,
    metadata: register.slotId?.metadata || {},
  };

  return plainSlot;
};

exports.removeAssignment = async (id, session) => {
  const slotRecord = await Slot.findOne({ slotId: id }).session(session);
  if (!slotRecord) throw new Error('Slot not found');

  const resetLabel = slotRecord.slotNumber || 'Slot';
  await Shape.findByIdAndUpdate(
    id,
    { 'metadata.label': resetLabel },
    { new: true, session },
  );

  const slot = await Slot.findOneAndUpdate(
    { slotId: id },
    {
      $set: {
        assignedStudentId: null,
        status: 'available',
        isOccupied: false,
        occupiedBy: null,
        entryTime: null,
        endTime: null,
      },
    },
    { new: true, session },
  ).populate({
    path: 'slotId',
    select: 'metadata -_id',
  });

  if (!slot) throw new Error('Failed to remove user from slot');

  return {
    _id: slot._id,
    assignedStudentId: slot.assignedStudentId,
    status: slot.status,
    isOccupied: slot.isOccupied,
    occupiedBy: slot.occupiedBy,
    entryTime: slot.entryTime,
    endTime: slot.endTime,
    metadata: slot.slotId?.metadata || {},
  };
};

// SLOT REPORTS
exports.calculateSummaryReports = async () => {
  const slots = await Slot.find();
  const totalSlots = slots.length;
  const exclusiveSlots = slots.filter(
    (s) => s.assignedStudentId !== null,
  ).length;
  const availableSlots = slots.filter((s) => !s.occupiedBy).length;
  const occupiedSlots = slots.filter((s) => s.occupiedBy).length;

  const reports = [
    { title: 'Total Slots', data: totalSlots },
    { title: 'Total Exclusive', data: exclusiveSlots },
    { title: 'Total Available', data: availableSlots },
    { title: 'Total Occupied', data: occupiedSlots },
  ];

  return reports;
};
