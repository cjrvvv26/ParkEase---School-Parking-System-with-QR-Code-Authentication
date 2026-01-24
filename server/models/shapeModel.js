// models/shapeModel.js
const mongoose = require("mongoose");

const geometrySchema = new mongoose.Schema({
  shape: { type: String, enum: ["rect", "parallelogram", "polygon"] },
  x: { type: Number }, // top-left x (for rect/parallelogram)
  y: { type: Number }, // top-left y
  width: { type: Number }, // width (for rect/parallelogram)
  height: { type: Number }, // height
  rotation: { type: Number }, // rotation angle
  points: [{ x: Number, y: Number }], // for polygons
});

const metadataSchema = new mongoose.Schema({
  label: { type: String }, // e.g., A-01
  type: { type: String, enum: ["slot", "building"] },
  area: { type: String },
  locked: { type: Boolean, default: false },
  information: {
    picture: {
      url: String,
      public_id: String,
    },
    name: String,
    description: String,
  },
});

const shapeSchema = new mongoose.Schema(
  {
    mapId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "map",
    },
    geometry: geometrySchema,
    metadata: metadataSchema,
  },
  { timestamps: true },
);

module.exports = mongoose.model("shape", shapeSchema);
