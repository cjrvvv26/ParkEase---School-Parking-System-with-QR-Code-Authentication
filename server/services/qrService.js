const Slot = require('../models/slotModel');
const Student = require('../models/studentModel');
const Faculty = require('../models/facultyModel');
const User = require('../models/userModel');
const ActivityLog = require('../models/activityModel');
const notificationService = require('../services/notificationService');

exports.guardScan = async (qrData, guardId) => {
  // Extract userId from "PARKEASE_USER:<userId>"
  const match = qrData.match(/PARKEASE_USER:(.+)/);
  if (!match) throw new Error('QR code not recognized');
  const userId = match[1].trim();

  const user = await User.findById(userId);
  if (!user) throw new Error('User not found');
  if (user.role !== 'student' && user.role !== 'faculty')
    throw new Error('QR code not recognized');

  const Model = user.role === 'student' ? Student : Faculty;
  const roleRecord = await Model.findOne({ userId: user._id });
  if (!roleRecord) throw new Error('User record not found');

  const firstName = roleRecord.name?.firstName || 'User';
  const fullName = `${firstName} ${roleRecord.name?.lastName || ''}`.trim();

  let message = '';
  let action = '';
  let description = '';
  let notifTitle = '';
  let notifMessage = '';

  if (!roleRecord.entryTime) {
    // ── ENTRY ──
    roleRecord.entryTime = new Date();
    await roleRecord.save();

    message = `Entry recorded. Welcome, ${firstName}!`;
    action = 'ENTRY_TIME';
    description = `${fullName} entered the campus.`;
    notifTitle = 'Entry Recorded';
    notifMessage = `Hey ${firstName}! Your entry has been recorded. Have a great day!`;
  } else {
    // ── EXIT / TIMEOUT ──
    roleRecord.entryTime = null;
    roleRecord.outTime = new Date();
    await roleRecord.save();

    // Release any slot they currently occupy
    const occupiedSlot = await Slot.findOne({ occupiedBy: user._id });
    if (occupiedSlot) {
      const wasExclusive = occupiedSlot.assignedStudentId?.equals(user._id);
      const exitTime = new Date();
      const durationMs = occupiedSlot.entryTime ? exitTime - new Date(occupiedSlot.entryTime) : 0;
      const durationMins = Math.round(durationMs / 60000);

      occupiedSlot.isOccupied = false;
      occupiedSlot.occupiedBy = null;
      occupiedSlot.entryTime = null;
      occupiedSlot.endTime = exitTime;
      occupiedSlot.status = wasExclusive ? 'exclusive' : 'available';
      await occupiedSlot.save();

      // Log the unpark with duration and slot info
      const shape = await require('../models/shapeModel').findById(occupiedSlot.slotId).select('metadata.label mapId').populate('mapId', 'name');
      await ActivityLog.create({
        userId: user._id,
        actionType: 'parking',
        action: 'UNPARKED',
        description: `${fullName} vacated slot ${occupiedSlot.slotNumber}.`,
        entityType: 'Slot',
        entityId: occupiedSlot._id,
        metadata: {
          slotNumber: occupiedSlot.slotNumber,
          slotLabel: shape?.metadata?.label || occupiedSlot.slotNumber,
          mapName: shape?.mapId?.name || null,
          duration: durationMins,
          guardId,
        },
      });
    }

    message = `Exit recorded. See you next time, ${firstName}!`;
    action = 'OUT_TIME';
    description = `${fullName} exited the campus.${occupiedSlot ? ' Slot released.' : ''}`;
    notifTitle = 'Exit Recorded';
    notifMessage = `Hey ${firstName}! Your exit has been recorded. See you next time!`;
  }

  // Activity log — entry/exit (userId = the scanned user so it shows on their profile)
  await ActivityLog.create({
    userId: user._id,
    actionType: 'parking',
    action,
    description,
    entityType: 'Attendance',
    entityId: user._id,
    metadata: { scannedUserId: user._id, guardId, role: user.role },
  });

  // Notification for the scanned user
  await notificationService.createNotification({
    userId: user._id,
    title: notifTitle,
    message: notifMessage,
  });

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

  if (!entryTime) {
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
    const shape = await require('../models/shapeModel').findById(slot.slotId).select('metadata.label mapId').populate('mapId', 'name');
    await ActivityLog.create({
      userId,
      actionType: 'parking',
      action: 'PARKED',
      description: `User parked in exclusive slot ${slot.slotNumber}.`,
      entityType: 'Slot',
      entityId: slot._id,
      metadata: { slotNumber: slot.slotNumber, slotLabel: shape?.metadata?.label || slot.slotNumber, mapName: shape?.mapId?.name || null, exclusive: true },
    });
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
    const shape2 = await require('../models/shapeModel').findById(slot.slotId).select('metadata.label mapId').populate('mapId', 'name');
    await ActivityLog.create({
      userId,
      actionType: 'parking',
      action: 'PARKED',
      description: `User parked in an assigned slot ${slot.slotNumber} (not their own).`,
      entityType: 'Slot',
      entityId: slot._id,
      metadata: { slotNumber: slot.slotNumber, slotLabel: shape2?.metadata?.label || slot.slotNumber, mapName: shape2?.mapId?.name || null, exclusive: false },
    });
  } else if (!slot.entryTime && !slot.assignedStudentId) {
    slot.entryTime = Date.now();
    slot.isOccupied = true;
    slot.occupiedBy = userId;
    slot.status = 'occupied';
    await slot.save();
    message = 'Thanks for parking!';
    const shape3 = await require('../models/shapeModel').findById(slot.slotId).select('metadata.label mapId').populate('mapId', 'name');
    await ActivityLog.create({
      userId,
      actionType: 'parking',
      action: 'PARKED',
      description: `User parked in available slot ${slot.slotNumber}.`,
      entityType: 'Slot',
      entityId: slot._id,
      metadata: { slotNumber: slot.slotNumber, slotLabel: shape3?.metadata?.label || slot.slotNumber, mapName: shape3?.mapId?.name || null, exclusive: false },
    });
  }

  return message;
};
