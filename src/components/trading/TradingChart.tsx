import React from "react";
import type { Asset, Candle, ChartType, ResultMarker, TradeMarker } from "./trading.types";

type TradingChartProps = {
  asset: Asset;
  candles: Candle[];
  chartType: ChartType;
  timeframe: string;
  activeTrades: TradeMarker[];
  resultMarkers: ResultMarker[];
};

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

export default function TradingChart({
  asset,
  candles,
  chartType,
  timeframe,
  activeTrades,
  resultMarkers,
}: TradingChartProps) {
  const canvasRef = React.useRef<HTMLCanvasElement | null>(null);

  React.useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");

    if (!canvas || !context || candles.length === 0) {
      return;
    }

    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;

    canvas.width = Math.max(1, Math.floor(rect.width * dpr));
    canvas.height = Math.max(1, Math.floor(rect.height * dpr));

    context.setTransform(dpr, 0, 0, dpr, 0, 0);

    const width = rect.width;
    const height = rect.height;

    const left = 16;
    const right = 86;
    const top = 42;
    const bottom = 36;

    const chartWidth = width - left - right;
    const chartHeight = height - top - bottom;

    context.clearRect(0, 0, width, height);

    const bg = context.createLinearGradient(0, 0, 0, height);
    bg.addColorStop(0, "#202a49");
    bg.addColorStop(0.52, "#161e35");
    bg.addColorStop(1, "#101729");

    context.fillStyle = bg;
    context.fillRect(0, 0, width, height);

    context.save();
    context.globalAlpha = 0.24;
    context.fillStyle = "#6f8ec6";
    context.beginPath();
    context.moveTo(left, height - bottom);
    context.lineTo(width * 0.18, height * 0.48);
    context.lineTo(width * 0.33, height * 0.68);
    context.lineTo(width * 0.55, height * 0.38);
    context.lineTo(width * 0.72, height * 0.72);
    context.lineTo(width * 0.92, height * 0.53);
    context.lineTo(width, height * 0.63);
    context.lineTo(width, height - bottom);
    context.closePath();
    context.fill();
    context.restore();

    const prices = candles.flatMap((candle) => [
      candle.open,
      candle.high,
      candle.low,
      candle.close,
    ]);

    activeTrades.forEach((trade) => prices.push(trade.entryPrice));
    resultMarkers.forEach((marker) => prices.push(marker.price));

    let minPrice = Math.min(...prices);
    let maxPrice = Math.max(...prices);

    const pad = Math.max((maxPrice - minPrice) * 0.18, asset.basePrice * 0.0012);
    minPrice -= pad;
    maxPrice += pad;

    const priceToY = (price: number) => {
      return top + ((maxPrice - price) / (maxPrice - minPrice)) * chartHeight;
    };

    const indexToX = (index: number) => {
      return left + (index / Math.max(candles.length - 1, 1)) * chartWidth;
    };

    context.strokeStyle = "rgba(180, 208, 255, 0.14)";
    context.lineWidth = 1;

    for (let i = 0; i <= 8; i += 1) {
      const x = left + (chartWidth / 8) * i;
      context.beginPath();
      context.moveTo(x, top);
      context.lineTo(x, height - bottom);
      context.stroke();
    }

    for (let i = 0; i <= 6; i += 1) {
      const y = top + (chartHeight / 6) * i;
      context.beginPath();
      context.moveTo(left, y);
      context.lineTo(width - right, y);
      context.stroke();
    }

    const candleWidth = clamp(chartWidth / candles.length * 0.58, 3, 9);

    if (chartType === "Line") {
      context.strokeStyle = "#55d7e5";
      context.lineWidth = 2.4;
      context.beginPath();

      candles.forEach((candle, index) => {
        const x = indexToX(index);
        const y = priceToY(candle.close);

        if (index === 0) {
          context.moveTo(x, y);
        } else {
          context.lineTo(x, y);
        }
      });

      context.stroke();
    } else {
      let previousHaOpen = candles[0].open;
      let previousHaClose = candles[0].close;

      candles.forEach((candle, index) => {
        let open = candle.open;
        let close = candle.close;
        let high = candle.high;
        let low = candle.low;

        if (chartType === "Heiken Ashi") {
          const haClose = (candle.open + candle.high + candle.low + candle.close) / 4;
          const haOpen = (previousHaOpen + previousHaClose) / 2;
          const haHigh = Math.max(candle.high, haOpen, haClose);
          const haLow = Math.min(candle.low, haOpen, haClose);

          open = haOpen;
          close = haClose;
          high = haHigh;
          low = haLow;

          previousHaOpen = haOpen;
          previousHaClose = haClose;
        }

        const x = indexToX(index);
        const openY = priceToY(open);
        const closeY = priceToY(close);
        const highY = priceToY(high);
        const lowY = priceToY(low);

        const rising = close >= open;
        const color = rising ? "#58e1d9" : "#ff614f";

        context.strokeStyle = color;
        context.fillStyle = color;
        context.lineWidth = 1.4;

        if (chartType === "Bars") {
          context.beginPath();
          context.moveTo(x, highY);
          context.lineTo(x, lowY);
          context.moveTo(x - candleWidth * 0.7, openY);
          context.lineTo(x, openY);
          context.moveTo(x, closeY);
          context.lineTo(x + candleWidth * 0.7, closeY);
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

    const latest = candles[candles.length - 1];
    const currentY = priceToY(latest.close);

    context.setLineDash([6, 6]);
    context.strokeStyle = "#78d8ff";
    context.lineWidth = 1.3;
    context.beginPath();
    context.moveTo(left, currentY);
    context.lineTo(width - right + 5, currentY);
    context.stroke();
    context.setLineDash([]);

    context.fillStyle = "#84c8ff";
    context.beginPath();
    context.roundRect(width - right + 9, currentY - 18, 72, 36, 9);
    context.fill();

    context.fillStyle = "#ffffff";
    context.font = "700 13px Roboto, sans-serif";
    context.textAlign = "center";
    context.fillText(latest.close.toFixed(asset.precision), width - right + 45, currentY + 5);

    context.fillStyle = "rgba(235, 243, 255, 0.78)";
    context.font = "700 13px Roboto, sans-serif";
    context.textAlign = "right";

    for (let i = 0; i <= 5; i += 1) {
      const price = maxPrice - ((maxPrice - minPrice) / 5) * i;
      const y = priceToY(price);
      context.fillText(price.toFixed(asset.precision), width - 12, y + 4);
    }

    context.strokeStyle = "rgba(255,255,255,0.9)";
    context.lineWidth = 1.5;
    const expiryX = left + chartWidth * 0.82;

    context.beginPath();
    context.moveTo(expiryX, top);
    context.lineTo(expiryX, height - bottom);
    context.stroke();

    context.fillStyle = "#ffffff";
    context.textAlign = "left";
    context.font = "700 12px Roboto, sans-serif";
    context.fillText("⚑", expiryX + 5, top + 12);
    context.fillText("Expiration time", expiryX + 10, top + 30);

    context.fillStyle = "rgba(232, 240, 255, 0.74)";
    context.font = "700 12px Roboto, sans-serif";
    context.textAlign = "left";
    context.fillText(`${new Date().toLocaleTimeString()} UTC+3`, left + 10, top - 13);

    context.textAlign = "center";
    context.fillText(timeframe, expiryX - 48, currentY - 8);

    activeTrades.forEach((trade, index) => {
      const y = priceToY(trade.entryPrice);
      const x = left + 24 + index * 14;

      context.strokeStyle = trade.side === "BUY" ? "#5fea7d" : "#ff6358";
      context.setLineDash([4, 4]);
      context.beginPath();
      context.moveTo(left, y);
      context.lineTo(width - right, y);
      context.stroke();
      context.setLineDash([]);

      context.fillStyle = trade.side === "BUY" ? "#46d866" : "#ef534b";
      context.beginPath();
      context.roundRect(x, y - 16, 126, 32, 8);
      context.fill();

      context.fillStyle = "#ffffff";
      context.font = "800 12px Roboto, sans-serif";
      context.textAlign = "left";
      context.fillText(trade.label, x + 9, y + 4);
    });

    resultMarkers.forEach((marker) => {
      const y = priceToY(marker.price);
      const x = width - right - 150;

      context.fillStyle = marker.won ? "#47d86b" : "#f05a54";
      context.beginPath();
      context.roundRect(x, y - 18, 138, 36, 10);
      context.fill();

      context.fillStyle = "#ffffff";
      context.font = "900 13px Roboto, sans-serif";
      context.textAlign = "center";
      context.fillText(marker.label, x + 69, y + 5);
    });

    context.fillStyle = "rgba(235, 243, 255, 0.62)";
    context.font = "600 12px Roboto, sans-serif";
    context.textAlign = "center";

    ["13:16", "13:32", "13:48", "14:04"].forEach((time, index) => {
      const x = left + chartWidth * (0.12 + index * 0.25);
      context.fillText(time, x, height - 10);
    });
  }, [asset, candles, chartType, timeframe, activeTrades, resultMarkers]);

  return (
    <div className="nt-chart-wrap">
      <canvas ref={canvasRef} className="nt-chart-canvas" />
    </div>
  );
}