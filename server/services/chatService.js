const Message = require('../models/messageModel');

exports.saveMessage = async (data) => {
  return await Message.create(data);
};

exports.getMessages = async (chatId) => {
  return await Message.find({ chatId }).sort({ createdAt: 1 });
};
