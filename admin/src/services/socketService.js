import { io } from 'socket.io-client';

const BASE_URL = import.meta.env.VITE_BASE_URL || 'http://localhost:5000';

let socket = null;

export const getSocket = () => {
  if (!socket) {
    socket = io(BASE_URL, { transports: ['websocket'], autoConnect: false });
  }
  return socket;
};

export const connectSocket = () =>
  new Promise((resolve) => {
    const s = getSocket();
    if (s.connected) return resolve(s);
    s.once('connect', () => resolve(s));
    s.connect();
  });

export const disconnectSocket = () => socket?.disconnect();
