const mongoose = require('mongoose');
const { Schema } = mongoose;

const courseSchema = new Schema(
  {
    name: String,
    name: String,
  },
  { timestamps: true },
);

module.exports = mongoose.model('course', courseSchema);
