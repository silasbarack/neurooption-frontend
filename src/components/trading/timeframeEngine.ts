import type { Asset, AssetCategory, Candle } from "./trading.types";

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

type MarketProfile = {
  volatility: number;
  trend: number;
  chop: number;
  wick: number;
  breakoutChance: number;
};

const CATEGORY_PROFILES: Record<AssetCategory, MarketProfile> = {
  Currencies: {
    volatility: 0.0017,
    trend: 0.78,
    chop: 0.48,
    wick: 0.72,
    breakoutChance: 0.022,
  },
  Cryptocurrencies: {
    volatility: 0.009,
    trend: 1.18,
    chop: 0.82,
    wick: 0.9,
    breakoutChance: 0.06,
  },
  Stocks: {
    volatility: 0.0042,
    trend: 1.05,
    chop: 0.55,
    wick: 0.8,
    breakoutChance: 0.038,
  },
  Indices: {
    volatility: 0.0032,
    trend: 0.94,
    chop: 0.42,
    wick: 0.66,
    breakoutChance: 0.03,
  },
  Commodities: {
    volatility: 0.0048,
    trend: 0.88,
    chop: 0.68,
    wick: 1.02,
    breakoutChance: 0.045,
  },
};

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function hashString(value: string) {
  let hash = 2166136261;

  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }

  return hash >>> 0;
}

function unitFromHash(value: string) {
  return hashString(value) / 0xffffffff;
}

function signedFromHash(value: string) {
  return unitFromHash(value) * 2 - 1;
}

function roundPrice(value: number, precision: number) {
  const decimals = clamp(precision, 0, 8);
  return Number(Math.max(value, 0.00000001).toFixed(decimals));
}

function createAssetProfile(asset: Asset): MarketProfile & {
  seed: number;
  phaseA: number;
  phaseB: number;
  phaseC: number;
  volatilityScale: number;
  directionalBias: number;
} {
  const seed = hashString(asset.symbol);
  const base = CATEGORY_PROFILES[asset.category];

  return {
    ...base,
    seed,
    phaseA: unitFromHash(`${asset.symbol}:phase-a`) * Math.PI * 2,
    phaseB: unitFromHash(`${asset.symbol}:phase-b`) * Math.PI * 2,
    phaseC: unitFromHash(`${asset.symbol}:phase-c`) * Math.PI * 2,
    volatilityScale: 0.76 + unitFromHash(`${asset.symbol}:volatility`) * 0.58,
    directionalBias: signedFromHash(`${asset.symbol}:bias`) * 0.16,
  };
}

function marketStructureValue(
  asset: Asset,
  timeframe: string,
  bucket: number,
  timeframeSeconds: number,
) {
  const profile = createAssetProfile(asset);
  const timeframeScale = clamp(Math.sqrt(timeframeSeconds / 60), 0.34, 8.5);
  const amplitude = profile.volatility * profile.volatilityScale * timeframeScale;

  const fastPeriod = 7 + (profile.seed % 9);
  const swingPeriod = 29 + (profile.seed % 23);
  const regimePeriod = 94 + (profile.seed % 61);

  const fast = Math.sin(bucket / fastPeriod + profile.phaseA) * profile.chop;
  const swing = Math.sin(bucket / swingPeriod + profile.phaseB) * 0.92;
  const regime = Math.tanh(
    Math.sin(bucket / regimePeriod + profile.phaseC) * 2.4,
  );
  const trendWave =
    Math.sin(bucket / (regimePeriod * 2.2) + profile.phaseA * 0.6) *
    profile.trend;
  const microNoise =
    signedFromHash(`${asset.symbol}:${timeframe}:${bucket}:micro`) *
    profile.chop *
    0.24;

  let breakout = 0;

  for (let age = 0; age <= 10; age += 1) {
    const eventBucket = bucket - age;
    const eventRoll = unitFromHash(
      `${asset.symbol}:${timeframe}:${eventBucket}:event`,
    );

    if (eventRoll < profile.breakoutChance) {
      const direction =
        signedFromHash(`${asset.symbol}:${timeframe}:${eventBucket}:direction`) >= 0
          ? 1
          : -1;
      const strength =
        0.65 +
        unitFromHash(`${asset.symbol}:${timeframe}:${eventBucket}:strength`) *
          1.35;

      breakout += direction * strength * Math.exp(-age / 3.2);
    }
  }

  return (
    amplitude *
    (fast * 0.24 +
      swing * 0.52 +
      regime * 0.56 +
      trendWave * 0.72 +
      profile.directionalBias +
      microNoise +
      breakout * 0.48)
  );
}

function generateSyntheticCandles(
  asset: Asset,
  timeframe: string,
  nowMs: number,
  anchorPrice: number,
  count: number,
) {
  const timeframeSeconds = TIMEFRAME_SECONDS[timeframe] ?? 60;
  const timeframeMs = timeframeSeconds * 1000;
  const latestBucket = Math.floor(nowMs / timeframeMs);
  const startBucket = latestBucket - count;
  const rawBoundaryPrices: number[] = [];

  for (let offset = 0; offset <= count; offset += 1) {
    const bucket = startBucket + offset;
    const structure = marketStructureValue(
      asset,
      timeframe,
      bucket,
      timeframeSeconds,
    );

    rawBoundaryPrices.push(asset.basePrice * Math.exp(structure));
  }

  const rawLast = rawBoundaryPrices[rawBoundaryPrices.length - 1];
  const safeAnchor =
    Number.isFinite(anchorPrice) && anchorPrice > 0 ? anchorPrice : asset.basePrice;
  const anchorScale = safeAnchor / rawLast;
  const profile = createAssetProfile(asset);
  const timeframeScale = clamp(Math.sqrt(timeframeSeconds / 60), 0.34, 8.5);
  const baseWick =
    safeAnchor *
    profile.volatility *
    profile.volatilityScale *
    timeframeScale *
    0.11;

  const candles: Candle[] = [];

  for (let index = 0; index < count; index += 1) {
    const bucket = startBucket + index + 1;
    const open = rawBoundaryPrices[index] * anchorScale;
    const close = rawBoundaryPrices[index + 1] * anchorScale;
    const body = Math.abs(close - open);
    const upperNoise = unitFromHash(
      `${asset.symbol}:${timeframe}:${bucket}:upper-wick`,
    );
    const lowerNoise = unitFromHash(
      `${asset.symbol}:${timeframe}:${bucket}:lower-wick`,
    );
    const wickFloor = Math.max(baseWick, safeAnchor * 10 ** -asset.precision);
    const upperWick =
      wickFloor * (0.28 + upperNoise * profile.wick) +
      body * (0.08 + upperNoise * 0.22);
    const lowerWick =
      wickFloor * (0.28 + lowerNoise * profile.wick) +
      body * (0.08 + lowerNoise * 0.22);

    candles.push({
      time: bucket * timeframeMs,
      open: roundPrice(open, asset.precision),
      high: roundPrice(Math.max(open, close) + upperWick, asset.precision),
      low: roundPrice(Math.min(open, close) - lowerWick, asset.precision),
      close: roundPrice(close, asset.precision),
    });
  }

  return candles;
}

export function buildTimeframeCandles(
  asset: Asset,
  timeframe: string,
  backendCandles: Candle[],
  nowMs: number,
) {
  const latestBackendPrice = backendCandles[backendCandles.length - 1]?.close;
  const count = clamp(backendCandles.length || 240, 180, 420);

  return generateSyntheticCandles(
    asset,
    timeframe,
    nowMs,
    latestBackendPrice ?? asset.basePrice,
    count,
  );
}
