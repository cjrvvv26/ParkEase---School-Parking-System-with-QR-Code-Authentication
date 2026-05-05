const mongoose = require("mongoose");
const Notification = require("../models/notificationModel");

let _io = null;
exports.setIo = (io) => { _io = io; };

exports.createNotification = async (data, session) => {
  const { userId, title, message } = data;
  let notification;
  if (session) {
    notification = new Notification({ userId, title, message });
    await notification.save({ session });
  } else {
    notification = await Notification.create({ userId, message, title });
  }

  if (_io) {
    _io.to(`user:${userId.toString()}`).emit('new_notification', {
      _id: notification._id.toString(),
      userId: userId.toString(),
      title,
      message,
      read: false,
      createdAt: notification.createdAt,
    });
  }

  return notification;
};

exports.deleteNotification = async (id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new Error("Invalid notification id");
  }

  const notification = await Notification.findByIdAndDelete(id);

  if (!notification)
    throw new Error("An error occurred while deleting notification");
};
