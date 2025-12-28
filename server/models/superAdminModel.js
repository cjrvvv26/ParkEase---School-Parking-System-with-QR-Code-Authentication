const mongoose = require("mongoose");
const { Schema } = mongoose;

const superAdminSchema = new Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "user",
    },
    name: { type: String, trim: true, required: true },
    password: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("super-admin", superAdminSchema);
