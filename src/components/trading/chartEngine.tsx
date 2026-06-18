import type { Asset, Candle } from "./trading.types";

export const MIN_EXPIRY_SECONDS = 5;
export const MAX_EXPIRY_SECONDS = 5 * 60 * 60;

export const LIVE_TICK_MS = 950;
export const M1_CANDLE_MS = 60_000;
export const MAX_CANDLES = 110;

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

export function getFxOtcVolatility(asset: Asset) {
  if (asset.basePrice < 3) return asset.basePrice * 0.00022;
  if (asset.basePrice < 200) return asset.basePrice * 0.0003;
  if (asset.basePrice < 5000) return asset.basePrice * 0.00018;
  return asset.basePrice * 0.00012;
}

function getDirectionalBias(asset: Asset, time: number) {
  const base = asset.basePrice;
  const slowWave = Math.sin(time / 26_000) * base * 0.000035;
  const mediumWave = Math.sin(time / 11_500) * base * 0.00002;
  return slowWave + mediumWave;
}

export function createInitialCandles(asset: Asset) {
  const candles: Candle[] = [];
  let price = asset.basePrice;
  const volatility = getFxOtcVolatility(asset);
  const now = Date.now();

  for (let index = 0; index < MAX_CANDLES; index += 1) {
    const wave = Math.sin(index / 8) * volatility * 7;
    const correction = Math.sin(index / 17) * volatility * 4;
    const noise = (Math.random() - 0.5) * volatility * 6;

    const open = price;
    const close = Math.max(0.00001, open + wave + correction + noise);

    const wick = volatility * (4 + Math.random() * 5);
    const high = Math.max(open, close) + wick;
    const low = Math.max(0.00001, Math.min(open, close) - wick);

    candles.push({
      open,
      high,
      low,
      close,
      time: now - (MAX_CANDLES - index) * M1_CANDLE_MS,
    });

    price = close;
  }

  return candles;
}

export function updateLiveM1Candle(currentCandles: Candle[], asset: Asset) {
  const candles =
    currentCandles.length > 0 ? currentCandles.slice() : createInitialCandles(asset);

  const latest = candles[candles.length - 1];
  const now = Date.now();
  const volatility = getFxOtcVolatility(asset);

  if (now - latest.time >= M1_CANDLE_MS) {
    const open = latest.close;
    const microGap = (Math.random() - 0.5) * volatility * 0.5;
    const nextOpen = Math.max(0.00001, open + microGap);

    candles.push({
      open: nextOpen,
      high: nextOpen,
      low: nextOpen,
      close: nextOpen,
      time: now,
    });

    return candles.slice(-MAX_CANDLES);
  }

  const candleAge = clamp((now - latest.time) / M1_CANDLE_MS, 0, 1);
  const bias = getDirectionalBias(asset, now);
  const microTick = (Math.random() - 0.5) * volatility * 1.15;
  const bodyControl = (latest.open - latest.close) * 0.018 * candleAge;

  const nextClose = Math.max(
    0.00001,
    latest.close + bias + microTick + bodyControl
  );

  const wickPulse = Math.abs(microTick) * 0.8 + volatility * 0.25;

  candles[candles.length - 1] = {
    ...latest,
    close: nextClose,
    high: Math.max(latest.high, nextClose + wickPulse),
    low: Math.max(0.00001, Math.min(latest.low, nextClose - wickPulse)),
  };

  return candles.slice(-MAX_CANDLES);
}