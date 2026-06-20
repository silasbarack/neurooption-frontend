import type { Asset, Candle } from "./trading.types";

export const TIMEFRAME_SECONDS: Record<string, number> = {
  S5: 5,
  S10: 10,
  S15: 15,
  S30: 30,
  M1: 60,
  M2: 120,
  M3: 180,
  M5: 300,
  M10: 600,
  M15: 900,
  M30: 1800,
  H1: 3600,
  H4: 14400,
  D1: 86400,
};

function hashString(value: string) {
  let hash = 2166136261;

  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }

  return hash >>> 0;
}

function random(seed: number) {
  let x = seed || 123456789;

  x ^= x << 13;
  x ^= x >>> 17;
  x ^= x << 5;

  return {
    seed: x >>> 0,
    value: ((x >>> 0) % 1_000_000) / 1_000_000,
  };
}

function randomNormal(seed: number) {
  const r1 = random(seed);
  const r2 = random(r1.seed);

  const u1 = Math.max(r1.value, 0.000001);
  const u2 = Math.max(r2.value, 0.000001);

  return {
    seed: r2.seed,
    value: Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2),
  };
}

function getVolatility(asset: Asset, timeframeSeconds: number) {
  const rootTime = Math.sqrt(Math.max(timeframeSeconds, 5) / 60);

  if (asset.basePrice < 3) return asset.basePrice * 0.00075 * rootTime;
  if (asset.basePrice < 200) return asset.basePrice * 0.0011 * rootTime;
  if (asset.basePrice < 5000) return asset.basePrice * 0.00085 * rootTime;

  return asset.basePrice * 0.0006 * rootTime;
}

function roundPrice(value: number, precision: number) {
  const decimals = Math.min(Math.max(precision + 2, 2), 10);
  return Number(value.toFixed(decimals));
}

function aggregateCandles(candles: Candle[], timeframeSeconds: number) {
  const timeframeMs = timeframeSeconds * 1000;
  const buckets = new Map<number, Candle[]>();

  candles.forEach((candle) => {
    const bucketTime = Math.floor(candle.time / timeframeMs) * timeframeMs;
    const bucket = buckets.get(bucketTime) ?? [];

    bucket.push(candle);
    buckets.set(bucketTime, bucket);
  });

  return Array.from(buckets.entries())
    .sort(([a], [b]) => a - b)
    .map(([time, bucket]) => ({
      time,
      open: bucket[0].open,
      high: Math.max(...bucket.map((candle) => candle.high)),
      low: Math.min(...bucket.map((candle) => candle.low)),
      close: bucket[bucket.length - 1].close,
    }));
}

function generateSyntheticTimeframeCandles(
  asset: Asset,
  timeframe: string,
  nowMs: number,
  anchorPrice: number,
  count = 120
) {
  const timeframeSeconds = TIMEFRAME_SECONDS[timeframe] ?? 60;
  const timeframeMs = timeframeSeconds * 1000;
  const alignedNow = Math.floor(nowMs / timeframeMs) * timeframeMs;
  const startTime = alignedNow - (count - 1) * timeframeMs;

  const baseSeed = hashString(`${asset.symbol}-${timeframe}-${Math.floor(alignedNow / timeframeMs)}`);
  const volatility = getVolatility(asset, timeframeSeconds);

  let seed = baseSeed;
  let price =
    anchorPrice *
    (1 +
      Math.sin(startTime / (timeframeMs * 31)) * 0.0015 +
      Math.cos(startTime / (timeframeMs * 53)) * 0.0008);

  const candles: Candle[] = [];

  for (let index = 0; index < count; index += 1) {
    const time = startTime + index * timeframeMs;
    const regime = Math.floor((time / (timeframeMs * 18) + baseSeed) % 8);

    const waveA = Math.sin(index / 7 + baseSeed * 0.00001);
    const waveB = Math.cos(index / 13 + baseSeed * 0.00002);

    let drift = 0;

    if (regime === 0) drift = volatility * 0.25;
    else if (regime === 1) drift = -volatility * 0.25;
    else if (regime === 2) drift = volatility * 0.08 * waveA;
    else if (regime === 3) drift = -volatility * 0.08 * waveB;
    else if (regime === 4) drift = volatility * 0.42;
    else if (regime === 5) drift = -volatility * 0.42;
    else drift = volatility * 0.02 * (waveA - waveB);

    const n1 = randomNormal(seed);
    seed = n1.seed;

    const open = price;
    const close = Math.max(0.000001, open + drift + n1.value * volatility * 0.85);

    const body = Math.abs(close - open);
    const n2 = randomNormal(seed);
    seed = n2.seed;

    const wick = Math.abs(n2.value) * volatility * 0.75 + body * 0.45;

    const high = Math.max(open, close) + wick;
    const low = Math.max(0.000001, Math.min(open, close) - wick);

    candles.push({
      time,
      open: roundPrice(open, asset.precision),
      high: roundPrice(high, asset.precision),
      low: roundPrice(low, asset.precision),
      close: roundPrice(close, asset.precision),
    });

    price = close;
  }

  return candles;
}

export function buildTimeframeCandles(
  asset: Asset,
  timeframe: string,
  backendM1Candles: Candle[],
  nowMs: number
) {
  const timeframeSeconds = TIMEFRAME_SECONDS[timeframe] ?? 60;

  if (timeframe === "M1" && backendM1Candles.length >= 5) {
    return backendM1Candles.slice(-120);
  }

  if (
    timeframeSeconds > 60 &&
    timeframeSeconds <= 180 &&
    backendM1Candles.length >= 90
  ) {
    const aggregated = aggregateCandles(backendM1Candles, timeframeSeconds);

    if (aggregated.length >= 35) {
      return aggregated.slice(-120);
    }
  }

  const anchorPrice =
    backendM1Candles[backendM1Candles.length - 1]?.close ?? asset.basePrice;

  return generateSyntheticTimeframeCandles(asset, timeframe, nowMs, anchorPrice, 120);
}