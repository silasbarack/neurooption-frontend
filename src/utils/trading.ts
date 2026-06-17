import type { TradeSide, TradingAsset } from "../types/trading.types";

export function calculateExpectedProfit(amount: number, payoutPercent: number) {
  return amount * (payoutPercent / 100);
}

export function calculateExpectedReturn(amount: number, payoutPercent: number) {
  return amount + calculateExpectedProfit(amount, payoutPercent);
}

export function clampPayout(value: number) {
  return Math.min(Math.max(value, 20), 92);
}

export function getAssetPrecision(asset: TradingAsset) {
  return asset.precision ?? 2;
}

export function formatAssetPrice(asset: TradingAsset, price: number) {
  return price.toFixed(getAssetPrecision(asset));
}

export function determineTradeResult(side: TradeSide, entryPrice: number, closePrice: number) {
  if (side === "BUY") {
    return closePrice > entryPrice;
  }

  return closePrice < entryPrice;
}

export function generateDynamicPayout(asset: TradingAsset) {
  const boost = asset.payoutBoost ?? 0;
  const randomPulse = Math.floor(Math.random() * 18);
  return clampPayout(72 + boost + randomPulse);
}