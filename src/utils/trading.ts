import type { TradingAsset } from "../types/trading.types";
import { clamp } from "./format";

export const MIN_EXPIRY_SECONDS = 5;
export const MAX_EXPIRY_SECONDS = 5 * 60 * 60;

export function clampExpiry(seconds: number): number {
  return clamp(seconds, MIN_EXPIRY_SECONDS, MAX_EXPIRY_SECONDS);
}

export function changeExpiryUnit(
  currentSeconds: number,
  unit: "hours" | "minutes" | "seconds",
  delta: 1 | -1,
): number {
  const hours = Math.floor(currentSeconds / 3600);
  const minutes = Math.floor((currentSeconds % 3600) / 60);
  const seconds = currentSeconds % 60;

  let nextHours = hours;
  let nextMinutes = minutes;
  let nextSeconds = seconds;

  if (unit === "hours") nextHours += delta;
  if (unit === "minutes") nextMinutes += delta;
  if (unit === "seconds") nextSeconds += delta;

  nextHours = clamp(nextHours, 0, 5);
  nextMinutes = clamp(nextMinutes, 0, 59);
  nextSeconds = clamp(nextSeconds, 0, 59);

  return clampExpiry(nextHours * 3600 + nextMinutes * 60 + nextSeconds);
}

export function calculateExpectedProfit(amount: number, payoutPercent: number): number {
  return amount * (payoutPercent / 100);
}

export function calculateExpectedReturn(amount: number, payoutPercent: number): number {
  return amount + calculateExpectedProfit(amount, payoutPercent);
}

export function getDynamicPayout(asset: TradingAsset, timestamp: number): number {
  const wave = Math.sin(timestamp / 18000) * 6;
  const micro = Math.sin(timestamp / 7000) * 3;
  return Math.round(clamp(asset.payout + wave + micro, 20, 92));
}

export function getTradeWinStatus(
  direction: "BUY" | "SELL",
  entryPrice: number,
  closePrice: number,
): boolean {
  if (direction === "BUY") return closePrice > entryPrice;
  return closePrice < entryPrice;
}