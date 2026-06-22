import { io, type Socket } from "socket.io-client";

export type MarketPriceUpdate = {
  symbol: string;
  price: number;
  time: number;
  serverTime: string;
};

export type MarketCandleUpdate = {
  symbol: string;
  timeframe: string;
  candle: {
    time: number;
    open: number;
    high: number;
    low: number;
    close: number;
    volume: number;
  };
};

export const MARKET_SOCKET_EVENTS = {
  SUBSCRIBE_SYMBOL: "subscribe_symbol",
  UNSUBSCRIBE_SYMBOL: "unsubscribe_symbol",
  PRICE_UPDATE: "price_update",
  CANDLE_UPDATE: "candle_update",
} as const;

let socket: Socket | null = null;

export function getMarketSocket(baseUrl: string) {
  if (!socket) {
    socket = io(`${baseUrl}/market`, {
      transports: ["websocket"],
    });
  }

  return socket;
}
