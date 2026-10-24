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
  indecision: number;
  reversalWick: number;
  bodyClean: number;
  trendPersistence: number;
};

const CATEGORY_PROFILES: Record<AssetCategory, MarketProfile> = {
  Currencies: {
    volatility: 0.0017,
    trend: 0.78,
    chop: 0.48,
    wick: 0.72,
    breakoutChance: 0.022,
    indecision: 0.8,
    reversalWick: 0.85,
    bodyClean: 0.35,
    trendPersistence: 0.85,
  },
  Cryptocurrencies: {
    volatility: 0.009,
    trend: 1.18,
    chop: 0.82,
    wick: 0.9,
    breakoutChance: 0.06,
    indecision: 0.3,
    reversalWick: 0.55,
    bodyClean: 0.8,
    trendPersistence: 1.3,
  },
  Stocks: {
    volatility: 0.0042,
    trend: 1.05,
    chop: 0.55,
    wick: 0.8,
    breakoutChance: 0.038,
    indecision: 0.45,
    reversalWick: 0.6,
    bodyClean: 0.6,
    trendPersistence: 1.05,
  },
  Indices: {
    volatility: 0.0032,
    trend: 0.94,
    chop: 0.42,
    wick: 0.66,
    breakoutChance: 0.03,
    indecision: 0.35,
    reversalWick: 0.45,
    bodyClean: 0.7,
    trendPersistence: 1.15,
  },
  Commodities: {
    volatility: 0.0048,
    trend: 0.88,
    chop: 0.68,
    wick: 1.02,
    breakoutChance: 0.045,
    indecision: 0.5,
    reversalWick: 1.0,
    bodyClean: 0.5,
    trendPersistence: 0.95,
  },
};

// Each asset is deterministically assigned one of these archetypes (by symbol
// hash) so that, for example, two currency pairs in the same category can
// still feel distinct: one grinds in a tight range, another trends hard.
const PERSONALITIES = [
  {
    name: "trending",
    volatilityMul: 1.05,
    trendMul: 1.35,
    chopMul: 0.7,
    breakoutMul: 0.85,
    reversalWickMul: 0.85,
    bodyCleanMul: 1.1,
    persistenceMul: 1.4,
  },
  {
    name: "ranging",
    volatilityMul: 0.85,
    trendMul: 0.6,
    chopMul: 1.35,
    breakoutMul: 0.7,
    reversalWickMul: 1.15,
    bodyCleanMul: 0.8,
    persistenceMul: 0.65,
  },
  {
    name: "volatile",
    volatilityMul: 1.3,
    trendMul: 1.0,
    chopMul: 1.1,
    breakoutMul: 1.6,
    reversalWickMul: 1.3,
    bodyCleanMul: 0.85,
    persistenceMul: 0.9,
  },
  {
    name: "steady",
    volatilityMul: 0.75,
    trendMul: 0.9,
    chopMul: 0.6,
    breakoutMul: 0.55,
    reversalWickMul: 0.7,
    bodyCleanMul: 1.25,
    persistenceMul: 1.15,
  },
];

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function probability(value: number) {
  return clamp(value * 0.55, 0.05, 0.85);
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
  const personality =
    PERSONALITIES[
      Math.floor(unitFromHash(`${asset.symbol}:personality`) * PERSONALITIES.length) %
        PERSONALITIES.length
    ];
  const baseVolatilityScale = 0.76 + unitFromHash(`${asset.symbol}:volatility`) * 0.58;

  return {
    volatility: base.volatility,
    trend: base.trend * personality.trendMul,
    chop: base.chop * personality.chopMul,
    wick: base.wick,
    breakoutChance: base.breakoutChance * personality.breakoutMul,
    indecision: base.indecision,
    reversalWick: base.reversalWick * personality.reversalWickMul,
    bodyClean: base.bodyClean * personality.bodyCleanMul,
    trendPersistence: base.trendPersistence * personality.persistenceMul,
    seed,
    phaseA: unitFromHash(`${asset.symbol}:phase-a`) * Math.PI * 2,
    phaseB: unitFromHash(`${asset.symbol}:phase-b`) * Math.PI * 2,
    phaseC: unitFromHash(`${asset.symbol}:phase-c`) * Math.PI * 2,
    volatilityScale: baseVolatilityScale * personality.volatilityMul,
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
  const swingPeriod = Math.round((29 + (profile.seed % 23)) * profile.trendPersistence);
  const regimePeriod = Math.round((94 + (profile.seed % 61)) * profile.trendPersistence);

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

    // Classify this candle against the surrounding price path so the wick
    // shaping reads as a real formation (Doji, Hammer, Shooting Star,
    // Marubozu) rather than uniform random noise.
    const slopeBefore =
      index > 0
        ? rawBoundaryPrices[index] - rawBoundaryPrices[index - 1]
        : rawBoundaryPrices[index + 1] - rawBoundaryPrices[index];
    const slopeAfter =
      index + 2 <= count
        ? rawBoundaryPrices[index + 2] - rawBoundaryPrices[index + 1]
        : rawBoundaryPrices[index + 1] - rawBoundaryPrices[index];
    const isBullishReversal = slopeBefore < 0 && slopeAfter > 0;
    const isBearishReversal = slopeBefore > 0 && slopeAfter < 0;
    const bodyRatio = body / wickFloor;
    const patternRoll = unitFromHash(
      `${asset.symbol}:${timeframe}:${bucket}:pattern`,
    );

    let upperWick: number;
    let lowerWick: number;

    if (bodyRatio < 0.45 && patternRoll < probability(profile.indecision)) {
      // Doji / Spinning Top: tiny body, long wicks on both sides.
      upperWick = wickFloor * (0.55 + upperNoise * 0.55);
      lowerWick = wickFloor * (0.55 + lowerNoise * 0.55);
    } else if (isBullishReversal && patternRoll < probability(profile.reversalWick)) {
      // Hammer: long lower wick rejecting the downside, small upper wick.
      lowerWick = wickFloor * (1.3 + lowerNoise * 0.9) + body * 0.15;
      upperWick = wickFloor * (0.05 + upperNoise * 0.12);
    } else if (isBearishReversal && patternRoll < probability(profile.reversalWick)) {
      // Shooting Star: long upper wick rejecting the upside, small lower wick.
      upperWick = wickFloor * (1.3 + upperNoise * 0.9) + body * 0.15;
      lowerWick = wickFloor * (0.05 + lowerNoise * 0.12);
    } else if (bodyRatio > 1.2 && patternRoll < probability(profile.bodyClean)) {
      // Marubozu: a decisive, near-full-body breakout/trend candle.
      upperWick = wickFloor * (0.04 + upperNoise * 0.1);
      lowerWick = wickFloor * (0.04 + lowerNoise * 0.1);
    } else {
      upperWick =
        wickFloor * (0.28 + upperNoise * profile.wick) +
        body * (0.08 + upperNoise * 0.22);
      lowerWick =
        wickFloor * (0.28 + lowerNoise * profile.wick) +
        body * (0.08 + lowerNoise * 0.22);
    }

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
