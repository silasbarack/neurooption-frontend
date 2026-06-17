import type { TradingAsset, TradingAssetResponse } from "../types/trading.types";

const API_URL = import.meta.env.VITE_API_URL || "https://neurooption-backend.onrender.com";

async function request<T>(path: string): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }

  return response.json() as Promise<T>;
}

export async function getTradingAssets(): Promise<TradingAsset[]> {
  try {
    const data = await request<TradingAssetResponse | TradingAsset[]>("/market/assets");
    return Array.isArray(data) ? data : data.assets;
  } catch {
    return [];
  }
}

export async function getAssetBySymbol(symbol: string): Promise<TradingAsset | null> {
  const assets = await getTradingAssets();
  return assets.find((asset) => asset.symbol === symbol) ?? null;
}

export const marketApi = {
  getTradingAssets,
  getAssetBySymbol,
};

export default marketApi;