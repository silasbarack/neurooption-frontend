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

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function formatClock(time: number) {
  return new Date(time).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
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

function sma(values: number[], period: number) {
  return values.map((_, index) => {
    if (index < period - 1) return null;

    const slice = values.slice(index - period + 1, index + 1);

    return slice.reduce((sum, value) => sum + value, 0) / period;
  });
}

function ema(values: number[], period: number) {
  const result: Array<number | null> = [];
  const multiplier = 2 / (period + 1);
  let previous = values[0];

  values.forEach((value, index) => {
    if (index === 0) {
      previous = value;
      result.push(value);
      return;
    }

    previous = value * multiplier + previous * (1 - multiplier);
    result.push(previous);
  });

  return result;
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
      const difference = values[i] - values[i - 1];

      if (difference >= 0) gains += difference;
      else losses += Math.abs(difference);
    }

    if (losses === 0) return 70;

    const relativeStrength = gains / losses;

    return 100 - 100 / (1 + relativeStrength);
  });
}

function heikenAshi(candles: Candle[]) {
  const result: Candle[] = [];

  candles.forEach((candle, index) => {
    const previous = result[index - 1];
    const close = (candle.open + candle.high + candle.low + candle.close) / 4;
    const open = previous ? (previous.open + previous.close) / 2 : candle.open;
    const high = Math.max(candle.high, open, close);
    const low = Math.min(candle.low, open, close);

    result.push({
      open,
      high,
      low,
      close,
      time: candle.time,
    });
  });

  return result;
}

function drawLine(
  context: CanvasRenderingContext2D,
  data: Array<number | null>,
  color: string,
  indexToX: (index: number) => number,
  priceToY: (price: number) => number,
  width = 1.35
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

function drawVisualLegend(
  context: CanvasRenderingContext2D,
  items: Array<{ name: string; color: string }>,
  x: number,
  y: number
) {
  if (items.length === 0) return;

  context.font = "700 10px Roboto, sans-serif";
  context.textAlign = "left";

  items.slice(0, 8).forEach((item, index) => {
    const rowY = y + index * 18;

    context.strokeStyle = item.color;
    context.lineWidth = 3;
    context.beginPath();
    context.moveTo(x, rowY);
    context.lineTo(x + 20, rowY);
    context.stroke();

    context.fillStyle = "#344054";
    context.fillText(item.name, x + 28, rowY + 4);
  });
}

export default function TradingChart({
  asset,
  candles,
  chartType,
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
      context.fillText("Loading OTC candles...", width / 2, height / 2);
      return;
    }

    const hasOscillator =
      selectedIndicators.includes("RSI") ||
      selectedIndicators.includes("MACD") ||
      selectedIndicators.includes("Stochastic Oscillator");

    const left = 18;
    const right = 82;
    const top = 58;
    const axisFooter = 34;
    const oscillatorHeight = hasOscillator ? 112 : 0;
    const chartBottom = height - axisFooter - oscillatorHeight;
    const chartWidth = width - left - right;
    const chartHeight = chartBottom - top;

    context.fillStyle = "rgba(226, 232, 240, 0.5)";
    context.beginPath();
    context.moveTo(left, chartBottom);
    context.lineTo(width * 0.18, top + chartHeight * 0.44);
    context.lineTo(width * 0.32, chartBottom);
    context.lineTo(width * 0.52, top + chartHeight * 0.25);
    context.lineTo(width * 0.7, chartBottom);
    context.lineTo(width * 0.88, top + chartHeight * 0.47);
    context.lineTo(width - right, chartBottom);
    context.closePath();
    context.fill();

    const renderCandles = chartType === "Heiken Ashi" ? heikenAshi(candles) : candles;
    const closes = renderCandles.map((candle) => candle.close);

    const values = renderCandles.flatMap((candle) => [
      candle.open,
      candle.high,
      candle.low,
      candle.close,
    ]);

    activeTrades.forEach((trade) => values.push(trade.entryPrice));
    resultMarkers.forEach((marker) => values.push(marker.price));

    let minPrice = Math.min(...values);
    let maxPrice = Math.max(...values);
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
      context.lineTo(x, chartBottom);
      context.stroke();
    }

    for (let i = 0; i <= 6; i += 1) {
      const y = top + (chartHeight / 6) * i;

      context.beginPath();
      context.moveTo(left, y);
      context.lineTo(width - right, y);
      context.stroke();
    }

    const candleWidth = clamp((chartWidth / renderCandles.length) * 0.58, 3, 9);

    if (chartType === "Line") {
      drawLine(
        context,
        renderCandles.map((candle) => candle.close),
        "#0ea5e9",
        indexToX,
        priceToY,
        1.8
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

    const legendItems: Array<{ name: string; color: string }> = [];

    if (selectedIndicators.includes("Moving Average")) {
      drawLine(context, sma(closes, 7), "#2fb344", indexToX, priceToY, 1.4);
      legendItems.push({ name: "MA 7", color: "#2fb344" });
    }

    if (selectedIndicators.includes("Exponential MA")) {
      drawLine(context, ema(closes, 20), "#f59e0b", indexToX, priceToY, 1.4);
      legendItems.push({ name: "EMA 20", color: "#f59e0b" });
    }

    if (selectedIndicators.includes("Weighted MA")) {
      drawLine(context, wma(closes, 50), "#2563eb", indexToX, priceToY, 1.4);
      legendItems.push({ name: "WMA 50", color: "#2563eb" });
    }

    if (selectedIndicators.includes("Bollinger Bands")) {
      const middle = sma(closes, 20);
      const deviation = standardDeviation(closes, 20);

      drawLine(
        context,
        middle.map((value, index) =>
          value === null || deviation[index] === null
            ? null
            : value + deviation[index]! * 2
        ),
        "#9333ea",
        indexToX,
        priceToY,
        1.2
      );

      drawLine(
        context,
        middle.map((value, index) =>
          value === null || deviation[index] === null
            ? null
            : value - deviation[index]! * 2
        ),
        "#9333ea",
        indexToX,
        priceToY,
        1.2
      );

      legendItems.push({ name: "Bollinger", color: "#9333ea" });
    }

    if (
      selectedIndicators.includes("Price Channel") ||
      selectedIndicators.includes("Donchian Channel")
    ) {
      const highs = renderCandles.map((candle) => candle.high);
      const lows = renderCandles.map((candle) => candle.low);

      drawLine(context, sma(highs, 10), "#06b6d4", indexToX, priceToY, 1.1);
      drawLine(context, sma(lows, 10), "#06b6d4", indexToX, priceToY, 1.1);

      legendItems.push({ name: "Channel", color: "#06b6d4" });
    }

    drawVisualLegend(context, legendItems, left + 8, top - 34);

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
    context.beginPath();
    context.roundRect(width - right + 8, currentY - 14, 68, 28, 6);
    context.fill();

    context.fillStyle = "#ffffff";
    context.font = "700 12px Roboto, sans-serif";
    context.textAlign = "center";
    context.fillText(latest.close.toFixed(asset.precision), width - right + 42, currentY + 4);

    context.fillStyle = "#344054";
    context.font = "500 11px Roboto, sans-serif";
    context.textAlign = "right";

    for (let i = 0; i <= 5; i += 1) {
      const price = maxPrice - ((maxPrice - minPrice) / 5) * i;
      const y = priceToY(price);

      context.fillText(price.toFixed(asset.precision), width - 8, y + 4);
    }

    const expiryX = left + chartWidth * 0.82;
    const expiryClock = new Date(nowMs + expirySeconds * 1000).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });

    context.strokeStyle = "#98a2b3";
    context.lineWidth = 1;
    context.setLineDash([3, 3]);
    context.beginPath();
    context.moveTo(expiryX, top);
    context.lineTo(expiryX, chartBottom);
    context.stroke();
    context.setLineDash([]);

    context.fillStyle = "#475467";
    context.font = "600 10px Roboto, sans-serif";
    context.textAlign = "left";
    context.fillText("Expiration time", expiryX + 6, top + 13);
    context.fillText(expiryClock, expiryX + 6, top + 28);
    context.fillText(formatDuration(expirySeconds), expiryX + 6, top + 43);

    activeTrades.forEach((trade) => {
      const y = priceToY(trade.entryPrice);

      context.strokeStyle = trade.side === "BUY" ? "#22c55e" : "#ef4444";
      context.setLineDash([4, 4]);
      context.beginPath();
      context.moveTo(left, y);
      context.lineTo(width - right, y);
      context.stroke();
      context.setLineDash([]);

      context.fillStyle = trade.side === "BUY" ? "#22c55e" : "#ef4444";
      context.beginPath();
      context.roundRect(left + 20, y - 14, 118, 28, 7);
      context.fill();

      context.fillStyle = "#ffffff";
      context.font = "700 11px Roboto, sans-serif";
      context.textAlign = "left";
      context.fillText(trade.label, left + 28, y + 4);
    });

    resultMarkers.forEach((marker) => {
      const y = priceToY(marker.price);

      context.fillStyle = marker.won ? "#22c55e" : "#ef4444";
      context.beginPath();
      context.roundRect(width - right - 142, y - 15, 132, 30, 7);
      context.fill();

      context.fillStyle = "#ffffff";
      context.font = "800 11px Roboto, sans-serif";
      context.textAlign = "center";
      context.fillText(marker.label, width - right - 76, y + 4);
    });

    context.fillStyle = "#344054";
    context.font = "600 11px Roboto, sans-serif";
    context.textAlign = "left";
    context.fillText(`${new Date(nowMs).toLocaleTimeString()} UTC+3`, left + 8, top - 16);

    context.textAlign = "center";

    for (let i = 0; i <= 5; i += 1) {
      const candleIndex = Math.floor((renderCandles.length - 1) * (i / 5));
      const candle = renderCandles[candleIndex];
      const x = left + (chartWidth / 5) * i;

      context.fillStyle = "#475467";
      context.font = "600 11px Roboto, sans-serif";
      context.fillText(formatClock(candle.time), x, chartBottom + 16);
    }

    if (hasOscillator) {
      const oscTop = chartBottom + 34;
      const oscBottom = height - 16;
      const oscHeight = oscBottom - oscTop;

      context.strokeStyle = "#e5e7eb";
      context.lineWidth = 1;

      for (let i = 0; i <= 3; i += 1) {
        const y = oscTop + (oscHeight / 3) * i;

        context.beginPath();
        context.moveTo(left, y);
        context.lineTo(width - right, y);
        context.stroke();
      }

      if (selectedIndicators.includes("RSI")) {
        const rsiValues = rsi(closes);

        context.strokeStyle = "#6aa84f";
        context.lineWidth = 1.5;
        context.beginPath();

        rsiValues.forEach((value, index) => {
          const x = indexToX(index);
          const y = oscBottom - ((value - 20) / 60) * oscHeight;

          if (index === 0) context.moveTo(x, y);
          else context.lineTo(x, y);
        });

        context.stroke();

        context.fillStyle = "#475467";
        context.font = "700 10px Roboto, sans-serif";
        context.textAlign = "left";
        context.fillText("RSI", left + 4, oscTop - 6);
      }
    }
  }, [
    asset,
    candles,
    chartType,
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