import React from "react";
import type {
  Asset,
  Candle,
  ChartType,
  ResultMarker,
  TradeMarker,
} from "./trading.types";
import {
  DEFAULT_INDICATOR_SETTINGS,
  DEFAULT_INDICATOR_STYLES,
  type IndicatorSettingsMap,
  type IndicatorStylesMap,
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
  indicatorStyles?: IndicatorStylesMap;
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
  positiveColor?: string;
  negativeColor?: string;
  visible?: boolean;
};

type BottomPanel = {
  key: string;
  title: string;
  series: Series[];
  levels?: number[];
  levelColor?: string;
  min?: number;
  max?: number;
};

const MAX_HISTORY_CANDLES = 520;

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
]);

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function isFiniteNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function numSetting(
  settings: IndicatorSettingsMap,
  indicator: string,
  key: string,
  fallback: number,
) {
  const value =
    settings[indicator]?.[key] ??
    DEFAULT_INDICATOR_SETTINGS[indicator]?.[key] ??
    fallback;

  return Number.isFinite(value) ? Number(value) : fallback;
}

function intSetting(
  settings: IndicatorSettingsMap,
  indicator: string,
  key: string,
  fallback: number,
) {
  return Math.max(1, Math.round(numSetting(settings, indicator, key, fallback)));
}

function styleColor(
  styles: IndicatorStylesMap,
  indicator: string,
  key: string,
  fallback: string,
) {
  const value =
    styles[indicator]?.[key] ??
    DEFAULT_INDICATOR_STYLES[indicator]?.[key] ??
    fallback;

  return typeof value === "string" ? value : fallback;
}

function styleNumber(
  styles: IndicatorStylesMap,
  indicator: string,
  key: string,
  fallback: number,
) {
  const value =
    styles[indicator]?.[key] ??
    DEFAULT_INDICATOR_STYLES[indicator]?.[key] ??
    fallback;

  return Number.isFinite(Number(value)) ? Number(value) : fallback;
}

function styleBool(
  styles: IndicatorStylesMap,
  indicator: string,
  key: string,
  fallback: boolean,
) {
  const value =
    styles[indicator]?.[key] ??
    DEFAULT_INDICATOR_STYLES[indicator]?.[key] ??
    fallback;

  return Boolean(value);
}

function normalizeIndicatorName(indicator: string) {
  const name = indicator.trim().toLowerCase();

  if (name === "moving average" || name === "ma" || name === "simple ma") return "SMA";
  if (name.includes("exponential")) return "EMA";
  if (name.includes("weighted")) return "WMA";
  if (name.includes("alligator")) return "ALLIGATOR";
  if (name.includes("bollinger")) return "BOLLINGER_BANDS";
  if (name.includes("parabolic") || name.includes("sar")) return "PARABOLIC_SAR";
  if (name.includes("ichimoku")) return "ICHIMOKU";
  if (name.includes("donchian")) return "DONCHIAN_CHANNEL";
  if (name.includes("envelope")) return "ENVELOPES";
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
  if (name.includes("bull")) return "BULLS_POWER";
  if (name.includes("demarker")) return "DEMARKER";
  if (name.includes("rate of change") || name === "roc") return "RATE_OF_CHANGE";

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

  if (seconds <= 15) return 104;
  if (seconds <= 30) return 100;
  if (seconds <= 60) return 96;
  if (seconds <= 180) return 90;
  if (seconds <= 300) return 86;
  if (seconds <= 900) return 80;
  if (seconds <= 1800) return 74;
  if (seconds <= 3600) return 68;

  return 60;
}

function formatDuration(totalSeconds: number) {
  const safe = Math.max(0, totalSeconds);
  const hours = Math.floor(safe / 3600);
  const minutes = Math.floor((safe % 3600) / 60);
  const seconds = safe % 60;

  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
    2,
    "0",
  )}:${String(seconds).padStart(2, "0")}`;
}

function sma(values: number[], period: number): Value[] {
  const safePeriod = Math.max(1, Math.round(period));
  let rolling = 0;

  return values.map((value, index) => {
    rolling += value;

    if (index >= safePeriod) rolling -= values[index - safePeriod];

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

function trueRange(candles: Candle[]) {
  return candles.map((candle, index) => {
    const previousClose = candles[index - 1]?.close ?? candle.close;

    return Math.max(
      candle.high - candle.low,
      Math.abs(candle.high - previousClose),
      Math.abs(candle.low - previousClose),
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
      const difference = closes[i] - closes[i - 1];

      if (difference >= 0) gains += difference;
      else losses += Math.abs(difference);
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
  signalPeriod: number,
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
      : null,
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

function stochastic(candles: Candle[], kPeriod: number, dPeriod: number, slowing: number) {
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

  const k = sma(rawK.map((value) => (isFiniteNumber(value) ? value : 50)), slowing);
  const d = sma(k.map((value) => (isFiniteNumber(value) ? value : 50)), dPeriod);

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

  return sma(dx.map((value) => (isFiniteNumber(value) ? value : 0)), safePeriod);
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
    if (!isFiniteNumber(maxSma[index]) || !isFiniteNumber(minSma[index])) return null;

    const denominator = maxSma[index]! + minSma[index]!;
    if (denominator === 0) return 0.5;

    return maxSma[index]! / denominator;
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

    output.push({ ...candle, open, high, low, close });
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
  width = 1.5,
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
  series: Series,
  indexToX: (index: number) => number,
  valueToY: (value: number) => number,
  zeroY: number,
  candleGap: number,
) {
  data.forEach((value, index) => {
    if (!isFiniteNumber(value)) return;

    const x = indexToX(index);
    const y = valueToY(value);
    const top = Math.min(y, zeroY);
    const height = Math.max(Math.abs(zeroY - y), 1.2);

    context.fillStyle =
      value >= 0
        ? series.positiveColor ?? series.color
        : series.negativeColor ?? series.color;

    context.fillRect(
      x - candleGap * 0.32,
      top,
      Math.max(candleGap * 0.64, 2),
      height,
    );
  });
}

function drawDots(
  context: CanvasRenderingContext2D,
  data: Value[],
  color: string,
  indexToX: (index: number) => number,
  valueToY: (value: number) => number,
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
  foreground = "#ffffff",
) {
  context.font = "800 11px Roboto, sans-serif";
  const pillWidth = context.measureText(text).width + 14;

  context.fillStyle = background;
  context.beginPath();
  context.roundRect(x, y - 11, pillWidth, 22, 7);
  context.fill();

  context.fillStyle = foreground;
  context.textAlign = "left";
  context.textBaseline = "middle";
  context.fillText(text, x + 7, y);
}

function collectFiniteValues(series: Series[]) {
  return series.flatMap((item) => item.values.filter(isFiniteNumber));
}

function buildOverlaySeries(
  canonical: string,
  settings: IndicatorSettingsMap,
  styles: IndicatorStylesMap,
  fullCandles: Candle[],
  visibleLength: number,
): Series[] {
  const closes = fullCandles.map((candle) => candle.close);
  const highs = fullCandles.map((candle) => candle.high);
  const lows = fullCandles.map((candle) => candle.low);

  if (canonical === "SMA") {
    return [
      {
        name: "SMA",
        color: styleColor(styles, canonical, "lineColor", "#22c55e"),
        width: styleNumber(styles, canonical, "lineWidth", 1.5),
        values: sliceSeries(sma(closes, intSetting(settings, canonical, "period", 20)), visibleLength),
      },
    ];
  }

  if (canonical === "EMA") {
    return [
      {
        name: "EMA",
        color: styleColor(styles, canonical, "lineColor", "#f97316"),
        width: styleNumber(styles, canonical, "lineWidth", 1.5),
        values: sliceSeries(ema(closes, intSetting(settings, canonical, "period", 20)), visibleLength),
      },
    ];
  }

  if (canonical === "WMA") {
    return [
      {
        name: "WMA",
        color: styleColor(styles, canonical, "lineColor", "#2563eb"),
        width: styleNumber(styles, canonical, "lineWidth", 1.5),
        values: sliceSeries(wma(closes, intSetting(settings, canonical, "period", 20)), visibleLength),
      },
    ];
  }

  if (canonical === "ALLIGATOR") {
    const jaw = intSetting(settings, canonical, "jawPeriod", 13);
    const teeth = intSetting(settings, canonical, "teethPeriod", 8);
    const lips = intSetting(settings, canonical, "lipsPeriod", 5);
    const width = styleNumber(styles, canonical, "lineWidth", 1.5);

    return [
      {
        name: `Alligator Jaw ${jaw}`,
        color: styleColor(styles, canonical, "jawColor", "#3b82f6"),
        width,
        values: sliceSeries(sma(closes, jaw), visibleLength),
      },
      {
        name: `Alligator Teeth ${teeth}`,
        color: styleColor(styles, canonical, "teethColor", "#ef4444"),
        width,
        values: sliceSeries(sma(closes, teeth), visibleLength),
      },
      {
        name: `Alligator Lips ${lips}`,
        color: styleColor(styles, canonical, "lipsColor", "#a3e635"),
        width,
        values: sliceSeries(sma(closes, lips), visibleLength),
      },
    ];
  }

  if (canonical === "BOLLINGER_BANDS") {
    const period = intSetting(settings, canonical, "period", 20);
    const deviation = numSetting(settings, canonical, "deviation", 2);
    const mid = sma(closes, period);
    const sd = standardDeviation(closes, period);

    const upper = mid.map((value, index) =>
      isFiniteNumber(value) && isFiniteNumber(sd[index])
        ? value + sd[index]! * deviation
        : null,
    );

    const lower = mid.map((value, index) =>
      isFiniteNumber(value) && isFiniteNumber(sd[index])
        ? value - sd[index]! * deviation
        : null,
    );

    return [
      { name: "BB Upper", color: "#2563eb", width: 1.2, values: sliceSeries(upper, visibleLength) },
      { name: "BB Middle", color: "#64748b", width: 1, values: sliceSeries(mid, visibleLength) },
      { name: "BB Lower", color: "#2563eb", width: 1.2, values: sliceSeries(lower, visibleLength) },
    ];
  }

  if (canonical === "DONCHIAN_CHANNEL") {
    const period = intSetting(settings, canonical, "period", 20);

    return [
      {
        name: "Donchian High",
        color: "#38bdf8",
        width: 1.2,
        values: sliceSeries(highest(highs, period), visibleLength),
      },
      {
        name: "Donchian Low",
        color: "#38bdf8",
        width: 1.2,
        values: sliceSeries(lowest(lows, period), visibleLength),
      },
    ];
  }

  if (canonical === "ENVELOPES") {
    const period = intSetting(settings, canonical, "period", 20);
    const deviation = numSetting(settings, canonical, "deviation", 0.1) / 100;
    const mid = sma(closes, period);

    return [
      {
        name: "Envelope Upper",
        color: "#9333ea",
        width: 1.2,
        values: sliceSeries(
          mid.map((value) => (isFiniteNumber(value) ? value * (1 + deviation) : null)),
          visibleLength,
        ),
      },
      {
        name: "Envelope Lower",
        color: "#9333ea",
        width: 1.2,
        values: sliceSeries(
          mid.map((value) => (isFiniteNumber(value) ? value * (1 - deviation) : null)),
          visibleLength,
        ),
      },
    ];
  }

  return [];
}

function buildBottomPanel(
  canonical: string,
  settings: IndicatorSettingsMap,
  styles: IndicatorStylesMap,
  fullCandles: Candle[],
  visibleLength: number,
): BottomPanel | null {
  const closes = fullCandles.map((candle) => candle.close);
  const highs = fullCandles.map((candle) => candle.high);
  const median = fullCandles.map((candle) => (candle.high + candle.low) / 2);

  if (canonical === "RSI") {
    const period = intSetting(settings, canonical, "period", 14);

    return {
      key: canonical,
      title: `RSI ${period}`,
      min: 0,
      max: 100,
      levels: [30, 70],
      levelColor: styleColor(styles, canonical, "upperLevelColor", "#38bdf8"),
      series: [
        {
          name: "RSI",
          color: styleColor(styles, canonical, "lineColor", "#d7d36a"),
          width: styleNumber(styles, canonical, "lineWidth", 1.4),
          values: sliceSeries(rsi(closes, period), visibleLength),
        },
      ],
    };
  }

  if (canonical === "MACD") {
    const fast = intSetting(settings, canonical, "fastPeriod", 12);
    const slow = intSetting(settings, canonical, "slowPeriod", 26);
    const signalPeriod = intSetting(settings, canonical, "signalPeriod", 9);
    const output = macd(closes, fast, slow, signalPeriod);

    const series: Series[] = [];

    if (styleBool(styles, canonical, "showHistogram", true)) {
      series.push({
        name: "Histogram",
        color: "#94a3b8",
        mode: "histogram",
        positiveColor: styleColor(styles, canonical, "histogramUpColor", "#b6e34b"),
        negativeColor: styleColor(styles, canonical, "histogramDownColor", "#ef4444"),
        values: sliceSeries(output.histogram, visibleLength),
      });
    }

    if (styleBool(styles, canonical, "showMacdLine", true)) {
      series.push({
        name: "MACD",
        color: styleColor(styles, canonical, "macdLineColor", "#b6e34b"),
        width: styleNumber(styles, canonical, "macdLineWidth", 1.3),
        values: sliceSeries(output.macdLine, visibleLength),
      });
    }

    if (styleBool(styles, canonical, "showSignalLine", true)) {
      series.push({
        name: "Signal",
        color: styleColor(styles, canonical, "signalLineColor", "#ef4444"),
        width: styleNumber(styles, canonical, "signalLineWidth", 1.3),
        values: sliceSeries(output.signal, visibleLength),
      });
    }

    return {
      key: canonical,
      title: `MACD ${fast} ${slow} ${signalPeriod}`,
      levels: [0],
      series,
    };
  }

  if (canonical === "OSMA") {
    const fast = intSetting(settings, canonical, "fastPeriod", 12);
    const slow = intSetting(settings, canonical, "slowPeriod", 26);
    const signalPeriod = intSetting(settings, canonical, "signalPeriod", 9);
    const output = macd(closes, fast, slow, signalPeriod);

    return {
      key: canonical,
      title: `OsMA ${fast} ${slow} ${signalPeriod}`,
      levels: [0],
      series: [
        {
          name: "OsMA",
          mode: "histogram",
          color: "#94a3b8",
          positiveColor: styleColor(styles, canonical, "histogramUpColor", "#b6e34b"),
          negativeColor: styleColor(styles, canonical, "histogramDownColor", "#ef4444"),
          values: sliceSeries(output.histogram, visibleLength),
        },
      ],
    };
  }

  if (canonical === "RATE_OF_CHANGE") {
    const period = intSetting(settings, canonical, "period", 14);
    const values = closes.map((value, index) =>
      index < period || closes[index - period] === 0
        ? null
        : ((value - closes[index - period]) / closes[index - period]) * 100,
    );

    return {
      key: canonical,
      title: `Rate of Change ${period}`,
      levels: [0],
      levelColor: styleColor(styles, canonical, "zeroLineColor", "#94a3b8"),
      series: [
        {
          name: "ROC",
          color: styleColor(styles, canonical, "lineColor", "#facc15"),
          width: styleNumber(styles, canonical, "lineWidth", 1.4),
          values: sliceSeries(values, visibleLength),
        },
      ],
    };
  }

  if (canonical === "CCI") {
    const period = intSetting(settings, canonical, "period", 20);

    return {
      key: canonical,
      title: `CCI ${period}`,
      levels: [-100, 100],
      levelColor: styleColor(styles, canonical, "levelColor", "#f59e0b"),
      series: [
        {
          name: "CCI",
          color: styleColor(styles, canonical, "lineColor", "#facc15"),
          width: styleNumber(styles, canonical, "lineWidth", 1.4),
          values: sliceSeries(cci(fullCandles, period), visibleLength),
        },
      ],
    };
  }

  if (canonical === "AWESOME_OSCILLATOR") {
    const fast = intSetting(settings, canonical, "fastPeriod", 5);
    const slow = intSetting(settings, canonical, "slowPeriod", 34);
    const fastSma = sma(median, fast);
    const slowSma = sma(median, slow);

    const values = median.map((_, index) =>
      isFiniteNumber(fastSma[index]) && isFiniteNumber(slowSma[index])
        ? fastSma[index]! - slowSma[index]!
        : null,
    );

    return {
      key: canonical,
      title: `Awesome Oscillator ${fast} ${slow}`,
      levels: [0],
      series: [
        {
          name: "AO",
          mode: "histogram",
          color: "#94a3b8",
          positiveColor: styleColor(styles, canonical, "histogramUpColor", "#22c55e"),
          negativeColor: styleColor(styles, canonical, "histogramDownColor", "#ef4444"),
          values: sliceSeries(values, visibleLength),
        },
      ],
    };
  }

  if (canonical === "ACCELERATOR_OSCILLATOR") {
    const fast = intSetting(settings, canonical, "fastPeriod", 5);
    const slow = intSetting(settings, canonical, "slowPeriod", 34);
    const signal = intSetting(settings, canonical, "signalPeriod", 5);
    const fastSma = sma(median, fast);
    const slowSma = sma(median, slow);

    const ao = median.map((_, index) =>
      isFiniteNumber(fastSma[index]) && isFiniteNumber(slowSma[index])
        ? fastSma[index]! - slowSma[index]!
        : null,
    );

    const signalLine = sma(ao.map((value) => (isFiniteNumber(value) ? value : 0)), signal);

    const values = ao.map((value, index) =>
      isFiniteNumber(value) && isFiniteNumber(signalLine[index])
        ? value - signalLine[index]!
        : null,
    );

    return {
      key: canonical,
      title: `Accelerator Oscillator ${fast} ${slow} ${signal}`,
      levels: [0],
      series: [
        {
          name: "AC",
          mode: "histogram",
          color: "#94a3b8",
          positiveColor: styleColor(styles, canonical, "histogramUpColor", "#22c55e"),
          negativeColor: styleColor(styles, canonical, "histogramDownColor", "#ef4444"),
          values: sliceSeries(values, visibleLength),
        },
      ],
    };
  }

  if (canonical === "STOCHASTIC_OSCILLATOR") {
    const output = stochastic(
      fullCandles,
      intSetting(settings, canonical, "kPeriod", 14),
      intSetting(settings, canonical, "dPeriod", 3),
      intSetting(settings, canonical, "slowing", 3),
    );

    return {
      key: canonical,
      title: "Stochastic Oscillator",
      min: 0,
      max: 100,
      levels: [20, 80],
      series: [
        { name: "%K", color: "#22c55e", values: sliceSeries(output.k, visibleLength) },
        { name: "%D", color: "#ef4444", values: sliceSeries(output.d, visibleLength) },
      ],
    };
  }

  if (canonical === "ADX") {
    const period = intSetting(settings, canonical, "period", 14);

    return {
      key: canonical,
      title: `ADX ${period}`,
      min: 0,
      max: 100,
      levels: [20, 50],
      series: [
        {
          name: "ADX",
          color: styleColor(styles, canonical, "lineColor", "#38bdf8"),
          width: styleNumber(styles, canonical, "lineWidth", 1.4),
          values: sliceSeries(adx(fullCandles, period), visibleLength),
        },
      ],
    };
  }

  if (canonical === "ATR") {
    const period = intSetting(settings, canonical, "period", 14);

    return {
      key: canonical,
      title: `ATR ${period}`,
      series: [
        {
          name: "ATR",
          color: styleColor(styles, canonical, "lineColor", "#f97316"),
          width: styleNumber(styles, canonical, "lineWidth", 1.4),
          values: sliceSeries(atr(fullCandles, period), visibleLength),
        },
      ],
    };
  }

  if (canonical === "WILLIAMS_R") {
    const period = intSetting(settings, canonical, "period", 14);

    return {
      key: canonical,
      title: `Williams %R ${period}`,
      min: -100,
      max: 0,
      levels: [-80, -20],
      series: [
        {
          name: "Williams %R",
          color: styleColor(styles, canonical, "lineColor", "#a78bfa"),
          width: styleNumber(styles, canonical, "lineWidth", 1.4),
          values: sliceSeries(williamsR(fullCandles, period), visibleLength),
        },
      ],
    };
  }

  if (canonical === "MOMENTUM") {
    const period = intSetting(settings, canonical, "period", 10);
    const values = closes.map((value, index) =>
      index < period ? null : value - closes[index - period],
    );

    return {
      key: canonical,
      title: `Momentum ${period}`,
      levels: [0],
      series: [
        {
          name: "Momentum",
          color: styleColor(styles, canonical, "lineColor", "#22c55e"),
          width: styleNumber(styles, canonical, "lineWidth", 1.4),
          values: sliceSeries(values, visibleLength),
        },
      ],
    };
  }

  if (canonical === "BULLS_POWER") {
    const period = intSetting(settings, canonical, "period", 13);
    const emaValues = ema(closes, period);

    const bulls = highs.map((high, index) =>
      isFiniteNumber(emaValues[index]) ? high - emaValues[index]! : null,
    );

    return {
      key: canonical,
      title: `Bulls Power ${period}`,
      levels: [0],
      series: [
        {
          name: "Bulls",
          color: "#22c55e",
          mode: "histogram",
          positiveColor: "#22c55e",
          negativeColor: "#ef4444",
          values: sliceSeries(bulls, visibleLength),
        },
      ],
    };
  }

  if (canonical === "DEMARKER") {
    const period = intSetting(settings, canonical, "period", 14);

    return {
      key: canonical,
      title: `DeMarker ${period}`,
      min: 0,
      max: 1,
      levels: [0.3, 0.7],
      series: [
        {
          name: "DeMarker",
          color: "#38bdf8",
          values: sliceSeries(deMarker(fullCandles, period), visibleLength),
        },
      ],
    };
  }

  return null;
}

function drawCandles(
  context: CanvasRenderingContext2D,
  renderCandles: Candle[],
  chartType: ChartType,
  indexToX: (index: number) => number,
  priceToY: (price: number) => number,
  candleWidth: number,
) {
  if (chartType === "Line") {
    drawLine(
      context,
      renderCandles.map((candle) => candle.close),
      "#2563eb",
      indexToX,
      priceToY,
      2,
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
  const candleValues = candles.flatMap((candle) => [
    candle.open,
    candle.high,
    candle.low,
    candle.close,
  ]);
  const candleMin = Math.min(...candleValues);
  const candleMax = Math.max(...candleValues);
  const candleRange = Math.max(candleMax - candleMin, Math.abs(candleMax) * 0.0005);
  const relevantExtras = extras.filter(
    (value) =>
      value >= candleMin - candleRange * 1.5 &&
      value <= candleMax + candleRange * 1.5,
  );
  const values = [...candleValues, ...relevantExtras];

  let min = Math.min(...values);
  let max = Math.max(...values);

  if (!Number.isFinite(min) || !Number.isFinite(max) || min === max) {
    min = 0;
    max = 1;
  }

  const padding = Math.max((max - min) * 0.1, Math.abs(max) * 0.00018, 0.00001);

  return { min: min - padding, max: max + padding };
}

function drawGrid(
  context: CanvasRenderingContext2D,
  left: number,
  right: number,
  top: number,
  bottom: number,
  columns: number,
  rows: number,
) {
  context.strokeStyle = "rgba(255, 255, 255, 0.045)";
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
  candleGap: number,
) {
  context.fillStyle = panelIndex % 2 === 0 ? "#141925" : "#10141d";
  context.fillRect(left, top, right - left, bottom - top);

  context.strokeStyle = "rgba(255, 255, 255, 0.08)";
  context.lineWidth = 1;
  context.beginPath();
  context.moveTo(left, top);
  context.lineTo(right, top);
  context.stroke();

  context.fillStyle = "#9aa4b8";
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
    bottom - ((value - min) / (max - min)) * (bottom - top - 18) - 9;

  const indexToX = (index: number) =>
    left + (index / Math.max(visibleLength - 1, 1)) * (right - left);

  context.strokeStyle = "rgba(255, 255, 255, 0.05)";
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
    context.strokeStyle = panel.levelColor ?? "#cbd5e1";

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

  panel.series
    .filter((series) => series.visible !== false)
    .forEach((series) => {
      if (series.mode === "histogram") {
        drawHistogram(context, series.values, series, indexToX, valueToY, zeroY, candleGap);
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
        series.width ?? 1.35,
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
  indicatorStyles = DEFAULT_INDICATOR_STYLES,
  activeTrades,
  resultMarkers,
}: TradingChartProps) {
  const containerRef = React.useRef<HTMLDivElement | null>(null);
  const canvasRef = React.useRef<HTMLCanvasElement | null>(null);
  const [resizeVersion, setResizeVersion] = React.useState(0);

  React.useEffect(() => {
    const container = containerRef.current;

    if (!container || typeof ResizeObserver === "undefined") return;

    const observer = new ResizeObserver(() => {
      setResizeVersion((version) => version + 1);
    });

    observer.observe(container);

    return () => observer.disconnect();
  }, []);

  React.useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");

    if (!canvas || !context) return;

    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;

    canvas.width = Math.max(1, Math.floor(rect.width * dpr));
    canvas.height = Math.max(1, Math.floor(rect.height * dpr));

    context.setTransform(dpr, 0, 0, dpr, 0, 0);
    context.imageSmoothingEnabled = false;

    const width = rect.width;
    const height = rect.height;

    context.clearRect(0, 0, width, height);
    context.fillStyle = "#11151f";
    context.fillRect(0, 0, width, height);

    if (candles.length < 2) {
      context.fillStyle = "#7d8aa0";
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

    const allBottomPanels = normalizedIndicators
      .filter((indicator) => BOTTOM_INDICATORS.has(indicator))
      .map((indicator) =>
        buildBottomPanel(
          indicator,
          indicatorSettings,
          indicatorStyles,
          fullCandles,
          visibleLength,
        ),
      )
      .filter((panel): panel is BottomPanel => panel !== null);

    const bottomPanels = allBottomPanels.slice(0, 4);

    const overlaySeries = normalizedIndicators.flatMap((indicator) =>
      BOTTOM_INDICATORS.has(indicator)
        ? []
        : buildOverlaySeries(
            indicator,
            indicatorSettings,
            indicatorStyles,
            fullCandles,
            visibleLength,
          ),
    );

    const left = 18;
    const rightSpace = 84;
    const right = width - rightSpace;
    const top = 64;
    const footer = 26;
    const availableHeight = Math.max(height - top - footer, 160);
    const singlePanelHeight = clamp(availableHeight * 0.125, 84, 108);
    const desiredBottomArea = bottomPanels.length * singlePanelHeight;
    const bottomAreaHeight =
      bottomPanels.length > 0
        ? Math.min(desiredBottomArea, availableHeight * 0.36)
        : 0;
    const panelHeight =
      bottomPanels.length > 0 ? bottomAreaHeight / bottomPanels.length : 0;
    const chartBottom = height - footer - bottomAreaHeight;
    const chartHeight = Math.max(chartBottom - top, 120);
    const chartWidth = right - left;
    const candleGap = chartWidth / Math.max(visibleLength - 1, 1);
    const candleWidth = clamp(Math.floor(candleGap * 0.66), 3, 10);

    const overlayValues = collectFiniteValues(overlaySeries);

    const markerValues = [
      ...activeTrades.map((trade) => trade.entryPrice),
      ...resultMarkers.map((marker) => marker.price),
      ...overlayValues,
    ].filter(isFiniteNumber);

    const { min, max } = priceRangeFromCandles(renderCandles, markerValues);

    const priceToY = (price: number) =>
  Math.round(top + ((max - price) / (max - min)) * chartHeight) + 0.5;

    const indexToX = (index: number) =>
      Math.round(left + (index / Math.max(visibleLength - 1, 1)) * chartWidth) +
      0.5;

    drawGrid(context, left, right, top, chartBottom, 8, 6);

    drawCandles(context, renderCandles, chartType, indexToX, priceToY, candleWidth);

    overlaySeries.forEach((series) => {
      if (series.visible === false) return;

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
        series.width ?? 1.35,
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
      latest.close >= latest.open ? "#16a34a" : "#dc2626",
    );

    const remaining = Math.max(
      0,
      Math.round((nowMs + expirySeconds * 1000 - Date.now()) / 1000),
    );

    const expiryX = right - 8;

    context.strokeStyle = "#1677ff";
    context.lineWidth = 1.5;
    context.setLineDash([6, 5]);
    context.beginPath();
    context.moveTo(expiryX, top);
    context.lineTo(expiryX, chartBottom);
    context.stroke();
    context.setLineDash([]);

    drawTextPill(context, formatDuration(remaining), expiryX - 92, top + 16, "#1677ff");

    context.fillStyle = "#9aa4b8";
    context.font = "900 13px Roboto, sans-serif";
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.fillText(timeframe, expiryX - 28, chartBottom - 44);

    context.font = "800 12px Roboto, sans-serif";
    context.fillText(formatDuration(remaining).slice(3), expiryX - 28, chartBottom - 25);

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

    overlaySeries.slice(0, 6).forEach((series, index) => {
      context.fillStyle = series.color;
      context.font = "800 11px Roboto, sans-serif";
      context.textAlign = "left";
      context.textBaseline = "top";
      context.fillText(series.name, left + index * 96, top + 8);
    });

    context.fillStyle = "#9aa4b8";
    context.font = "800 11px Roboto, sans-serif";
    context.textAlign = "right";
    context.textBaseline = "middle";

    for (let i = 0; i <= 6; i += 1) {
      const price = max - ((max - min) / 6) * i;
      const y = top + (chartHeight / 6) * i;

      context.fillText(price.toFixed(asset.precision), width - 10, y);
    }

    bottomPanels.forEach((panel, index) => {
      const panelTop = chartBottom + index * panelHeight;
      const panelBottom = Math.min(panelTop + panelHeight, height - footer);

      if (panelBottom - panelTop < 36) return;

      drawBottomPanel(
        context,
        panel,
        index,
        visibleLength,
        left,
        right,
        panelTop,
        panelBottom,
        candleGap,
      );
    });
  }, [
    activeTrades,
    asset,
    candles,
    chartType,
    expirySeconds,
    indicatorSettings,
    indicatorStyles,
    nowMs,
    resultMarkers,
    resizeVersion,
    selectedIndicators,
    timeframe,
  ]);

  return (
    <div ref={containerRef} className="nt-chart-canvas-wrap">
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
    previous.indicatorStyles === next.indicatorStyles &&
    previous.activeTrades === next.activeTrades &&
    previous.resultMarkers === next.resultMarkers
  );
});

export default TradingChart;
