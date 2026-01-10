const Slot = require("../models/slotModel");
const Shape = require("../models/shapeModel");
const mongoose = require("mongoose");

exports.modifyMapLayout = async (data) => {
  const { area, shapes } = data;

  if (!area) throw new Error("Map not found");
  if (!Array.isArray(shapes)) throw new Error("Invalid request");

  const existingShapes = await Shape.find({ area });
  const existingIds = existingShapes.map((s) => s._id.toString());

  const frontendIds = shapes.filter((s) => s._id).map((s) => s._id);

  const shapesToDelete = existingIds.filter((id) => !frontendIds.includes(id));
  const slotsToDelete = await Slot.find({
    slotId: { $in: shapesToDelete },
  });
  const assignedSlots = slotsToDelete.filter((s) => s.assignedStudentId);

  if (assignedSlots.length > 0) {
    throw new Error("You cannot delete assigned slot");
  }

  if (shapesToDelete.length > 0) {
    await Shape.deleteMany({ _id: { $in: shapesToDelete } });
    await Slot.deleteMany({ slotId: { $in: shapesToDelete } });
  }

  const updatedShapes = [];

  for (const shape of shapes) {
    const { _id, ...rest } = shape;

    let result;
    if (_id && mongoose.Types.ObjectId.isValid(_id)) {
      result = await Shape.findByIdAndUpdate(_id, rest, { new: true });
    } else {
      result = await Shape.create(rest);

      if (rest.metadata?.type === "slot") {
        await Slot.create({
          assignedStudentId: null,
          slotId: result._id,
          status: "available",
        });
      }
    }

    if (result) updatedShapes.push(result);
  }

  return updatedShapes;
};
