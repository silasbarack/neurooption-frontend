import React from "react";
import type {
  Asset,
  Candle,
  ChartType,
  ResultMarker,
  TradeMarker,
} from "./trading.types";

type TradingChartProps = {
  asset: Asset;
  candles: Candle[];
  chartType: ChartType;
  timeframe: string;
  expirySeconds: number;
  nowMs: number;
  selectedIndicators: string[];
  activeTrades: TradeMarker[];
  resultMarkers: ResultMarker[];
};

type Value = number | null;

type CanonicalIndicator =
  | "SMA"
  | "EMA"
  | "WMA"
  | "BOLLINGER_BANDS"
  | "PARABOLIC_SAR"
  | "ICHIMOKU"
  | "DONCHIAN_CHANNEL"
  | "ENVELOPES"
  | "AWESOME_OSCILLATOR"
  | "RSI"
  | "MACD"
  | "CCI"
  | "ADX"
  | "ATR"
  | "WILLIAMS_R"
  | "MOMENTUM"
  | "STOCHASTIC_OSCILLATOR"
  | "OSMA"
  | "ACCELERATOR_OSCILLATOR"
  | "BULLS_POWER"
  | "DEMARKER"
  | "RATE_OF_CHANGE";

type SeriesMode = "line" | "histogram" | "dots";

type Series = {
  values: Value[];
  color: string;
  mode?: SeriesMode;
  width?: number;
};

type BottomPanel = {
  title: string;
  params: string;
  series: Series[];
  levels?: number[];
  min?: number;
  max?: number;
  decimals?: number;
};

type PreparedChartData = {
  historyCandles: Candle[];
  visibleCandles: Candle[];
  overlaySeries: Series[];
  bottomPanels: BottomPanel[];
};

const MAX_HISTORY_CANDLES = 220;
const MAX_RENDER_CANDLES = 96;
const LIVE_FPS = 14;
const LIVE_FRAME_MS = 1000 / LIVE_FPS;

const COLORS = [
  "#2563eb",
  "#16a34a",
  "#f59e0b",
  "#9333ea",
  "#06b6d4",
  "#ef4444",
  "#14b8a6",
  "#64748b",
  "#a855f7",
  "#0f766e",
  "#dc2626",
  "#0891b2",
];

const OVERLAY_SET = new Set<CanonicalIndicator>([
  "SMA",
  "EMA",
  "WMA",
  "BOLLINGER_BANDS",
  "PARABOLIC_SAR",
  "ICHIMOKU",
  "DONCHIAN_CHANNEL",
  "ENVELOPES",
]);

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function isNumber(value: Value): value is number {
  return value !== null && Number.isFinite(value);
}

function crisp(value: number) {
  return Math.round(value) + 0.5;
}

function normalizeIndicatorName(indicator: string): CanonicalIndicator | null {
  const name = indicator.toLowerCase().replace(/[^a-z0-9]/g, "");

  if (name.includes("awesome") || name === "ao") return "AWESOME_OSCILLATOR";
  if (name === "rsi" || name.includes("relativestrength")) return "RSI";
  if (name === "macd") return "MACD";
  if (name === "cci") return "CCI";
  if (name === "adx") return "ADX";
  if (name === "atr") return "ATR";
  if (name.includes("williams")) return "WILLIAMS_R";
  if (name.includes("momentum")) return "MOMENTUM";
  if (name.includes("stochastic") || name === "stoch") {
    return "STOCHASTIC_OSCILLATOR";
  }
  if (name === "osma") return "OSMA";
  if (name.includes("accelerator")) return "ACCELERATOR_OSCILLATOR";
  if (name.includes("bulls")) return "BULLS_POWER";
  if (name.includes("demarker") || name.includes("demark")) return "DEMARKER";
  if (name.includes("rateofchange") || name === "roc") return "RATE_OF_CHANGE";

  if (name.includes("bollinger") || name.includes("bands")) {
    return "BOLLINGER_BANDS";
  }
  if (name.includes("parabolic") || name.includes("sar")) {
    return "PARABOLIC_SAR";
  }
  if (name.includes("ichimoku")) return "ICHIMOKU";
  if (name.includes("donchian") || name.includes("channel")) {
    return "DONCHIAN_CHANNEL";
  }
  if (name.includes("envelope")) return "ENVELOPES";
  if (name.includes("exponential") || name === "ema") return "EMA";
  if (name.includes("weighted") || name === "wma") return "WMA";
  if (name.includes("moving") || name === "ma" || name === "sma") return "SMA";

  return null;
}

function uniqueIndicators(indicators: string[]) {
  const seen = new Set<CanonicalIndicator>();
  const output: CanonicalIndicator[] = [];

  indicators.forEach((indicator) => {
    const key = normalizeIndicatorName(indicator);

    if (!key || seen.has(key)) return;

    seen.add(key);
    output.push(key);
  });

  return output;
}

function closes(candles: Candle[]) {
  return candles.map((candle) => candle.close);
}

function medianPrices(candles: Candle[]) {
  return candles.map((candle) => (candle.high + candle.low) / 2);
}

function typicalPrices(candles: Candle[]) {
  return candles.map((candle) => (candle.high + candle.low + candle.close) / 3);
}

function highest(values: number[]) {
  return Math.max(...values);
}

function lowest(values: number[]) {
  return Math.min(...values);
}

function sma(values: number[], period: number): Value[] {
  return values.map((_, index) => {
    if (index < period - 1) return null;

    const slice = values.slice(index - period + 1, index + 1);

    return slice.reduce((sum, value) => sum + value, 0) / period;
  });
}

function smaNullable(values: Value[], period: number): Value[] {
  return values.map((_, index) => {
    if (index < period - 1) return null;

    const slice = values.slice(index - period + 1, index + 1);

    if (slice.some((value) => !isNumber(value))) return null;

    return (slice as number[]).reduce((sum, value) => sum + value, 0) / period;
  });
}

function ema(values: number[], period: number): Value[] {
  const output: Value[] = Array(values.length).fill(null);

  if (values.length < period) return output;

  const multiplier = 2 / (period + 1);

  let previous =
    values.slice(0, period).reduce((sum, value) => sum + value, 0) / period;

  output[period - 1] = previous;

  for (let index = period; index < values.length; index += 1) {
    previous = values[index] * multiplier + previous * (1 - multiplier);
    output[index] = previous;
  }

  return output;
}

function emaNullable(values: Value[], period: number): Value[] {
  const output: Value[] = Array(values.length).fill(null);
  const multiplier = 2 / (period + 1);
  const seed: number[] = [];
  let previous: number | null = null;

  values.forEach((value, index) => {
    if (!isNumber(value)) return;

    if (previous === null) {
      seed.push(value);

      if (seed.length === period) {
        previous = seed.reduce((sum, item) => sum + item, 0) / period;
        output[index] = previous;
      }

      return;
    }

    previous = value * multiplier + previous * (1 - multiplier);
    output[index] = previous;
  });

  return output;
}

function wma(values: number[], period: number): Value[] {
  const denominator = (period * (period + 1)) / 2;

  return values.map((_, index) => {
    if (index < period - 1) return null;

    let total = 0;

    for (let offset = 0; offset < period; offset += 1) {
      total += values[index - offset] * (period - offset);
    }

    return total / denominator;
  });
}

function standardDeviation(values: number[], period: number): Value[] {
  return values.map((_, index) => {
    if (index < period - 1) return null;

    const slice = values.slice(index - period + 1, index + 1);
    const mean = slice.reduce((sum, value) => sum + value, 0) / period;

    const variance =
      slice.reduce((sum, value) => sum + (value - mean) ** 2, 0) / period;

    return Math.sqrt(variance);
  });
}

function trueRange(candles: Candle[], index: number) {
  if (index === 0) return candles[0].high - candles[0].low;

  const candle = candles[index];
  const previousClose = candles[index - 1].close;

  return Math.max(
    candle.high - candle.low,
    Math.abs(candle.high - previousClose),
    Math.abs(candle.low - previousClose)
  );
}

function atr(candles: Candle[], period = 14): Value[] {
  const output: Value[] = Array(candles.length).fill(null);

  if (candles.length <= period) return output;

  const ranges = candles.map((_, index) => trueRange(candles, index));

  let previousAtr =
    ranges.slice(1, period + 1).reduce((sum, value) => sum + value, 0) / period;

  output[period] = previousAtr;

  for (let index = period + 1; index < candles.length; index += 1) {
    previousAtr = (previousAtr * (period - 1) + ranges[index]) / period;
    output[index] = previousAtr;
  }

  return output;
}

function rsi(values: number[], period = 14): Value[] {
  const output: Value[] = Array(values.length).fill(null);

  if (values.length <= period) return output;

  let gains = 0;
  let losses = 0;

  for (let index = 1; index <= period; index += 1) {
    const difference = values[index] - values[index - 1];

    if (difference >= 0) gains += difference;
    else losses += Math.abs(difference);
  }

  let averageGain = gains / period;
  let averageLoss = losses / period;

  output[period] =
    averageLoss === 0 ? 100 : 100 - 100 / (1 + averageGain / averageLoss);

  for (let index = period + 1; index < values.length; index += 1) {
    const difference = values[index] - values[index - 1];
    const gain = difference > 0 ? difference : 0;
    const loss = difference < 0 ? Math.abs(difference) : 0;

    averageGain = (averageGain * (period - 1) + gain) / period;
    averageLoss = (averageLoss * (period - 1) + loss) / period;

    output[index] =
      averageLoss === 0 ? 100 : 100 - 100 / (1 + averageGain / averageLoss);
  }

  return output;
}

function macd(
  candles: Candle[],
  fastPeriod = 12,
  slowPeriod = 26,
  signalPeriod = 9
) {
  const closeValues = closes(candles);
  const fast = ema(closeValues, fastPeriod);
  const slow = ema(closeValues, slowPeriod);

  const line: Value[] = closeValues.map((_, index) => {
    if (!isNumber(fast[index]) || !isNumber(slow[index])) return null;
    return fast[index] - slow[index];
  });

  const signal = emaNullable(line, signalPeriod);

  const histogram = line.map((value, index) => {
    if (!isNumber(value) || !isNumber(signal[index])) return null;
    return value - signal[index];
  });

  return { line, signal, histogram };
}

function cci(candles: Candle[], period = 20): Value[] {
  const typical = typicalPrices(candles);

  return typical.map((value, index) => {
    if (index < period - 1) return null;

    const slice = typical.slice(index - period + 1, index + 1);
    const mean = slice.reduce((sum, item) => sum + item, 0) / period;

    const meanDeviation =
      slice.reduce((sum, item) => sum + Math.abs(item - mean), 0) / period;

    if (meanDeviation === 0) return null;

    return (value - mean) / (0.015 * meanDeviation);
  });
}

function adx(candles: Candle[], period = 14) {
  const adxValues: Value[] = Array(candles.length).fill(null);
  const plusDi: Value[] = Array(candles.length).fill(null);
  const minusDi: Value[] = Array(candles.length).fill(null);

  const tr = Array(candles.length).fill(0);
  const plusDm = Array(candles.length).fill(0);
  const minusDm = Array(candles.length).fill(0);
  const dx: Value[] = Array(candles.length).fill(null);

  if (candles.length <= period * 2) {
    return { adxValues, plusDi, minusDi };
  }

  for (let index = 1; index < candles.length; index += 1) {
    const upMove = candles[index].high - candles[index - 1].high;
    const downMove = candles[index - 1].low - candles[index].low;

    plusDm[index] = upMove > downMove && upMove > 0 ? upMove : 0;
    minusDm[index] = downMove > upMove && downMove > 0 ? downMove : 0;
    tr[index] = trueRange(candles, index);
  }

  let smoothedTr = tr.slice(1, period + 1).reduce((sum, value) => sum + value, 0);

  let smoothedPlusDm = plusDm
    .slice(1, period + 1)
    .reduce((sum, value) => sum + value, 0);

  let smoothedMinusDm = minusDm
    .slice(1, period + 1)
    .reduce((sum, value) => sum + value, 0);

  for (let index = period; index < candles.length; index += 1) {
    if (index > period) {
      smoothedTr = smoothedTr - smoothedTr / period + tr[index];
      smoothedPlusDm = smoothedPlusDm - smoothedPlusDm / period + plusDm[index];
      smoothedMinusDm = smoothedMinusDm - smoothedMinusDm / period + minusDm[index];
    }

    const pdi = smoothedTr === 0 ? 0 : 100 * (smoothedPlusDm / smoothedTr);
    const mdi = smoothedTr === 0 ? 0 : 100 * (smoothedMinusDm / smoothedTr);

    plusDi[index] = pdi;
    minusDi[index] = mdi;

    const denominator = pdi + mdi;

    dx[index] =
      denominator === 0 ? 0 : (100 * Math.abs(pdi - mdi)) / denominator;
  }

  const firstDx = dx.slice(period, period * 2).filter(isNumber);

  if (firstDx.length < period) {
    return { adxValues, plusDi, minusDi };
  }

  let previousAdx = firstDx.reduce((sum, value) => sum + value, 0) / period;

  adxValues[period * 2 - 1] = previousAdx;

  for (let index = period * 2; index < candles.length; index += 1) {
    previousAdx = (previousAdx * (period - 1) + (dx[index] ?? 0)) / period;
    adxValues[index] = previousAdx;
  }

  return { adxValues, plusDi, minusDi };
}

function williamsR(candles: Candle[], period = 14): Value[] {
  return candles.map((candle, index) => {
    if (index < period - 1) return null;

    const slice = candles.slice(index - period + 1, index + 1);
    const high = highest(slice.map((item) => item.high));
    const low = lowest(slice.map((item) => item.low));

    if (high === low) return null;

    return ((high - candle.close) / (high - low)) * -100;
  });
}

function momentum(candles: Candle[], period = 10): Value[] {
  return candles.map((candle, index) => {
    if (index < period) return null;

    const previousClose = candles[index - period].close;

    if (previousClose === 0) return null;

    return (candle.close / previousClose) * 100;
  });
}

function stochastic(candles: Candle[], kPeriod = 14, dPeriod = 3, slowing = 3) {
  const rawK: Value[] = candles.map((candle, index) => {
    if (index < kPeriod - 1) return null;

    const slice = candles.slice(index - kPeriod + 1, index + 1);
    const high = highest(slice.map((item) => item.high));
    const low = lowest(slice.map((item) => item.low));

    if (high === low) return null;

    return ((candle.close - low) / (high - low)) * 100;
  });

  const slowK = smaNullable(rawK, slowing);
  const dLine = smaNullable(slowK, dPeriod);

  return { slowK, dLine };
}

function awesomeOscillator(
  candles: Candle[],
  fastPeriod = 5,
  slowPeriod = 34
): Value[] {
  const median = medianPrices(candles);
  const fast = sma(median, fastPeriod);
  const slow = sma(median, slowPeriod);

  return median.map((_, index) => {
    if (!isNumber(fast[index]) || !isNumber(slow[index])) return null;
    return fast[index] - slow[index];
  });
}

function acceleratorOscillator(
  candles: Candle[],
  fastPeriod = 5,
  slowPeriod = 34,
  signalPeriod = 5
): Value[] {
  const ao = awesomeOscillator(candles, fastPeriod, slowPeriod);
  const aoSignal = smaNullable(ao, signalPeriod);

  return ao.map((value, index) => {
    if (!isNumber(value) || !isNumber(aoSignal[index])) return null;
    return value - aoSignal[index];
  });
}

function bullsPower(candles: Candle[], period = 13): Value[] {
  const closeEma = ema(closes(candles), period);

  return candles.map((candle, index) => {
    if (!isNumber(closeEma[index])) return null;
    return candle.high - closeEma[index];
  });
}

function deMarker(candles: Candle[], period = 14): Value[] {
  const deMax = Array(candles.length).fill(0);
  const deMin = Array(candles.length).fill(0);

  for (let index = 1; index < candles.length; index += 1) {
    deMax[index] =
      candles[index].high > candles[index - 1].high
        ? candles[index].high - candles[index - 1].high
        : 0;

    deMin[index] =
      candles[index].low < candles[index - 1].low
        ? candles[index - 1].low - candles[index].low
        : 0;
  }

  const maxSma = sma(deMax, period);
  const minSma = sma(deMin, period);

  return candles.map((_, index) => {
    if (!isNumber(maxSma[index]) || !isNumber(minSma[index])) return null;

    const denominator = maxSma[index] + minSma[index];

    if (denominator === 0) return null;

    return maxSma[index] / denominator;
  });
}

function rateOfChange(candles: Candle[], period = 12): Value[] {
  return candles.map((candle, index) => {
    if (index < period) return null;

    const previousClose = candles[index - period].close;

    if (previousClose === 0) return null;

    return ((candle.close - previousClose) / previousClose) * 100;
  });
}

function parabolicSar(candles: Candle[], step = 0.02, maxStep = 0.2): Value[] {
  const output: Value[] = Array(candles.length).fill(null);

  if (candles.length < 2) return output;

  let upTrend = candles[1].close >= candles[0].close;
  let acceleration = step;
  let extremePoint = upTrend ? candles[1].high : candles[1].low;
  let sar = upTrend ? candles[0].low : candles[0].high;

  output[1] = sar;

  for (let index = 2; index < candles.length; index += 1) {
    sar = sar + acceleration * (extremePoint - sar);

    if (upTrend) {
      sar = Math.min(sar, candles[index - 1].low, candles[index - 2].low);

      if (candles[index].low < sar) {
        upTrend = false;
        sar = extremePoint;
        extremePoint = candles[index].low;
        acceleration = step;
      } else if (candles[index].high > extremePoint) {
        extremePoint = candles[index].high;
        acceleration = Math.min(acceleration + step, maxStep);
      }
    } else {
      sar = Math.max(sar, candles[index - 1].high, candles[index - 2].high);

      if (candles[index].high > sar) {
        upTrend = true;
        sar = extremePoint;
        extremePoint = candles[index].high;
        acceleration = step;
      } else if (candles[index].low < extremePoint) {
        extremePoint = candles[index].low;
        acceleration = Math.min(acceleration + step, maxStep);
      }
    }

    output[index] = sar;
  }

  return output;
}

function ichimoku(
  candles: Candle[],
  conversionPeriod = 9,
  basePeriod = 26,
  spanBPeriod = 52
) {
  const tenkan: Value[] = Array(candles.length).fill(null);
  const kijun: Value[] = Array(candles.length).fill(null);
  const spanA: Value[] = Array(candles.length).fill(null);
  const spanB: Value[] = Array(candles.length).fill(null);

  candles.forEach((_, index) => {
    if (index >= conversionPeriod - 1) {
      const slice = candles.slice(index - conversionPeriod + 1, index + 1);

      tenkan[index] =
        (highest(slice.map((item) => item.high)) +
          lowest(slice.map((item) => item.low))) /
        2;
    }

    if (index >= basePeriod - 1) {
      const slice = candles.slice(index - basePeriod + 1, index + 1);

      kijun[index] =
        (highest(slice.map((item) => item.high)) +
          lowest(slice.map((item) => item.low))) /
        2;
    }

    if (isNumber(tenkan[index]) && isNumber(kijun[index])) {
      spanA[index] = (tenkan[index] + kijun[index]) / 2;
    }

    if (index >= spanBPeriod - 1) {
      const slice = candles.slice(index - spanBPeriod + 1, index + 1);

      spanB[index] =
        (highest(slice.map((item) => item.high)) +
          lowest(slice.map((item) => item.low))) /
        2;
    }
  });

  return { tenkan, kijun, spanA, spanB };
}

function donchianChannel(candles: Candle[], period = 20) {
  const upper: Value[] = Array(candles.length).fill(null);
  const middle: Value[] = Array(candles.length).fill(null);
  const lower: Value[] = Array(candles.length).fill(null);

  candles.forEach((_, index) => {
    if (index < period - 1) return;

    const slice = candles.slice(index - period + 1, index + 1);
    const high = highest(slice.map((item) => item.high));
    const low = lowest(slice.map((item) => item.low));

    upper[index] = high;
    middle[index] = (high + low) / 2;
    lower[index] = low;
  });

  return { upper, middle, lower };
}

function heikenAshi(candles: Candle[]) {
  const output: Candle[] = [];

  candles.forEach((candle, index) => {
    const previous = output[index - 1];

    const close = (candle.open + candle.high + candle.low + candle.close) / 4;
    const open = previous ? (previous.open + previous.close) / 2 : candle.open;
    const high = Math.max(candle.high, open, close);
    const low = Math.min(candle.low, open, close);

    output.push({
      time: candle.time,
      open,
      high,
      low,
      close,
    });
  });

  return output;
}

function fillDisplayGaps(values: Value[], mode?: SeriesMode): Value[] {
  if (mode === "dots") return values;

  if (mode === "histogram") {
    return values.map((value) => (isNumber(value) ? value : 0));
  }

  const output = [...values];

  const validIndexes = output
    .map((value, index) => (isNumber(value) ? index : -1))
    .filter((index) => index >= 0);

  if (validIndexes.length === 0) return output;

  const firstIndex = validIndexes[0];
  const lastIndex = validIndexes[validIndexes.length - 1];

  for (let index = 0; index < firstIndex; index += 1) {
    output[index] = output[firstIndex];
  }

  for (let index = lastIndex + 1; index < output.length; index += 1) {
    output[index] = output[lastIndex];
  }

  for (let validIndex = 0; validIndex < validIndexes.length - 1; validIndex += 1) {
    const start = validIndexes[validIndex];
    const end = validIndexes[validIndex + 1];

    if (end - start <= 1) continue;

    const startValue = output[start];
    const endValue = output[end];

    if (!isNumber(startValue) || !isNumber(endValue)) continue;

    for (let index = start + 1; index < end; index += 1) {
      const ratio = (index - start) / (end - start);
      output[index] = startValue + (endValue - startValue) * ratio;
    }
  }

  return output;
}

function prepareSeries(series: Series, visibleCount: number): Series {
  return {
    ...series,
    values: fillDisplayGaps(series.values.slice(-visibleCount), series.mode),
  };
}

function preparePanel(panel: BottomPanel, visibleCount: number): BottomPanel {
  return {
    ...panel,
    series: panel.series.map((series) => prepareSeries(series, visibleCount)),
  };
}

function buildOverlay(
  indicator: CanonicalIndicator,
  candles: Candle[],
  colorIndex: number
): Series[] {
  const closeValues = closes(candles);
  const color = COLORS[colorIndex % COLORS.length];

  if (indicator === "SMA") {
    return [{ values: sma(closeValues, 20), color }];
  }

  if (indicator === "EMA") {
    return [{ values: ema(closeValues, 20), color }];
  }

  if (indicator === "WMA") {
    return [{ values: wma(closeValues, 20), color }];
  }

  if (indicator === "BOLLINGER_BANDS") {
    const middle = sma(closeValues, 20);
    const deviation = standardDeviation(closeValues, 20);

    const upper = middle.map((value, index) =>
      isNumber(value) && isNumber(deviation[index])
        ? value + deviation[index] * 2
        : null
    );

    const lower = middle.map((value, index) =>
      isNumber(value) && isNumber(deviation[index])
        ? value - deviation[index] * 2
        : null
    );

    return [
      { values: upper, color: "#2563eb", width: 1.1 },
      { values: middle, color: "#64748b", width: 1 },
      { values: lower, color: "#2563eb", width: 1.1 },
    ];
  }

  if (indicator === "PARABOLIC_SAR") {
    return [{ values: parabolicSar(candles), color, mode: "dots" }];
  }

  if (indicator === "ICHIMOKU") {
    const data = ichimoku(candles);

    return [
      { values: data.tenkan, color: "#dc2626", width: 1.1 },
      { values: data.kijun, color: "#2563eb", width: 1.1 },
      { values: data.spanA, color: "#16a34a", width: 1 },
      { values: data.spanB, color: "#f59e0b", width: 1 },
    ];
  }

  if (indicator === "DONCHIAN_CHANNEL") {
    const data = donchianChannel(candles, 20);

    return [
      { values: data.upper, color: "#9333ea", width: 1.1 },
      { values: data.middle, color: "#64748b", width: 1 },
      { values: data.lower, color: "#9333ea", width: 1.1 },
    ];
  }

  if (indicator === "ENVELOPES") {
    const middle = sma(closeValues, 20);
    const upper = middle.map((value) => (isNumber(value) ? value * 1.001 : null));
    const lower = middle.map((value) => (isNumber(value) ? value * 0.999 : null));

    return [
      { values: upper, color: "#0891b2", width: 1.1 },
      { values: middle, color: "#64748b", width: 1 },
      { values: lower, color: "#0891b2", width: 1.1 },
    ];
  }

  return [];
}

function buildBottomPanel(
  indicator: CanonicalIndicator,
  candles: Candle[],
  colorIndex: number
): BottomPanel | null {
  const color = COLORS[colorIndex % COLORS.length];

  if (indicator === "AWESOME_OSCILLATOR") {
    return {
      title: "Awesome Oscillator",
      params: "5, 34",
      series: [{ values: awesomeOscillator(candles), color, mode: "histogram" }],
      levels: [0],
      decimals: 6,
    };
  }

  if (indicator === "RSI") {
    return {
      title: "RSI",
      params: "14",
      series: [{ values: rsi(closes(candles), 14), color }],
      levels: [30, 50, 70],
      min: 0,
      max: 100,
      decimals: 2,
    };
  }

  if (indicator === "MACD") {
    const data = macd(candles);

    return {
      title: "MACD",
      params: "12, 26, 9",
      series: [
        { values: data.histogram, color: "#64748b", mode: "histogram" },
        { values: data.line, color: "#2563eb" },
        { values: data.signal, color: "#f59e0b" },
      ],
      levels: [0],
      decimals: 6,
    };
  }

  if (indicator === "CCI") {
    return {
      title: "CCI",
      params: "20",
      series: [{ values: cci(candles), color }],
      levels: [-100, 0, 100],
      decimals: 2,
    };
  }

  if (indicator === "ADX") {
    const data = adx(candles);

    return {
      title: "ADX",
      params: "14",
      series: [
        { values: data.adxValues, color: "#2563eb" },
        { values: data.plusDi, color: "#16a34a" },
        { values: data.minusDi, color: "#dc2626" },
      ],
      levels: [20, 25, 50],
      min: 0,
      max: 100,
      decimals: 2,
    };
  }

  if (indicator === "ATR") {
    return {
      title: "ATR",
      params: "14",
      series: [{ values: atr(candles), color }],
      min: 0,
      decimals: 6,
    };
  }

  if (indicator === "WILLIAMS_R") {
    return {
      title: "Williams %R",
      params: "14",
      series: [{ values: williamsR(candles), color }],
      levels: [-80, -50, -20],
      min: -100,
      max: 0,
      decimals: 2,
    };
  }

  if (indicator === "MOMENTUM") {
    return {
      title: "Momentum",
      params: "10",
      series: [{ values: momentum(candles), color }],
      levels: [100],
      decimals: 3,
    };
  }

  if (indicator === "STOCHASTIC_OSCILLATOR") {
    const data = stochastic(candles);

    return {
      title: "Stochastic Oscillator",
      params: "14, 3, 3",
      series: [
        { values: data.slowK, color: "#2563eb" },
        { values: data.dLine, color: "#f59e0b" },
      ],
      levels: [20, 50, 80],
      min: 0,
      max: 100,
      decimals: 2,
    };
  }

  if (indicator === "OSMA") {
    const data = macd(candles);

    return {
      title: "OsMA",
      params: "12, 26, 9",
      series: [{ values: data.histogram, color, mode: "histogram" }],
      levels: [0],
      decimals: 6,
    };
  }

  if (indicator === "ACCELERATOR_OSCILLATOR") {
    return {
      title: "Accelerator Oscillator",
      params: "5, 34, 5",
      series: [
        { values: acceleratorOscillator(candles), color, mode: "histogram" },
      ],
      levels: [0],
      decimals: 6,
    };
  }

  if (indicator === "BULLS_POWER") {
    return {
      title: "Bulls Power",
      params: "13",
      series: [{ values: bullsPower(candles), color, mode: "histogram" }],
      levels: [0],
      decimals: 6,
    };
  }

  if (indicator === "DEMARKER") {
    return {
      title: "DeMarker",
      params: "14",
      series: [{ values: deMarker(candles), color }],
      levels: [0.3, 0.5, 0.7],
      min: 0,
      max: 1,
      decimals: 3,
    };
  }

  if (indicator === "RATE_OF_CHANGE") {
    return {
      title: "Rate of Change",
      params: "12",
      series: [{ values: rateOfChange(candles), color }],
      levels: [0],
      decimals: 3,
    };
  }

  return null;
}

function formatDuration(totalSeconds: number) {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
    2,
    "0"
  )}:${String(seconds).padStart(2, "0")}`;
}

function liveCandle(candle: Candle, asset: Asset, frameTime: number): Candle {
  const rawRange = Math.max(candle.high - candle.low, asset.basePrice * 0.00015);
  const wave =
    Math.sin(frameTime / 320) * rawRange * 0.34 +
    Math.sin(frameTime / 900) * rawRange * 0.22;

  const close = clamp(
    candle.close + wave,
    candle.low - rawRange * 0.18,
    candle.high + rawRange * 0.18
  );

  return {
    ...candle,
    close,
    high: Math.max(candle.high, close),
    low: Math.min(candle.low, close),
  };
}

function drawLine(
  context: CanvasRenderingContext2D,
  values: Value[],
  color: string,
  indexToX: (index: number) => number,
  valueToY: (value: number) => number,
  width = 1.25
) {
  context.strokeStyle = color;
  context.lineWidth = width;
  context.beginPath();

  let started = false;

  values.forEach((value, index) => {
    if (!isNumber(value)) return;

    const x = indexToX(index);
    const y = valueToY(value);

    if (!started) {
      context.moveTo(x, y);
      started = true;
    } else {
      context.lineTo(x, y);
    }
  });

  context.stroke();
}

function drawDots(
  context: CanvasRenderingContext2D,
  values: Value[],
  color: string,
  indexToX: (index: number) => number,
  valueToY: (value: number) => number
) {
  context.fillStyle = color;

  values.forEach((value, index) => {
    if (!isNumber(value)) return;

    const x = indexToX(index);
    const y = valueToY(value);

    context.beginPath();
    context.arc(x, y, 2.25, 0, Math.PI * 2);
    context.fill();
  });
}

function drawHistogram(
  context: CanvasRenderingContext2D,
  values: Value[],
  color: string,
  indexToX: (index: number) => number,
  valueToY: (value: number) => number,
  candleWidth: number
) {
  const zeroY = valueToY(0);

  context.fillStyle = color;

  values.forEach((value, index) => {
    if (!isNumber(value)) return;

    const x = indexToX(index);
    const y = valueToY(value);
    const top = Math.min(y, zeroY);
    const height = Math.max(1, Math.abs(zeroY - y));

    context.fillRect(x - candleWidth / 2, top, candleWidth, height);
  });
}

function roundRect(
  context: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number
) {
  context.beginPath();
  context.moveTo(x + radius, y);
  context.lineTo(x + width - radius, y);
  context.quadraticCurveTo(x + width, y, x + width, y + radius);
  context.lineTo(x + width, y + height - radius);
  context.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  context.lineTo(x + radius, y + height);
  context.quadraticCurveTo(x, y + height, x, y + height - radius);
  context.lineTo(x, y + radius);
  context.quadraticCurveTo(x, y, x + radius, y);
  context.closePath();
}

function TradingChartComponent(props: TradingChartProps) {
  const {
    asset,
    candles,
    chartType,
    timeframe,
    expirySeconds,
    selectedIndicators,
    activeTrades,
    resultMarkers,
  } = props;

  const canvasRef = React.useRef<HTMLCanvasElement | null>(null);
  const animationRef = React.useRef<number | null>(null);
  const lastFrameRef = React.useRef(0);

  const prepared = React.useMemo<PreparedChartData>(() => {
    const historyCandles = candles.slice(-MAX_HISTORY_CANDLES);
    const visibleBaseCandles = historyCandles.slice(-MAX_RENDER_CANDLES);

    const visibleCandles =
      chartType === "Heiken Ashi"
        ? heikenAshi(visibleBaseCandles)
        : visibleBaseCandles;

    const canonicalIndicators = uniqueIndicators(selectedIndicators);

    const overlayIndicators = canonicalIndicators.filter((item) =>
      OVERLAY_SET.has(item)
    );

    const bottomIndicators = canonicalIndicators.filter(
      (item) => !OVERLAY_SET.has(item)
    );

    const visibleCount = visibleCandles.length;

    const overlaySeries = overlayIndicators
      .flatMap((indicator, index) => buildOverlay(indicator, historyCandles, index))
      .map((series) => prepareSeries(series, visibleCount));

    const bottomPanels = bottomIndicators
      .map((indicator, index) => buildBottomPanel(indicator, historyCandles, index))
      .filter((panel): panel is BottomPanel => panel !== null)
      .map((panel) => preparePanel(panel, visibleCount));

    return {
      historyCandles,
      visibleCandles,
      overlaySeries,
      bottomPanels,
    };
  }, [candles, chartType, selectedIndicators]);

  const bottomPanelCount = prepared.bottomPanels.length;

  const wrapStyle: React.CSSProperties =
    bottomPanelCount > 0
      ? {
          minHeight: Math.max(620, 460 + Math.min(bottomPanelCount, 3) * 155),
        }
      : {};

  React.useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d", { alpha: false });

    if (!canvas || !context) return;

    const draw = (frameTime: number) => {
      if (frameTime - lastFrameRef.current < LIVE_FRAME_MS) {
        animationRef.current = window.requestAnimationFrame(draw);
        return;
      }

      lastFrameRef.current = frameTime;

      const rect = canvas.getBoundingClientRect();
      const cssWidth = Math.max(1, Math.floor(rect.width));
      const cssHeight = Math.max(1, Math.floor(rect.height));
      const dpr = Math.min(window.devicePixelRatio || 1, 2);

      const nextWidth = Math.floor(cssWidth * dpr);
      const nextHeight = Math.floor(cssHeight * dpr);

      if (canvas.width !== nextWidth || canvas.height !== nextHeight) {
        canvas.width = nextWidth;
        canvas.height = nextHeight;
        canvas.style.width = `${cssWidth}px`;
        canvas.style.height = `${cssHeight}px`;
      }

      context.setTransform(dpr, 0, 0, dpr, 0, 0);
      context.imageSmoothingEnabled = false;

      const width = cssWidth;
      const height = cssHeight;

      context.clearRect(0, 0, width, height);
      context.fillStyle = "#ffffff";
      context.fillRect(0, 0, width, height);

      if (prepared.visibleCandles.length < 2) {
        context.fillStyle = "#667085";
        context.font = "700 14px Roboto, Arial, sans-serif";
        context.textAlign = "center";
        context.fillText("Loading candles...", width / 2, height / 2);
        animationRef.current = window.requestAnimationFrame(draw);
        return;
      }

      const renderCandles = [...prepared.visibleCandles];
      const lastIndex = renderCandles.length - 1;

      if (lastIndex >= 0) {
        renderCandles[lastIndex] = liveCandle(
          renderCandles[lastIndex],
          asset,
          frameTime
        );
      }

      const left = 18;
      const right = 92;
      const top = 58;
      const footer = 44;

      const bottomArea =
        bottomPanelCount > 0 ? clamp(height * 0.46, 220, height * 0.55) : 0;

      const panelGap = bottomPanelCount > 0 ? 8 : 0;
      const chartBottom = height - footer - bottomArea - panelGap;
      const chartHeight = Math.max(170, chartBottom - top);
      const chartWidth = width - left - right;

      const priceValues = renderCandles.flatMap((candle) => [
        candle.open,
        candle.high,
        candle.low,
        candle.close,
      ]);

      prepared.overlaySeries.forEach((series) => {
        series.values.forEach((value) => {
          if (isNumber(value)) priceValues.push(value);
        });
      });

      activeTrades.forEach((trade) => priceValues.push(trade.entryPrice));
      resultMarkers.forEach((marker) => priceValues.push(marker.price));

      let minPrice = Math.min(...priceValues);
      let maxPrice = Math.max(...priceValues);

      const padding = Math.max(
        (maxPrice - minPrice) * 0.32,
        asset.basePrice * 0.001
      );

      minPrice -= padding;
      maxPrice += padding;

      const priceRange = maxPrice - minPrice || 1;

      const priceToY = (price: number) =>
        top + ((maxPrice - price) / priceRange) * chartHeight;

      const indexToX = (index: number) =>
        left + (index / Math.max(renderCandles.length - 1, 1)) * chartWidth;

      context.strokeStyle = "#edf1f6";
      context.lineWidth = 1;

      for (let i = 0; i <= 8; i += 1) {
        const x = crisp(left + (chartWidth / 8) * i);

        context.beginPath();
        context.moveTo(x, top);
        context.lineTo(x, chartBottom);
        context.stroke();
      }

      for (let i = 0; i <= 6; i += 1) {
        const y = crisp(top + (chartHeight / 6) * i);

        context.beginPath();
        context.moveTo(left, y);
        context.lineTo(width - right, y);
        context.stroke();
      }

      const candleWidth = clamp(
        (chartWidth / renderCandles.length) * 0.48,
        1.6,
        6
      );

      if (chartType === "Line") {
        drawLine(
          context,
          renderCandles.map((candle) => candle.close),
          "#0ea5e9",
          indexToX,
          priceToY,
          1.9
        );
      } else {
        renderCandles.forEach((candle, index) => {
          const x = crisp(indexToX(index));
          const openY = priceToY(candle.open);
          const closeY = priceToY(candle.close);
          const highY = priceToY(candle.high);
          const lowY = priceToY(candle.low);

          const bullish = candle.close >= candle.open;
          const color = bullish ? "#17a868" : "#e5484d";

          context.strokeStyle = color;
          context.fillStyle = color;
          context.lineWidth = 1.15;

          if (chartType === "Bars") {
            context.beginPath();
            context.moveTo(x, highY);
            context.lineTo(x, lowY);
            context.moveTo(x - candleWidth, openY);
            context.lineTo(x, openY);
            context.moveTo(x, closeY);
            context.lineTo(x + candleWidth, closeY);
            context.stroke();
          } else {
            context.beginPath();
            context.moveTo(x, highY);
            context.lineTo(x, lowY);
            context.stroke();

            const bodyTop = Math.min(openY, closeY);
            const bodyHeight = Math.max(2, Math.abs(openY - closeY));

            context.fillRect(
              Math.round(x - candleWidth / 2),
              Math.round(bodyTop),
              Math.max(2, Math.round(candleWidth)),
              Math.round(bodyHeight)
            );
          }
        });
      }

      prepared.overlaySeries.forEach((series) => {
        if (series.mode === "dots") {
          drawDots(context, series.values, series.color, indexToX, priceToY);
        } else {
          drawLine(
            context,
            series.values,
            series.color,
            indexToX,
            priceToY,
            series.width ?? 1.3
          );
        }
      });

      const latest = renderCandles[renderCandles.length - 1];
      const currentY = priceToY(latest.close);

      context.setLineDash([4, 4]);
      context.strokeStyle = "#3b82f6";
      context.beginPath();
      context.moveTo(left, currentY);
      context.lineTo(width - right + 4, currentY);
      context.stroke();
      context.setLineDash([]);

      context.fillStyle = "#1677ff";
      roundRect(context, width - right + 8, currentY - 14, 66, 28, 6);
      context.fill();

      context.fillStyle = "#ffffff";
      context.font = "700 12px Roboto, Arial, sans-serif";
      context.textAlign = "center";
      context.fillText(
        latest.close.toFixed(asset.precision),
        width - right + 41,
        currentY + 4
      );

      context.fillStyle = "#344054";
      context.font = "500 11px Roboto, Arial, sans-serif";
      context.textAlign = "right";

      for (let i = 0; i <= 5; i += 1) {
        const price = maxPrice - ((maxPrice - minPrice) / 5) * i;
        const y = priceToY(price);

        context.fillText(price.toFixed(asset.precision), width - 8, y + 4);
      }

      const expiryX = left + chartWidth * 0.82;

      context.strokeStyle = "#98a2b3";
      context.setLineDash([3, 3]);
      context.beginPath();
      context.moveTo(expiryX, top);
      context.lineTo(expiryX, chartBottom);
      context.stroke();
      context.setLineDash([]);

      context.fillStyle = "#475467";
      context.font = "700 10px Roboto, Arial, sans-serif";
      context.textAlign = "left";
      context.fillText("Expiration time", expiryX + 6, top + 12);
      context.fillText(formatDuration(expirySeconds), expiryX + 6, top + 29);

      context.fillStyle = "#344054";
      context.font = "600 11px Roboto, Arial, sans-serif";
      context.textAlign = "left";
      context.fillText(timeframe, width - right - 26, currentY - 10);

      activeTrades.forEach((trade) => {
        const y = priceToY(trade.entryPrice);

        context.strokeStyle = trade.side === "BUY" ? "#22c55e" : "#ef4444";
        context.setLineDash([4, 4]);
        context.beginPath();
        context.moveTo(left, y);
        context.lineTo(width - right, y);
        context.stroke();
        context.setLineDash([]);
      });

      resultMarkers.forEach((marker) => {
        const y = priceToY(marker.price);

        context.fillStyle = marker.won ? "#16a34a" : "#dc2626";
        roundRect(context, width - right - 122, y - 14, 112, 28, 7);
        context.fill();

        context.fillStyle = "#ffffff";
        context.font = "800 10px Roboto, Arial, sans-serif";
        context.textAlign = "center";
        context.fillText(marker.label, width - right - 66, y + 4);
      });

      if (prepared.bottomPanels.length > 0) {
        const panelHeight = bottomArea / Math.max(prepared.bottomPanels.length, 1);
        const panelTopStart = chartBottom + panelGap;

        prepared.bottomPanels.forEach((panel, panelIndex) => {
          const panelTop = panelTopStart + panelHeight * panelIndex;
          const panelBottom = panelTop + panelHeight - 4;
          const panelInnerTop = panelTop + 20;
          const panelInnerBottom = panelBottom - 10;
          const panelInnerHeight = Math.max(24, panelInnerBottom - panelInnerTop);

          const values = panel.series
            .flatMap((series) => series.values)
            .filter(isNumber);

          const levelValues = panel.levels ?? [];

          let min = panel.min ?? Math.min(...values, ...levelValues, 0);
          let max = panel.max ?? Math.max(...values, ...levelValues, 0);

          if (!Number.isFinite(min)) min = 0;
          if (!Number.isFinite(max)) max = 1;

          if (min === max) {
            min -= 1;
            max += 1;
          }

          const paddingValue = (max - min) * 0.16;

          if (panel.min === undefined) min -= paddingValue;
          if (panel.max === undefined) max += paddingValue;

          const valueToY = (value: number) =>
            panelInnerTop + ((max - value) / (max - min || 1)) * panelInnerHeight;

          context.fillStyle = "#ffffff";
          context.fillRect(left, panelTop, width - left - 4, panelBottom - panelTop);

          context.strokeStyle = "#dbe3ef";
          context.lineWidth = 1;
          context.beginPath();
          context.moveTo(left, crisp(panelTop));
          context.lineTo(width - 4, crisp(panelTop));
          context.stroke();

          context.fillStyle = "#111827";
          context.font = "800 10px Roboto, Arial, sans-serif";
          context.textAlign = "left";
          context.fillText(`${panel.title} ${panel.params}`, left + 4, panelTop + 13);

          context.fillStyle = "#64748b";
          context.font = "600 9px Roboto, Arial, sans-serif";
          context.textAlign = "right";
          context.fillText(
            max.toFixed(panel.decimals ?? 2),
            width - 8,
            panelInnerTop + 4
          );
          context.fillText(
            min.toFixed(panel.decimals ?? 2),
            width - 8,
            panelInnerBottom
          );

          context.strokeStyle = "#edf1f6";
          context.lineWidth = 1;

          [0.25, 0.5, 0.75].forEach((ratio) => {
            const y = crisp(panelInnerTop + panelInnerHeight * ratio);

            context.beginPath();
            context.moveTo(left, y);
            context.lineTo(width - right, y);
            context.stroke();
          });

          if (panel.levels) {
            context.strokeStyle = "#cbd5e1";
            context.setLineDash([4, 4]);

            panel.levels.forEach((level) => {
              if (level < min || level > max) return;

              const y = valueToY(level);

              context.beginPath();
              context.moveTo(left, y);
              context.lineTo(width - right, y);
              context.stroke();
            });

            context.setLineDash([]);
          }

          panel.series.forEach((series) => {
            if (series.mode === "histogram") {
              drawHistogram(
                context,
                series.values,
                series.color,
                indexToX,
                valueToY,
                clamp(candleWidth, 2, 7)
              );
            } else if (series.mode === "dots") {
              drawDots(context, series.values, series.color, indexToX, valueToY);
            } else {
              drawLine(
                context,
                series.values,
                series.color,
                indexToX,
                valueToY,
                series.width ?? 1.35
              );
            }
          });
        });
      }

      animationRef.current = window.requestAnimationFrame(draw);
    };

    animationRef.current = window.requestAnimationFrame(draw);

    return () => {
      if (animationRef.current !== null) {
        window.cancelAnimationFrame(animationRef.current);
      }
    };
  }, [
    asset,
    chartType,
    timeframe,
    expirySeconds,
    prepared,
    activeTrades,
    resultMarkers,
    bottomPanelCount,
  ]);

  return (
    <div className="nt-chart-wrap" style={wrapStyle}>
      <canvas ref={canvasRef} className="nt-chart-canvas" />
    </div>
  );
}

function areTradingChartPropsEqual(
  previous: TradingChartProps,
  next: TradingChartProps
) {
  return (
    previous.asset.symbol === next.asset.symbol &&
    previous.asset.precision === next.asset.precision &&
    previous.asset.basePrice === next.asset.basePrice &&
    previous.chartType === next.chartType &&
    previous.timeframe === next.timeframe &&
    previous.expirySeconds === next.expirySeconds &&
    previous.candles === next.candles &&
    previous.selectedIndicators === next.selectedIndicators &&
    previous.activeTrades === next.activeTrades &&
    previous.resultMarkers === next.resultMarkers
  );
}

export default React.memo(TradingChartComponent, areTradingChartPropsEqual);