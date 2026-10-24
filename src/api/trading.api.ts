import { api } from "./api";

export type PlaceTradePayload = {
  asset: string;
  direction: "BUY" | "SELL";
  amount: number;
  currency: string;
  expirySeconds: number;
  entryPrice: number;
  payoutPercent: number;
};

export type PlaceTradeResponse = {
  success: boolean;
  message: string;
  tradeId?: string;
};

export const tradingApi = {
  placeTrade(payload: PlaceTradePayload): Promise<PlaceTradeResponse> {
    return api.post<PlaceTradeResponse>("/trading/place", payload);
  },
};