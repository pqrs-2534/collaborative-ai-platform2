module.exports = (io, socket) => {
  // Join project room
  socket.on('joinProject', (projectId, callback) => {
    socket.join(`project_${projectId}`);
    console.log(`📂 User ${socket.id} joined project: ${projectId}`);
    
    // Callback is optional
    if (callback && typeof callback === 'function') {
      callback({ success: true });
    }
  });

  // Leave project room
  socket.on('leaveProject', (projectId, callback) => {
    socket.leave(`project_${projectId}`);
    console.log(`📂 User ${socket.id} left project: ${projectId}`);
    
    // Callback is optional
    if (callback && typeof callback === 'function') {
      callback({ success: true });
    }
  });

  // Notify project members of updates
  socket.on('projectUpdate', ({ projectId, updateType, data }) => {
    socket.to(`project_${projectId}`).emit('projectUpdate', {
      updateType,
      data,
      timestamp: new Date().toISOString(),
    });
  });

  // Task updates
  socket.on('taskUpdate', ({ projectId, task }) => {
    io.to(`project_${projectId}`).emit('taskUpdate', task);
  });

  // User presence
  socket.on('userPresence', ({ projectId, status }) => {
    socket.to(`project_${projectId}`).emit('userPresence', {
      userId: socket.user?._id || socket.id,
      userName: socket.user?.name || 'Anonymous',
      status,
      timestamp: new Date().toISOString(),
    });
  });
};