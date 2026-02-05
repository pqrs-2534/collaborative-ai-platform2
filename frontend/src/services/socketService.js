import { io } from 'socket.io-client';

const SOCKET_URL = process.env.REACT_APP_SOCKET_URL || 'http://localhost:5000';

class SocketService {
  constructor() {
    this.socket = null;
    this.connected = false;
  }

  // Connect to socket server
  connect(token) {
    if (this.socket && this.connected) {
      return this.socket;
    }

    this.socket = io(SOCKET_URL, {
      auth: { token },
      transports: ['websocket', 'polling'],
    });

    this.socket.on('connect', () => {
      this.connected = true;
      console.log('✅ Socket connected:', this.socket.id);
    });

    this.socket.on('disconnect', () => {
      this.connected = false;
      console.log('❌ Socket disconnected');
    });

    this.socket.on('error', (error) => {
      console.error('Socket error:', error);
    });

    return this.socket;
  }

  // Disconnect from socket server
  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.connected = false;
    }
  }

  // Join a room
  joinRoom(roomType, roomId, callback) {
    if (this.socket) {
      this.socket.emit(`join${roomType}`, roomId, callback);
    }
  }

  // Leave a room
  leaveRoom(roomType, roomId) {
    if (this.socket) {
      this.socket.emit(`leave${roomType}`, roomId);
    }
  }

  // Emit event
  emit(event, data) {
    if (this.socket) {
      this.socket.emit(event, data);
    }
  }

  // Listen to event
  on(event, callback) {
    if (this.socket) {
      this.socket.on(event, callback);
    }
  }

  // Remove listener
  off(event, callback) {
    if (this.socket) {
      this.socket.off(event, callback);
    }
  }

  // Get socket instance
  getSocket() {
    return this.socket;
  }

  // Check if connected
  isConnected() {
    return this.connected;
  }
}

const socketService = new SocketService();


export default socketService;