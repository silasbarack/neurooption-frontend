import { useEffect, useRef, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import { useTradeStore } from '../store/tradeStore';

const WS_URL = import.meta.env.VITE_WS_URL || 'http://localhost:3000';

let globalSocket: Socket | null = null;

export function useWebSocket() {
  const socketRef = useRef<Socket | null>(null);
  const { auth, updateTickData, addSignal } = useTradeStore();

  const connect = useCallback(() => {
    const token = localStorage.getItem('neurooption_token') || auth?.token;
    if (!token) return;
    if (globalSocket?.connected) {
      socketRef.current = globalSocket;
      return;
    }

    const socket = io(WS_URL, {
      auth: { token },
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionDelay: 1000,
    });

    socket.on('connect', () => {
      console.log('WS Connected:', socket.id);
      socket.emit('market:subscribe:all');
    });

    socket.on('market:snapshot', (ticks: any[]) => {
      ticks.forEach(tick => updateTickData(tick.marketId, tick));
    });

    socket.on('market:ticks', (ticks: any[]) => {
      ticks.forEach(tick => updateTickData(tick.marketId, tick));
    });

    socket.on('market:tick', (tick: any) => {
      updateTickData(tick.marketId, tick);
    });

    socket.on('signals:update', (signals: any[]) => {
      signals.forEach(signal => addSignal(signal));
    });

    socket.on('trade:opened', (trade: any) => {
      console.log('Trade opened via WS:', trade);
    });

    socket.on('trade:closed', (trade: any) => {
      console.log('Trade closed via WS:', trade);
    });

    socket.on('announcement', (data: any) => {
      console.log('Announcement:', data);
    });

    socket.on('disconnect', () => {
      console.log('WS Disconnected');
    });

    socket.on('connect_error', (err) => {
      console.warn('WS connect error:', err.message);
    });

    globalSocket = socket;
    socketRef.current = socket;
  }, [auth?.token]);

  const disconnect = useCallback(() => {
    globalSocket?.disconnect();
    globalSocket = null;
    socketRef.current = null;
  }, []);

  const subscribeMarket = useCallback((marketId: string) => {
    socketRef.current?.emit('market:subscribe', { marketId });
  }, []);

  useEffect(() => {
    connect();
    return () => { /* keep socket alive across page changes */ };
  }, [connect]);

  return { socket: socketRef.current, connect, disconnect, subscribeMarket };
}
