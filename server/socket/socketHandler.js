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
        const { chatId, sender, receiver, message } = data;
        if (!chatId || !sender || !receiver || !message) return;

        const saveMessage = await chatService.saveMessage({
          chatId,
          sender,
          receiver,
          message,
        });
        const plain = saveMessage.toObject();
        plain._id = plain._id.toString();
        plain.sender = plain.sender.toString();
        plain.receiver = plain.receiver.toString();
        io.to(chatId).emit('received_message', plain);
      } catch (error) {
        console.log('[send_message error]', error.message);
        socket.emit('message_error', { error: error.message });
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
