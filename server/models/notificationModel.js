const mongoose = require('mongoose');
const { Schema } = mongoose;

const notificationSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'user' },
    actorId: { type: Schema.Types.ObjectId, ref: 'user' },
    message: { type: String, required: true },
    title: { type: String, required: true },
    read: { type: Boolean, default: false },
  },
  { timestamps: true },
);

module.exports = mongoose.model('notification', notificationSchema);
