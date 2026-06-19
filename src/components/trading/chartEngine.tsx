import type { Asset, Candle } from "./trading.types";

export const MIN_EXPIRY_SECONDS = 5;
export const MAX_EXPIRY_SECONDS = 5 * 60 * 60;

export const LIVE_TICK_MS = 245;
export const M1_CANDLE_MS = 60_000;
export const MAX_CANDLES = 110;

type MarketStructure =
  | "TREND_UP"
  | "TREND_DOWN"
  | "RANGE"
  | "PULLBACK_UP"
  | "PULLBACK_DOWN"
  | "BREAKOUT_UP"
  | "BREAKOUT_DOWN"
  | "SQUEEZE";

type EngineState = {
  seed: number;
  regime: MarketStructure;
  regimeTicksLeft: number;
  volatility: number;
  momentum: number;
  fairValue: number;
  rangeTop: number;
  rangeBottom: number;
};

const states = new Map<string, EngineState>();

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function hashString(value: string) {
  let hash = 2166136261;

  for (let i = 0; i < value.length; i += 1) {
    hash ^= value.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }

  return hash >>> 0;
}

function nextRandom(state: EngineState) {
  let x = state.seed || 123456789;

  x ^= x << 13;
  x ^= x >>> 17;
  x ^= x << 5;

  state.seed = x >>> 0;

  return (state.seed % 1_000_000) / 1_000_000;
}

function randomBetween(state: EngineState, min: number, max: number) {
  return min + (max - min) * nextRandom(state);
}

function randomNormal(state: EngineState) {
  const u1 = Math.max(nextRandom(state), 0.000001);
  const u2 = Math.max(nextRandom(state), 0.000001);

  return Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
}

function getBaseVolatility(asset: Asset) {
  if (asset.basePrice < 3) return asset.basePrice * 0.000065;
  if (asset.basePrice < 200) return asset.basePrice * 0.000105;
  if (asset.basePrice < 5000) return asset.basePrice * 0.00007;
  return asset.basePrice * 0.000045;
}

function getState(asset: Asset) {
  const key = asset.symbol;
  const existing = states.get(key);

  if (existing) return existing;

  const baseVolatility = getBaseVolatility(asset);

  const state: EngineState = {
    seed: hashString(`${asset.symbol}-${asset.basePrice}`),
    regime: "RANGE",
    regimeTicksLeft: 120,
    volatility: baseVolatility,
    momentum: 0,
    fairValue: asset.basePrice,
    rangeTop: asset.basePrice + baseVolatility * 60,
    rangeBottom: asset.basePrice - baseVolatility * 60,
  };

  states.set(key, state);
  return state;
}

function chooseRegime(state: EngineState, lastPrice: number) {
  const roll = nextRandom(state);

  if (roll < 0.18) state.regime = "TREND_UP";
  else if (roll < 0.36) state.regime = "TREND_DOWN";
  else if (roll < 0.52) state.regime = "RANGE";
  else if (roll < 0.64) state.regime = "PULLBACK_UP";
  else if (roll < 0.76) state.regime = "PULLBACK_DOWN";
  else if (roll < 0.86) state.regime = "BREAKOUT_UP";
  else if (roll < 0.96) state.regime = "BREAKOUT_DOWN";
  else state.regime = "SQUEEZE";

  state.regimeTicksLeft = Math.floor(randomBetween(state, 45, 190));

  const rangeSize = state.volatility * randomBetween(state, 55, 120);
  state.rangeTop = lastPrice + rangeSize;
  state.rangeBottom = lastPrice - rangeSize;
}

function updateRegime(state: EngineState, lastPrice: number) {
  state.regimeTicksLeft -= 1;

  if (state.regimeTicksLeft <= 0) {
    chooseRegime(state, lastPrice);
  }
}

function updateVolatility(asset: Asset, state: EngineState) {
  const base = getBaseVolatility(asset);
  const shock = Math.abs(randomNormal(state));
  const target = base * (0.55 + shock * 0.4);

  state.volatility = state.volatility * 0.96 + target * 0.04;
  state.volatility = clamp(state.volatility, base * 0.4, base * 2.4);
}

function getStructureDrift(asset: Asset, state: EngineState, lastPrice: number) {
  const base = getBaseVolatility(asset);

  if (state.regime === "TREND_UP") return base * 0.13;
  if (state.regime === "TREND_DOWN") return -base * 0.13;

  if (state.regime === "BREAKOUT_UP") return base * 0.22;
  if (state.regime === "BREAKOUT_DOWN") return -base * 0.22;

  if (state.regime === "PULLBACK_UP") return lastPrice < state.fairValue ? base * 0.16 : -base * 0.06;
  if (state.regime === "PULLBACK_DOWN") return lastPrice > state.fairValue ? -base * 0.16 : base * 0.06;

  if (state.regime === "RANGE") {
    const middle = (state.rangeTop + state.rangeBottom) / 2;
    return (middle - lastPrice) * 0.0022;
  }

  if (state.regime === "SQUEEZE") {
    return (state.fairValue - lastPrice) * 0.001;
  }

  return 0;
}

function createNewCandle(previousClose: number, time: number): Candle {
  return {
    open: previousClose,
    high: previousClose,
    low: previousClose,
    close: previousClose,
    time,
  };
}

export function createInitialCandles(asset: Asset) {
  const state = getState(asset);

  state.seed = hashString(`${asset.symbol}-${Date.now()}`);
  state.volatility = getBaseVolatility(asset);
  state.momentum = 0;
  state.fairValue = asset.basePrice;
  state.regime = "RANGE";
  state.regimeTicksLeft = 100;

  const candles: Candle[] = [];
  let previousClose = asset.basePrice;
  const now = Date.now();

  for (let i = 0; i < MAX_CANDLES; i += 1) {
    updateRegime(state, previousClose);
    updateVolatility(asset, state);

    const open = previousClose;
    const drift = getStructureDrift(asset, state, previousClose);
    const noise = randomNormal(state) * state.volatility * 4.1;
    const meanReversion = (state.fairValue - previousClose) * 0.0013;

    state.momentum = state.momentum * 0.84 + (drift + noise) * 0.16;

    const close = Math.max(0.00001, open + drift + noise + meanReversion + state.momentum);

    const body = Math.abs(close - open);
    const wickBase = state.volatility * randomBetween(state, 2.8, 7.2);
    const high = Math.max(open, close) + wickBase + body * randomBetween(state, 0.15, 0.72);
    const low = Math.max(0.00001, Math.min(open, close) - wickBase - body * randomBetween(state, 0.15, 0.72));

    candles.push({
      open,
      high,
      low,
      close,
      time: now - (MAX_CANDLES - i) * M1_CANDLE_MS,
    });

    previousClose = close;
    state.fairValue = state.fairValue * 0.9993 + close * 0.0007;
  }

  return candles;
}

export function updateLiveM1Candle(currentCandles: Candle[], asset: Asset) {
  const state = getState(asset);
  const candles = currentCandles.length > 0 ? currentCandles.slice() : createInitialCandles(asset);
  const latest = candles[candles.length - 1];
  const now = Date.now();

  if (!latest) return createInitialCandles(asset);

  updateRegime(state, latest.close);
  updateVolatility(asset, state);

  if (now - latest.time >= M1_CANDLE_MS) {
    const gap = randomNormal(state) * state.volatility * 0.12;
    const nextOpen = Math.max(0.00001, latest.close + gap);

    candles.push(createNewCandle(nextOpen, now));
    return candles.slice(-MAX_CANDLES);
  }

  const candleAge = clamp((now - latest.time) / M1_CANDLE_MS, 0, 1);
  const drift = getStructureDrift(asset, state, latest.close);
  const meanReversion = (state.fairValue - latest.close) * 0.0015;
  const noiseMultiplier = state.regime === "SQUEEZE" ? 0.18 : 0.38;
  const tickNoise = randomNormal(state) * state.volatility * noiseMultiplier;

  state.momentum = state.momentum * 0.91 + (drift + tickNoise) * 0.09;

  const nextClose = Math.max(
    0.00001,
    latest.close + drift * (0.75 + candleAge * 0.45) + tickNoise + state.momentum + meanReversion
  );

  const body = Math.abs(nextClose - latest.open);
  const wickPulse = Math.abs(tickNoise) * 0.7 + state.volatility * (0.14 + candleAge * 0.28);

  const nextHigh = Math.max(
    latest.high,
    nextClose + wickPulse * randomBetween(state, 0.2, 1.1),
    latest.open + body * randomBetween(state, 0.04, 0.24)
  );

  const nextLow = Math.max(
    0.00001,
    Math.min(
      latest.low,
      nextClose - wickPulse * randomBetween(state, 0.2, 1.1),
      latest.open - body * randomBetween(state, 0.04, 0.24)
    )
  );

  candles[candles.length - 1] = {
    ...latest,
    close: nextClose,
    high: nextHigh,
    low: nextLow,
  };

  state.fairValue = state.fairValue * 0.9995 + nextClose * 0.0005;

  return candles.slice(-MAX_CANDLES);
}