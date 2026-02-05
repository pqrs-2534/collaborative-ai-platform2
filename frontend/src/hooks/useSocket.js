import { useEffect, useRef, useState } from 'react';
import socketService from '../services/socketService';
import useAuth from './useAuth';

const useSocket = () => {
  const { token, isAuthenticated } = useAuth();
  const socketRef = useRef(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    if (isAuthenticated && token) {
      // Connect to socket
      const socket = socketService.connect(token);
      socketRef.current = socket;

      socket.on('connect', () => {
        setConnected(true);
      });

      socket.on('disconnect', () => {
        setConnected(false);
      });

      return () => {
        socketService.disconnect();
        setConnected(false);
      };
    }
  }, [isAuthenticated, token]);

  const joinRoom = (roomType, roomId, callback) => {
    socketService.joinRoom(roomType, roomId, callback);
  };

  const leaveRoom = (roomType, roomId) => {
    socketService.leaveRoom(roomType, roomId);
  };

  const emit = (event, data) => {
    socketService.emit(event, data);
  };

  const on = (event, callback) => {
    socketService.on(event, callback);
  };

  const off = (event, callback) => {
    socketService.off(event, callback);
  };

  return {
    socket: socketRef.current,
    connected,
    joinRoom,
    leaveRoom,
    emit,
    on,
    off,
  };
};

export default useSocket;