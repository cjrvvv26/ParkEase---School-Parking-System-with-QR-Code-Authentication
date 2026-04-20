const mongoose = require('mongoose');
const Slot = require('../models/slotModel');
const Shape = require('../models/shapeModel');
const User = require('../models/userModel');
const Map = require('../models/mapModel');
const qrService = require('../services/qrService');
const slotService = require('../services/slotService');

exports.getSlotDetails = async (req, res) => {
  try {
    let assignedStudent = null;
    let occupyingUser = null;

    if (!mongoose.Types.ObjectId.isValid(req.body._id))
      throw new Error('Invalid slot id');
    let slot = await Slot.findOne({ slotId: req.body._id });
    if (slot.assignedStudentId) {
      assignedStudent = await slotService.getAssignedStudent(
        slot.assignedStudentId,
      );
    }
    if (slot.occupiedBy && !slot.occupiedBy.equals(slot.assignedStudentId)) {
      occupyingUser = await slotService.getAssignedStudent(slot.occupiedBy);
    }

    const details = {
      ...(slot ? slot.toObject() : {}),
      ...assignedStudent,
      occupyingUser: slot.occupiedBy ? occupyingUser || assignedStudent : null,
    };

    res
      .status(201)
      .json({ message: 'Successfully fetched slot data', slot: details });
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
};

exports.getYourSlotLocation = async (req, res) => {
  try {
    const { userId } = req.params;
    // First try to find assigned slot, then occupied slot
    let slot = await Slot.findOne({ assignedStudentId: userId }).populate({
      path: 'slotId',
      select: 'metadata.label mapId',
    });

    if (!slot) {
      // If no assigned slot, check if currently occupying a slot
      slot = await Slot.findOne({ occupiedBy: userId }).populate({
        path: 'slotId',
        select: 'metadata.label mapId',
      });
    }

    if (!slot) {
      return res.status(404).json({ error: 'No slot found for this user' });
    }

    if (!slot.slotId) {
      return res.status(404).json({ error: 'Slot shape not found' });
    }

    const map = await Map.findById(slot.slotId.mapId);

    if (!map) {
      return res.status(404).json({ error: 'Map not found' });
    }

    const shapes = await Shape.find({ mapId: map._id });

    res.status(200).json({ slot, map, shapes });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getAvailableSlots = async (req, res) => {
  try {
    const slots = await Slot.find({ status: 'available' }).populate({
      path: 'slotId',
      select: 'metadata.label mapId',
      populate: {
        path: 'mapId',
        select: 'name',
      },
    });
    if (!slots.length) {
      return res.status(404).json({ error: 'No slots available' });
    }
    res.status(200).json(slots);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getAllSlotDetails = async (req, res) => {
  try {
    const { mapId } = req.params;
    if (!mapId) return res.status(404).json({ error: 'No selected map' });
    const data = await slotService.getSlotsQRDetails(mapId);

    res.status(200).json({ metadata: data.map, slots: data.slots });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.assignStudentSlot = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  let committed = false;

  try {
    let { student } = req.body;

    await slotService.verifyStudentInfo(student);

    const updatedSlot = await slotService.assignStudent(req.body, session);

    if (updatedSlot.assignedStudentId) {
      student = await slotService.getAssignedStudent(
        updatedSlot.assignedStudentId,
      );
    }

    const details = {
      ...updatedSlot,
      ...student,
    };

    await session.commitTransaction();
    committed = true;
    session.endSession();

    res
      .status(200)
      .json({ message: 'Successfully assigned student', slot: details });
  } catch (error) {
    if (!committed) {
      try {
        await session.abortTransaction();
      } catch (abortErr) {
        console.log('Transaction could not be aborted:', abortErr.message);
      }
    }
    session.endSession();
    res.status(500).json({ error: error.message });
  }
};

exports.removeAssignment = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { id } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new Error('Invalid Object ID');
    }

    const slot = await slotService.removeAssignment(id, session);

    await session.commitTransaction();
    session.endSession();

    res.status(200).json({
      message: 'Successfully removed student',
      slot, // ⚡ safe, plain object
    });
  } catch (error) {
    // Only abort if the transaction hasn't been committed
    if (session.inTransaction()) {
      await session.abortTransaction();
    }
    session.endSession();
    res.status(500).json({ error: error.message });
  }
};

exports.verifyUserSlot = async (req, res) => {
  try {
    const message = await qrService.verifySlotData(req.body);
    res.status(200).json({ message });
  } catch (error) {
    res.status(403).json({ error: error.message });
  }
};

exports.guardScan = async (req, res) => {
  try {
    const { qrData, guardId } = req.body;
    if (!qrData || !guardId) throw new Error('Missing qrData or guardId');
    const message = await qrService.guardScan(qrData, guardId);
    res.status(200).json({ message });
  } catch (error) {
    res.status(400).json({ error: error.message });
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
    res.status(200).json({ message: 'Student slot has been updated' });
  } catch (error) {
    session.abortTransaction();
    session.endSession();
    res.status(500).json({ error: error.message });
  }
};
