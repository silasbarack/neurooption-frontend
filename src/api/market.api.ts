import { api } from "./api";
import type { TradingAsset } from "../types/trading.types";

export const marketApi = {
  getAssets(): Promise<TradingAsset[]> {
    return api.get<TradingAsset[]>("/market/assets", false);
  },
};