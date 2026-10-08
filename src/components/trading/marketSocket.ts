import { io, type Socket } from "socket.io-client";

export type MarketPriceUpdate = {
  symbol: string;
  price: number;
  bid: number;
  ask: number;
  time: number;
  timestamp: number;
  sequence: number;
  source: string;
  marketType: "OTC" | "REAL";
  serverReceiveTimestamp: number;
  serverBroadcastTimestamp: number;
  serverTime: string;
};

export type MarketCandleUpdate = {
  symbol: string;
  timeframe: string;
  sequence: number;
  serverBroadcastTimestamp: number;
  candle: {
    time: number;
    open: number;
    high: number;
    low: number;
    close: number;
    volume: number;
    closed: boolean;
  };
};

export type MarketResyncResponse = {
  type?: "resync_response";
  symbol: string;
  timeframe: string;
  requestedSince: number;
  lastSequence: number;
  serverTimestamp: number;
  candles: Array<{
    time: number;
    open: number;
    high: number;
    low: number;
    close: number;
    volume: number;
  }>;
};

export type ServerTimeResponse = {
  type?: "server_time";
  clientSentAt: number;
  serverTimestamp: number;
  serverTime: string;
};

export const MARKET_SOCKET_EVENTS = {
  SUBSCRIBE_SYMBOL: "subscribe_symbol",
  UNSUBSCRIBE_SYMBOL: "unsubscribe_symbol",
  PRICE_UPDATE: "price_update",
  CANDLE_UPDATE: "candle_update",
  SERVER_TIME: "server_time",
  RESYNC_REQUEST: "resync_request",
  RESYNC_RESPONSE: "resync_response",
  CLIENT_METRICS: "client_metrics",
} as const;

let socket: Socket | null = null;

export function getMarketSocket(baseUrl: string) {
  if (!socket) {
    socket = io(`${baseUrl}/market`, {
      // Prefer WebSocket, but allow Engine.IO polling when a mobile
      // carrier/proxy cannot establish or sustain the WebSocket transport.
      transports: ["websocket", "polling"],
      tryAllTransports: true,
      upgrade: true,
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 250,
      reconnectionDelayMax: 5000,
      randomizationFactor: 0.5,
      timeout: 5000,
    });
  }

  return socket;
}
