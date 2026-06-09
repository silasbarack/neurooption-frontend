import { io } from 'socket.io-client';

export const marketSocket = io('http://localhost:3000/market', {
  autoConnect: false,
});