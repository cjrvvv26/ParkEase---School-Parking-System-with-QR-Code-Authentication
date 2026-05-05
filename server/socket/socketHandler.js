const chatService = require('../services/chatService');

const socketHandler = (io) => {
  io.on('connection', (socket) => {
    console.log('User connected: ', socket.id);

    socket.on('join room', (chatId) => {
      socket.join(chatId);
    });

    // Each user joins their own personal room for targeted notifications
    socket.on('join_user', (userId) => {
      socket.join(`user:${userId}`);
    });

    socket.on('send_message', async (data) => {
      try {
        const saveMessage = await chatService.saveMessage(data);
        const plain = saveMessage.toObject();
        plain._id = plain._id.toString();
        plain.sender = plain.sender.toString();
        plain.receiver = plain.receiver.toString();
        io.to(data.chatId).emit('received_message', plain);
      } catch (error) {
        console.log(error.message);
      }
    });

    socket.on('disconnect', () => {
      console.log('User disconnected', socket.id);
    });
  });
};

// Function to broadcast slot updates to all connected clients
const broadcastSlotUpdate = (io, updatedSlotData) => {
  io.emit('slot:updated', {
    shapeId: updatedSlotData.shapeId,
    assignedStudentId: updatedSlotData.assignedStudentId,
    assignedName: updatedSlotData.assignedName,
    occupiedBy: updatedSlotData.occupiedBy,
    slotStatus: updatedSlotData.slotStatus,
    status: updatedSlotData.status,
  });
};

module.exports = socketHandler;
module.exports.broadcastSlotUpdate = broadcastSlotUpdate;
