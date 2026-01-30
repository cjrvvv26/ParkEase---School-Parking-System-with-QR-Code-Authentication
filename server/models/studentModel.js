const mongoose = require("mongoose");
const { Schema } = mongoose;

const motorDetails = new Schema({
  plateNo: { type: String, required: true },
  brand: { type: String, required: true },
  model: { type: String, required: true },
  color: { type: String, required: true },
});

const studentSchema = new Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    unique: true,
    required: true,
  },
  studentNo: { type: String, required: true },
  name: {
    firstName: { type: String, trim: true, required: true },
    middleName: { type: String, trim: true, required: true },
    lastName: { type: String, trim: true, required: true },
  },
  yearLevel: { type: String, required: true },
  course: { type: String, required: true },
  phoneNo: { type: String, required: true },
  payment: {
    isPaid: { type: Boolean, default: false },
    amount: { type: Number, default: 0 },
  },
  QRCode: { type: String, required: true },
  entryTime: Date,
  outTime: Date,
  creditPoints: { type: Number, default: 200, required: true },
  motorDetails,
});

module.exports = mongoose.model("student", studentSchema);
