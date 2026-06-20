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

const COLORS = [
  "#22c55e",
  "#f59e0b",
  "#2563eb",
  "#9333ea",
  "#06b6d4",
  "#ef4444",
  "#14b8a6",
  "#64748b",
];

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function sma(values: number[], period: number) {
  return values.map((_, index) => {
    if (index < period - 1) return null;
    const slice = values.slice(index - period + 1, index + 1);
    return slice.reduce((sum, value) => sum + value, 0) / period;
  });
}

function ema(values: number[], period: number) {
  const output: Array<number | null> = [];
  const multiplier = 2 / (period + 1);
  let previous = values[0];

  values.forEach((value, index) => {
    if (index === 0) {
      previous = value;
      output.push(value);
      return;
    }

    previous = value * multiplier + previous * (1 - multiplier);
    output.push(previous);
  });

  return output;
}

function wma(values: number[], period: number) {
  const weightTotal = (period * (period + 1)) / 2;

  return values.map((_, index) => {
    if (index < period - 1) return null;

    let total = 0;

    for (let offset = 0; offset < period; offset += 1) {
      total += values[index - offset] * (period - offset);
    }

    return total / weightTotal;
  });
}

function standardDeviation(values: number[], period: number) {
  return values.map((_, index) => {
    if (index < period - 1) return null;

    const slice = values.slice(index - period + 1, index + 1);
    const average = slice.reduce((sum, value) => sum + value, 0) / period;
    const variance =
      slice.reduce((sum, value) => sum + (value - average) ** 2, 0) / period;

    return Math.sqrt(variance);
  });
}

function rsi(values: number[], period = 14) {
  return values.map((_, index) => {
    if (index < period) return 50;

    let gains = 0;
    let losses = 0;

    for (let i = index - period + 1; i <= index; i += 1) {
      const diff = values[i] - values[i - 1];

      if (diff >= 0) gains += diff;
      else losses += Math.abs(diff);
    }

    if (losses === 0) return 75;

    const rs = gains / losses;
    return 100 - 100 / (1 + rs);
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

function hashName(name: string) {
  return name.split("").reduce((sum, char) => sum + char.charCodeAt(0), 0);
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

function drawLine(
  context: CanvasRenderingContext2D,
  data: Array<number | null>,
  color: string,
  indexToX: (index: number) => number,
  priceToY: (price: number) => number,
  width = 1.4
) {
  context.strokeStyle = color;
  context.lineWidth = width;
  context.beginPath();

  let started = false;

  data.forEach((value, index) => {
    if (value === null || !Number.isFinite(value)) return;

    const x = indexToX(index);
    const y = priceToY(value);

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
  data: Array<number | null>,
  color: string,
  indexToX: (index: number) => number,
  priceToY: (price: number) => number
) {
  context.fillStyle = color;

  data.forEach((value, index) => {
    if (value === null || !Number.isFinite(value)) return;

    const x = indexToX(index);
    const y = priceToY(value);

    context.beginPath();
    context.arc(x, y, 2.4, 0, Math.PI * 2);
    context.fill();
  });
}

function drawIndicatorVisual(
  context: CanvasRenderingContext2D,
  indicator: string,
  index: number,
  candles: Candle[],
  indexToX: (index: number) => number,
  priceToY: (price: number) => number,
  left: number,
  rightEdge: number
) {
  const closes = candles.map((candle) => candle.close);
  const highs = candles.map((candle) => candle.high);
  const lows = candles.map((candle) => candle.low);
  const color = COLORS[index % COLORS.length];
  const lowerName = indicator.toLowerCase();

  if (lowerName.includes("exponential")) {
    drawLine(context, ema(closes, 20), color, indexToX, priceToY, 1.5);
    return;
  }

  if (lowerName.includes("weighted")) {
    drawLine(context, wma(closes, 30), color, indexToX, priceToY, 1.5);
    return;
  }

  if (lowerName.includes("moving") || lowerName === "ma") {
    drawLine(context, sma(closes, 9), color, indexToX, priceToY, 1.5);
    return;
  }

  if (
    lowerName.includes("bollinger") ||
    lowerName.includes("bands") ||
    lowerName.includes("envelope")
  ) {
    const middle = sma(closes, 20);
    const deviation = standardDeviation(closes, 20);

    const upper = middle.map((value, i) =>
      value === null || deviation[i] === null ? null : value + deviation[i]! * 2
    );

    const lower = middle.map((value, i) =>
      value === null || deviation[i] === null ? null : value - deviation[i]! * 2
    );

    drawLine(context, upper, color, indexToX, priceToY, 1.2);
    drawLine(context, lower, color, indexToX, priceToY, 1.2);
    return;
  }

  if (
    lowerName.includes("channel") ||
    lowerName.includes("donchian") ||
    lowerName.includes("keltner")
  ) {
    drawLine(context, sma(highs, 12), color, indexToX, priceToY, 1.2);
    drawLine(context, sma(lows, 12), color, indexToX, priceToY, 1.2);
    return;
  }

  if (lowerName.includes("sar") || lowerName.includes("parabolic")) {
    const dots = candles.map((candle, i) =>
      i % 2 === 0 ? candle.low - (candle.high - candle.low) * 0.25 : candle.high + (candle.high - candle.low) * 0.25
    );

    drawDots(context, dots, color, indexToX, priceToY);
    return;
  }

  if (
    lowerName.includes("pivot") ||
    lowerName.includes("support") ||
    lowerName.includes("resistance") ||
    lowerName.includes("fibonacci")
  ) {
    const min = Math.min(...lows);
    const max = Math.max(...highs);
    const levels = [0.236, 0.382, 0.5, 0.618, 0.786];

    context.strokeStyle = color;
    context.lineWidth = 1;
    context.setLineDash([5, 5]);

    levels.forEach((level) => {
      const price = min + (max - min) * level;
      const y = priceToY(price);

      context.beginPath();
      context.moveTo(left, y);
      context.lineTo(rightEdge, y);
      context.stroke();
    });

    context.setLineDash([]);
    return;
  }

  if (lowerName.includes("zig") || lowerName.includes("fractal")) {
    context.strokeStyle = color;
    context.lineWidth = 1.5;
    context.beginPath();

    let started = false;

    candles.forEach((candle, i) => {
      if (i % 9 !== 0 && i !== candles.length - 1) return;

      const x = indexToX(i);
      const y = priceToY(i % 18 === 0 ? candle.high : candle.low);

      if (!started) {
        context.moveTo(x, y);
        started = true;
      } else {
        context.lineTo(x, y);
      }
    });

    context.stroke();
    return;
  }

  if (lowerName.includes("ichimoku")) {
    const fast = sma(closes, 9);
    const slow = sma(closes, 26);

    context.fillStyle = "rgba(34, 197, 94, 0.10)";
    context.beginPath();

    fast.forEach((value, i) => {
      if (value === null) return;
      const x = indexToX(i);
      const y = priceToY(value);

      if (i === 8) context.moveTo(x, y);
      else context.lineTo(x, y);
    });

    [...slow].reverse().forEach((value, reverseIndex) => {
      if (value === null) return;
      const i = slow.length - 1 - reverseIndex;
      context.lineTo(indexToX(i), priceToY(value));
    });

    context.closePath();
    context.fill();

    drawLine(context, fast, color, indexToX, priceToY, 1.2);
    drawLine(context, slow, "#64748b", indexToX, priceToY, 1.2);
    return;
  }

  const period = 6 + (hashName(indicator) % 34);
  const generic = lowerName.includes("rsi")
    ? rsi(closes, 14).map((value, i) => {
        const min = Math.min(...lows);
        const max = Math.max(...highs);
        return min + ((max - min) * value) / 100;
      })
    : ema(closes, period);

  drawLine(context, generic, color, indexToX, priceToY, 1.2);
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

export default function TradingChart({
  asset,
  candles,
  chartType,
  timeframe,
  expirySeconds,
  nowMs,
  selectedIndicators,
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
      context.font = "700 14px Roboto, sans-serif";
      context.textAlign = "center";
      context.fillText("Loading candles...", width / 2, height / 2);
      return;
    }

    const renderCandles = chartType === "Heiken Ashi" ? heikenAshi(candles) : candles;

    const left = 12;
    const right = 78;
    const top = 46;
    const bottom = height - 38;
    const chartWidth = width - left - right;
    const chartHeight = bottom - top;

    context.fillStyle = "rgba(226, 232, 240, 0.55)";
    context.beginPath();
    context.moveTo(left, bottom);
    context.lineTo(width * 0.2, top + chartHeight * 0.42);
    context.lineTo(width * 0.34, bottom);
    context.lineTo(width * 0.55, top + chartHeight * 0.22);
    context.lineTo(width * 0.72, bottom);
    context.lineTo(width * 0.9, top + chartHeight * 0.45);
    context.lineTo(width - right, bottom);
    context.closePath();
    context.fill();

    const priceValues = renderCandles.flatMap((candle) => [
      candle.open,
      candle.high,
      candle.low,
      candle.close,
    ]);

    activeTrades.forEach((trade) => priceValues.push(trade.entryPrice));
    resultMarkers.forEach((marker) => priceValues.push(marker.price));

    let minPrice = Math.min(...priceValues);
    let maxPrice = Math.max(...priceValues);

    const padding = Math.max((maxPrice - minPrice) * 0.18, asset.basePrice * 0.0005);

    minPrice -= padding;
    maxPrice += padding;

    const priceToY = (price: number) =>
      top + ((maxPrice - price) / (maxPrice - minPrice)) * chartHeight;

    const indexToX = (index: number) =>
      left + (index / Math.max(renderCandles.length - 1, 1)) * chartWidth;

    context.strokeStyle = "#edf1f6";
    context.lineWidth = 1;

    for (let i = 0; i <= 8; i += 1) {
      const x = left + (chartWidth / 8) * i;

      context.beginPath();
      context.moveTo(x, top);
      context.lineTo(x, bottom);
      context.stroke();
    }

    for (let i = 0; i <= 6; i += 1) {
      const y = top + (chartHeight / 6) * i;

      context.beginPath();
      context.moveTo(left, y);
      context.lineTo(width - right, y);
      context.stroke();
    }

    const candleWidth = clamp((chartWidth / renderCandles.length) * 0.58, 2.5, 9);

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
        const x = indexToX(index);
        const openY = priceToY(candle.open);
        const closeY = priceToY(candle.close);
        const highY = priceToY(candle.high);
        const lowY = priceToY(candle.low);

        const bullish = candle.close >= candle.open;
        const color = bullish ? "#17a868" : "#e5484d";

        context.strokeStyle = color;
        context.fillStyle = color;
        context.lineWidth = 1.3;

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

          context.fillRect(x - candleWidth / 2, bodyTop, candleWidth, bodyHeight);
        }
      });
    }

    selectedIndicators.forEach((indicator, index) => {
      drawIndicatorVisual(
        context,
        indicator,
        index,
        renderCandles,
        indexToX,
        priceToY,
        left,
        width - right
      );
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
    context.font = "700 12px Roboto, sans-serif";
    context.textAlign = "center";
    context.fillText(
      latest.close.toFixed(asset.precision),
      width - right + 41,
      currentY + 4
    );

    context.fillStyle = "#344054";
    context.font = "500 11px Roboto, sans-serif";
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
    context.lineTo(expiryX, bottom);
    context.stroke();
    context.setLineDash([]);

    context.fillStyle = "#475467";
    context.font = "700 10px Roboto, sans-serif";
    context.textAlign = "left";
    context.fillText("Expiration time", expiryX + 6, top + 12);
    context.fillText(formatDuration(expirySeconds), expiryX + 6, top + 29);

    context.fillStyle = "#344054";
    context.font = "600 11px Roboto, sans-serif";
    context.textAlign = "left";
    context.fillText(`${new Date(nowMs).toLocaleTimeString()} UTC+3`, left + 6, top - 14);

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
  }, [
    asset,
    candles,
    chartType,
    timeframe,
    expirySeconds,
    nowMs,
    selectedIndicators,
    activeTrades,
    resultMarkers,
  ]);

  return (
    <div className="nt-chart-wrap">
      <canvas ref={canvasRef} className="nt-chart-canvas" />
    </div>
  );
}