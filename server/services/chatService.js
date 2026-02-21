const Message = require("../models/messageModel");

exports.saveMessage = async (data) => {
  return await Message.create(data);
};
