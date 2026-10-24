import type { Asset, Candle } from "./trading.types";

export const MIN_EXPIRY_SECONDS = 5;
export const MAX_EXPIRY_SECONDS = 5 * 60 * 60;

export const LIVE_TICK_MS = 245;
export const M1_CANDLE_MS = 60_000;
export const MAX_CANDLES = 110;

type MarketRegime =
  | "TREND_UP"
  | "TREND_DOWN"
  | "RANGE"
  | "PULLBACK_UP"
  | "PULLBACK_DOWN"
  | "BREAKOUT_UP"
  | "BREAKOUT_DOWN"
  | "CONSOLIDATION";

type EngineState = {
  seed: number;
  regime: MarketRegime;
  regimeTicksLeft: number;
  volatility: number;
  momentum: number;
  fairValue: number;
  lastShock: number;
};

const states = new Map<string, EngineState>();

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
  if (asset.basePrice < 3) return asset.basePrice * 0.000075;
  if (asset.basePrice < 200) return asset.basePrice * 0.00011;
  if (asset.basePrice < 5000) return asset.basePrice * 0.00007;
  return asset.basePrice * 0.00005;
}

function getState(asset: Asset) {
  const existing = states.get(asset.symbol);

  if (existing) return existing;

  const state: EngineState = {
    seed: hashString(`${asset.symbol}-${asset.basePrice}-${Date.now()}`),
    regime: "RANGE",
    regimeTicksLeft: 90,
    volatility: getBaseVolatility(asset),
    momentum: 0,
    fairValue: asset.basePrice,
    lastShock: 0,
  };

  states.set(asset.symbol, state);

  return state;
}

function chooseRegime(state: EngineState) {
  const roll = nextRandom(state);

  if (roll < 0.18) state.regime = "TREND_UP";
  else if (roll < 0.36) state.regime = "TREND_DOWN";
  else if (roll < 0.52) state.regime = "RANGE";
  else if (roll < 0.65) state.regime = "PULLBACK_UP";
  else if (roll < 0.78) state.regime = "PULLBACK_DOWN";
  else if (roll < 0.86) state.regime = "BREAKOUT_UP";
  else if (roll < 0.94) state.regime = "BREAKOUT_DOWN";
  else state.regime = "CONSOLIDATION";

  state.regimeTicksLeft = Math.floor(randomBetween(state, 45, 190));
}

function updateRegime(state: EngineState) {
  state.regimeTicksLeft -= 1;

  if (state.regimeTicksLeft <= 0) {
    chooseRegime(state);
  }
}

function updateVolatility(asset: Asset, state: EngineState) {
  const base = getBaseVolatility(asset);
  const shock = Math.abs(randomNormal(state));

  const target =
    state.regime === "CONSOLIDATION"
      ? base * randomBetween(state, 0.45, 0.75)
      : state.regime.startsWith("BREAKOUT")
        ? base * randomBetween(state, 1.55, 2.35)
        : base * randomBetween(state, 0.75, 1.45) + shock * base * 0.25;

  state.volatility = state.volatility * 0.93 + target * 0.07;
  state.volatility = clamp(state.volatility, base * 0.35, base * 2.6);
}

function regimeDrift(asset: Asset, state: EngineState) {
  const base = getBaseVolatility(asset);

  switch (state.regime) {
    case "TREND_UP":
      return base * 0.12;
    case "TREND_DOWN":
      return -base * 0.12;
    case "PULLBACK_UP":
      return base * 0.05;
    case "PULLBACK_DOWN":
      return -base * 0.05;
    case "BREAKOUT_UP":
      return base * 0.22;
    case "BREAKOUT_DOWN":
      return -base * 0.22;
    case "CONSOLIDATION":
      return 0;
    default:
      return 0;
  }
}

function makeNewCandle(open: number, time: number): Candle {
  return {
    open,
    high: open,
    low: open,
    close: open,
    time,
  };
}

export function createInitialCandles(asset: Asset) {
  const state = getState(asset);

  state.seed = hashString(`${asset.symbol}-${asset.basePrice}-${Date.now()}`);
  state.regime = "RANGE";
  state.regimeTicksLeft = 90;
  state.volatility = getBaseVolatility(asset);
  state.momentum = 0;
  state.fairValue = asset.basePrice;
  state.lastShock = 0;

  const candles: Candle[] = [];
  let close = asset.basePrice;
  const now = Date.now();

  for (let index = 0; index < MAX_CANDLES; index += 1) {
    updateRegime(state);
    updateVolatility(asset, state);

    const open = close;
    const drift = regimeDrift(asset, state);
    const noise = randomNormal(state) * state.volatility * 4.2;
    const reversion = (state.fairValue - close) * 0.0012;

    state.momentum = state.momentum * 0.84 + (drift + noise) * 0.16;

    close = Math.max(0.00001, open + drift + noise + reversion + state.momentum);

    const body = Math.abs(close - open);
    const wickBase = state.volatility * randomBetween(state, 2.4, 6.4);
    const high = Math.max(open, close) + wickBase + body * randomBetween(state, 0.1, 0.7);
    const low = Math.max(
      0.00001,
      Math.min(open, close) - wickBase - body * randomBetween(state, 0.1, 0.7)
    );

    candles.push({
      open,
      high,
      low,
      close,
      time: now - (MAX_CANDLES - index) * M1_CANDLE_MS,
    });

    state.fairValue = state.fairValue * 0.9992 + close * 0.0008;
  }

  return candles;
}

export function updateLiveM1Candle(currentCandles: Candle[], asset: Asset) {
  const state = getState(asset);
  const candles = currentCandles.length > 0 ? currentCandles.slice() : createInitialCandles(asset);
  const latest = candles[candles.length - 1];
  const now = Date.now();

  updateRegime(state);
  updateVolatility(asset, state);

  if (now - latest.time >= M1_CANDLE_MS) {
    const gap = randomNormal(state) * state.volatility * 0.14;
    const open = Math.max(0.00001, latest.close + gap);

    candles.push(makeNewCandle(open, latest.time + M1_CANDLE_MS));

    return candles.slice(-MAX_CANDLES);
  }

  const age = clamp((now - latest.time) / M1_CANDLE_MS, 0, 1);
  const drift = regimeDrift(asset, state);
  const noise = randomNormal(state) * state.volatility * 0.34;
  const reversion = (state.fairValue - latest.close) * 0.0016;

  state.lastShock = state.lastShock * 0.65 + noise * 0.35;
  state.momentum = state.momentum * 0.91 + (drift + state.lastShock) * 0.09;

  const ageFactor = 0.72 + age * 0.42;

  const nextClose = Math.max(
    0.00001,
    latest.close + drift * ageFactor + noise + state.momentum + reversion
  );

  const body = Math.abs(nextClose - latest.open);
  const wickSearch = Math.abs(noise) * 0.7 + state.volatility * (0.16 + age * 0.36);

  const high = Math.max(
    latest.high,
    nextClose + wickSearch * randomBetween(state, 0.25, 1.12),
    latest.open + body * randomBetween(state, 0.04, 0.24)
  );

  const low = Math.max(
    0.00001,
    Math.min(
      latest.low,
      nextClose - wickSearch * randomBetween(state, 0.25, 1.12),
      latest.open - body * randomBetween(state, 0.04, 0.24)
    )
  );

  candles[candles.length - 1] = {
    ...latest,
    close: nextClose,
    high,
    low,
  };

  state.fairValue = state.fairValue * 0.9994 + nextClose * 0.0006;

  return candles.slice(-MAX_CANDLES);
}