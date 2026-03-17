const chatService = require("../services/chatService");

const socketHandler = (io) => {
  io.on("connection", (socket) => {
    console.log("User connected: ", socket.id);

    socket.on("join room", (chatId) => {
      socket.join(chatId);
    });

    socket.on("send_message", async (data) => {
      try {
        const saveMessage = await chatService.saveMessage(data);
        const plain = saveMessage.toObject();
        plain._id = plain._id.toString();
        plain.sender = plain.sender.toString();
        plain.receiver = plain.receiver.toString();
        io.to(data.chatId).emit("received_message", plain);
      } catch (error) {
        console.log(error.message);
      }
    });

    socket.on("disconnect", () => {
      console.log("User disconnected", socket.id);
    });
  });
};

module.exports = socketHandler;
