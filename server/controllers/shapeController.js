const mongoose = require("mongoose");
const Slot = require("../models/slotModel");
const Shape = require("../models/shapeModel");
const shapeService = require("../services/shapeService");

exports.getAllShapes = async (req, res) => {
  try {
    const { area } = req.body;
    const filter = {};

    if (area) filter["metadata.area"] = area;

    const shapes = await Shape.find(filter);
    res.status(200).json(shapes);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.saveMapLayout = async (req, res) => {
  try {
    const { shapes } = req.body;

    if (!Array.isArray(shapes)) throw new Error("Invalid request");

    const insertedShapes = await Shape.insertMany(shapes);
    const insertedSlots = insertedShapes.filter(
      (s) => s.metadata.type === "slot"
    );

    const slots = insertedSlots.map(() => ({
      assignedStudentId: null,
      slotId: s._id,
      status: "available",
    }));

    await Slot.insertMany(slots);

    res
      .status(201)
      .json({ message: "Area created successfully", shapes: insertedShapes });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.updateMapLayout = async (req, res) => {
  try {
    const shapes = await shapeService.modifyMapLayout(req.body);
    res.status(200).json({ message: "Updated successfully", shapes });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
