const mongoose = require('mongoose');
const { Schema } = mongoose;

const motorDetails = new Schema({
  plateNo: { type: String },
  brand: { type: String },
  model: { type: String },
  color: { type: String },
});

const facultySchema = new Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    unique: true,
    required: true,
  },
  name: {
    firstName: { type: String, trim: true, required: true },
    middleName: { type: String, trim: true, required: true },
    lastName: { type: String, trim: true, required: true },
  },
  phoneNo: { type: String, required: true },
  QRCode: { url: String, public_id: String },
  entryTime: Date,
  outTime: Date,
  motorDetails: { type: motorDetails, default: null },
});

module.exports = mongoose.model('faculty', facultySchema);
