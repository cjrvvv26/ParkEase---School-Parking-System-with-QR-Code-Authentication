const mongoose = require("mongoose");
const Notification = require("../models/notification");

exports.createNotification = async (data) => {
  const { userId, title, message } = data;
  const notification = await Notification.create({
    userId,
    message,
    title,
  });
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
