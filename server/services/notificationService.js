const mongoose = require("mongoose");
const Notification = require("../models/notificationModel");

exports.createNotification = async (data, session) => {
  const { userId, title, message } = data;
  if (session) {
    const notification = new Notification({
      userId,
      title,
      message,
    });

    return await notification.save({ session });
  }

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
