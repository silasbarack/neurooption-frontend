import { api } from "./api";

export type OtcTimeframe = "M1" | "M2" | "M3" | "M5" | "M15" | "M30" | "H1" | "H4";

export type MarketCategory =
  | "Currencies"
  | "Cryptocurrencies"
  | "Indices"
  | "Stocks"
  | "Commodities";

export type OtcAsset = {
  symbol: string;
  displayName: string;
  category: MarketCategory;
  market: "OTC";
  basePrice: number;
  precision: number;
  volatility: number;
  payout: number;
};

export type OtcCandle = {
  symbol: string;
  timeframe: OtcTimeframe;
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
  closed: boolean;
};

export type OtcStreamPayload = {
  type: "snapshot" | "tick";
  asset: OtcAsset;
  timeframe: OtcTimeframe;
  price: number;
  serverTime: number;
  candles: OtcCandle[];
};

export function createOtcMarketStream(options: {
  symbol: string;
  timeframe: OtcTimeframe;
  onTick: (payload: OtcStreamPayload) => void;
  onError?: () => void;
}): () => void {
  const url = new URL(`${api.baseUrl}/market-data/stream`);
  url.searchParams.set("symbol", options.symbol);
  url.searchParams.set("timeframe", options.timeframe);

  const source = new EventSource(url.toString());

  source.onmessage = (event) => {
    try {
      const payload = JSON.parse(event.data) as OtcStreamPayload;
      options.onTick(payload);
    } catch {
      options.onError?.();
    }
  };

  source.onerror = () => {
    options.onError?.();
  };

  return () => {
    source.close();
  };
}