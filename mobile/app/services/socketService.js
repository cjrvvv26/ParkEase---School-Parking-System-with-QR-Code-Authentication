import { io } from 'socket.io-client/build/cjs/index.js';
import { BASE_URL } from './api';

let socket = null;

export const getSocket = () => {
  if (!socket) {
    socket = io(BASE_URL, { transports: ['websocket'], autoConnect: false });
  }
  return socket;
};

export const connectSocket = () => getSocket().connect();
export const disconnectSocket = () => socket?.disconnect();
