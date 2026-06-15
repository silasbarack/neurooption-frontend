import React from "react";
import "./TradingPage.css";

type AccountMode = "demo" | "real";
type CurrencyCode =
  | "USD"
  | "KES"
  | "UGX"
  | "TZS"
  | "NGN"
  | "XOF"
  | "EUR"
  | "CAD"
  | "JPY"
  | "CNY"
  | "AOA"
  | "ZAR"
  | "BRL";

type ChartType = "Candlesticks" | "Heiken Ashi" | "Bars" | "Line";
type Direction = "BUY" | "SELL";
type AssetCategory =
  | "Currencies"
  | "Cryptocurrencies"
  | "Stocks"
  | "Indices"
  | "Commodities";

type Candle = {
  open: number;
  high: number;
  low: number;
  close: number;
  time: number;
};

type AssetConfig = {
  symbol: string;
  name: string;
  category: AssetCategory;
  basePrice: number;
  volatility: number;
  precision: number;
  payout: number;
};

type Marker = {
  id: string;
  direction: Direction;
  price: number;
  label: string;
  status: "active" | "win" | "loss";
  resultLabel?: string;
};

const RATES: Record<CurrencyCode, number> = {
  USD: 1,
  KES: 129,
  UGX: 3700,
  TZS: 2600,
  NGN: 1500,
  XOF: 600,
  EUR: 0.92,
  CAD: 1.36,
  JPY: 157,
  CNY: 7.24,
  AOA: 850,
  ZAR: 18.1,
  BRL: 5.42,
};

const CURRENCY_SYMBOLS: Record<CurrencyCode, string> = {
  USD: "$",
  KES: "KES",
  UGX: "UGX",
  TZS: "TZS",
  NGN: "NGN",
  XOF: "XOF",
  EUR: "€",
  CAD: "CAD",
  JPY: "¥",
  CNY: "¥",
  AOA: "AOA",
  ZAR: "ZAR",
  BRL: "R$",
};

const TIMEFRAMES = [
  "S5",
  "S10",
  "S15",
  "S30",
  "M1",
  "M2",
  "M3",
  "M5",
  "M10",
  "M15",
  "M30",
  "H1",
  "H4",
  "D1",
];

const ASSETS: AssetConfig[] = [
  {
    symbol: "AUD/CAD OTC",
    name: "Australian Dollar / Canadian Dollar",
    category: "Currencies",
    basePrice: 0.8422,
    volatility: 0.0011,
    precision: 5,
    payout: 92,
  },
  {
    symbol: "EUR/USD OTC",
    name: "Euro / US Dollar",
    category: "Currencies",
    basePrice: 1.1335,
    volatility: 0.001,
    precision: 5,
    payout: 90,
  },
  {
    symbol: "USD/JPY OTC",
    name: "US Dollar / Japanese Yen",
    category: "Currencies",
    basePrice: 157.42,
    volatility: 0.0012,
    precision: 3,
    payout: 88,
  },
  {
    symbol: "BTC/USD OTC",
    name: "Bitcoin / US Dollar",
    category: "Cryptocurrencies",
    basePrice: 67250,
    volatility: 0.0045,
    precision: 2,
    payout: 84,
  },
  {
    symbol: "ETH/USD OTC",
    name: "Ethereum / US Dollar",
    category: "Cryptocurrencies",
    basePrice: 3550,
    volatility: 0.004,
    precision: 2,
    payout: 86,
  },
  {
    symbol: "Tesla OTC",
    name: "Tesla Inc.",
    category: "Stocks",
    basePrice: 182.45,
    volatility: 0.0025,
    precision: 2,
    payout: 78,
  },
  {
    symbol: "Apple OTC",
    name: "Apple Inc.",
    category: "Stocks",
    basePrice: 214.15,
    volatility: 0.002,
    precision: 2,
    payout: 80,
  },
  {
    symbol: "Amazon OTC",
    name: "Amazon.com Inc.",
    category: "Stocks",
    basePrice: 185.8,
    volatility: 0.0022,
    precision: 2,
    payout: 79,
  },
  {
    symbol: "US100 OTC",
    name: "Nasdaq 100",
    category: "Indices",
    basePrice: 19885,
    volatility: 0.0018,
    precision: 2,
    payout: 85,
  },
  {
    symbol: "US30 OTC",
    name: "Dow Jones 30",
    category: "Indices",
    basePrice: 39210,
    volatility: 0.0015,
    precision: 2,
    payout: 82,
  },
  {
    symbol: "XAU/USD OTC",
    name: "Gold / US Dollar",
    category: "Commodities",
    basePrice: 2332.5,
    volatility: 0.0016,
    precision: 2,
    payout: 87,
  },
  {
    symbol: "Brent OTC",
    name: "Brent Crude Oil",
    category: "Commodities",
    basePrice: 82.3,
    volatility: 0.0021,
    precision: 2,
    payout: 81,
  },
];

const INDICATORS = [
  "Moving Average",
  "EMA",
  "SMA",
  "WMA",
  "Bollinger Bands",
  "RSI",
  "MACD",
  "Stochastic",
  "CCI",
  "ADX",
  "ATR",
  "Ichimoku",
  "Momentum",
  "Williams %R",
  "Alligator",
  "Fractals",
  "SuperTrend",
  "VWAP",
  "OBV",
  "MFI",
  "TRIX",
  "DPO",
  "KAMA",
  "Hull MA",
  "Donchian Channel",
  "Keltner Channel",
  "Envelopes",
  "Aroon",
  "ROC",
  "Parabolic SAR",
  "Standard Deviation",
  "Linear Regression",
  "Pivot Points",
  "Price Channel",
  "Elder Ray",
  "DeMarker",
  "Volume",
  "Awesome Oscillator",
  "Fibonacci Levels",
  "Trend Strength",
  "Variance",
  "Money Flow",
];

const DRAWING_TOOLS = [
  "Cursor",
  "Trend Line",
  "Horizontal Line",
  "Vertical Line",
  "Brush",
  "Text",
  "Rectangle",
  "Fibonacci",
  "Eraser",
];

const SIDEBAR_ITEMS = [
  ["📈", "Trading"],
  ["💵", "Finance"],
  ["👤", "Profile"],
  ["🛒", "Market"],
  ["💎", "Achievements"],
  ["🏆", "Tournaments"],
  ["💬", "Chat"],
  ["?", "Help"],
  ["🎁", "Promo"],
  ["🤖", "Autotrading"],
];

const QUICK_ITEMS = [
  ["↻", "Trades"],
  ["📡", "Signals"],
  ["👥", "Social Trading"],
  ["◎", "Express Trades"],
  ["⏳", "Pending Trades"],
  ["⌨", "Hotkeys"],
  ["⛶", "Full Screen"],
];

function getAsset(symbol: string): AssetConfig {
  return ASSETS.find((asset) => asset.symbol === symbol) ?? ASSETS[0];
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

function formatExpiry(totalSeconds: number): string {
  const safe = clamp(totalSeconds, 5, 18000);
  const hours = Math.floor(safe / 3600);
  const minutes = Math.floor((safe % 3600) / 60);
  const seconds = safe % 60;

  return [hours, minutes, seconds]
    .map((part) => String(part).padStart(2, "0"))
    .join(":");
}

function splitExpiry(totalSeconds: number) {
  const safe = clamp(totalSeconds, 5, 18000);
  return {
    hours: Math.floor(safe / 3600),
    minutes: Math.floor((safe % 3600) / 60),
    seconds: safe % 60,
  };
}

function formatMoney(value: number, currency: CurrencyCode): string {
  const symbol = CURRENCY_SYMBOLS[currency];
  const decimals = currency === "JPY" || currency === "XOF" ? 0 : 2;

  const formatted = new Intl.NumberFormat("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);

  if (symbol === "$" || symbol === "€" || symbol === "¥" || symbol === "R$") {
    return `${symbol}${formatted}`;
  }

  return `${symbol} ${formatted}`;
}

function compactNumber(value: number): string {
  if (!Number.isFinite(value)) return "0";
  if (Math.abs(value) >= 1000) return value.toFixed(2);
  if (Math.abs(value) >= 10) return value.toFixed(3);
  return value.toFixed(5);
}

function createInitialCandles(asset: AssetConfig, count = 100): Candle[] {
  const candles: Candle[] = [];
  let close = asset.basePrice;

  for (let i = 0; i < count; i += 1) {
    const drift = Math.sin(i / 9) * asset.basePrice * asset.volatility * 0.55;
    const noise = (Math.random() - 0.5) * asset.basePrice * asset.volatility * 1.5;
    const open = close;
    close = Math.max(0.00001, open + drift + noise);

    const wick =
      Math.abs(close - open) +
      asset.basePrice * asset.volatility * (0.3 + Math.random() * 1.8);

    candles.push({
      open,
      close,
      high: Math.max(open, close) + wick * Math.random(),
      low: Math.min(open, close) - wick * Math.random(),
      time: Date.now() - (count - i) * 60000,
    });
  }

  return candles;
}

function roundedRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number,
) {
  const r = Math.min(radius, width / 2, height / 2);
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + width, y, x + width, y + height, r);
  ctx.arcTo(x + width, y + height, x, y + height, r);
  ctx.arcTo(x, y + height, x, y, r);
  ctx.arcTo(x, y, x + width, y, r);
  ctx.closePath();
}

function drawChart(
  canvas: HTMLCanvasElement,
  candles: Candle[],
  asset: AssetConfig,
  chartType: ChartType,
  timeframe: string,
  markers: Marker[],
  activeTool: string,
) {
  const rect = canvas.getBoundingClientRect();
  const dpr = window.devicePixelRatio || 1;

  if (
    canvas.width !== Math.floor(rect.width * dpr) ||
    canvas.height !== Math.floor(rect.height * dpr)
  ) {
    canvas.width = Math.floor(rect.width * dpr);
    canvas.height = Math.floor(rect.height * dpr);
  }

  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

  const width = rect.width;
  const height = rect.height;

  ctx.clearRect(0, 0, width, height);

  const gradient = ctx.createLinearGradient(0, 0, width, height);
  gradient.addColorStop(0, "#213b67");
  gradient.addColorStop(0.45, "#15284d");
  gradient.addColorStop(1, "#0a1326");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);

  ctx.save();
  ctx.globalAlpha = 0.2;
  ctx.fillStyle = "#89b8e8";
  ctx.beginPath();
  ctx.moveTo(0, height * 0.8);
  ctx.lineTo(width * 0.14, height * 0.46);
  ctx.lineTo(width * 0.28, height * 0.72);
  ctx.lineTo(width * 0.46, height * 0.4);
  ctx.lineTo(width * 0.64, height * 0.76);
  ctx.lineTo(width * 0.82, height * 0.5);
  ctx.lineTo(width, height * 0.75);
  ctx.lineTo(width, height);
  ctx.lineTo(0, height);
  ctx.closePath();
  ctx.fill();
  ctx.restore();

  const pad = {
    left: 16,
    right: 74,
    top: 72,
    bottom: 38,
  };

  const plotX = pad.left;
  const plotY = pad.top;
  const plotW = Math.max(100, width - pad.left - pad.right);
  const plotH = Math.max(100, height - pad.top - pad.bottom);

  const visible = candles.slice(-96);
  const highs = visible.map((candle) => candle.high);
  const lows = visible.map((candle) => candle.low);
  const maxPrice = Math.max(...highs);
  const minPrice = Math.min(...lows);
  const pricePadding = Math.max((maxPrice - minPrice) * 0.18, asset.basePrice * asset.volatility * 3);
  const topPrice = maxPrice + pricePadding;
  const bottomPrice = minPrice - pricePadding;

  const yForPrice = (price: number) =>
    plotY + ((topPrice - price) / (topPrice - bottomPrice)) * plotH;

  const xForIndex = (index: number) =>
    plotX + (index / Math.max(1, visible.length - 1)) * plotW;

  ctx.strokeStyle = "rgba(168, 202, 255, 0.12)";
  ctx.lineWidth = 1;

  for (let i = 0; i <= 8; i += 1) {
    const x = plotX + (plotW / 8) * i;
    ctx.beginPath();
    ctx.moveTo(x, plotY);
    ctx.lineTo(x, plotY + plotH);
    ctx.stroke();
  }

  for (let i = 0; i <= 6; i += 1) {
    const y = plotY + (plotH / 6) * i;
    ctx.beginPath();
    ctx.moveTo(plotX, y);
    ctx.lineTo(plotX + plotW, y);
    ctx.stroke();
  }

  ctx.fillStyle = "rgba(255,255,255,0.72)";
  ctx.font = "600 12px Roboto, Arial, sans-serif";
  ctx.textAlign = "right";

  for (let i = 0; i <= 5; i += 1) {
    const price = topPrice - ((topPrice - bottomPrice) / 5) * i;
    const y = yForPrice(price);
    ctx.fillText(price.toFixed(asset.precision), width - 10, y + 4);
  }

  const current = visible[visible.length - 1]?.close ?? asset.basePrice;
  const currentY = yForPrice(current);

  ctx.strokeStyle = "rgba(91, 207, 255, 0.85)";
  ctx.setLineDash([7, 7]);
  ctx.beginPath();
  ctx.moveTo(plotX, currentY);
  ctx.lineTo(plotX + plotW, currentY);
  ctx.stroke();
  ctx.setLineDash([]);

  roundedRect(ctx, width - 86, currentY - 17, 74, 34, 10);
  ctx.fillStyle = "#7bc4ff";
  ctx.fill();
  ctx.fillStyle = "#ffffff";
  ctx.textAlign = "center";
  ctx.font = "700 13px Roboto, Arial, sans-serif";
  ctx.fillText(current.toFixed(asset.precision), width - 49, currentY + 5);

  const expiryX = plotX + plotW * 0.76;
  ctx.strokeStyle = "rgba(255,255,255,0.9)";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(expiryX, plotY);
  ctx.lineTo(expiryX, plotY + plotH);
  ctx.stroke();

  ctx.fillStyle = "#ffffff";
  ctx.font = "700 11px Roboto, Arial, sans-serif";
  ctx.textAlign = "left";
  ctx.fillText("Expiration time", expiryX + 8, plotY + 28);

  const candleW = Math.max(3, Math.min(10, plotW / visible.length - 2));

  const heiken: Candle[] = [];
  if (chartType === "Heiken Ashi") {
    visible.forEach((candle, index) => {
      const close = (candle.open + candle.high + candle.low + candle.close) / 4;
      const open =
        index === 0
          ? (candle.open + candle.close) / 2
          : (heiken[index - 1].open + heiken[index - 1].close) / 2;
      heiken.push({
        open,
        close,
        high: Math.max(candle.high, open, close),
        low: Math.min(candle.low, open, close),
        time: candle.time,
      });
    });
  }

  const renderCandles = chartType === "Heiken Ashi" ? heiken : visible;

  if (chartType === "Line") {
    ctx.strokeStyle = "#65f3e7";
    ctx.lineWidth = 2.4;
    ctx.beginPath();
    renderCandles.forEach((candle, index) => {
      const x = xForIndex(index);
      const y = yForPrice(candle.close);
      if (index === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.stroke();
  } else {
    renderCandles.forEach((candle, index) => {
      const x = xForIndex(index);
      const yOpen = yForPrice(candle.open);
      const yClose = yForPrice(candle.close);
      const yHigh = yForPrice(candle.high);
      const yLow = yForPrice(candle.low);
      const isUp = candle.close >= candle.open;
      const color = isUp ? "#53f2df" : "#ff6b5f";

      ctx.strokeStyle = color;
      ctx.fillStyle = color;
      ctx.lineWidth = chartType === "Bars" ? 2 : 1.5;

      ctx.beginPath();
      ctx.moveTo(x, yHigh);
      ctx.lineTo(x, yLow);
      ctx.stroke();

      if (chartType === "Bars") {
        ctx.beginPath();
        ctx.moveTo(x - candleW, yOpen);
        ctx.lineTo(x, yOpen);
        ctx.moveTo(x, yClose);
        ctx.lineTo(x + candleW, yClose);
        ctx.stroke();
      } else {
        const bodyY = Math.min(yOpen, yClose);
        const bodyH = Math.max(3, Math.abs(yClose - yOpen));
        roundedRect(ctx, x - candleW / 2, bodyY, candleW, bodyH, 2);
        ctx.fill();
      }
    });
  }

  markers.forEach((marker) => {
    const y = yForPrice(marker.price);
    const isBuy = marker.direction === "BUY";
    const isWin = marker.status === "win";
    const isLoss = marker.status === "loss";

    ctx.setLineDash([4, 4]);
    ctx.strokeStyle = isLoss ? "#ff514c" : "#5ee66f";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(plotX, y);
    ctx.lineTo(plotX + plotW, y);
    ctx.stroke();
    ctx.setLineDash([]);

    const label = marker.status === "active" ? marker.label : `${isWin ? "✓" : "✕"} ${marker.resultLabel ?? ""}`;
    const labelW = Math.min(190, Math.max(98, label.length * 7.2));
    const labelX = isBuy ? plotX + 24 : plotX + 140;

    roundedRect(ctx, labelX, y - 18, labelW, 30, 8);
    ctx.fillStyle = isLoss ? "#ff514c" : "#5ee66f";
    ctx.fill();

    ctx.fillStyle = "#ffffff";
    ctx.font = "800 11px Roboto, Arial, sans-serif";
    ctx.textAlign = "left";
    ctx.fillText(label, labelX + 10, y + 2);
  });

  ctx.fillStyle = "rgba(255,255,255,0.78)";
  ctx.font = "700 13px Roboto, Arial, sans-serif";
  ctx.textAlign = "left";
  ctx.fillText(new Date().toLocaleTimeString() + " UTC+3", plotX + 12, plotY - 34);
  ctx.fillText(`Tool: ${activeTool}`, plotX + 185, plotY - 34);

  ctx.textAlign = "center";
  ctx.fillText(timeframe, plotX + plotW * 0.72, currentY - 12);

  ctx.fillStyle = "rgba(255,255,255,0.65)";
  ctx.font = "600 11px Roboto, Arial, sans-serif";
  for (let i = 0; i <= 4; i += 1) {
    const x = plotX + (plotW / 4) * i;
    ctx.fillText(["13:16", "13:32", "13:48", "14:04", "14:20"][i], x, height - 12);
  }
}

export default function TradingPage() {
  const canvasRef = React.useRef<HTMLCanvasElement | null>(null);
  const animationRef = React.useRef<number | null>(null);
  const candlesRef = React.useRef<Candle[]>(createInitialCandles(ASSETS[0]));
  const priceRef = React.useRef<number>(ASSETS[0].basePrice);
  const momentumRef = React.useRef<number>(0);
  const regimeRef = React.useRef<number>(0.2);
  const lastTickRef = React.useRef<number>(0);
  const lastCandleRef = React.useRef<number>(performance.now());
  const tradeTimersRef = React.useRef<number[]>([]);
  const previousCurrencyRef = React.useRef<CurrencyCode>("USD");

  const [accountMode, setAccountMode] = React.useState<AccountMode>("demo");
  const [currency, setCurrency] = React.useState<CurrencyCode>("USD");
  const [balances, setBalances] = React.useState<Record<AccountMode, number>>({
    demo: 70000,
    real: 0,
  });

  const [selectedSymbol, setSelectedSymbol] = React.useState("AUD/CAD OTC");
  const [chartType, setChartType] = React.useState<ChartType>("Candlesticks");
  const [timeframe, setTimeframe] = React.useState("M1");
  const [expirySeconds, setExpirySeconds] = React.useState(1800);
  const [amountText, setAmountText] = React.useState("100");
  const [markers, setMarkers] = React.useState<Marker[]>([]);
  const [currentPrice, setCurrentPrice] = React.useState(ASSETS[0].basePrice);
  const [assetMenuOpen, setAssetMenuOpen] = React.useState(false);
  const [indicatorMenuOpen, setIndicatorMenuOpen] = React.useState(false);
  const [toolsMenuOpen, setToolsMenuOpen] = React.useState(false);
  const [selectedIndicators, setSelectedIndicators] = React.useState<string[]>([]);
  const [activeTool, setActiveTool] = React.useState("Cursor");
  const [topUpOpen, setTopUpOpen] = React.useState(false);

  const selectedAsset = React.useMemo(() => getAsset(selectedSymbol), [selectedSymbol]);

  const amountLocal = Math.max(0, Number(amountText) || 0);
  const amountUsd = amountLocal / RATES[currency];
  const balanceLocal = balances[accountMode] * RATES[currency];
  const payoutRate = clamp(selectedAsset.payout + Math.sin(currentPrice) * 2, 20, 92);
  const expectedProfitLocal = amountLocal * (payoutRate / 100);
  const expectedReturnLocal = amountLocal + expectedProfitLocal;
  const canTrade = amountUsd > 0 && balances[accountMode] >= amountUsd;

  const expiryParts = splitExpiry(expirySeconds);

  React.useEffect(() => {
    const previous = previousCurrencyRef.current;
    if (previous !== currency) {
      const previousAmount = Number(amountText) || 0;
      const currentAmountUsd = previousAmount / RATES[previous];
      const converted = currentAmountUsd * RATES[currency];
      setAmountText(converted.toFixed(currency === "JPY" || currency === "XOF" ? 0 : 2));
      previousCurrencyRef.current = currency;
    }
  }, [currency]);

  React.useEffect(() => {
    candlesRef.current = createInitialCandles(selectedAsset);
    priceRef.current = selectedAsset.basePrice;
    momentumRef.current = 0;
    regimeRef.current = Math.random() > 0.5 ? 0.25 : -0.25;
    lastCandleRef.current = performance.now();
    setCurrentPrice(selectedAsset.basePrice);
    setMarkers([]);
  }, [selectedAsset]);

  React.useEffect(() => {
    const animate = (timestamp: number) => {
      const canvas = canvasRef.current;
      const candles = candlesRef.current;
      const asset = selectedAsset;

      if (timestamp - lastTickRef.current > 110) {
        lastTickRef.current = timestamp;

        if (Math.random() < 0.01) {
          regimeRef.current = (Math.random() - 0.5) * 1.4;
        }

        const last = candles[candles.length - 1];
        const meanPull = (asset.basePrice - last.close) * 0.006;
        const trend = regimeRef.current * asset.basePrice * asset.volatility * 0.025;
        const noise = (Math.random() - 0.5) * asset.basePrice * asset.volatility * 0.2;
        const rarePulse =
          Math.random() < 0.006
            ? (Math.random() - 0.5) * asset.basePrice * asset.volatility * 1.2
            : 0;

        momentumRef.current = momentumRef.current * 0.94 + trend + noise + rarePulse + meanPull;
        const nextPrice = Math.max(0.00001, last.close + momentumRef.current);

        last.close = nextPrice;
        last.high = Math.max(last.high, nextPrice);
        last.low = Math.min(last.low, nextPrice);
        priceRef.current = nextPrice;

        const visualCandleDuration = 4200;
        if (timestamp - lastCandleRef.current > visualCandleDuration) {
          candles.push({
            open: nextPrice,
            high: nextPrice,
            low: nextPrice,
            close: nextPrice,
            time: Date.now(),
          });

          if (candles.length > 115) candles.shift();
          lastCandleRef.current = timestamp;
        }

        setCurrentPrice(nextPrice);
      }

      if (canvas) {
        drawChart(canvas, candlesRef.current, selectedAsset, chartType, timeframe, markers, activeTool);
      }

      animationRef.current = window.requestAnimationFrame(animate);
    };

    animationRef.current = window.requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        window.cancelAnimationFrame(animationRef.current);
      }
    };
  }, [selectedAsset, chartType, timeframe, markers, activeTool]);

  React.useEffect(() => {
    return () => {
      tradeTimersRef.current.forEach((timer) => window.clearTimeout(timer));
    };
  }, []);

  function changeExpiryUnit(unit: "hours" | "minutes" | "seconds", delta: number) {
    const current = splitExpiry(expirySeconds);
    const next = { ...current };

    if (unit === "hours") next.hours += delta;
    if (unit === "minutes") next.minutes += delta;
    if (unit === "seconds") next.seconds += delta;

    const nextSeconds = next.hours * 3600 + next.minutes * 60 + next.seconds;
    setExpirySeconds(clamp(nextSeconds, 5, 18000));
  }

  function toggleIndicator(name: string) {
    setSelectedIndicators((previous) =>
      previous.includes(name)
        ? previous.filter((item) => item !== name)
        : [...previous, name],
    );
  }

  async function toggleFullscreen() {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
      } else {
        await document.exitFullscreen();
      }
    } catch {
      window.alert("Fullscreen could not be opened by this browser.");
    }
  }

  function placeTrade(direction: Direction) {
    if (!canTrade) return;

    const entryPrice = priceRef.current;
    const stakeUsd = amountUsd;
    const profitUsd = stakeUsd * (payoutRate / 100);
    const tradeCurrency = currency;
    const tradeRate = RATES[currency];
    const tradeAccount = accountMode;
    const markerId = `${direction}-${Date.now()}-${Math.random()}`;

    setBalances((previous) => ({
      ...previous,
      [tradeAccount]: Math.max(0, previous[tradeAccount] - stakeUsd),
    }));

    const activeMarker: Marker = {
      id: markerId,
      direction,
      price: entryPrice,
      label: `${direction} ${formatMoney(stakeUsd * tradeRate, tradeCurrency)}`,
      status: "active",
    };

    setMarkers((previous) => [...previous, activeMarker]);

    const settleTimer = window.setTimeout(() => {
      const closingPrice = priceRef.current;
      const isWin =
        direction === "BUY" ? closingPrice > entryPrice : closingPrice < entryPrice;

      if (isWin) {
        setBalances((previous) => ({
          ...previous,
          [tradeAccount]: previous[tradeAccount] + stakeUsd + profitUsd,
        }));
      }

      setMarkers((previous) =>
        previous.map((marker) =>
          marker.id === markerId
            ? {
                ...marker,
                status: isWin ? "win" : "loss",
                resultLabel: isWin
                  ? formatMoney((stakeUsd + profitUsd) * tradeRate, tradeCurrency)
                  : formatMoney(0, tradeCurrency),
              }
            : marker,
        ),
      );

      const removeTimer = window.setTimeout(() => {
        setMarkers((previous) => previous.filter((marker) => marker.id !== markerId));
      }, 10000);

      tradeTimersRef.current.push(removeTimer);
    }, expirySeconds * 1000);

    tradeTimersRef.current.push(settleTimer);
  }

  const groupedAssets = React.useMemo(() => {
    return ASSETS.reduce<Record<AssetCategory, AssetConfig[]>>(
      (result, asset) => {
        result[asset.category].push(asset);
        return result;
      },
      {
        Currencies: [],
        Cryptocurrencies: [],
        Stocks: [],
        Indices: [],
        Commodities: [],
      },
    );
  }, []);

  return (
    <main className="neuro-terminal">
      <header className="terminal-topbar">
        <div className="brand-area">
          <div className="brand-icon">N</div>
          <div className="brand-name">NeuroOption</div>
          <button className="star-button" type="button">★</button>
        </div>

        <div className="account-strip">
          <select
            className="terminal-select"
            value={accountMode}
            onChange={(event) => setAccountMode(event.target.value as AccountMode)}
          >
            <option value="demo">QT Demo</option>
            <option value="real">QT Real</option>
          </select>

          <select
            className="terminal-select currency-select"
            value={currency}
            onChange={(event) => setCurrency(event.target.value as CurrencyCode)}
          >
            {(Object.keys(RATES) as CurrencyCode[]).map((code) => (
              <option key={code} value={code}>
                {code}
              </option>
            ))}
          </select>

          <div className="balance-pill">{formatMoney(balanceLocal, currency)}</div>

          <button className="topup-button" type="button" onClick={() => setTopUpOpen(true)}>
            TOP UP
          </button>

          <button className="header-icon-button" type="button" onClick={toggleFullscreen}>
            ⛶
          </button>

          <div className="avatar">SM</div>
        </div>
      </header>

      <aside className="left-rail">
        {SIDEBAR_ITEMS.map(([icon, label]) => (
          <button
            type="button"
            className={`rail-item ${label === "Trading" ? "active" : ""}`}
            key={label}
          >
            <span className="rail-icon">{icon}</span>
            <span className="rail-label">{label}</span>
          </button>
        ))}
      </aside>

      <section className="chart-stage">
        <canvas ref={canvasRef} className="market-canvas" />

        <div className="chart-toolbar">
          <div className="toolbar-left">
            <div className="dropdown-wrap">
              <button
                className="asset-button"
                type="button"
                onClick={() => setAssetMenuOpen((open) => !open)}
              >
                <span>{selectedAsset.symbol}</span>
                <span>⌄</span>
              </button>

              {assetMenuOpen && (
                <div className="asset-menu">
                  {(Object.entries(groupedAssets) as Array<[AssetCategory, AssetConfig[]]>).map(
                    ([category, assets]) => (
                      <div className="asset-group" key={category}>
                        <div className="asset-group-title">{category}</div>
                        {assets.map((asset) => (
                          <button
                            type="button"
                            key={asset.symbol}
                            className="asset-option"
                            onClick={() => {
                              setSelectedSymbol(asset.symbol);
                              setAssetMenuOpen(false);
                            }}
                          >
                            <span>{asset.symbol}</span>
                            <small>{asset.name}</small>
                          </button>
                        ))}
                      </div>
                    ),
                  )}
                </div>
              )}
            </div>

            <select
              className="mini-select"
              value={timeframe}
              onChange={(event) => setTimeframe(event.target.value)}
            >
              {TIMEFRAMES.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>

            <button
              type="button"
              className="tool-button"
              onClick={() => setIndicatorMenuOpen((open) => !open)}
            >
              📊
            </button>

            <button
              type="button"
              className="tool-button"
              onClick={() => setToolsMenuOpen((open) => !open)}
            >
              ✎
            </button>

            <button type="button" className="tool-button">
              ⋯
            </button>
          </div>

          <div className="chart-type-row">
            {(["Candlesticks", "Heiken Ashi", "Bars", "Line"] as ChartType[]).map((type) => (
              <button
                type="button"
                key={type}
                className={`chart-type-button ${chartType === type ? "active" : ""}`}
                onClick={() => setChartType(type)}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {indicatorMenuOpen && (
          <div className="floating-menu indicators-menu">
            <div className="floating-title">Indicators</div>
            <div className="indicator-grid">
              {INDICATORS.map((indicator) => (
                <button
                  type="button"
                  key={indicator}
                  className={selectedIndicators.includes(indicator) ? "selected" : ""}
                  onClick={() => toggleIndicator(indicator)}
                >
                  {indicator}
                </button>
              ))}
            </div>
          </div>
        )}

        {toolsMenuOpen && (
          <div className="floating-menu tools-menu">
            <div className="floating-title">Drawing tools</div>
            {DRAWING_TOOLS.map((tool) => (
              <button
                type="button"
                key={tool}
                className={activeTool === tool ? "selected" : ""}
                onClick={() => {
                  setActiveTool(tool);
                  setToolsMenuOpen(false);
                }}
              >
                {tool}
              </button>
            ))}
          </div>
        )}

        <div className="chart-bottom-info">
          <button type="button" className="small-chip">←</button>
          <button type="button" className="small-chip">{timeframe} ▲</button>
          <div className="asset-name-chip">{selectedAsset.name}</div>
        </div>
      </section>

      <aside className="trade-panel">
        <div className="sentiment-row">
          <span>50%</span>
          <div className="sentiment-track">
            <div className="sentiment-green" />
            <div className="sentiment-red" />
            <div className="sentiment-thumb" />
          </div>
          <span>50%</span>
        </div>

        <div className="panel-section">
          <div className="section-label">Time ⓘ</div>
          <div className="main-time-control">
            <button type="button" onClick={() => setExpirySeconds((v) => clamp(v - 1, 5, 18000))}>
              -
            </button>
            <strong>{formatExpiry(expirySeconds)}</strong>
            <button type="button" onClick={() => setExpirySeconds((v) => clamp(v + 1, 5, 18000))}>
              +
            </button>
          </div>
          <div className="time-limit">Min 00:00:05 · Max 05:00:00</div>

          <div className="expiry-unit-grid">
            <div className="expiry-unit-card">
              <button type="button" onClick={() => changeExpiryUnit("hours", 1)}>+</button>
              <strong>{String(expiryParts.hours).padStart(2, "0")}</strong>
              <button type="button" onClick={() => changeExpiryUnit("hours", -1)}>-</button>
              <span>Hours</span>
            </div>

            <div className="expiry-unit-card">
              <button type="button" onClick={() => changeExpiryUnit("minutes", 1)}>+</button>
              <strong>{String(expiryParts.minutes).padStart(2, "0")}</strong>
              <button type="button" onClick={() => changeExpiryUnit("minutes", -1)}>-</button>
              <span>Minutes</span>
            </div>

            <div className="expiry-unit-card">
              <button type="button" onClick={() => changeExpiryUnit("seconds", 1)}>+</button>
              <strong>{String(expiryParts.seconds).padStart(2, "0")}</strong>
              <button type="button" onClick={() => changeExpiryUnit("seconds", -1)}>-</button>
              <span>Seconds</span>
            </div>
          </div>
        </div>

        <div className="panel-section">
          <div className="section-label">Amount ⓘ</div>
          <div className="amount-box">
            <input
              value={amountText}
              type="number"
              min="0"
              onChange={(event) => setAmountText(event.target.value)}
            />
            <span>{currency}</span>
          </div>
        </div>

        <div className="payout-card">
          <div>
            <span>Rate</span>
            <strong>+{payoutRate.toFixed(0)}%</strong>
          </div>
          <div>
            <span>Expected profit</span>
            <strong>{formatMoney(expectedProfitLocal, currency)}</strong>
          </div>
          <div>
            <span>Expected return</span>
            <strong>{formatMoney(expectedReturnLocal, currency)}</strong>
          </div>
        </div>

        {!canTrade && (
          <div className="trade-warning">
            Insufficient balance or invalid amount.
          </div>
        )}

        <button
          type="button"
          className="trade-button buy"
          disabled={!canTrade}
          onClick={() => placeTrade("BUY")}
        >
          ↗ BUY
        </button>

        <button type="button" className="ai-button">
          AI TRADING
        </button>

        <button
          type="button"
          className="trade-button sell"
          disabled={!canTrade}
          onClick={() => placeTrade("SELL")}
        >
          ↘ SELL
        </button>
      </aside>

      <aside className="right-rail">
        {QUICK_ITEMS.map(([icon, label]) => (
          <button
            type="button"
            key={label}
            className="quick-item"
            onClick={label === "Full Screen" ? toggleFullscreen : undefined}
          >
            <span>{icon}</span>
            <small>{label}</small>
          </button>
        ))}
      </aside>

      <nav className="mobile-bottom-nav">
        {QUICK_ITEMS.slice(0, 5).map(([icon, label]) => (
          <button type="button" key={label}>
            <span>{icon}</span>
            <small>{label}</small>
          </button>
        ))}
      </nav>

      {topUpOpen && (
        <div className="modal-backdrop" onClick={() => setTopUpOpen(false)}>
          <div className="topup-modal" onClick={(event) => event.stopPropagation()}>
            <h3>Top Up</h3>
            <p>Payment gateway integration placeholder for NeuroOption.</p>
            <button type="button" onClick={() => setTopUpOpen(false)}>
              Close
            </button>
          </div>
        </div>
      )}
    </main>
  );
}