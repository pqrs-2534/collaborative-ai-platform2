module.exports = (io, socket) => {
  // Join whiteboard room
  socket.on('joinWhiteboard', (projectId, callback) => {
    socket.join(`whiteboard_${projectId}`);
    console.log(`🎨 User ${socket.id} joined whiteboard: ${projectId}`);
    
    // Callback is optional
    if (callback && typeof callback === 'function') {
      callback({ success: true });
    }
  });

  // Leave whiteboard room
  socket.on('leaveWhiteboard', (projectId, callback) => {
    socket.leave(`whiteboard_${projectId}`);
    console.log(`🎨 User ${socket.id} left whiteboard: ${projectId}`);
    
    // Callback is optional
    if (callback && typeof callback === 'function') {
      callback({ success: true });
    }
  });

  // Handle new shape
  socket.on('whiteboardShape', ({ projectId, shape }) => {
    // Broadcast to all others in the room (not the sender)
    socket.to(`whiteboard_${projectId}`).emit('whiteboardShape', shape);
  });

  // Handle clear whiteboard
  socket.on('whiteboardClear', ({ projectId }) => {
    // Broadcast to all others in the room (not the sender)
    socket.to(`whiteboard_${projectId}`).emit('whiteboardClear');
  });
};