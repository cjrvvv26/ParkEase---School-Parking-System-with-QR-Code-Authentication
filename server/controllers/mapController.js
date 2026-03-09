const mongoose = require('mongoose');
const Map = require('../models/mapModel');
const Shape = require('../models/shapeModel');
const Slot = require('../models/slotModel');
const generateQRCode = require('../utils/generateQRCode');
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
        const slotNumber = shape.metadata.label; // e.g. A-01
        const qrText = `MAP:${map._id}-SLOT:${slotNumber}`;

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
      actionType: 'parking',
      action: 'REGISTER',
      description: `A new parking map "${map.name}" has been created with ${slotShapes.length} slots.`,
      entityType: 'Slot',
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

    // IMPORTANT: multipart/form-data => shapes is STRING
    let shapes = null;
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

    // If shapes are provided, update them
    if (shapes && Array.isArray(shapes)) {
      // Delete existing shapes for this map
      await Shape.deleteMany({ mapId: id });

      // Index uploaded Cloudinary files by tempId
      const imageMap = {};
      req.files?.forEach((file) => {
        // building[tempId]
        const match = file.fieldname.match(/\[(.*?)\]/);
        if (match) imageMap[match[1]] = file;
      });

      // Create new shapes
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

      // Update slots if there are slot shapes
      const slotShapes = savedShapes.filter((s) => s.metadata?.type === 'slot');

      if (slotShapes.length) {
        // Delete existing slots for this map's shapes
        const existingSlots = await Slot.find({ mapId: id });
        const existingSlotIds = existingSlots.map((s) => s._id);
        await Slot.deleteMany({ _id: { $in: existingSlotIds } });

        const slots = [];

        for (const shape of slotShapes) {
          const slotNumber = shape.metadata.label; // e.g. A-01
          const qrText = `MAP:${id}-SLOT:${slotNumber}`;

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
        actionType: 'parking',
        action: 'UPDATE_MAP',
        description: `Parking map "${updatedMap.name}" has been updated with ${slotShapes.length} slots.`,
        entityType: 'Slot',
        entityId: id,
        metadata: {
          mapName: updatedMap.name,
          totalSlots: slotShapes.length,
        },
      });

      const mapNotif = {
        userId: req.user._id,
        title: 'Parking Map Updated',
        message: `The parking area "${updatedMap.name}" has been updated. The new layout is now available in the system.`,
      };
      console.log(mapNotif);

      await notificationService.createNotification(mapNotif);
    }

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
      return res.status(404).json({ error: 'Map not found' });
    }

    res.status(200).json({ message: 'Map deleted successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
