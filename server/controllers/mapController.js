const mongoose = require('mongoose');
const Map = require('../models/mapModel');
const Shape = require('../models/shapeModel');
const Slot = require('../models/slotModel');
const generateQRCode = require('../utils/generateQRCode');
const cloudinary = require('../utils/cloudinary');
const ActivityLogs = require('../models/activityModel');
const notificationService = require('../services/notificationService');

// Create a new map with shapes
exports.createMap = async (req, res) => {
  try {
    const { name, height, width } = req.body;
    const createdBy = req.user.id;

    // Validate required fields
    if (!name || !height || !width) {
      return res.status(400).json({
        error: 'Missing required fields: name, height, and width are required.',
      });
    }

    if (!req.body.shapes) {
      return res.status(400).json({
        error: 'Missing required field: shapes.',
      });
    }

    // IMPORTANT: multipart/form-data => shapes is STRING
    let shapes;
    try {
      shapes = JSON.parse(req.body.shapes);
    } catch (parseError) {
      return res.status(400).json({
        error: 'Invalid shapes format. Shapes must be valid JSON.',
      });
    }

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

      if (shape.metadata?.type === 'building' && imageMap[shape.tempId]) {
        newShape.metadata.information.picture = {
          url: imageMap[shape.tempId].path,
          public_id: imageMap[shape.tempId].filename,
        };
      }

      await newShape.save();
      savedShapes.push(newShape);
    }

    // 4. Create slots
    const slotShapes = savedShapes.filter((s) => s.metadata?.type === 'slot');

    if (slotShapes.length) {
      const slots = [];

      for (const shape of slotShapes) {
        console.log(shape);

        const slotNumber = shape.metadata.label;
        const qrText = `MAP:${map._id}-SLOT:${shape._id}`;

        const qrCode = await generateQRCode(qrText);

        slots.push({
          slotId: shape._id,
          slotNumber,
          QRCode: qrCode,
          assignedStudentId: null,
          status: 'available',
        });
      }

      await Slot.insertMany(slots);
    }

    await ActivityLogs.create({
      userId: req.user._id,
      actionType: 'map',
      action: 'REGISTER',
      description: `A new parking map "${map.name}" has been created with ${slotShapes.length} slots.`,
      entityType: 'Map',
      entityId: map._id,
      metadata: {
        mapName: map.name,
        totalSlots: slotShapes.length,
      },
    });

    const mapNotif = {
      userId: req.user._id,
      title: 'New Parking Map Created',
      message: `You have created a new parking area. The updated layout is now available in the system. You may review and manage the slots as needed.`,
    };

    await notificationService.createNotification(mapNotif);

    res.status(201).json({
      message: 'Map created successfully',
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
      return res.status(404).json({ error: 'Map not found' });
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

    // Validate required fields
    if (!name || !height || !width) {
      return res.status(400).json({
        error: 'Missing required fields: name, height, and width are required.',
      });
    }

    // Parse shapes if provided
    let shapes = [];
    if (req.body.shapes) {
      try {
        shapes = JSON.parse(req.body.shapes);
      } catch (parseError) {
        return res.status(400).json({
          error: 'Invalid shapes format. Shapes must be valid JSON.',
        });
      }
    }

    // Update map basic info
    const updatedMap = await Map.findByIdAndUpdate(
      id,
      { name, height, width },
      { new: true },
    );

    if (!updatedMap) {
      return res.status(404).json({ error: 'Map not found' });
    }

    let savedShapes = [];

    if (shapes.length) {
      // --- Step 1: Delete old shapes and their slots ---
      const oldShapes = await Shape.find({ mapId: id });
      const oldShapeIds = oldShapes.map((s) => s._id);

      await Shape.deleteMany({ mapId: id });
      const oldSlots = await Slot.find({ slotId: { $in: oldShapeIds } });
      for (const s of oldSlots) {
        if (s.QRCode?.public_id) {
          await cloudinary.uploader.destroy(s.QRCode.public_id).catch(() => {});
        }
      }
      await Slot.deleteMany({ slotId: { $in: oldShapeIds } });

      // --- Step 2: Index uploaded Cloudinary files ---
      const imageMap = {};
      req.files?.forEach((file) => {
        const match = file.fieldname.match(/\[(.*?)\]/);
        if (match) imageMap[match[1]] = file;
      });

      // --- Step 3: Create new shapes ---
      for (const shape of shapes) {
        const newShape = new Shape({
          ...shape,
          mapId: id,
        });

        if (shape.metadata?.type === 'building' && imageMap[shape.tempId]) {
          newShape.metadata.information.picture = {
            url: imageMap[shape.tempId].path,
            public_id: imageMap[shape.tempId].filename,
          };
        }

        await newShape.save();
        savedShapes.push(newShape);
      }

      // --- Step 4: Create slots for shapes with type 'slot' ---
      const slotShapes = savedShapes.filter((s) => s.metadata?.type === 'slot');

      if (slotShapes.length) {
        const slots = [];
        for (const shape of slotShapes) {
          const slotNumber = shape.metadata.label; // e.g., "A-01"
          const qrText = `MAP:${id}-SLOT:${shape._id}`; // QR stores ObjectId
          const qrCode = await generateQRCode(qrText);

          slots.push({
            slotId: shape._id,
            mapId: id, // optional but useful for queries
            slotNumber,
            QRCode: qrCode,
            assignedStudentId: null,
            status: 'available',
          });
        }

        await Slot.insertMany(slots);
      }

      // --- Step 5: Log activity ---
      await ActivityLogs.create({
        userId: req.user._id,
        actionType: 'map',
        action: 'UPDATE_MAP',
        description: `Parking map "${updatedMap.name}" has been updated with ${slotShapes.length} slots.`,
        entityType: 'Map',
        entityId: id,
        metadata: {
          mapName: updatedMap.name,
          totalSlots: slotShapes.length,
        },
      });

      // --- Step 6: Send notification ---
      const mapNotif = {
        userId: req.user._id,
        title: 'Parking Map Updated',
        message: `The parking area "${updatedMap.name}" has been updated. The new layout is now available in the system.`,
      };
      await notificationService.createNotification(mapNotif);
    }

    // --- Step 7: Respond ---
    res.status(200).json({
      message: 'Map updated successfully',
      map: updatedMap,
      shapes: savedShapes,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete a map and its shapes and slots
exports.deleteMap = async (req, res) => {
  try {
    const { id } = req.params;

    const shapes = await Shape.find({ mapId: id });
    const shapeIds = shapes.map((s) => s._id);

    // Clear assigned/occupied users before deleting slots
    if (shapeIds.length > 0) {
      const slots = await Slot.find({ slotId: { $in: shapeIds } });
      const Student = require('../models/studentModel');
      const Faculty = require('../models/facultyModel');
      for (const slot of slots) {
        if (slot.assignedStudentId) {
          await Student.findOneAndUpdate({ userId: slot.assignedStudentId }, { $unset: { entryTime: 1, outTime: 1 } });
          await Faculty.findOneAndUpdate({ userId: slot.assignedStudentId }, { $unset: { entryTime: 1, outTime: 1 } });
        }
        if (slot.occupiedBy) {
          await Student.findOneAndUpdate({ userId: slot.occupiedBy }, { $unset: { entryTime: 1, outTime: 1 } });
          await Faculty.findOneAndUpdate({ userId: slot.occupiedBy }, { $unset: { entryTime: 1, outTime: 1 } });
        }
        if (slot.QRCode?.public_id) {
          await cloudinary.uploader.destroy(slot.QRCode.public_id).catch(() => {});
        }
      }
      await Slot.deleteMany({ slotId: { $in: shapeIds } });
    }

    await Shape.deleteMany({ mapId: id });
    const deletedMap = await Map.findByIdAndDelete(id);

    if (!deletedMap) {
      return res.status(404).json({ error: 'Map not found' });
    }

    await ActivityLogs.create({
      userId: req.user._id,
      actionType: 'map',
      action: 'DELETE_MAP',
      description: `Parking map "${deletedMap.name}" has been deleted.`,
      entityType: 'Map',
      entityId: deletedMap._id,
      metadata: { mapName: deletedMap.name },
    });

    res.status(200).json({ message: 'Map deleted successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete a single shape and its slot, clearing user assignments
exports.deleteShape = async (req, res) => {
  try {
    const { shapeId } = req.params;
    const shape = await Shape.findById(shapeId);
    if (!shape) return res.status(404).json({ error: 'Shape not found' });

    if (shape.metadata?.type === 'slot') {
      const slot = await Slot.findOne({ slotId: shapeId });
      if (slot) {
        const Student = require('../models/studentModel');
        const Faculty = require('../models/facultyModel');
        if (slot.assignedStudentId) {
          await Student.findOneAndUpdate({ userId: slot.assignedStudentId }, { $unset: { entryTime: 1, outTime: 1 } });
          await Faculty.findOneAndUpdate({ userId: slot.assignedStudentId }, { $unset: { entryTime: 1, outTime: 1 } });
        }
        if (slot.occupiedBy) {
          await Student.findOneAndUpdate({ userId: slot.occupiedBy }, { $unset: { entryTime: 1, outTime: 1 } });
          await Faculty.findOneAndUpdate({ userId: slot.occupiedBy }, { $unset: { entryTime: 1, outTime: 1 } });
        }
        await Slot.deleteOne({ slotId: shapeId });
        if (slot.QRCode?.public_id) {
          await cloudinary.uploader.destroy(slot.QRCode.public_id).catch(() => {});
        }
      }
    }

    await Shape.findByIdAndDelete(shapeId);
    res.status(200).json({ message: 'Shape deleted successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
