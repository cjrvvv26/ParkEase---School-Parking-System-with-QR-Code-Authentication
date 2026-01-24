const mongoose = require("mongoose");
const { Schema } = mongoose;

const mapSchema = new Schema(
  {
    name: String,
    height: Number,
    width: Number,
    createdBy: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "user",
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("map", mapSchema);
