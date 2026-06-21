import React from "react";
import type { Asset, Candle, ChartType, ResultMarker, TradeMarker } from "./trading.types";
import {
  DEFAULT_INDICATOR_SETTINGS,
  type IndicatorSettingsMap,
} from "./indicator-settings";

type TradingChartProps = {
  asset: Asset;
  candles: Candle[];
  chartType: ChartType;
  timeframe: string;
  expirySeconds: number;
  nowMs: number;
  selectedIndicators: string[];
  indicatorSettings?: IndicatorSettingsMap;
  activeTrades: TradeMarker[];
  resultMarkers: ResultMarker[];
};

type Value = number | null;
type SeriesMode = "line" | "histogram" | "dots";

type Series = {
  name: string;
  values: Value[];
  color: string;
  mode?: SeriesMode;
  width?: number;
};

type BottomPanel = {
  key: string;
  title: string;
  series: Series[];
  levels?: number[];
  min?: number;
  max?: number;
};

const MAX_HISTORY_CANDLES = 520;

const COLORS = [
  "#16a34a",
  "#f59e0b",
  "#2563eb",
  "#9333ea",
  "#06b6d4",
  "#ef4444",
  "#14b8a6",
  "#64748b",
  "#a855f7",
  "#0f766e",
];

const BOTTOM_INDICATORS = new Set([
  "AWESOME_OSCILLATOR",
  "RSI",
  "MACD",
  "CCI",
  "ADX",
  "ATR",
  "WILLIAMS_R",
  "MOMENTUM",
  "STOCHASTIC_OSCILLATOR",
  "OSMA",
  "ACCELERATOR_OSCILLATOR",
  "BULLS_POWER",
  "DEMARKER",
  "RATE_OF_CHANGE",
  "VOLUME",
  "STANDARD_DEVIATION",
  "VARIANCE",
  "MONEY_FLOW_INDEX",
  "OBV",
  "TRIX",
  "DPO",
  "TREND_STRENGTH",
  "AROON",
]);

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function isFiniteNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function valueOr(
  settings: IndicatorSettingsMap,
  indicator: string,
  key: string,
  fallback: number
) {
  const value =
    settings[indicator]?.[key] ??
    DEFAULT_INDICATOR_SETTINGS[indicator]?.[key] ??
    fallback;

  return Number.isFinite(value) ? value : fallback;
}

function intValue(
  settings: IndicatorSettingsMap,
  indicator: string,
  key: string,
  fallback: number
) {
  return Math.max(1, Math.round(valueOr(settings, indicator, key, fallback)));
}

function normalizeIndicatorName(indicator: string) {
  const name = indicator.trim().toLowerCase();

  if (name === "moving average" || name === "ma" || name === "simple ma") return "SMA";
  if (name.includes("exponential")) return "EMA";
  if (name.includes("weighted")) return "WMA";
  if (name.includes("bollinger")) return "BOLLINGER_BANDS";
  if (name.includes("parabolic") || name.includes("sar")) return "PARABOLIC_SAR";
  if (name.includes("ichimoku")) return "ICHIMOKU";
  if (name.includes("donchian")) return "DONCHIAN_CHANNEL";
  if (name.includes("envelope")) return "ENVELOPES";
  if (name.includes("alligator")) return "ALLIGATOR";
  if (name.includes("keltner")) return "KELTNER_CHANNEL";
  if (name.includes("hull")) return "HULL_MA";
  if (name.includes("tema")) return "TEMA";
  if (name.includes("kama")) return "KAMA";
  if (name.includes("price channel")) return "PRICE_CHANNEL";
  if (name.includes("linear regression")) return "LINEAR_REGRESSION";
  if (name.includes("vwap")) return "VWAP";
  if (name.includes("supertrend") || name.includes("super trend")) return "SUPER_TREND";
  if (name.includes("pivot")) return "PIVOT_POINTS";
  if (name.includes("fibonacci")) return "FIBONACCI_LEVELS";
  if (name.includes("zig")) return "ZIG_ZAG";
  if (name.includes("fractal")) return "FRACTALS";
  if (name.includes("awesome")) return "AWESOME_OSCILLATOR";
  if (name === "rsi" || name.includes("relative strength")) return "RSI";
  if (name.includes("macd")) return "MACD";
  if (name.includes("cci")) return "CCI";
  if (name.includes("adx")) return "ADX";
  if (name.includes("atr")) return "ATR";
  if (name.includes("williams")) return "WILLIAMS_R";
  if (name.includes("momentum")) return "MOMENTUM";
  if (name.includes("stochastic")) return "STOCHASTIC_OSCILLATOR";
  if (name.includes("osma")) return "OSMA";
  if (name.includes("accelerator")) return "ACCELERATOR_OSCILLATOR";
  if (name.includes("bull") || name.includes("elder ray")) return "BULLS_POWER";
  if (name.includes("demarker")) return "DEMARKER";
  if (name.includes("rate of change") || name === "roc") return "RATE_OF_CHANGE";
  if (name.includes("volume")) return "VOLUME";
  if (name.includes("standard deviation")) return "STANDARD_DEVIATION";
  if (name.includes("variance")) return "VARIANCE";
  if (name.includes("money flow")) return "MONEY_FLOW_INDEX";
  if (name === "obv" || name.includes("on balance")) return "OBV";
  if (name.includes("trix")) return "TRIX";
  if (name.includes("dpo")) return "DPO";
  if (name.includes("trend strength")) return "TREND_STRENGTH";
  if (name.includes("aroon")) return "AROON";

  return indicator.toUpperCase().replace(/[^A-Z0-9]+/g, "_").replace(/^_|_$/g, "");
}

function uniqueCanonicalIndicators(indicators: string[]) {
  const seen = new Set<string>();
  const output: string[] = [];

  indicators.forEach((indicator) => {
    const canonical = normalizeIndicatorName(indicator);

    if (seen.has(canonical)) return;

    seen.add(canonical);
    output.push(canonical);
  });

  return output;
}

function timeframeToSeconds(timeframe: string) {
  const normalized = timeframe.trim().toUpperCase();
  const value = Number(normalized.slice(1)) || 1;

  if (normalized.startsWith("S")) return value;
  if (normalized.startsWith("M")) return value * 60;
  if (normalized.startsWith("H")) return value * 3600;
  if (normalized.startsWith("D")) return value * 86400;

  return 60;
}

function getVisibleCandleCount(timeframe: string) {
  const seconds = timeframeToSeconds(timeframe);

  if (seconds <= 15) return 96;
  if (seconds <= 30) return 92;
  if (seconds <= 60) return 90;
  if (seconds <= 180) return 86;
  if (seconds <= 300) return 84;
  if (seconds <= 900) return 76;
  if (seconds <= 1800) return 72;
  if (seconds <= 3600) return 68;

  return 60;
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

function sma(values: number[], period: number): Value[] {
  const safePeriod = Math.max(1, Math.round(period));
  let rolling = 0;

  return values.map((value, index) => {
    rolling += value;

    if (index >= safePeriod) {
      rolling -= values[index - safePeriod];
    }

    if (index < safePeriod - 1) return null;

    return rolling / safePeriod;
  });
}

function ema(values: number[], period: number): Value[] {
  if (values.length === 0) return [];

  const safePeriod = Math.max(1, Math.round(period));
  const multiplier = 2 / (safePeriod + 1);
  const output: Value[] = [];
  let previous = values[0];

  values.forEach((value, index) => {
    previous = index === 0 ? value : value * multiplier + previous * (1 - multiplier);
    output.push(previous);
  });

  return output;
}

function wma(values: number[], period: number): Value[] {
  const safePeriod = Math.max(1, Math.round(period));
  const weightTotal = (safePeriod * (safePeriod + 1)) / 2;

  return values.map((_, index) => {
    if (index < safePeriod - 1) return null;

    let total = 0;

    for (let offset = 0; offset < safePeriod; offset += 1) {
      total += values[index - offset] * (safePeriod - offset);
    }

    return total / weightTotal;
  });
}

function standardDeviation(values: number[], period: number): Value[] {
  const safePeriod = Math.max(1, Math.round(period));

  return values.map((_, index) => {
    if (index < safePeriod - 1) return null;

    const slice = values.slice(index - safePeriod + 1, index + 1);
    const average = slice.reduce((sum, value) => sum + value, 0) / safePeriod;
    const variance =
      slice.reduce((sum, value) => sum + (value - average) ** 2, 0) / safePeriod;

    return Math.sqrt(variance);
  });
}

function highest(values: number[], period: number): Value[] {
  const safePeriod = Math.max(1, Math.round(period));

  return values.map((_, index) => {
    if (index < safePeriod - 1) return null;

    return Math.max(...values.slice(index - safePeriod + 1, index + 1));
  });
}

function lowest(values: number[], period: number): Value[] {
  const safePeriod = Math.max(1, Math.round(period));

  return values.map((_, index) => {
    if (index < safePeriod - 1) return null;

    return Math.min(...values.slice(index - safePeriod + 1, index + 1));
  });
}

function trueRange(candles: Candle[]) {
  return candles.map((candle, index) => {
    const previousClose = candles[index - 1]?.close ?? candle.close;

    return Math.max(
      candle.high - candle.low,
      Math.abs(candle.high - previousClose),
      Math.abs(candle.low - previousClose)
    );
  });
}

function atr(candles: Candle[], period: number) {
  return sma(trueRange(candles), period);
}

function rsi(closes: number[], period: number): Value[] {
  const safePeriod = Math.max(1, Math.round(period));

  return closes.map((_, index) => {
    if (index < safePeriod) return null;

    let gains = 0;
    let losses = 0;

    for (let i = index - safePeriod + 1; i <= index; i += 1) {
      const diff = closes[i] - closes[i - 1];

      if (diff >= 0) gains += diff;
      else losses += Math.abs(diff);
    }

    if (losses === 0) return 100;

    const rs = gains / losses;

    return 100 - 100 / (1 + rs);
  });
}

function macd(
  closes: number[],
  fastPeriod: number,
  slowPeriod: number,
  signalPeriod: number
) {
  const fast = ema(closes, fastPeriod);
  const slow = ema(closes, slowPeriod);

  const macdLine = closes.map((_, index) => {
    const fastValue = fast[index];
    const slowValue = slow[index];

    return isFiniteNumber(fastValue) && isFiniteNumber(slowValue)
      ? fastValue - slowValue
      : null;
  });

  const numericMacd = macdLine.map((value) => (isFiniteNumber(value) ? value : 0));
  const signal = sma(numericMacd, signalPeriod);

  const histogram = macdLine.map((value, index) =>
    isFiniteNumber(value) && isFiniteNumber(signal[index])
      ? value - signal[index]!
      : null
  );

  return { macdLine, signal, histogram };
}

function cci(candles: Candle[], period: number): Value[] {
  const typical = candles.map((candle) => (candle.high + candle.low + candle.close) / 3);
  const average = sma(typical, period);
  const safePeriod = Math.max(1, Math.round(period));

  return typical.map((value, index) => {
    if (index < safePeriod - 1 || average[index] === null) return null;

    const slice = typical.slice(index - safePeriod + 1, index + 1);
    const meanDeviation =
      slice.reduce((sum, item) => sum + Math.abs(item - average[index]!), 0) /
      safePeriod;

    if (meanDeviation === 0) return 0;

    return (value - average[index]!) / (0.015 * meanDeviation);
  });
}

function williamsR(candles: Candle[], period: number): Value[] {
  const highs = candles.map((candle) => candle.high);
  const lows = candles.map((candle) => candle.low);
  const high = highest(highs, period);
  const low = lowest(lows, period);

  return candles.map((candle, index) => {
    if (!isFiniteNumber(high[index]) || !isFiniteNumber(low[index])) return null;

    const range = high[index]! - low[index]!;

    if (range === 0) return 0;

    return -100 * ((high[index]! - candle.close) / range);
  });
}

function stochastic(
  candles: Candle[],
  kPeriod: number,
  dPeriod: number,
  slowing: number
) {
  const highs = candles.map((candle) => candle.high);
  const lows = candles.map((candle) => candle.low);
  const high = highest(highs, kPeriod);
  const low = lowest(lows, kPeriod);

  const rawK = candles.map((candle, index) => {
    if (!isFiniteNumber(high[index]) || !isFiniteNumber(low[index])) return null;

    const range = high[index]! - low[index]!;

    if (range === 0) return 50;

    return ((candle.close - low[index]!) / range) * 100;
  });

  const k = sma(
    rawK.map((value) => (isFiniteNumber(value) ? value : 50)),
    slowing
  );

  const d = sma(
    k.map((value) => (isFiniteNumber(value) ? value : 50)),
    dPeriod
  );

  return { k, d };
}

function adx(candles: Candle[], period: number): Value[] {
  const safePeriod = Math.max(1, Math.round(period));
  const tr = trueRange(candles);
  const plusDm: number[] = [0];
  const minusDm: number[] = [0];

  for (let index = 1; index < candles.length; index += 1) {
    const upMove = candles[index].high - candles[index - 1].high;
    const downMove = candles[index - 1].low - candles[index].low;

    plusDm.push(upMove > downMove && upMove > 0 ? upMove : 0);
    minusDm.push(downMove > upMove && downMove > 0 ? downMove : 0);
  }

  const trSma = sma(tr, safePeriod);
  const plusSma = sma(plusDm, safePeriod);
  const minusSma = sma(minusDm, safePeriod);

  const dx = candles.map((_, index) => {
    if (!isFiniteNumber(trSma[index]) || trSma[index] === 0) return null;

    const plusDi = (100 * (plusSma[index] ?? 0)) / trSma[index]!;
    const minusDi = (100 * (minusSma[index] ?? 0)) / trSma[index]!;
    const sum = plusDi + minusDi;

    if (sum === 0) return 0;

    return (100 * Math.abs(plusDi - minusDi)) / sum;
  });

  return sma(
    dx.map((value) => (isFiniteNumber(value) ? value : 0)),
    safePeriod
  );
}

function deMarker(candles: Candle[], period: number): Value[] {
  const deMax: number[] = [0];
  const deMin: number[] = [0];

  for (let index = 1; index < candles.length; index += 1) {
    deMax.push(Math.max(candles[index].high - candles[index - 1].high, 0));
    deMin.push(Math.max(candles[index - 1].low - candles[index].low, 0));
  }

  const maxSma = sma(deMax, period);
  const minSma = sma(deMin, period);

  return candles.map((_, index) => {
    if (!isFiniteNumber(maxSma[index]) || !isFiniteNumber(minSma[index])) {
      return null;
    }

    const denominator = maxSma[index]! + minSma[index]!;

    if (denominator === 0) return 0.5;

    return maxSma[index]! / denominator;
  });
}

function linearRegression(values: number[], period: number): Value[] {
  const safePeriod = Math.max(1, Math.round(period));

  return values.map((_, index) => {
    if (index < safePeriod - 1) return null;

    const slice = values.slice(index - safePeriod + 1, index + 1);
    const n = slice.length;
    const sumX = (n * (n - 1)) / 2;
    const sumY = slice.reduce((sum, value) => sum + value, 0);
    const sumXX = ((n - 1) * n * (2 * n - 1)) / 6;
    const sumXY = slice.reduce((sum, value, i) => sum + i * value, 0);
    const denominator = n * sumXX - sumX * sumX;

    if (denominator === 0) return slice[n - 1];

    const slope = (n * sumXY - sumX * sumY) / denominator;
    const intercept = (sumY - slope * sumX) / n;

    return intercept + slope * (n - 1);
  });
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

function sliceSeries(values: Value[], visibleLength: number) {
  return values.slice(Math.max(0, values.length - visibleLength));
}

function drawLine(
  context: CanvasRenderingContext2D,
  data: Value[],
  color: string,
  indexToX: (index: number) => number,
  valueToY: (value: number) => number,
  width = 1.5
) {
  context.strokeStyle = color;
  context.lineWidth = width;
  context.beginPath();

  let started = false;

  data.forEach((value, index) => {
    if (!isFiniteNumber(value)) return;

    const x = indexToX(index);
    const y = valueToY(value);

    if (!started) {
      context.moveTo(x, y);
      started = true;
    } else {
      context.lineTo(x, y);
    }
  });

  if (started) context.stroke();
}

function drawHistogram(
  context: CanvasRenderingContext2D,
  data: Value[],
  color: string,
  indexToX: (index: number) => number,
  valueToY: (value: number) => number,
  zeroY: number,
  candleGap: number
) {
  context.fillStyle = color;

  data.forEach((value, index) => {
    if (!isFiniteNumber(value)) return;

    const x = indexToX(index);
    const y = valueToY(value);
    const top = Math.min(y, zeroY);
    const height = Math.max(Math.abs(zeroY - y), 1.2);

    context.fillRect(
      x - candleGap * 0.32,
      top,
      Math.max(candleGap * 0.64, 2),
      height
    );
  });
}

function drawDots(
  context: CanvasRenderingContext2D,
  data: Value[],
  color: string,
  indexToX: (index: number) => number,
  valueToY: (value: number) => number
) {
  context.fillStyle = color;

  data.forEach((value, index) => {
    if (!isFiniteNumber(value)) return;

    context.beginPath();
    context.arc(indexToX(index), valueToY(value), 2.4, 0, Math.PI * 2);
    context.fill();
  });
}

function drawTextPill(
  context: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  background: string,
  foreground = "#ffffff"
) {
  context.font = "800 11px Roboto, sans-serif";
  const width = context.measureText(text).width + 14;

  context.fillStyle = background;
  context.beginPath();
  context.roundRect(x, y - 11, width, 22, 7);
  context.fill();

  context.fillStyle = foreground;
  context.textAlign = "left";
  context.textBaseline = "middle";
  context.fillText(text, x + 7, y);
}

function buildOverlaySeries(
  canonical: string,
  settings: IndicatorSettingsMap,
  fullCandles: Candle[],
  visibleLength: number,
  colorIndex: number
): Series[] {
  const closes = fullCandles.map((candle) => candle.close);
  const highs = fullCandles.map((candle) => candle.high);
  const lows = fullCandles.map((candle) => candle.low);
  const color = COLORS[colorIndex % COLORS.length];

  if (canonical === "SMA") {
    return [
      {
        name: "SMA",
        color,
        values: sliceSeries(
          sma(closes, intValue(settings, canonical, "period", 20)),
          visibleLength
        ),
      },
    ];
  }

  if (canonical === "EMA") {
    return [
      {
        name: "EMA",
        color,
        values: sliceSeries(
          ema(closes, intValue(settings, canonical, "period", 20)),
          visibleLength
        ),
      },
    ];
  }

  if (canonical === "WMA") {
    return [
      {
        name: "WMA",
        color,
        values: sliceSeries(
          wma(closes, intValue(settings, canonical, "period", 20)),
          visibleLength
        ),
      },
    ];
  }

  if (canonical === "BOLLINGER_BANDS") {
    const period = intValue(settings, canonical, "period", 20);
    const deviation = valueOr(settings, canonical, "deviation", 2);
    const mid = sma(closes, period);
    const sd = standardDeviation(closes, period);

    const upper = mid.map((value, index) =>
      isFiniteNumber(value) && isFiniteNumber(sd[index])
        ? value + sd[index]! * deviation
        : null
    );

    const lower = mid.map((value, index) =>
      isFiniteNumber(value) && isFiniteNumber(sd[index])
        ? value - sd[index]! * deviation
        : null
    );

    return [
      {
        name: "BB Upper",
        color,
        values: sliceSeries(upper, visibleLength),
        width: 1.2,
      },
      {
        name: "BB Middle",
        color: "#64748b",
        values: sliceSeries(mid, visibleLength),
        width: 1,
      },
      {
        name: "BB Lower",
        color,
        values: sliceSeries(lower, visibleLength),
        width: 1.2,
      },
    ];
  }

  if (canonical === "ENVELOPES") {
    const period = intValue(settings, canonical, "period", 20);
    const deviation = valueOr(settings, canonical, "deviation", 0.1) / 100;
    const mid = sma(closes, period);

    const upper = mid.map((value) =>
      isFiniteNumber(value) ? value * (1 + deviation) : null
    );

    const lower = mid.map((value) =>
      isFiniteNumber(value) ? value * (1 - deviation) : null
    );

    return [
      {
        name: "Envelope Upper",
        color,
        values: sliceSeries(upper, visibleLength),
        width: 1.2,
      },
      {
        name: "Envelope Lower",
        color,
        values: sliceSeries(lower, visibleLength),
        width: 1.2,
      },
    ];
  }

  if (canonical === "DONCHIAN_CHANNEL" || canonical === "PRICE_CHANNEL") {
    const period = intValue(settings, canonical, "period", 20);

    return [
      {
        name: "Channel High",
        color,
        values: sliceSeries(highest(highs, period), visibleLength),
        width: 1.2,
      },
      {
        name: "Channel Low",
        color,
        values: sliceSeries(lowest(lows, period), visibleLength),
        width: 1.2,
      },
    ];
  }

  if (canonical === "KELTNER_CHANNEL") {
    const period = intValue(settings, canonical, "period", 20);
    const multiplier = valueOr(settings, canonical, "multiplier", 2);
    const middle = ema(closes, period);
    const atrValues = atr(fullCandles, period);

    const upper = middle.map((value, index) =>
      isFiniteNumber(value) && isFiniteNumber(atrValues[index])
        ? value + atrValues[index]! * multiplier
        : null
    );

    const lower = middle.map((value, index) =>
      isFiniteNumber(value) && isFiniteNumber(atrValues[index])
        ? value - atrValues[index]! * multiplier
        : null
    );

    return [
      {
        name: "Keltner Upper",
        color,
        values: sliceSeries(upper, visibleLength),
        width: 1.2,
      },
      {
        name: "Keltner Middle",
        color: "#64748b",
        values: sliceSeries(middle, visibleLength),
        width: 1,
      },
      {
        name: "Keltner Lower",
        color,
        values: sliceSeries(lower, visibleLength),
        width: 1.2,
      },
    ];
  }

  if (canonical === "ICHIMOKU") {
    const conversion = intValue(settings, canonical, "conversionPeriod", 9);
    const base = intValue(settings, canonical, "basePeriod", 26);
    const spanB = intValue(settings, canonical, "spanBPeriod", 52);

    const tenkanHigh = highest(highs, conversion);
    const tenkanLow = lowest(lows, conversion);
    const kijunHigh = highest(highs, base);
    const kijunLow = lowest(lows, base);
    const spanBHigh = highest(highs, spanB);
    const spanBLow = lowest(lows, spanB);

    const tenkan = tenkanHigh.map((value, index) =>
      isFiniteNumber(value) && isFiniteNumber(tenkanLow[index])
        ? (value + tenkanLow[index]!) / 2
        : null
    );

    const kijun = kijunHigh.map((value, index) =>
      isFiniteNumber(value) && isFiniteNumber(kijunLow[index])
        ? (value + kijunLow[index]!) / 2
        : null
    );

    const senkouB = spanBHigh.map((value, index) =>
      isFiniteNumber(value) && isFiniteNumber(spanBLow[index])
        ? (value + spanBLow[index]!) / 2
        : null
    );

    return [
      {
        name: "Ichimoku Conversion",
        color,
        values: sliceSeries(tenkan, visibleLength),
        width: 1.2,
      },
      {
        name: "Ichimoku Base",
        color: "#ef4444",
        values: sliceSeries(kijun, visibleLength),
        width: 1.2,
      },
      {
        name: "Ichimoku Span B",
        color: "#64748b",
        values: sliceSeries(senkouB, visibleLength),
        width: 1,
      },
    ];
  }

  if (canonical === "PARABOLIC_SAR") {
    const step = valueOr(settings, canonical, "step", 0.02);
    const maxStep = valueOr(settings, canonical, "maxStep", 0.2);

    const dots = fullCandles.map((candle, index) => {
      const bias = index % 12 < 6 ? -1 : 1;
      const distance =
        (candle.high - candle.low) * (2 + Math.min(step * 25, maxStep * 5));

      return bias < 0 ? candle.low - distance : candle.high + distance;
    });

    return [
      {
        name: "Parabolic SAR",
        color,
        values: sliceSeries(dots, visibleLength),
        mode: "dots",
      },
    ];
  }

  if (canonical === "ALLIGATOR") {
    const jaw = intValue(settings, canonical, "jawPeriod", 13);
    const teeth = intValue(settings, canonical, "teethPeriod", 8);
    const lips = intValue(settings, canonical, "lipsPeriod", 5);

    return [
      {
        name: "Jaw",
        color: "#2563eb",
        values: sliceSeries(sma(closes, jaw), visibleLength),
        width: 1.2,
      },
      {
        name: "Teeth",
        color: "#ef4444",
        values: sliceSeries(sma(closes, teeth), visibleLength),
        width: 1.2,
      },
      {
        name: "Lips",
        color: "#16a34a",
        values: sliceSeries(sma(closes, lips), visibleLength),
        width: 1.2,
      },
    ];
  }

  if (canonical === "HULL_MA") {
    const period = intValue(settings, canonical, "period", 20);

    return [
      {
        name: "Hull MA",
        color,
        values: sliceSeries(
          wma(closes, Math.max(1, Math.round(Math.sqrt(period)))),
          visibleLength
        ),
      },
    ];
  }

  if (canonical === "TEMA") {
    const period = intValue(settings, canonical, "period", 20);
    const e1 = ema(closes, period).map((value) =>
      isFiniteNumber(value) ? value : closes[0]
    );
    const e2 = ema(e1, period).map((value) =>
      isFiniteNumber(value) ? value : closes[0]
    );
    const e3 = ema(e2, period).map((value) =>
      isFiniteNumber(value) ? value : closes[0]
    );

    const temaValues = closes.map((_, index) => 3 * e1[index] - 3 * e2[index] + e3[index]);

    return [
      {
        name: "TEMA",
        color,
        values: sliceSeries(temaValues, visibleLength),
      },
    ];
  }

  if (canonical === "KAMA") {
    const period = intValue(settings, canonical, "period", 20);

    return [
      {
        name: "KAMA",
        color,
        values: sliceSeries(ema(closes, Math.max(1, period)), visibleLength),
      },
    ];
  }

  if (canonical === "VWAP") {
    const period = intValue(settings, canonical, "period", 50);
    const typical = fullCandles.map(
      (candle) => (candle.high + candle.low + candle.close) / 3
    );

    const vwap = typical.map((_, index) => {
      const start = Math.max(0, index - period + 1);
      const slice = typical.slice(start, index + 1);

      return slice.reduce((sum, value) => sum + value, 0) / slice.length;
    });

    return [
      {
        name: "VWAP",
        color,
        values: sliceSeries(vwap, visibleLength),
        width: 1.3,
      },
    ];
  }

  if (canonical === "SUPER_TREND") {
    const period = intValue(settings, canonical, "period", 10);
    const multiplier = valueOr(settings, canonical, "multiplier", 3);
    const atrValues = atr(fullCandles, period);

    const line = fullCandles.map((candle, index) => {
      if (!isFiniteNumber(atrValues[index])) return null;

      return candle.close >= candle.open
        ? candle.low - atrValues[index]! * multiplier
        : candle.high + atrValues[index]! * multiplier;
    });

    return [
      {
        name: "SuperTrend",
        color,
        values: sliceSeries(line, visibleLength),
        width: 1.5,
      },
    ];
  }

  if (canonical === "LINEAR_REGRESSION") {
    const period = intValue(settings, canonical, "period", 20);

    return [
      {
        name: "Linear Regression",
        color,
        values: sliceSeries(linearRegression(closes, period), visibleLength),
        width: 1.4,
      },
    ];
  }

  return [];
}

function buildBottomPanel(
  canonical: string,
  settings: IndicatorSettingsMap,
  fullCandles: Candle[],
  visibleLength: number,
  colorIndex: number
): BottomPanel | null {
  const closes = fullCandles.map((candle) => candle.close);
  const highs = fullCandles.map((candle) => candle.high);
  const median = fullCandles.map((candle) => (candle.high + candle.low) / 2);
  const color = COLORS[colorIndex % COLORS.length];

  if (canonical === "RSI") {
    const values = sliceSeries(
      rsi(closes, intValue(settings, canonical, "period", 14)),
      visibleLength
    );

    return {
      key: canonical,
      title: "RSI",
      min: 0,
      max: 100,
      levels: [30, 70],
      series: [{ name: "RSI", color, values }],
    };
  }

  if (canonical === "MACD") {
    const fast = intValue(settings, canonical, "fastPeriod", 12);
    const slow = intValue(settings, canonical, "slowPeriod", 26);
    const signalPeriod = intValue(settings, canonical, "signalPeriod", 9);
    const output = macd(closes, fast, slow, signalPeriod);

    return {
      key: canonical,
      title: `MACD ${fast}, ${slow}, ${signalPeriod}`,
      series: [
        {
          name: "Histogram",
          color: "#94a3b8",
          values: sliceSeries(output.histogram, visibleLength),
          mode: "histogram",
        },
        {
          name: "MACD",
          color,
          values: sliceSeries(output.macdLine, visibleLength),
        },
        {
          name: "Signal",
          color: "#ef4444",
          values: sliceSeries(output.signal, visibleLength),
        },
      ],
    };
  }

  if (canonical === "STOCHASTIC_OSCILLATOR") {
    const output = stochastic(
      fullCandles,
      intValue(settings, canonical, "kPeriod", 14),
      intValue(settings, canonical, "dPeriod", 3),
      intValue(settings, canonical, "slowing", 3)
    );

    return {
      key: canonical,
      title: "Stochastic Oscillator",
      min: 0,
      max: 100,
      levels: [20, 80],
      series: [
        {
          name: "%K",
          color,
          values: sliceSeries(output.k, visibleLength),
        },
        {
          name: "%D",
          color: "#ef4444",
          values: sliceSeries(output.d, visibleLength),
        },
      ],
    };
  }

  if (canonical === "CCI") {
    return {
      key: canonical,
      title: "CCI",
      levels: [-100, 100],
      series: [
        {
          name: "CCI",
          color,
          values: sliceSeries(
            cci(fullCandles, intValue(settings, canonical, "period", 20)),
            visibleLength
          ),
        },
      ],
    };
  }

  if (canonical === "ADX") {
    return {
      key: canonical,
      title: "ADX",
      min: 0,
      max: 100,
      levels: [20, 50],
      series: [
        {
          name: "ADX",
          color,
          values: sliceSeries(
            adx(fullCandles, intValue(settings, canonical, "period", 14)),
            visibleLength
          ),
        },
      ],
    };
  }

  if (canonical === "ATR") {
    return {
      key: canonical,
      title: "ATR",
      series: [
        {
          name: "ATR",
          color,
          values: sliceSeries(
            atr(fullCandles, intValue(settings, canonical, "period", 14)),
            visibleLength
          ),
        },
      ],
    };
  }

  if (canonical === "WILLIAMS_R") {
    return {
      key: canonical,
      title: "Williams %R",
      min: -100,
      max: 0,
      levels: [-80, -20],
      series: [
        {
          name: "Williams %R",
          color,
          values: sliceSeries(
            williamsR(fullCandles, intValue(settings, canonical, "period", 14)),
            visibleLength
          ),
        },
      ],
    };
  }

  if (canonical === "MOMENTUM") {
    const period = intValue(settings, canonical, "period", 10);

    const values = closes.map((value, index) =>
      index < period ? null : value - closes[index - period]
    );

    return {
      key: canonical,
      title: "Momentum",
      levels: [0],
      series: [
        {
          name: "Momentum",
          color,
          values: sliceSeries(values, visibleLength),
        },
      ],
    };
  }

  if (canonical === "RATE_OF_CHANGE") {
    const period = intValue(settings, canonical, "period", 12);

    const values = closes.map((value, index) =>
      index < period || closes[index - period] === 0
        ? null
        : ((value - closes[index - period]) / closes[index - period]) * 100
    );

    return {
      key: canonical,
      title: "Rate of Change",
      levels: [0],
      series: [
        {
          name: "ROC",
          color,
          values: sliceSeries(values, visibleLength),
        },
      ],
    };
  }

  if (canonical === "DEMARKER") {
    return {
      key: canonical,
      title: "DeMarker",
      min: 0,
      max: 1,
      levels: [0.3, 0.7],
      series: [
        {
          name: "DeMarker",
          color,
          values: sliceSeries(
            deMarker(fullCandles, intValue(settings, canonical, "period", 14)),
            visibleLength
          ),
        },
      ],
    };
  }

  if (canonical === "AWESOME_OSCILLATOR") {
    const fast = intValue(settings, canonical, "fastPeriod", 5);
    const slow = intValue(settings, canonical, "slowPeriod", 34);
    const fastSma = sma(median, fast);
    const slowSma = sma(median, slow);

    const values = median.map((_, index) =>
      isFiniteNumber(fastSma[index]) && isFiniteNumber(slowSma[index])
        ? fastSma[index]! - slowSma[index]!
        : null
    );

    return {
      key: canonical,
      title: `Awesome Oscillator ${fast}, ${slow}`,
      levels: [0],
      series: [
        {
          name: "AO",
          color,
          values: sliceSeries(values, visibleLength),
          mode: "histogram",
        },
      ],
    };
  }

  if (canonical === "OSMA") {
    const output = macd(
      closes,
      intValue(settings, canonical, "fastPeriod", 12),
      intValue(settings, canonical, "slowPeriod", 26),
      intValue(settings, canonical, "signalPeriod", 9)
    );

    return {
      key: canonical,
      title: "OsMA",
      levels: [0],
      series: [
        {
          name: "OsMA",
          color,
          values: sliceSeries(output.histogram, visibleLength),
          mode: "histogram",
        },
      ],
    };
  }

  if (canonical === "ACCELERATOR_OSCILLATOR") {
    const fast = intValue(settings, canonical, "fastPeriod", 5);
    const slow = intValue(settings, canonical, "slowPeriod", 34);
    const signal = intValue(settings, canonical, "signalPeriod", 5);
    const fastSma = sma(median, fast);
    const slowSma = sma(median, slow);

    const ao = median.map((_, index) =>
      isFiniteNumber(fastSma[index]) && isFiniteNumber(slowSma[index])
        ? fastSma[index]! - slowSma[index]!
        : null
    );

    const signalLine = sma(
      ao.map((value) => (isFiniteNumber(value) ? value : 0)),
      signal
    );

    const values = ao.map((value, index) =>
      isFiniteNumber(value) && isFiniteNumber(signalLine[index])
        ? value - signalLine[index]!
        : null
    );

    return {
      key: canonical,
      title: "Accelerator Oscillator",
      levels: [0],
      series: [
        {
          name: "AC",
          color,
          values: sliceSeries(values, visibleLength),
          mode: "histogram",
        },
      ],
    };
  }

  if (canonical === "BULLS_POWER") {
    const period = intValue(settings, canonical, "period", 13);
    const emaValues = ema(closes, period);

    const bulls = highs.map((high, index) =>
      isFiniteNumber(emaValues[index]) ? high - emaValues[index]! : null
    );

    return {
      key: canonical,
      title: "Bulls Power",
      levels: [0],
      series: [
        {
          name: "Bulls",
          color,
          values: sliceSeries(bulls, visibleLength),
          mode: "histogram",
        },
      ],
    };
  }

  if (canonical === "STANDARD_DEVIATION") {
    const values = standardDeviation(closes, 20);

    return {
      key: canonical,
      title: "Standard Deviation",
      series: [
        {
          name: "Std Dev",
          color,
          values: sliceSeries(values, visibleLength),
        },
      ],
    };
  }

  if (canonical === "VARIANCE") {
    const values = standardDeviation(closes, 20).map((value) =>
      isFiniteNumber(value) ? value * value : null
    );

    return {
      key: canonical,
      title: "Variance",
      series: [
        {
          name: "Variance",
          color,
          values: sliceSeries(values, visibleLength),
        },
      ],
    };
  }

  if (canonical === "VOLUME") {
    const pseudoVolume = fullCandles.map((candle) =>
      Math.max(
        1,
        Math.abs(candle.close - candle.open) + (candle.high - candle.low)
      )
    );

    return {
      key: canonical,
      title: "Volume",
      min: 0,
      series: [
        {
          name: "Volume",
          color,
          values: sliceSeries(pseudoVolume, visibleLength),
          mode: "histogram",
        },
      ],
    };
  }

  if (canonical === "TREND_STRENGTH") {
    return {
      key: canonical,
      title: "Trend Strength",
      min: 0,
      max: 100,
      levels: [50],
      series: [
        {
          name: "Trend",
          color,
          values: sliceSeries(adx(fullCandles, 14), visibleLength),
        },
      ],
    };
  }

  return null;
}

function collectFiniteValues(series: Series[]) {
  return series.flatMap((item) => item.values.filter(isFiniteNumber));
}

function drawCandles(
  context: CanvasRenderingContext2D,
  renderCandles: Candle[],
  chartType: ChartType,
  indexToX: (index: number) => number,
  priceToY: (price: number) => number,
  candleWidth: number
) {
  if (chartType === "Line") {
    drawLine(
      context,
      renderCandles.map((candle) => candle.close),
      "#2563eb",
      indexToX,
      priceToY,
      2
    );

    return;
  }

  renderCandles.forEach((candle, index) => {
    const x = indexToX(index);
    const openY = priceToY(candle.open);
    const closeY = priceToY(candle.close);
    const highY = priceToY(candle.high);
    const lowY = priceToY(candle.low);
    const bullish = candle.close >= candle.open;
    const color = bullish ? "#22c55e" : "#ef4444";

    context.strokeStyle = color;
    context.fillStyle = color;
    context.lineWidth = 1.2;

    context.beginPath();
    context.moveTo(x, highY);
    context.lineTo(x, lowY);
    context.stroke();

    if (chartType === "Bars") {
      context.beginPath();
      context.moveTo(x - candleWidth * 0.45, openY);
      context.lineTo(x, openY);
      context.moveTo(x, closeY);
      context.lineTo(x + candleWidth * 0.45, closeY);
      context.stroke();
      return;
    }

    const bodyTop = Math.min(openY, closeY);
    const bodyHeight = Math.max(Math.abs(closeY - openY), 1.4);

    context.fillRect(x - candleWidth / 2, bodyTop, candleWidth, bodyHeight);
  });
}

function priceRangeFromCandles(candles: Candle[], extras: number[]) {
  const values = candles.flatMap((candle) => [
    candle.open,
    candle.high,
    candle.low,
    candle.close,
    ...extras,
  ]);

  let min = Math.min(...values);
  let max = Math.max(...values);

  if (!Number.isFinite(min) || !Number.isFinite(max) || min === max) {
    min = 0;
    max = 1;
  }

  const padding = Math.max(
    (max - min) * 0.2,
    Math.abs(max) * 0.00025,
    0.00001
  );

  return {
    min: min - padding,
    max: max + padding,
  };
}

function drawGrid(
  context: CanvasRenderingContext2D,
  left: number,
  right: number,
  top: number,
  bottom: number,
  columns: number,
  rows: number
) {
  context.strokeStyle = "#edf1f6";
  context.lineWidth = 1;

  for (let i = 0; i <= columns; i += 1) {
    const x = left + ((right - left) / columns) * i;

    context.beginPath();
    context.moveTo(x, top);
    context.lineTo(x, bottom);
    context.stroke();
  }

  for (let i = 0; i <= rows; i += 1) {
    const y = top + ((bottom - top) / rows) * i;

    context.beginPath();
    context.moveTo(left, y);
    context.lineTo(right, y);
    context.stroke();
  }
}

function drawBottomPanel(
  context: CanvasRenderingContext2D,
  panel: BottomPanel,
  panelIndex: number,
  visibleLength: number,
  left: number,
  right: number,
  top: number,
  bottom: number,
  candleGap: number
) {
  context.fillStyle = panelIndex % 2 === 0 ? "#fbfdff" : "#f8fbff";
  context.fillRect(left, top, right - left, bottom - top);

  context.strokeStyle = "#dbe4f0";
  context.lineWidth = 1;
  context.beginPath();
  context.moveTo(left, top);
  context.lineTo(right, top);
  context.stroke();

  context.fillStyle = "#475467";
  context.font = "800 11px Roboto, sans-serif";
  context.textAlign = "left";
  context.textBaseline = "top";
  context.fillText(panel.title, left + 8, top + 5);

  const values = collectFiniteValues(panel.series);

  let min = panel.min ?? Math.min(...values, ...(panel.levels ?? []), 0);
  let max = panel.max ?? Math.max(...values, ...(panel.levels ?? []), 0);

  if (!Number.isFinite(min) || !Number.isFinite(max) || min === max) {
    min = -1;
    max = 1;
  }

  const padding = (max - min) * 0.14;

  min -= padding;
  max += padding;

  const valueToY = (value: number) =>
    bottom - ((value - min) / (max - min)) * (bottom - top - 16) - 8;

  const indexToX = (index: number) =>
    left + (index / Math.max(visibleLength - 1, 1)) * (right - left);

  context.strokeStyle = "#eef2f7";
  context.lineWidth = 1;

  for (let i = 1; i < 3; i += 1) {
    const y = top + ((bottom - top) / 3) * i;

    context.beginPath();
    context.moveTo(left, y);
    context.lineTo(right, y);
    context.stroke();
  }

  if (panel.levels) {
    context.setLineDash([5, 5]);
    context.strokeStyle = "#cbd5e1";

    panel.levels.forEach((level) => {
      const y = valueToY(level);

      context.beginPath();
      context.moveTo(left, y);
      context.lineTo(right, y);
      context.stroke();
    });

    context.setLineDash([]);
  }

  const zeroY = clamp(valueToY(0), top + 6, bottom - 6);

  panel.series.forEach((series) => {
    if (series.mode === "histogram") {
      drawHistogram(
        context,
        series.values,
        series.color,
        indexToX,
        valueToY,
        zeroY,
        candleGap
      );

      return;
    }

    if (series.mode === "dots") {
      drawDots(context, series.values, series.color, indexToX, valueToY);
      return;
    }

    drawLine(
      context,
      series.values,
      series.color,
      indexToX,
      valueToY,
      series.width ?? 1.35
    );
  });
}

function TradingChartComponent({
  asset,
  candles,
  chartType,
  timeframe,
  expirySeconds,
  nowMs,
  selectedIndicators,
  indicatorSettings = DEFAULT_INDICATOR_SETTINGS,
  activeTrades,
  resultMarkers,
}: TradingChartProps) {
  const canvasRef = React.useRef<HTMLCanvasElement | null>(null);

  React.useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");

    if (!canvas || !context) return;

    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;

    canvas.width = Math.max(1, Math.floor(rect.width * dpr));
    canvas.height = Math.max(1, Math.floor(rect.height * dpr));

    context.setTransform(dpr, 0, 0, dpr, 0, 0);

    const width = rect.width;
    const height = rect.height;

    context.clearRect(0, 0, width, height);
    context.fillStyle = "#ffffff";
    context.fillRect(0, 0, width, height);

    if (candles.length < 2) {
      context.fillStyle = "#667085";
      context.font = "800 14px Roboto, sans-serif";
      context.textAlign = "center";
      context.textBaseline = "middle";
      context.fillText("Loading backend OTC candles...", width / 2, height / 2);
      return;
    }

    const normalizedIndicators = uniqueCanonicalIndicators(selectedIndicators);
    const fullCandles = candles.slice(-MAX_HISTORY_CANDLES);
    const visibleLength = Math.min(getVisibleCandleCount(timeframe), fullCandles.length);
    const visibleCandlesRaw = fullCandles.slice(-visibleLength);
    const renderCandles =
      chartType === "Heiken Ashi" ? heikenAshi(visibleCandlesRaw) : visibleCandlesRaw;

    const bottomPanels = normalizedIndicators
      .filter((indicator) => BOTTOM_INDICATORS.has(indicator))
      .map((indicator, index) =>
        buildBottomPanel(indicator, indicatorSettings, fullCandles, visibleLength, index)
      )
      .filter((panel): panel is BottomPanel => panel !== null);

    const overlaySeries = normalizedIndicators.flatMap((indicator, index) =>
      BOTTOM_INDICATORS.has(indicator)
        ? []
        : buildOverlaySeries(
            indicator,
            indicatorSettings,
            fullCandles,
            visibleLength,
            index
          )
    );

    const left = 18;
    const rightSpace = 84;
    const right = width - rightSpace;
    const top = 54;
    const footer = 36;
    const availableHeight = height - top - footer;
    const bottomPanelCount = bottomPanels.length;
    const bottomPanelHeight =
      bottomPanelCount > 0 ? clamp(availableHeight * 0.13, 58, 92) : 0;
    const bottomAreaHeight = Math.min(
      bottomPanelCount * bottomPanelHeight,
      availableHeight * 0.52
    );
    const chartBottom = height - footer - bottomAreaHeight;
    const chartHeight = Math.max(chartBottom - top, 170);
    const chartWidth = right - left;
    const candleGap = chartWidth / Math.max(visibleLength - 1, 1);
    const candleWidth = clamp(candleGap * 0.62, 2.5, 9);

    const overlayValues = collectFiniteValues(overlaySeries);

    const markerValues = [
      ...activeTrades.map((trade) => trade.entryPrice),
      ...resultMarkers.map((marker) => marker.price),
      ...overlayValues,
    ].filter(isFiniteNumber);

    const { min, max } = priceRangeFromCandles(renderCandles, markerValues);

    const priceToY = (price: number) =>
      top + ((max - price) / (max - min)) * chartHeight;

    const indexToX = (index: number) =>
      left + (index / Math.max(visibleLength - 1, 1)) * chartWidth;

    drawGrid(context, left, right, top, chartBottom, 8, 6);

    context.fillStyle = "rgba(226, 232, 240, 0.42)";
    context.beginPath();
    context.moveTo(left, chartBottom);
    context.lineTo(width * 0.2, top + chartHeight * 0.44);
    context.lineTo(width * 0.34, chartBottom);
    context.lineTo(width * 0.55, top + chartHeight * 0.24);
    context.lineTo(width * 0.72, chartBottom);
    context.lineTo(right, top + chartHeight * 0.46);
    context.lineTo(right, chartBottom);
    context.closePath();
    context.fill();

    drawCandles(context, renderCandles, chartType, indexToX, priceToY, candleWidth);

    overlaySeries.forEach((series) => {
      if (series.mode === "dots") {
        drawDots(context, series.values, series.color, indexToX, priceToY);
        return;
      }

      drawLine(
        context,
        series.values,
        series.color,
        indexToX,
        priceToY,
        series.width ?? 1.35
      );
    });

    const latest = renderCandles[renderCandles.length - 1];
    const latestY = priceToY(latest.close);

    context.strokeStyle = latest.close >= latest.open ? "#22c55e" : "#ef4444";
    context.lineWidth = 1.2;
    context.setLineDash([5, 5]);
    context.beginPath();
    context.moveTo(left, latestY);
    context.lineTo(right + 6, latestY);
    context.stroke();
    context.setLineDash([]);

    drawTextPill(
      context,
      latest.close.toFixed(asset.precision),
      right + 8,
      latestY,
      latest.close >= latest.open ? "#16a34a" : "#dc2626"
    );

    const remaining = Math.max(
      0,
      Math.round((nowMs + expirySeconds * 1000 - Date.now()) / 1000)
    );

    context.strokeStyle = "#1677ff";
    context.lineWidth = 1.5;
    context.setLineDash([6, 5]);
    context.beginPath();
    context.moveTo(right - 8, top);
    context.lineTo(right - 8, chartBottom);
    context.stroke();
    context.setLineDash([]);

    drawTextPill(context, formatDuration(remaining), right - 86, top + 16, "#1677ff");

    activeTrades.forEach((trade) => {
      const y = priceToY(trade.entryPrice);
      const color = trade.side === "BUY" ? "#16a34a" : "#dc2626";

      context.strokeStyle = color;
      context.lineWidth = 1.2;
      context.setLineDash([4, 4]);
      context.beginPath();
      context.moveTo(left, y);
      context.lineTo(right, y);
      context.stroke();
      context.setLineDash([]);

      drawTextPill(context, trade.label, left + 8, y, color);
    });

    resultMarkers.forEach((marker) => {
      const y = priceToY(marker.price);
      const color = marker.won ? "#16a34a" : "#dc2626";

      context.strokeStyle = color;
      context.lineWidth = 1;
      context.beginPath();
      context.moveTo(right - 60, y);
      context.lineTo(right, y);
      context.stroke();

      drawTextPill(context, marker.label, right - 112, y, color);
    });

    context.fillStyle = "#101828";
    context.font = "900 12px Roboto, sans-serif";
    context.textAlign = "left";
    context.textBaseline = "top";
    context.fillText(`${asset.symbol} • ${timeframe} • ${chartType}`, left, 13);

    context.font = "800 11px Roboto, sans-serif";

    overlaySeries.slice(0, 6).forEach((series, index) => {
      context.fillStyle = series.color;
      context.fillText(series.name, left + 190 + index * 92, 13);
    });

    context.fillStyle = "#64748b";
    context.font = "800 11px Roboto, sans-serif";
    context.textAlign = "right";
    context.textBaseline = "middle";

    for (let i = 0; i <= 6; i += 1) {
      const price = max - ((max - min) / 6) * i;
      const y = top + (chartHeight / 6) * i;

      context.fillText(price.toFixed(asset.precision), width - 10, y);
    }

    bottomPanels.forEach((panel, index) => {
      const panelTop = chartBottom + index * bottomPanelHeight;
      const panelBottom = Math.min(panelTop + bottomPanelHeight, height - footer);

      if (panelBottom - panelTop < 32) return;

      drawBottomPanel(
        context,
        panel,
        index,
        visibleLength,
        left,
        right,
        panelTop,
        panelBottom,
        candleGap
      );
    });
  }, [
    activeTrades,
    asset,
    candles,
    chartType,
    expirySeconds,
    indicatorSettings,
    nowMs,
    resultMarkers,
    selectedIndicators,
    timeframe,
  ]);

  return (
    <div className="nt-chart-canvas-wrap">
      <canvas ref={canvasRef} className="nt-chart-canvas" />
    </div>
  );
}

const TradingChart = React.memo(TradingChartComponent, (previous, next) => {
  return (
    previous.asset.symbol === next.asset.symbol &&
    previous.chartType === next.chartType &&
    previous.timeframe === next.timeframe &&
    previous.expirySeconds === next.expirySeconds &&
    previous.nowMs === next.nowMs &&
    previous.candles === next.candles &&
    previous.selectedIndicators === next.selectedIndicators &&
    previous.indicatorSettings === next.indicatorSettings &&
    previous.activeTrades === next.activeTrades &&
    previous.resultMarkers === next.resultMarkers
  );
});

export default TradingChart;