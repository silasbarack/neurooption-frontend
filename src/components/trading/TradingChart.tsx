import React from "react";
import type { Asset, Candle, ChartType, ResultMarker, TradeMarker } from "./trading.types";

type TradingChartProps = {
  asset: Asset;
  candles: Candle[];
  chartType: ChartType;
  timeframe: string;
  activeTrades: TradeMarker[];
  resultMarkers: ResultMarker[];
  selectedIndicators?: string[];
};

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function formatTime(timestamp: number) {
  return new Date(timestamp).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

function formatTimeWithSeconds(timestamp: number) {
  return new Date(timestamp).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });
}

function getSma(candles: Candle[], period: number) {
  return candles.map((_, index) => {
    if (index < period) return null;

    const slice = candles.slice(index - period, index);
    const sum = slice.reduce((total, candle) => total + candle.close, 0);

    return sum / period;
  });
}

function getBollinger(candles: Candle[], period: number) {
  const middle = getSma(candles, period);

  return middle.map((mid, index) => {
    if (!mid || index < period) return null;

    const slice = candles.slice(index - period, index);
    const variance =
      slice.reduce((total, candle) => total + Math.pow(candle.close - mid, 2), 0) / period;
    const deviation = Math.sqrt(variance);

    return {
      upper: mid + deviation * 2,
      middle: mid,
      lower: mid - deviation * 2,
    };
  });
}

function getRsi(candles: Candle[], period = 14) {
  return candles.map((_, index) => {
    if (index < period) return 50;

    const slice = candles.slice(index - period + 1, index + 1);
    let gains = 0;
    let losses = 0;

    for (let i = 1; i < slice.length; i += 1) {
      const difference = slice[i].close - slice[i - 1].close;

      if (difference >= 0) gains += difference;
      else losses += Math.abs(difference);
    }

    if (losses === 0) return 70;

    const rs = gains / losses;
    return clamp(100 - 100 / (1 + rs), 10, 90);
  });
}

export default function TradingChart({
  asset,
  candles,
  chartType,
  timeframe,
  activeTrades,
  resultMarkers,
  selectedIndicators = [],
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

    const showRsi = selectedIndicators.includes("RSI");
    const showMa =
      selectedIndicators.includes("Moving Average") ||
      selectedIndicators.includes("Exponential MA") ||
      selectedIndicators.includes("Weighted MA");

    const showBollinger = selectedIndicators.includes("Bollinger Bands");

    const left = 20;
    const right = 84;
    const top = 58;
    const rsiHeight = showRsi ? 105 : 0;
    const bottom = 34;
    const chartBottom = height - rsiHeight - bottom;
    const chartWidth = width - left - right;
    const chartHeight = chartBottom - top;

    context.clearRect(0, 0, width, height);

    context.fillStyle = "#ffffff";
    context.fillRect(0, 0, width, height);

    const mountain = context.createLinearGradient(0, top, 0, chartBottom);
    mountain.addColorStop(0, "rgba(238, 243, 249, 0.25)");
    mountain.addColorStop(1, "rgba(205, 216, 230, 0.62)");

    context.fillStyle = mountain;
    context.beginPath();
    context.moveTo(left, chartBottom);
    context.lineTo(width * 0.18, top + chartHeight * 0.42);
    context.lineTo(width * 0.32, chartBottom);
    context.lineTo(width * 0.52, top + chartHeight * 0.26);
    context.lineTo(width * 0.7, chartBottom);
    context.lineTo(width * 0.88, top + chartHeight * 0.45);
    context.lineTo(width - right, chartBottom);
    context.closePath();
    context.fill();

    const values = candles.flatMap((candle) => [
      candle.open,
      candle.high,
      candle.low,
      candle.close,
    ]);

    activeTrades.forEach((trade) => values.push(trade.entryPrice));
    resultMarkers.forEach((marker) => values.push(marker.price));

    const bollinger = getBollinger(candles, 20);

    if (showBollinger) {
      bollinger.forEach((band) => {
        if (band) {
          values.push(band.upper, band.middle, band.lower);
        }
      });
    }

    let minPrice = Math.min(...values);
    let maxPrice = Math.max(...values);
    const padding = Math.max((maxPrice - minPrice) * 0.16, asset.basePrice * 0.0005);

    minPrice -= padding;
    maxPrice += padding;

    const priceToY = (price: number) =>
      top + ((maxPrice - price) / (maxPrice - minPrice)) * chartHeight;

    const indexToX = (index: number) =>
      left + (index / Math.max(candles.length - 1, 1)) * chartWidth;

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

    if (showBollinger) {
      context.strokeStyle = "#94a3b8";
      context.lineWidth = 1;

      ["upper", "middle", "lower"].forEach((key) => {
        context.beginPath();

        bollinger.forEach((band, index) => {
          if (!band) return;

          const value = band[key as "upper" | "middle" | "lower"];
          const x = indexToX(index);
          const y = priceToY(value);

          if (index === 0 || !bollinger[index - 1]) context.moveTo(x, y);
          else context.lineTo(x, y);
        });

        context.stroke();
      });
    }

    const candleWidth = clamp((chartWidth / candles.length) * 0.58, 3, 9);

    if (chartType === "Line") {
      context.strokeStyle = "#0ea5e9";
      context.lineWidth = 2.2;
      context.beginPath();

      candles.forEach((candle, index) => {
        const x = indexToX(index);
        const y = priceToY(candle.close);

        if (index === 0) context.moveTo(x, y);
        else context.lineTo(x, y);
      });

      context.stroke();
    } else {
      candles.forEach((candle, index) => {
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

    if (showMa) {
      const ma7 = getSma(candles, 7);
      const ma20 = getSma(candles, 20);
      const ma50 = getSma(candles, 50);

      [
        { data: ma7, color: "#2fb344", label: "MA 7" },
        { data: ma20, color: "#f59e0b", label: "MA 20" },
        { data: ma50, color: "#2563eb", label: "MA 50" },
      ].forEach((line) => {
        context.strokeStyle = line.color;
        context.lineWidth = 1.4;
        context.beginPath();

        line.data.forEach((value, index) => {
          if (!value) return;

          const x = indexToX(index);
          const y = priceToY(value);

          if (index === 0 || !line.data[index - 1]) context.moveTo(x, y);
          else context.lineTo(x, y);
        });

        context.stroke();
      });
    }

    const latest = candles[candles.length - 1];
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
    context.fillText("00:00:45", expiryX + 6, top + 28);

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
    context.fillText(`${formatTimeWithSeconds(Date.now())} UTC+3`, left + 8, top - 24);

    if (showMa || showBollinger) {
      let legendX = left + 8;

      const legendItems = [
        ...(showMa
          ? [
              { label: "MA 7", color: "#2fb344" },
              { label: "MA 20", color: "#f59e0b" },
              { label: "MA 50", color: "#2563eb" },
            ]
          : []),
        ...(showBollinger ? [{ label: "Bollinger", color: "#94a3b8" }] : []),
      ];

      legendItems.forEach((item) => {
        context.fillStyle = item.color;
        context.fillText(item.label, legendX, top - 8);
        legendX += item.label.length * 7 + 18;
      });
    }

    if (showRsi) {
      const rsiTop = chartBottom + 18;
      const rsiBottom = height - bottom;

      context.strokeStyle = "#e5e7eb";
      context.lineWidth = 1;

      for (let i = 0; i <= 3; i += 1) {
        const y = rsiTop + ((rsiBottom - rsiTop) / 3) * i;
        context.beginPath();
        context.moveTo(left, y);
        context.lineTo(width - right, y);
        context.stroke();
      }

      const rsi = getRsi(candles);

      context.strokeStyle = "#6aa84f";
      context.lineWidth = 1.4;
      context.beginPath();

      rsi.forEach((value, index) => {
        const x = indexToX(index);
        const y = rsiBottom - ((value - 10) / 80) * (rsiBottom - rsiTop);

        if (index === 0) context.moveTo(x, y);
        else context.lineTo(x, y);
      });

      context.stroke();

      context.fillStyle = "#475467";
      context.font = "600 11px Roboto, sans-serif";
      context.textAlign = "left";
      context.fillText("RSI 14", left + 2, rsiTop - 5);
    }

    context.fillStyle = "#475467";
    context.font = "600 11px Roboto, sans-serif";
    context.textAlign = "center";

    const labelIndexes = [0, 20, 40, 60, 80, candles.length - 1];

    labelIndexes.forEach((candleIndex) => {
      const safeIndex = clamp(candleIndex, 0, candles.length - 1);
      const candle = candles[safeIndex];
      const x = indexToX(safeIndex);
      const label = safeIndex === candles.length - 1 ? formatTime(Date.now()) : formatTime(candle.time);

      context.fillText(label, x, chartBottom + 12);
    });
  }, [
    asset,
    candles,
    chartType,
    timeframe,
    activeTrades,
    resultMarkers,
    selectedIndicators,
  ]);

  return (
    <div className="nt-chart-wrap">
      <canvas ref={canvasRef} className="nt-chart-canvas" />
    </div>
  );
}