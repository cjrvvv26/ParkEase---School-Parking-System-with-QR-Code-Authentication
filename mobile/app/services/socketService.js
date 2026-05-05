import { io } from 'socket.io-client';
import { BASE_URL } from './api';

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
    if (s.connected) return resolve(s);  // already connected — resolve immediately
    if (s.connecting) {
      s.once('connect', () => resolve(s));
      return;
    }
    s.once('connect', () => resolve(s));
    s.connect();
  });

export const disconnectSocket = () => socket?.disconnect();
