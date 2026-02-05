module.exports = (io, socket) => {
  // Join chat room
  socket.on('joinChat', (projectId, callback) => {
    socket.join(`chat_${projectId}`);
    console.log(`📥 User ${socket.id} joined chat: ${projectId}`);
    
    // Callback is optional
    if (callback && typeof callback === 'function') {
      callback({ success: true });
    }
  });

  // Leave chat room
  socket.on('leaveChat', (projectId, callback) => {
    socket.leave(`chat_${projectId}`);
    console.log(`📤 User ${socket.id} left chat: ${projectId}`);
    
    // Callback is optional
    if (callback && typeof callback === 'function') {
      callback({ success: true });
    }
  });

  // Send message
  socket.on('sendMessage', ({ projectId, content }) => {
    const message = {
      _id: Date.now().toString(),
      content,
      sender: socket.user || { _id: socket.id, name: 'Anonymous' },
      createdAt: new Date().toISOString(),
    };

    // Broadcast to all in the chat room (including sender)
    io.to(`chat_${projectId}`).emit('newMessage', message);
  });

  // Typing indicator
  socket.on('typing', ({ projectId, userName }) => {
    // Broadcast to others in the room (not sender)
    socket.to(`chat_${projectId}`).emit('typingIndicator', {
      userId: socket.user?._id || socket.id,
      userName: userName || 'Someone',
    });
  });
};