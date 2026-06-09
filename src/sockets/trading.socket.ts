import { io } from 'socket.io-client';

export const tradingSocket = io('http://localhost:3000/trading', {
  autoConnect: false,
});