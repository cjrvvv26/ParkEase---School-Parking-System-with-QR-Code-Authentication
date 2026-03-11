const mongoose = require('mongoose');
const { Schema } = mongoose;

const courseSchema = new Schema(
  {
    name: { type: String, uppercase: true },
    description: String,
  },
  { timestamps: true },
);

module.exports = mongoose.model('course', courseSchema);
