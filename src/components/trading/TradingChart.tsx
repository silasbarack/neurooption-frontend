import React from "react";
import type { Asset, Candle, ChartType, ResultMarker, TradeMarker } from "./trading.types";

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

  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(
    seconds
  ).padStart(2, "0")}`;
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

function std(values: number[], period: number) {
  return values.map((_, index) => {
    if (index < period - 1) return null;

    const slice = values.slice(index - period + 1, index + 1);
    const average = slice.reduce((sum, value) => sum + value, 0) / period;
    const variance = slice.reduce((sum, value) => sum + (value - average) ** 2, 0) / period;

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

    if (losses === 0) return 70;

    const rs = gains / losses;
    return 100 - 100 / (1 + rs);
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

function getIndicatorStatus(name: string, closes: number[]) {
  const latest = closes[closes.length - 1];
  const previous = closes[closes.length - 8] ?? closes[0];
  const direction = latest >= previous ? "UP" : "DOWN";
  const change = ((latest - previous) / previous) * 100;

  if (name.includes("RSI")) {
    const value = rsi(closes).at(-1) ?? 50;
    return `${value.toFixed(1)} ${value > 55 ? "UP" : value < 45 ? "DOWN" : "RANGE"}`;
  }

  if (name.includes("MACD")) {
    const fast = ema(closes, 12).at(-1) ?? latest;
    const slow = ema(closes, 26).at(-1) ?? latest;
    return `${(fast - slow).toFixed(5)} ${fast >= slow ? "UP" : "DOWN"}`;
  }

  if (name.includes("Stochastic")) {
    const recent = closes.slice(-14);
    const high = Math.max(...recent);
    const low = Math.min(...recent);
    const value = ((latest - low) / Math.max(high - low, 0.000001)) * 100;
    return `${value.toFixed(1)} ${value > 55 ? "UP" : value < 45 ? "DOWN" : "RANGE"}`;
  }

  return `${change.toFixed(2)}% ${direction}`;
}

function drawLine(
  context: CanvasRenderingContext2D,
  data: Array<number | null>,
  color: string,
  indexToX: (index: number) => number,
  priceToY: (price: number) => number
) {
  context.strokeStyle = color;
  context.lineWidth = 1.35;
  context.beginPath();

  data.forEach((value, index) => {
    if (value === null) return;

    const x = indexToX(index);
    const y = priceToY(value);

    if (index === 0 || data[index - 1] === null) context.moveTo(x, y);
    else context.lineTo(x, y);
  });

  context.stroke();
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

    if (!canvas || !context || candles.length === 0) return;

    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;

    canvas.width = Math.max(1, Math.floor(rect.width * dpr));
    canvas.height = Math.max(1, Math.floor(rect.height * dpr));

    context.setTransform(dpr, 0, 0, dpr, 0, 0);

    const width = rect.width;
    const height = rect.height;

    const left = 20;
    const right = 82;
    const top = 58;
    const rsiHeight = 105;
    const bottom = 34;
    const chartBottom = height - rsiHeight - bottom;
    const chartWidth = width - left - right;
    const chartHeight = chartBottom - top;

    context.clearRect(0, 0, width, height);
    context.fillStyle = "#ffffff";
    context.fillRect(0, 0, width, height);

    context.fillStyle = "rgba(226, 232, 240, 0.54)";
    context.beginPath();
    context.moveTo(left, chartBottom);
    context.lineTo(width * 0.18, top + chartHeight * 0.42);
    context.lineTo(width * 0.32, chartBottom);
    context.lineTo(width * 0.52, top + chartHeight * 0.25);
    context.lineTo(width * 0.7, chartBottom);
    context.lineTo(width * 0.88, top + chartHeight * 0.46);
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
    const padding = Math.max((maxPrice - minPrice) * 0.16, asset.basePrice * 0.0005);

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
        priceToY
      );
    } else {
      renderCandles.forEach((candle, index) => {
        const x = indexToX(index);
        const openY = priceToY(candle.open);
        const closeY = priceToY(candle.close);
        const highY = priceToY(candle.high);
        const lowY = priceToY(candle.low);
        const bullish = candle.close >= candle.open;
        const color = bullish ? "#18b971" : "#ef4444";

        context.strokeStyle = color;
        context.fillStyle = color;
        context.lineWidth = 1.4;

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

    if (selectedIndicators.includes("Moving Average")) {
      drawLine(context, sma(closes, 7), "#2fb344", indexToX, priceToY);
    }

    if (selectedIndicators.includes("Exponential MA")) {
      drawLine(context, ema(closes, 20), "#f59e0b", indexToX, priceToY);
    }

    if (selectedIndicators.includes("Weighted MA")) {
      drawLine(context, wma(closes, 50), "#2563eb", indexToX, priceToY);
    }

    if (selectedIndicators.includes("Bollinger Bands")) {
      const middle = sma(closes, 20);
      const deviation = std(closes, 20);

      drawLine(
        context,
        middle.map((value, index) =>
          value === null || deviation[index] === null ? null : value + deviation[index]! * 2
        ),
        "#9333ea",
        indexToX,
        priceToY
      );

      drawLine(
        context,
        middle.map((value, index) =>
          value === null || deviation[index] === null ? null : value - deviation[index]! * 2
        ),
        "#9333ea",
        indexToX,
        priceToY
      );
    }

    if (selectedIndicators.includes("Price Channel") || selectedIndicators.includes("Donchian Channel")) {
      const highs = renderCandles.map((candle) => candle.high);
      const lows = renderCandles.map((candle) => candle.low);

      drawLine(context, sma(highs, 10), "#06b6d4", indexToX, priceToY);
      drawLine(context, sma(lows, 10), "#06b6d4", indexToX, priceToY);
    }

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
    context.fillText(`${new Date(nowMs).toLocaleTimeString()} UTC+3`, left + 8, top - 24);

    const rsiTop = chartBottom + 18;
    const rsiBottom = height - bottom;
    const rsiValues = rsi(closes);

    context.strokeStyle = "#e5e7eb";

    for (let i = 0; i <= 3; i += 1) {
      const y = rsiTop + ((rsiBottom - rsiTop) / 3) * i;
      context.beginPath();
      context.moveTo(left, y);
      context.lineTo(width - right, y);
      context.stroke();
    }

    context.strokeStyle = "#6aa84f";
    context.lineWidth = 1.4;
    context.beginPath();

    rsiValues.forEach((value, index) => {
      const x = indexToX(index);
      const y = rsiBottom - ((value - 20) / 60) * (rsiBottom - rsiTop);

      if (index === 0) context.moveTo(x, y);
      else context.lineTo(x, y);
    });

    context.stroke();

    context.fillStyle = "#475467";
    context.font = "600 11px Roboto, sans-serif";
    context.textAlign = "left";
    context.fillText("RSI 14", left + 2, rsiTop - 5);

    context.textAlign = "center";

    for (let i = 0; i <= 5; i += 1) {
      const candleIndex = Math.floor((renderCandles.length - 1) * (i / 5));
      const candle = renderCandles[candleIndex];
      const x = left + (chartWidth / 5) * i;
      context.fillText(formatClock(candle.time), x, chartBottom + 10);
    }
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

  const closes = candles.map((candle) => candle.close);

  return (
    <div className="nt-chart-wrap">
      <canvas ref={canvasRef} className="nt-chart-canvas" />

      {selectedIndicators.length > 0 && (
        <div className="nt-indicator-stack">
          {selectedIndicators.map((indicator) => (
            <span key={indicator}>
              {indicator}: {getIndicatorStatus(indicator, closes)}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}