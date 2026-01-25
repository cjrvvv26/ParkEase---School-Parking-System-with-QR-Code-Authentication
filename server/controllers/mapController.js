const mongoose = require("mongoose");
const crypto = require("crypto");
const Map = require("../models/mapModel");
const Shape = require("../models/shapeModel");
const Slot = require("../models/slotModel");
const cloudinary = require("../utils/cloudinary");
const { uploadShapeImage } = require("../services/mediaService");

// Create a new map with shapes
exports.createMap = async (req, res) => {
  try {
    const { name, height, width, shapes } = req.body;
    const createdBy = req.user.id; // assuming auth middleware sets req.user

    // Create the map
    const newMap = new Map({
      name,
      height,
      width,
      createdBy,
    });

    const savedMap = await newMap.save();

    // Insert shapes with mapId
    if (shapes && Array.isArray(shapes)) {
      const shapesWithMapId = shapes.map((shape) => ({
        ...shape,
        mapId: savedMap._id,
      }));

      const insertedShapes = await Shape.insertMany(shapesWithMapId);

      // Create slots for slot shapes
      const slotShapes = insertedShapes.filter(
        (s) => s.metadata.type === "slot",
      );
      const slots = slotShapes.map((shape) => ({
        assignedStudentId: null,
        slotId: shape._id,
        status: "available",
      }));

      if (slots.length > 0) {
        await Slot.insertMany(slots);
      }

      res.status(201).json({
        message: "Map created successfully",
        map: savedMap,
        shapes: insertedShapes,
      });
    } else {
      res.status(201).json({
        message: "Map created successfully",
        map: savedMap,
      });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
// Get all maps for the user
exports.getAllMaps = async (req, res) => {
  try {
    const maps = await Map.find({ createdBy: req.user.id });
    res.status(200).json(maps);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get all maps with shapes
exports.getAllMapsWithShapes = async (req, res) => {
  try {
    const filter = req.user ? { createdBy: req.user.id } : {};
    const maps = await Map.find(filter);
    const mapsWithShapes = await Promise.all(
      maps.map(async (map) => {
        const shapes = await Shape.find({ mapId: map._id });
        return { ...map.toObject(), shapes };
      }),
    );
    res.status(200).json(mapsWithShapes);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get a map by ID with shapes
exports.getMapById = async (req, res) => {
  try {
    const { id } = req.params;
    const map = await Map.findById(id);
    if (!map) {
      return res.status(404).json({ error: "Map not found" });
    }

    const shapes = await Shape.find({ mapId: id });
    res.status(200).json({ map, shapes });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Update a map
exports.updateMap = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, height, width } = req.body;

    const updatedMap = await Map.findByIdAndUpdate(
      id,
      { name, height, width },
      { new: true },
    );

    if (!updatedMap) {
      return res.status(404).json({ error: "Map not found" });
    }

    res
      .status(200)
      .json({ message: "Map updated successfully", map: updatedMap });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete a map and its shapes and slots
exports.deleteMap = async (req, res) => {
  try {
    const { id } = req.params;

    // Delete shapes
    const shapes = await Shape.find({ mapId: id });
    const shapeIds = shapes.map((s) => s._id);

    await Shape.deleteMany({ mapId: id });

    // Delete slots
    if (shapeIds.length > 0) {
      await Slot.deleteMany({ slotId: { $in: shapeIds } });
    }

    // Delete map
    const deletedMap = await Map.findByIdAndDelete(id);

    if (!deletedMap) {
      return res.status(404).json({ error: "Map not found" });
    }

    res.status(200).json({ message: "Map deleted successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
