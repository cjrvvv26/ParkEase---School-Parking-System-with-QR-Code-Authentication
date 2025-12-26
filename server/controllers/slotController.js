const Slot = require("../models/slotModel");

exports.registerStudentSlot = async (req, res) => {
  try {
    const { studentId, slotNumber } = req.body;

    await Slot.registerStudentSlot(studentId, slotNumber);

    res
      .status(200)
      .json({ message: "Successfully registered in exclusive slot." });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.removeSlotExclusiveness = async (req, res) => {
  try {
    const { studentId, slotNumber } = req.body;

    await Slot.updateSlotExclusiveness(studentId, slotNumber);

    res.status(200).json({
      message: "Successfully removed student access in exclusive slot.",
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateSlotOccupancy = async (req, res) => {
  try {
    const { studentId, slotNumber } = req.body;

    const slot = await Slot.updateSlotOccupancy(studentId, slotNumber);

    res.status(200).json({ slot });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getAllSlots = async (req, res) => {
  try {
    const slots = Slot.find();

    res.status(200).json({ slots });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
