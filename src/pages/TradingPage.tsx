import React from "react";
import "./TradingPage.css";

type AccountType = "demo" | "real";
type ChartType = "Candlesticks" | "Heiken Ashi" | "Bars" | "Line";
type Direction = "BUY" | "SELL";
type AssetCategory =
  | "Currencies"
  | "Cryptocurrencies"
  | "Stocks"
  | "Indices"
  | "Commodities";

type Asset = {
  symbol: string;
  name: string;
  category: AssetCategory;
  basePrice: number;
  precision: number;
  volatility: number;
};

type Candle = {
  open: number;
  high: number;
  low: number;
  close: number;
  time: number;
};

type TradeMarker = {
  id: string;
  direction: Direction;
  account: AccountType;
  currency: CurrencyCode;
  entryPrice: number;
  stakeUsd: number;
  payout: number;
  createdAt: number;
};

type ResultMarker = {
  id: string;
  direction: Direction;
  currency: CurrencyCode;
  price: number;
  valueUsd: number;
  win: boolean;
  createdAt: number;
};

const EXCHANGE_RATES = {
  USD: 1,
  KES: 129,
  UGX: 3800,
  TZS: 2600,
  NGN: 1500,
  XOF: 610,
  EUR: 0.92,
  CAD: 1.37,
  JPY: 157,
  CNY: 7.25,
  AOA: 870,
  ZAR: 18.2,
  BRL: 5.45,
} as const;

type CurrencyCode = keyof typeof EXCHANGE_RATES;

const CURRENCY_SYMBOLS: Record<CurrencyCode, string> = {
  USD: "$",
  KES: "KES ",
  UGX: "UGX ",
  TZS: "TZS ",
  NGN: "NGN ",
  XOF: "XOF ",
  EUR: "€",
  CAD: "CAD ",
  JPY: "¥",
  CNY: "¥",
  AOA: "AOA ",
  ZAR: "R",
  BRL: "R$",
};

const ASSET_CATEGORIES: AssetCategory[] = [
  "Currencies",
  "Cryptocurrencies",
  "Stocks",
  "Indices",
  "Commodities",
];

const ASSETS: Asset[] = [
  { symbol: "AUD/CAD OTC", name: "Australian Dollar / Canadian Dollar", category: "Currencies", basePrice: 0.84217, precision: 5, volatility: 0.00052 },
  { symbol: "EUR/USD OTC", name: "Euro / United States Dollar", category: "Currencies", basePrice: 1.13351, precision: 5, volatility: 0.0006 },
  { symbol: "USD/JPY OTC", name: "United States Dollar / Japanese Yen", category: "Currencies", basePrice: 157.42, precision: 3, volatility: 0.12 },
  { symbol: "GBP/USD OTC", name: "British Pound / United States Dollar", category: "Currencies", basePrice: 1.271, precision: 5, volatility: 0.0007 },
  { symbol: "BTC/USD OTC", name: "Bitcoin / United States Dollar", category: "Cryptocurrencies", basePrice: 68450, precision: 2, volatility: 115 },
  { symbol: "ETH/USD OTC", name: "Ethereum / United States Dollar", category: "Cryptocurrencies", basePrice: 3520, precision: 2, volatility: 9 },
  { symbol: "Tesla OTC", name: "Tesla Inc.", category: "Stocks", basePrice: 183.22, precision: 2, volatility: 0.9 },
  { symbol: "Apple OTC", name: "Apple Inc.", category: "Stocks", basePrice: 196.48, precision: 2, volatility: 0.65 },
  { symbol: "Amazon OTC", name: "Amazon.com Inc.", category: "Stocks", basePrice: 184.7, precision: 2, volatility: 0.7 },
  { symbol: "US100 OTC", name: "Nasdaq 100", category: "Indices", basePrice: 19888.46, precision: 2, volatility: 31 },
  { symbol: "US30 OTC", name: "Dow Jones 30", category: "Indices", basePrice: 38780.22, precision: 2, volatility: 42 },
  { symbol: "XAU/USD OTC", name: "Gold / United States Dollar", category: "Commodities", basePrice: 2332.45, precision: 2, volatility: 4.8 },
  { symbol: "Brent OTC", name: "Brent Crude Oil", category: "Commodities", basePrice: 81.34, precision: 2, volatility: 0.35 },
];

const TIMEFRAMES = ["S5", "S10", "S15", "S30", "M1", "M2", "M3", "M5", "M10", "M15", "M30", "H1", "H4", "D1"];

const INDICATORS = [
  "Moving Average", "EMA", "SMA", "WMA", "Bollinger Bands", "RSI", "MACD", "Stochastic",
  "ADX", "ATR", "CCI", "Momentum", "Ichimoku", "Parabolic SAR", "Fractals", "Alligator",
  "Awesome Oscillator", "DeMarker", "Envelopes", "Force Index", "Gator Oscillator", "MFI",
  "OBV", "Williams %R", "ZigZag", "Pivot Points", "Keltner Channel", "Donchian Channel",
  "SuperTrend", "VWAP", "Volume", "Aroon", "TRIX", "ROC", "DPO", "Elder Ray",
  "Standard Deviation", "Linear Regression", "Heikin Trend", "Fibonacci Bands", "Price Channel", "Market Sentiment",
];

const DRAWING_TOOLS = [
  "Cursor", "Trend Line", "Horizontal Line", "Vertical Line", "Brush", "Text", "Rectangle", "Fibonacci", "Eraser",
];

const LEFT_MENU = [
  { label: "Trading", icon: "📈" },
  { label: "Finance", icon: "💵" },
  { label: "Profile", icon: "👤" },
  { label: "Market", icon: "🛒" },
  { label: "Achievements", icon: "💎" },
  { label: "Tournaments", icon: "🏆" },
  { label: "Chat", icon: "💬" },
  { label: "Help", icon: "?" },
  { label: "Promo", icon: "🎁" },
  { label: "Autotrading", icon: "🤖" },
];

const QUICK_MENU = [
  { label: "Trades", icon: "↻" },
  { label: "Signals", icon: "📡" },
  { label: "Social Trading", icon: "👥" },
  { label: "Express Trades", icon: "◎" },
  { label: "Pending Trades", icon: "⏳" },
  { label: "Hotkeys", icon: "⌨" },
  { label: "Full Screen", icon: "⛶" },
];

const MIN_EXPIRY = 5;
const MAX_EXPIRY = 5 * 60 * 60;

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function formatExpiry(totalSeconds: number) {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return [hours, minutes, seconds]
    .map((value) => String(value).padStart(2, "0"))
    .join(":");
}

function splitExpiry(totalSeconds: number) {
  return {
    hours: Math.floor(totalSeconds / 3600),
    minutes: Math.floor((totalSeconds % 3600) / 60),
    seconds: totalSeconds % 60,
  };
}

function formatMoney(value: number, currency: CurrencyCode) {
  const symbol = CURRENCY_SYMBOLS[currency];
  const decimals = currency === "JPY" || currency === "XOF" ? 0 : 2;

  return `${symbol}${value.toLocaleString(undefined, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })}`;
}

function formatPlainAmount(value: number, currency: CurrencyCode) {
  const decimals = currency === "JPY" || currency === "XOF" ? 0 : 2;

  return value.toFixed(decimals);
}

function calcPayout(asset: Asset, timeframe: string) {
  const seed = asset.symbol.length * 13 + timeframe.length * 17;
  const wave = Math.sin(Date.now() / 7000 + seed) * 7;
  const volatilityBonus = Math.min(8, asset.volatility * 1000);
  return Math.round(clamp(78 + wave + volatilityBonus, 20, 92));
}

function makeCandles(asset: Asset, count = 110): Candle[] {
  const candles: Candle[] = [];
  let price = asset.basePrice;

  for (let i = 0; i < count; i += 1) {
    const open = price;
    const drift = Math.sin(i / 8) * asset.volatility * 0.9;
    const noise = (Math.random() - 0.46) * asset.volatility * 3;
    const close = Math.max(asset.volatility, open + drift + noise);
    const high = Math.max(open, close) + Math.random() * asset.volatility * 2;
    const low = Math.min(open, close) - Math.random() * asset.volatility * 2;

    candles.push({
      open,
      high,
      low: Math.max(0.00001, low),
      close,
      time: Date.now() - (count - i) * 60_000,
    });

    price = close;
  }

  return candles;
}

function toHeikenAshi(candles: Candle[]) {
  const result: Candle[] = [];

  candles.forEach((candle, index) => {
    const close = (candle.open + candle.high + candle.low + candle.close) / 4;
    const open =
      index === 0
        ? (candle.open + candle.close) / 2
        : (result[index - 1].open + result[index - 1].close) / 2;

    result.push({
      open,
      close,
      high: Math.max(candle.high, open, close),
      low: Math.min(candle.low, open, close),
      time: candle.time,
    });
  });

  return result;
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
  candlesInput: Candle[],
  asset: Asset,
  chartType: ChartType,
  timeframe: string,
  trades: TradeMarker[],
  results: ResultMarker[],
) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const rect = canvas.getBoundingClientRect();
  const dpr = window.devicePixelRatio || 1;
  const width = Math.max(320, rect.width);
  const height = Math.max(320, rect.height);

  if (
    canvas.width !== Math.floor(width * dpr) ||
    canvas.height !== Math.floor(height * dpr)
  ) {
    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
  }

  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.clearRect(0, 0, width, height);

  const background = ctx.createLinearGradient(0, 0, width, height);
  background.addColorStop(0, "#1f3156");
  background.addColorStop(0.52, "#14233f");
  background.addColorStop(1, "#0a1328");
  ctx.fillStyle = background;
  ctx.fillRect(0, 0, width, height);

  ctx.globalAlpha = 0.32;
  ctx.fillStyle = "#6882a8";
  ctx.beginPath();
  ctx.moveTo(0, height * 0.76);
  ctx.lineTo(width * 0.14, height * 0.48);
  ctx.lineTo(width * 0.3, height * 0.76);
  ctx.lineTo(width * 0.48, height * 0.48);
  ctx.lineTo(width * 0.65, height * 0.76);
  ctx.lineTo(width * 0.82, height * 0.56);
  ctx.lineTo(width, height * 0.74);
  ctx.lineTo(width, height);
  ctx.lineTo(0, height);
  ctx.closePath();
  ctx.fill();
  ctx.globalAlpha = 1;

  const top = 64;
  const left = 12;
  const right = 66;
  const bottom = 34;
  const plotW = width - left - right;
  const plotH = height - top - bottom;
  const plotR = left + plotW;
  const plotB = top + plotH;

  ctx.strokeStyle = "rgba(151, 184, 225, 0.16)";
  ctx.lineWidth = 1;

  for (let i = 0; i <= 8; i += 1) {
    const x = left + (plotW / 8) * i;
    ctx.beginPath();
    ctx.moveTo(x, top);
    ctx.lineTo(x, plotB);
    ctx.stroke();
  }

  for (let i = 0; i <= 6; i += 1) {
    const y = top + (plotH / 6) * i;
    ctx.beginPath();
    ctx.moveTo(left, y);
    ctx.lineTo(plotR, y);
    ctx.stroke();
  }

  const candles = chartType === "Heiken Ashi" ? toHeikenAshi(candlesInput) : candlesInput;
  const lows = candles.map((candle) => candle.low);
  const highs = candles.map((candle) => candle.high);
  const minRaw = Math.min(...lows);
  const maxRaw = Math.max(...highs);
  const pad = Math.max((maxRaw - minRaw) * 0.16, asset.volatility * 4);
  const min = minRaw - pad;
  const max = maxRaw + pad;
  const range = max - min || 1;

  const priceToY = (price: number) => top + ((max - price) / range) * plotH;
  const step = plotW / Math.max(candles.length - 1, 1);
  const candleWidth = Math.max(2.4, Math.min(8, step * 0.58));

  ctx.font = "700 12px Inter, Arial, sans-serif";
  ctx.fillStyle = "rgba(219, 233, 255, 0.82)";
  ctx.textAlign = "right";

  for (let i = 0; i <= 5; i += 1) {
    const price = max - (range / 5) * i;
    const y = priceToY(price);
    ctx.fillText(price.toFixed(asset.precision), width - 8, y + 4);
  }

  if (chartType === "Line") {
    ctx.beginPath();
    candles.forEach((candle, index) => {
      const x = left + index * step;
      const y = priceToY(candle.close);
      if (index === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.strokeStyle = "#56d7ff";
    ctx.lineWidth = 2.5;
    ctx.stroke();
  } else {
    candles.forEach((candle, index) => {
      const x = left + index * step;
      const openY = priceToY(candle.open);
      const closeY = priceToY(candle.close);
      const highY = priceToY(candle.high);
      const lowY = priceToY(candle.low);
      const up = candle.close >= candle.open;
      const color = up ? "#67e8dc" : "#ff725f";

      ctx.strokeStyle = color;
      ctx.fillStyle = color;
      ctx.lineWidth = chartType === "Bars" ? 1.7 : 1.2;

      if (chartType === "Bars") {
        ctx.beginPath();
        ctx.moveTo(x, highY);
        ctx.lineTo(x, lowY);
        ctx.moveTo(x - candleWidth, openY);
        ctx.lineTo(x, openY);
        ctx.moveTo(x, closeY);
        ctx.lineTo(x + candleWidth, closeY);
        ctx.stroke();
      } else {
        ctx.beginPath();
        ctx.moveTo(x, highY);
        ctx.lineTo(x, lowY);
        ctx.stroke();

        const bodyTop = Math.min(openY, closeY);
        const bodyHeight = Math.max(Math.abs(closeY - openY), 2);
        roundedRect(ctx, x - candleWidth / 2, bodyTop, candleWidth, bodyHeight, 1.5);
        ctx.fill();
      }
    });
  }

  const current = candlesInput[candlesInput.length - 1]?.close || asset.basePrice;
  const currentY = priceToY(current);

  ctx.setLineDash([6, 6]);
  ctx.strokeStyle = "rgba(111, 213, 255, 0.72)";
  ctx.lineWidth = 1.2;
  ctx.beginPath();
  ctx.moveTo(left, currentY);
  ctx.lineTo(plotR, currentY);
  ctx.stroke();
  ctx.setLineDash([]);

  ctx.fillStyle = "#8ccaff";
  roundedRect(ctx, plotR + 4, currentY - 16, 58, 30, 7);
  ctx.fill();
  ctx.fillStyle = "#ffffff";
  ctx.font = "800 12px Inter, Arial, sans-serif";
  ctx.textAlign = "center";
  ctx.fillText(current.toFixed(asset.precision), plotR + 33, currentY + 4);

  const expiryX = plotR - Math.min(96, plotW * 0.15);
  ctx.strokeStyle = "rgba(255, 255, 255, 0.82)";
  ctx.lineWidth = 1.4;
  ctx.beginPath();
  ctx.moveTo(expiryX, top);
  ctx.lineTo(expiryX, plotB);
  ctx.stroke();

  ctx.fillStyle = "#ffffff";
  ctx.font = "700 11px Inter, Arial, sans-serif";
  ctx.textAlign = "left";
  ctx.fillText("Expiration time", expiryX + 8, top + 28);

  ctx.font = "700 13px Inter, Arial, sans-serif";
  ctx.fillStyle = "rgba(221, 232, 255, 0.8)";
  ctx.textAlign = "center";
  ctx.fillText(timeframe, Math.min(expiryX + 16, plotR - 20), currentY - 10);

  const timeLabels = ["13:16", "13:32", "13:48", "14:04"];
  timeLabels.forEach((label, index) => {
    const x = left + (plotW / (timeLabels.length - 1)) * index;
    ctx.fillStyle = "rgba(221, 232, 255, 0.62)";
    ctx.font = "600 11px Inter, Arial, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(label, x, height - 10);
  });

  trades.forEach((trade, index) => {
    const y = priceToY(trade.entryPrice);
    const x = left + 36 + index * 82;
    const stakeText = formatMoney(trade.stakeUsd * EXCHANGE_RATES[trade.currency], trade.currency);
    const label = `${trade.direction} ${stakeText}`;

    ctx.setLineDash([3, 4]);
    ctx.strokeStyle = trade.direction === "BUY" ? "rgba(93, 230, 121, 0.85)" : "rgba(255, 106, 86, 0.85)";
    ctx.beginPath();
    ctx.moveTo(left, y);
    ctx.lineTo(plotR, y);
    ctx.stroke();
    ctx.setLineDash([]);

    ctx.fillStyle = trade.direction === "BUY" ? "#56d66f" : "#ff6256";
    roundedRect(ctx, x, y - 18, 120, 28, 7);
    ctx.fill();

    ctx.fillStyle = "#ffffff";
    ctx.font = "800 11px Inter, Arial, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(label, x + 60, y);
  });

  results.forEach((result, index) => {
    const y = priceToY(result.price);
    const x = left + 54 + index * 90;
    const value = formatMoney(result.valueUsd * EXCHANGE_RATES[result.currency], result.currency);
    const label = result.win ? `✓ ${value}` : `✓ ${CURRENCY_SYMBOLS[result.currency]}0`;

    ctx.fillStyle = result.win ? "#30d96a" : "#ff4238";
    roundedRect(ctx, x, y - 44, 122, 30, 8);
    ctx.fill();

    ctx.fillStyle = "#ffffff";
    ctx.font = "900 12px Inter, Arial, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(label, x + 61, y - 24);
  });

  ctx.fillStyle = "rgba(255,255,255,0.72)";
  ctx.font = "700 12px Inter, Arial, sans-serif";
  ctx.textAlign = "left";
  ctx.fillText("Current price", Math.max(left + 210, plotR - 240), top + 24);
}

export default function TradingPage() {
  const canvasRef = React.useRef<HTMLCanvasElement | null>(null);
  const candlesRef = React.useRef<Candle[]>([]);
  const assetRef = React.useRef<Asset>(ASSETS[0]);
  const chartTypeRef = React.useRef<ChartType>("Candlesticks");
  const timeframeRef = React.useRef("M1");
  const payoutRef = React.useRef(92);
  const currentPriceRef = React.useRef(ASSETS[0].basePrice);
  const tradeMarkersRef = React.useRef<TradeMarker[]>([]);
  const resultMarkersRef = React.useRef<ResultMarker[]>([]);
  const timeoutsRef = React.useRef<ReturnType<typeof window.setTimeout>[]>([]);
  const lastCandleAtRef = React.useRef(Date.now());
  const lastStatePriceAtRef = React.useRef(Date.now());

  const [accountType, setAccountType] = React.useState<AccountType>("demo");
  const [currency, setCurrency] = React.useState<CurrencyCode>("USD");
  const [demoBalanceUsd, setDemoBalanceUsd] = React.useState(70000);
  const [realBalanceUsd, setRealBalanceUsd] = React.useState(0);

  const [selectedAsset, setSelectedAsset] = React.useState<Asset>(ASSETS[0]);
  const [activeCategory, setActiveCategory] = React.useState<AssetCategory>("Currencies");
  const [chartType, setChartType] = React.useState<ChartType>("Candlesticks");
  const [timeframe, setTimeframe] = React.useState("M1");
  const [payout, setPayout] = React.useState(92);
  const [expirySeconds, setExpirySeconds] = React.useState(30 * 60);
  const [stakeUsd, setStakeUsd] = React.useState(100);
  const [amountText, setAmountText] = React.useState("100.00");
  const [currentPrice, setCurrentPrice] = React.useState(selectedAsset.basePrice);

  const [showAssets, setShowAssets] = React.useState(false);
  const [showIndicators, setShowIndicators] = React.useState(false);
  const [showDrawingTools, setShowDrawingTools] = React.useState(false);
  const [showTimeframes, setShowTimeframes] = React.useState(false);
  const [showTopUp, setShowTopUp] = React.useState(false);

  const [activeIndicators, setActiveIndicators] = React.useState<string[]>([]);
  const [activeTool, setActiveTool] = React.useState("Cursor");
  const [notice, setNotice] = React.useState("");

  const currencyRate = EXCHANGE_RATES[currency];
  const balanceUsd = accountType === "demo" ? demoBalanceUsd : realBalanceUsd;
  const convertedBalance = balanceUsd * currencyRate;
  const convertedStake = stakeUsd * currencyRate;
  const expectedProfit = convertedStake * (payout / 100);
  const expectedReturn = convertedStake + expectedProfit;
  const canTrade = stakeUsd > 0 && stakeUsd <= balanceUsd;

  const expiryParts = splitExpiry(expirySeconds);

  React.useEffect(() => {
    candlesRef.current = makeCandles(selectedAsset);
    currentPriceRef.current = candlesRef.current[candlesRef.current.length - 1].close;
    setCurrentPrice(currentPriceRef.current);
    assetRef.current = selectedAsset;
    tradeMarkersRef.current = [];
    resultMarkersRef.current = [];
  }, [selectedAsset]);

  React.useEffect(() => {
    assetRef.current = selectedAsset;
  }, [selectedAsset]);

  React.useEffect(() => {
    chartTypeRef.current = chartType;
  }, [chartType]);

  React.useEffect(() => {
    timeframeRef.current = timeframe;
  }, [timeframe]);

  React.useEffect(() => {
    payoutRef.current = payout;
  }, [payout]);

  React.useEffect(() => {
    setAmountText(formatPlainAmount(stakeUsd * EXCHANGE_RATES[currency], currency));
  }, [currency]);

  React.useEffect(() => {
    const updatePayout = () => {
      const nextPayout = calcPayout(assetRef.current, timeframeRef.current);
      setPayout(nextPayout);
      payoutRef.current = nextPayout;
    };

    updatePayout();
    const id = window.setInterval(updatePayout, 4000);

    return () => window.clearInterval(id);
  }, []);

  React.useEffect(() => {
    const updateSyntheticPrice = () => {
      const candles = candlesRef.current;
      const asset = assetRef.current;

      if (candles.length === 0) {
        candlesRef.current = makeCandles(asset);
        return;
      }

      const now = Date.now();
      const last = candles[candles.length - 1];
      const wave = Math.sin(now / 1800 + asset.symbol.length) * asset.volatility * 0.16;
      const noise = (Math.random() - 0.49) * asset.volatility * 0.88;
      const nextClose = Math.max(asset.volatility, last.close + wave + noise);

      last.close = nextClose;
      last.high = Math.max(last.high, nextClose);
      last.low = Math.min(last.low, nextClose);
      currentPriceRef.current = nextClose;

      if (now - lastCandleAtRef.current > 850) {
        candles.push({
          open: nextClose,
          high: nextClose + Math.random() * asset.volatility,
          low: Math.max(0.00001, nextClose - Math.random() * asset.volatility),
          close: nextClose,
          time: now,
        });

        if (candles.length > 115) candles.shift();
        lastCandleAtRef.current = now;
      }

      if (now - lastStatePriceAtRef.current > 420) {
        setCurrentPrice(nextClose);
        lastStatePriceAtRef.current = now;
      }
    };

    const tick = window.setInterval(updateSyntheticPrice, 180);

    let animationFrame = 0;
    const render = () => {
      if (canvasRef.current) {
        drawChart(
          canvasRef.current,
          candlesRef.current,
          assetRef.current,
          chartTypeRef.current,
          timeframeRef.current,
          tradeMarkersRef.current,
          resultMarkersRef.current,
        );
      }

      animationFrame = window.requestAnimationFrame(render);
    };

    render();

    return () => {
      window.clearInterval(tick);
      window.cancelAnimationFrame(animationFrame);
    };
  }, []);

  React.useEffect(() => {
    return () => {
      timeoutsRef.current.forEach((timeout) => window.clearTimeout(timeout));
    };
  }, []);

  function updateBalance(account: AccountType, updater: (value: number) => number) {
    if (account === "demo") {
      setDemoBalanceUsd((current) => Math.max(0, updater(current)));
    } else {
      setRealBalanceUsd((current) => Math.max(0, updater(current)));
    }
  }

  function handleAmountChange(event: React.ChangeEvent<HTMLInputElement>) {
    const value = event.target.value.replace(/[^\d.]/g, "");
    setAmountText(value);

    const parsed = Number(value);
    if (Number.isFinite(parsed)) {
      setStakeUsd(parsed / currencyRate);
    }
  }

  function changeExpiry(unit: "hours" | "minutes" | "seconds", delta: number) {
    const step = unit === "hours" ? 3600 : unit === "minutes" ? 60 : 1;
    setExpirySeconds((current) => clamp(current + step * delta, MIN_EXPIRY, MAX_EXPIRY));
  }

  function toggleIndicator(indicator: string) {
    setActiveIndicators((current) =>
      current.includes(indicator)
        ? current.filter((item) => item !== indicator)
        : [...current, indicator],
    );
  }

  function closeMenus() {
    setShowAssets(false);
    setShowIndicators(false);
    setShowDrawingTools(false);
    setShowTimeframes(false);
  }

  function placeTrade(direction: Direction) {
    if (!canTrade) {
      setNotice("Insufficient balance or invalid amount.");
      return;
    }

    const account = accountType;
    const tradeCurrency = currency;
    const entryPrice = currentPriceRef.current;
    const capturedStakeUsd = stakeUsd;
    const capturedPayout = payoutRef.current;
    const id = `${Date.now()}-${Math.random()}`;

    const marker: TradeMarker = {
      id,
      direction,
      account,
      currency: tradeCurrency,
      entryPrice,
      stakeUsd: capturedStakeUsd,
      payout: capturedPayout,
      createdAt: Date.now(),
    };

    updateBalance(account, (value) => value - capturedStakeUsd);
    tradeMarkersRef.current = [...tradeMarkersRef.current, marker].slice(-6);
    setNotice(`${direction} trade placed at ${entryPrice.toFixed(selectedAsset.precision)}.`);

    const settleTimeout = window.setTimeout(() => {
      const closePrice = currentPriceRef.current;
      const win =
        direction === "BUY"
          ? closePrice > entryPrice
          : closePrice < entryPrice;

      const profitUsd = capturedStakeUsd * (capturedPayout / 100);
      const returnUsd = win ? capturedStakeUsd + profitUsd : 0;

      if (win) {
        updateBalance(account, (value) => value + returnUsd);
      }

      tradeMarkersRef.current = tradeMarkersRef.current.filter((trade) => trade.id !== id);
      resultMarkersRef.current = [
        ...resultMarkersRef.current,
        {
          id,
          direction,
          currency: tradeCurrency,
          price: closePrice,
          valueUsd: returnUsd,
          win,
          createdAt: Date.now(),
        },
      ].slice(-4);

      setNotice(
        win
          ? `Trade won: ${formatMoney(returnUsd * EXCHANGE_RATES[tradeCurrency], tradeCurrency)} returned.`
          : `Trade lost: ${CURRENCY_SYMBOLS[tradeCurrency]}0 returned.`,
      );

      const resultTimeout = window.setTimeout(() => {
        resultMarkersRef.current = resultMarkersRef.current.filter((result) => result.id !== id);
        setNotice("");
      }, 10000);

      timeoutsRef.current.push(resultTimeout);
    }, expirySeconds * 1000);

    timeoutsRef.current.push(settleTimeout);
  }

  async function toggleFullscreen() {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
      } else {
        await document.exitFullscreen();
      }
    } catch {
      setNotice("Fullscreen is not available in this browser.");
    }
  }

  const visibleAssets = ASSETS.filter((asset) => asset.category === activeCategory);

  return (
    <div className="no-trading-page">
      <header className="no-topbar">
        <div className="no-brand">
          <div className="no-brand-mark">N</div>
          <span className="no-brand-name">NeuroOption</span>
          <button className="no-star" type="button">★</button>
        </div>

        <div className="no-account-strip">
          <select
            value={accountType}
            onChange={(event) => setAccountType(event.target.value as AccountType)}
            className="no-select no-account-select"
          >
            <option value="demo">QT Demo</option>
            <option value="real">QT Real</option>
          </select>

          <select
            value={currency}
            onChange={(event) => setCurrency(event.target.value as CurrencyCode)}
            className="no-select no-currency-select"
          >
            {(Object.keys(EXCHANGE_RATES) as CurrencyCode[]).map((item) => (
              <option key={item} value={item}>{item}</option>
            ))}
          </select>

          <div className="no-balance">{formatMoney(convertedBalance, currency)}</div>

          <button className="no-topup" type="button" onClick={() => setShowTopUp(true)}>
            TOP UP
          </button>

          <button className="no-icon-button" type="button" onClick={toggleFullscreen} aria-label="Toggle full screen">
            ⛶
          </button>

          <div className="no-avatar">SM</div>
        </div>
      </header>

      <div className="no-terminal-grid">
        <aside className="no-left-sidebar">
          {LEFT_MENU.map((item) => (
            <button
              type="button"
              key={item.label}
              className={`no-left-item ${item.label === "Trading" ? "active" : ""}`}
            >
              <span className="no-left-icon">{item.icon}</span>
              <span className="no-left-label">{item.label}</span>
            </button>
          ))}
        </aside>

        <main className="no-chart-shell">
          <canvas ref={canvasRef} className="no-chart-canvas" />

          <div className="no-chart-toolbar">
            <button
              className="no-asset-button"
              type="button"
              onClick={() => {
                closeMenus();
                setShowAssets((current) => !current);
              }}
            >
              <span>{selectedAsset.symbol}</span>
              <b>⌄</b>
            </button>

            <button
              className="no-tool-button"
              type="button"
              onClick={() => {
                closeMenus();
                setShowTimeframes((current) => !current);
              }}
            >
              📊 {timeframe}
            </button>

            <button
              className="no-tool-button"
              type="button"
              onClick={() => {
                closeMenus();
                setShowIndicators((current) => !current);
              }}
            >
              ☷ {activeIndicators.length > 0 ? activeIndicators.length : ""}
            </button>

            <button
              className="no-tool-button"
              type="button"
              onClick={() => {
                closeMenus();
                setShowDrawingTools((current) => !current);
              }}
            >
              ✎
            </button>

            <div className="no-chart-tabs">
              {(["Candlesticks", "Heiken Ashi", "Bars", "Line"] as ChartType[]).map((type) => (
                <button
                  key={type}
                  type="button"
                  className={`no-chart-tab ${chartType === type ? "active" : ""}`}
                  onClick={() => setChartType(type)}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          <div className="no-chart-meta">
            <span>{new Date().toLocaleTimeString()} UTC+3</span>
            <span>{selectedAsset.name}</span>
            <span>Current price {currentPrice.toFixed(selectedAsset.precision)}</span>
            <span>Tool: {activeTool}</span>
          </div>

          <div className="no-bottom-chart-bar">
            <button type="button" className="no-mini-button">←</button>
            <button
              type="button"
              className="no-mini-button"
              onClick={() => {
                closeMenus();
                setShowTimeframes((current) => !current);
              }}
            >
              {timeframe} ▲
            </button>
            <div className="no-asset-fullname">{selectedAsset.name}</div>
          </div>

          {showAssets && (
            <div className="no-floating-menu no-assets-menu">
              <div className="no-menu-title">Assets</div>
              <div className="no-category-tabs">
                {ASSET_CATEGORIES.map((category) => (
                  <button
                    type="button"
                    key={category}
                    className={activeCategory === category ? "active" : ""}
                    onClick={() => setActiveCategory(category)}
                  >
                    {category}
                  </button>
                ))}
              </div>
              <div className="no-asset-list">
                {visibleAssets.map((asset) => (
                  <button
                    type="button"
                    key={asset.symbol}
                    onClick={() => {
                      setSelectedAsset(asset);
                      setShowAssets(false);
                    }}
                  >
                    <b>{asset.symbol}</b>
                    <span>{asset.name}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {showTimeframes && (
            <div className="no-floating-menu no-timeframe-menu">
              <div className="no-menu-title">Timeframes</div>
              <div className="no-grid-menu">
                {TIMEFRAMES.map((item) => (
                  <button
                    type="button"
                    key={item}
                    className={timeframe === item ? "active" : ""}
                    onClick={() => {
                      setTimeframe(item);
                      setShowTimeframes(false);
                    }}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
          )}

          {showIndicators && (
            <div className="no-floating-menu no-indicator-menu">
              <div className="no-menu-title">Indicators</div>
              <div className="no-grid-menu indicators">
                {INDICATORS.map((indicator) => (
                  <button
                    type="button"
                    key={indicator}
                    className={activeIndicators.includes(indicator) ? "active" : ""}
                    onClick={() => toggleIndicator(indicator)}
                  >
                    {indicator}
                  </button>
                ))}
              </div>
            </div>
          )}

          {showDrawingTools && (
            <div className="no-floating-menu no-drawing-menu">
              <div className="no-menu-title">Drawing Tools</div>
              <div className="no-grid-menu">
                {DRAWING_TOOLS.map((tool) => (
                  <button
                    type="button"
                    key={tool}
                    className={activeTool === tool ? "active" : ""}
                    onClick={() => {
                      setActiveTool(tool);
                      setShowDrawingTools(false);
                    }}
                  >
                    {tool}
                  </button>
                ))}
              </div>
            </div>
          )}

          {notice && <div className="no-toast">{notice}</div>}
        </main>

        <aside className="no-trade-panel">
          <div className="no-sentiment">
            <span>50%</span>
            <div className="no-sentiment-track">
              <div className="green" />
              <div className="red" />
              <b />
            </div>
            <span>50%</span>
          </div>

          <section className="no-panel-section">
            <h3>Time <span>ⓘ</span></h3>

            <div className="no-main-time-row">
              <button type="button" onClick={() => changeExpiry("seconds", -1)}>-</button>
              <strong>{formatExpiry(expirySeconds)}</strong>
              <button type="button" onClick={() => changeExpiry("seconds", 1)}>+</button>
            </div>

            <p className="no-range-text">Min 00:00:05 · Max 05:00:00</p>

            <div className="no-expiry-units">
              <div className="no-expiry-card">
                <button type="button" onClick={() => changeExpiry("hours", 1)}>+</button>
                <strong>{String(expiryParts.hours).padStart(2, "0")}</strong>
                <button type="button" onClick={() => changeExpiry("hours", -1)}>-</button>
                <span>Hours</span>
              </div>

              <div className="no-expiry-card">
                <button type="button" onClick={() => changeExpiry("minutes", 1)}>+</button>
                <strong>{String(expiryParts.minutes).padStart(2, "0")}</strong>
                <button type="button" onClick={() => changeExpiry("minutes", -1)}>-</button>
                <span>Minutes</span>
              </div>

              <div className="no-expiry-card">
                <button type="button" onClick={() => changeExpiry("seconds", 1)}>+</button>
                <strong>{String(expiryParts.seconds).padStart(2, "0")}</strong>
                <button type="button" onClick={() => changeExpiry("seconds", -1)}>-</button>
                <span>Seconds</span>
              </div>
            </div>
          </section>

          <section className="no-panel-section">
            <h3>Amount <span>ⓘ</span></h3>
            <div className="no-amount-box">
              <input
                value={amountText}
                onChange={handleAmountChange}
                inputMode="decimal"
              />
              <b>{currency}</b>
            </div>
          </section>

          <section className="no-payout-card">
            <div>
              <span>Rate</span>
              <b>+{payout}%</b>
            </div>
            <div>
              <span>Expected profit</span>
              <b>{formatMoney(expectedProfit, currency)}</b>
            </div>
            <div>
              <span>Expected return</span>
              <b>{formatMoney(expectedReturn, currency)}</b>
            </div>
          </section>

          <div className="no-action-buttons">
            <button
              type="button"
              className="buy"
              disabled={!canTrade}
              onClick={() => placeTrade("BUY")}
            >
              ↗ BUY
            </button>

            <button type="button" className="ai">
              AI TRADING
            </button>

            <button
              type="button"
              className="sell"
              disabled={!canTrade}
              onClick={() => placeTrade("SELL")}
            >
              ↘ SELL
            </button>
          </div>
        </aside>

        <aside className="no-right-menu">
          {QUICK_MENU.map((item) => (
            <button
              type="button"
              key={item.label}
              onClick={item.label === "Full Screen" ? toggleFullscreen : undefined}
            >
              <span>{item.icon}</span>
              <b>{item.label}</b>
            </button>
          ))}
        </aside>

        <nav className="no-mobile-bottom-nav">
          {QUICK_MENU.slice(0, 5).map((item) => (
            <button type="button" key={item.label}>
              <span>{item.icon}</span>
              <b>{item.label}</b>
            </button>
          ))}
        </nav>
      </div>

      {showTopUp && (
        <div className="no-modal-backdrop" onClick={() => setShowTopUp(false)}>
          <div className="no-modal" onClick={(event) => event.stopPropagation()}>
            <h2>Top Up</h2>
            <p>Payment integration placeholder for M-Pesa, cards, Binance Pay, and wallet funding.</p>
            <button type="button" onClick={() => setShowTopUp(false)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}