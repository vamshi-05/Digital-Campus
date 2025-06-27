const Chat = require('../models/Chat');
const User = require('../models/User');

module.exports = (io) => {
  io.on('connection', (socket) => {
    // Join user to their own room
    socket.on('join', (userId) => {
      socket.join(userId);
    });

    // Send message
    socket.on('send_message', async ({ from, to, content }) => {
      // Find or create chat between participants
      let chat = await Chat.findOne({ participants: { $all: [from, to] } });
      if (!chat) {
        chat = new Chat({ participants: [from, to] });
      }
      chat.messages.push({ sender: from, content });
      await chat.save();
      // Emit to both users
      io.to(from).to(to).emit('receive_message', { from, to, content });
      // Optionally, emit to admin for monitoring
      io.to('admin').emit('monitor_message', { from, to, content });
    });

    // Admin joins admin room
    socket.on('join_admin', () => {
      socket.join('admin');
    });
  });
}; 