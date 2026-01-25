const mongoose = require("mongoose");
const Map = require("../models/mapModel");
const Shape = require("../models/shapeModel");
const Slot = require("../models/slotModel");
const generateQRCode = require("../utils/generateQRCode");

// Create a new map with shapes
exports.createMap = async (req, res) => {
  try {
    const { name, height, width } = req.body;
    const createdBy = req.user.id;

    // IMPORTANT: multipart/form-data => shapes is STRING
    const shapes = JSON.parse(req.body.shapes);

    // 1. Create map
    const map = await Map.create({
      name,
      height,
      width,
      createdBy,
    });

    // 2. Index uploaded Cloudinary files by tempId
    const imageMap = {};
    req.files?.forEach((file) => {
      // building[tempId]
      const match = file.fieldname.match(/\[(.*?)\]/);
      if (match) imageMap[match[1]] = file;
    });

    const savedShapes = [];

    // 3. Create shapes + attach building images
    for (const shape of shapes) {
      const newShape = new Shape({
        ...shape,
        mapId: map._id,
      });

      if (shape.metadata?.type === "building" && imageMap[shape.tempId]) {
        newShape.metadata.information.picture = {
          url: imageMap[shape.tempId].path,
          public_id: imageMap[shape.tempId].filename,
        };
      }

      await newShape.save();
      savedShapes.push(newShape);
    }

    // 4. Create slots
    const slotShapes = savedShapes.filter((s) => s.metadata?.type === "slot");

    if (slotShapes.length) {
      const slots = [];

      for (const shape of slotShapes) {
        const slotNumber = shape.metadata.label; // e.g. A-01
        const qrText = `MAP:${map._id}-SLOT:${slotNumber}`;

        const qrCode = await generateQRCode(qrText);

        slots.push({
          slotId: shape._id,
          slotNumber,
          QRCode: qrCode,
          assignedStudentId: null,
          status: "available",
        });
      }

      await Slot.insertMany(slots);
    }

    res.status(201).json({
      message: "Map created successfully",
      map,
      shapes: savedShapes,
    });
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
