import React from "react";
import "./TradingPage.css";

type AccountType = "demo" | "real";
type Direction = "BUY" | "SELL";
type ChartType = "candles" | "heiken" | "bars" | "line";
type ToolName =
  | "Cursor"
  | "Trend Line"
  | "Horizontal Line"
  | "Vertical Line"
  | "Brush"
  | "Text"
  | "Rectangle"
  | "Fibonacci"
  | "Eraser";

const CURRENCIES = [
  "USD",
  "KES",
  "UGX",
  "TZS",
  "NGN",
  "XOF",
  "EUR",
  "CAD",
  "JPY",
  "CNY",
  "AOA",
  "ZAR",
  "BRL",
] as const;

type Currency = (typeof CURRENCIES)[number];

type AssetCategory =
  | "Currencies"
  | "Cryptocurrencies"
  | "Stocks"
  | "Indices"
  | "Commodities";

type Timeframe =
  | "S5"
  | "S10"
  | "S15"
  | "S30"
  | "M1"
  | "M2"
  | "M3"
  | "M5"
  | "M10"
  | "M15"
  | "M30"
  | "H1"
  | "H4"
  | "D1";

type Asset = {
  symbol: string;
  name: string;
  category: AssetCategory;
  base: number;
  volatility: number;
  precision: number;
  payoutBase: number;
};

type Candle = {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
};

type MarketRuntime = {
  price: number;
  momentum: number;
  drift: number;
  regimeUntil: number;
  candleStartedAt: number;
};

type TradeMarker = {
  id: string;
  direction: Direction;
  accountType: AccountType;
  currency: Currency;
  entryPrice: number;
  entryIndex: number;
  stakeCurrency: number;
  stakeUsd: number;
  payout: number;
  openedAt: number;
  expiresAt: number;
  label: string;
  resolved: boolean;
};

type ResultMarker = {
  id: string;
  direction: Direction;
  won: boolean;
  price: number;
  candleIndex: number;
  label: string;
  expiresAt: number;
};

const EXCHANGE_RATES: Record<Currency, number> = {
  USD: 1,
  KES: 129,
  UGX: 3720,
  TZS: 2620,
  NGN: 1500,
  XOF: 610,
  EUR: 0.92,
  CAD: 1.37,
  JPY: 157,
  CNY: 7.25,
  AOA: 910,
  ZAR: 18.2,
  BRL: 5.45,
};

const TIMEFRAME_SECONDS: Record<Timeframe, number> = {
  S5: 5,
  S10: 10,
  S15: 15,
  S30: 30,
  M1: 60,
  M2: 120,
  M3: 180,
  M5: 300,
  M10: 600,
  M15: 900,
  M30: 1800,
  H1: 3600,
  H4: 14400,
  D1: 86400,
};

const TIMEFRAMES: Timeframe[] = [
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

const ASSETS: Asset[] = [
  {
    symbol: "AUD/CAD OTC",
    name: "Australian Dollar / Canadian Dollar",
    category: "Currencies",
    base: 0.845,
    volatility: 0.00042,
    precision: 5,
    payoutBase: 92,
  },
  {
    symbol: "EUR/USD OTC",
    name: "Euro / United States Dollar",
    category: "Currencies",
    base: 1.1335,
    volatility: 0.00055,
    precision: 5,
    payoutBase: 90,
  },
  {
    symbol: "USD/JPY OTC",
    name: "United States Dollar / Japanese Yen",
    category: "Currencies",
    base: 157.2,
    volatility: 0.055,
    precision: 3,
    payoutBase: 86,
  },
  {
    symbol: "BTC/USD OTC",
    name: "Bitcoin / United States Dollar",
    category: "Cryptocurrencies",
    base: 68450,
    volatility: 72,
    precision: 2,
    payoutBase: 78,
  },
  {
    symbol: "ETH/USD OTC",
    name: "Ethereum / United States Dollar",
    category: "Cryptocurrencies",
    base: 3580,
    volatility: 8,
    precision: 2,
    payoutBase: 80,
  },
  {
    symbol: "Tesla OTC",
    name: "Tesla Inc.",
    category: "Stocks",
    base: 188.4,
    volatility: 0.42,
    precision: 2,
    payoutBase: 74,
  },
  {
    symbol: "Apple OTC",
    name: "Apple Inc.",
    category: "Stocks",
    base: 211.7,
    volatility: 0.35,
    precision: 2,
    payoutBase: 76,
  },
  {
    symbol: "Amazon OTC",
    name: "Amazon.com Inc.",
    category: "Stocks",
    base: 184.2,
    volatility: 0.38,
    precision: 2,
    payoutBase: 75,
  },
  {
    symbol: "US100 OTC",
    name: "Nasdaq 100",
    category: "Indices",
    base: 19880,
    volatility: 21,
    precision: 2,
    payoutBase: 85,
  },
  {
    symbol: "US30 OTC",
    name: "Dow Jones 30",
    category: "Indices",
    base: 38940,
    volatility: 34,
    precision: 2,
    payoutBase: 82,
  },
  {
    symbol: "XAU/USD OTC",
    name: "Gold / United States Dollar",
    category: "Commodities",
    base: 2325,
    volatility: 3.2,
    precision: 2,
    payoutBase: 88,
  },
  {
    symbol: "Brent OTC",
    name: "Brent Crude Oil",
    category: "Commodities",
    base: 82.6,
    volatility: 0.16,
    precision: 2,
    payoutBase: 84,
  },
];

const CATEGORIES: AssetCategory[] = [
  "Currencies",
  "Cryptocurrencies",
  "Stocks",
  "Indices",
  "Commodities",
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

const DRAWING_TOOLS: ToolName[] = [
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

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function timeframeSeconds(timeframe: Timeframe) {
  return TIMEFRAME_SECONDS[timeframe];
}

function formatTime(seconds: number) {
  const safe = clamp(Math.round(seconds), 5, 18000);
  const h = Math.floor(safe / 3600);
  const m = Math.floor((safe % 3600) / 60);
  const s = safe % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(
    s,
  ).padStart(2, "0")}`;
}

function splitTime(seconds: number) {
  const safe = clamp(Math.round(seconds), 5, 18000);
  return {
    hours: Math.floor(safe / 3600),
    minutes: Math.floor((safe % 3600) / 60),
    seconds: safe % 60,
  };
}

function priceText(price: number, asset: Asset) {
  return price.toFixed(asset.precision);
}

function moneyText(currency: Currency, value: number) {
  const decimals =
    currency === "JPY" || currency === "XOF" || currency === "UGX" || currency === "TZS"
      ? 0
      : 2;

  const formatted = new Intl.NumberFormat("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(Number.isFinite(value) ? value : 0);

  if (currency === "USD") return `$${formatted}`;
  if (currency === "EUR") return `€${formatted}`;
  if (currency === "JPY") return `¥${formatted}`;
  return `${currency} ${formatted}`;
}

function shortMoney(currency: Currency, value: number) {
  const decimals =
    currency === "JPY" || currency === "XOF" || currency === "UGX" || currency === "TZS"
      ? 0
      : 2;

  const formatted = new Intl.NumberFormat("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(Number.isFinite(value) ? value : 0);

  if (currency === "USD") return `$${formatted}`;
  return `${formatted} ${currency}`;
}

function createInitialCandles(asset: Asset, timeframe: Timeframe) {
  const candles: Candle[] = [];
  const count = 96;
  const now = Date.now();
  const step = timeframeSeconds(timeframe) * 1000;
  let price = asset.base;
  let momentum = 0;
  let drift = asset.volatility * 0.12;

  for (let i = 0; i < count; i += 1) {
    if (i % 18 === 0) {
      drift = (Math.random() > 0.5 ? 1 : -1) * asset.volatility * (0.07 + Math.random() * 0.18);
    }

    const open = price;
    const pulse = Math.sin(i / 5.5) * asset.volatility * 0.7;
    const noise = (Math.random() - 0.5) * asset.volatility * 2.2;
    const mean = (asset.base - price) * 0.015;

    momentum = momentum * 0.74 + drift + pulse + noise + mean;
    const close = Math.max(asset.base * 0.02, open + momentum);

    const wickA = Math.random() * asset.volatility * 2.2;
    const wickB = Math.random() * asset.volatility * 2.2;

    candles.push({
      time: now - (count - i) * step,
      open,
      high: Math.max(open, close) + wickA,
      low: Math.min(open, close) - wickB,
      close,
    });

    price = close;
  }

  return candles;
}

function toHeikenAshi(candles: Candle[]) {
  if (candles.length === 0) return [];

  const result: Candle[] = [];
  let previousOpen = candles[0].open;
  let previousClose =
    (candles[0].open + candles[0].high + candles[0].low + candles[0].close) / 4;

  for (const candle of candles) {
    const close = (candle.open + candle.high + candle.low + candle.close) / 4;
    const open = (previousOpen + previousClose) / 2;
    const high = Math.max(candle.high, open, close);
    const low = Math.min(candle.low, open, close);

    result.push({
      time: candle.time,
      open,
      high,
      low,
      close,
    });

    previousOpen = open;
    previousClose = close;
  }

  return result;
}

function roundRect(
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

export default function TradingPage() {
  const canvasRef = React.useRef<HTMLCanvasElement | null>(null);
  const animationRef = React.useRef<number | null>(null);
  const candlesRef = React.useRef<Candle[]>([]);
  const marketRef = React.useRef<MarketRuntime>({
    price: ASSETS[0].base,
    momentum: 0,
    drift: ASSETS[0].volatility * 0.1,
    regimeUntil: Date.now() + 8000,
    candleStartedAt: Date.now(),
  });

  const tradesRef = React.useRef<TradeMarker[]>([]);
  const resultsRef = React.useRef<ResultMarker[]>([]);
  const timeoutRef = React.useRef<number[]>([]);
  const chartTypeRef = React.useRef<ChartType>("candles");
  const selectedAssetRef = React.useRef<Asset>(ASSETS[0]);

  const [selectedAsset, setSelectedAsset] = React.useState<Asset>(ASSETS[0]);
  const [selectedCategory, setSelectedCategory] =
    React.useState<AssetCategory>("Currencies");
  const [timeframe, setTimeframe] = React.useState<Timeframe>("M1");
  const [chartType, setChartType] = React.useState<ChartType>("candles");
  const [accountType, setAccountType] = React.useState<AccountType>("demo");
  const [currency, setCurrency] = React.useState<Currency>("USD");
  const [balancesUsd, setBalancesUsd] = React.useState<Record<AccountType, number>>({
    demo: 70000,
    real: 0,
  });

  const [stakeUsd, setStakeUsd] = React.useState(100);
  const [stakeInput, setStakeInput] = React.useState("100.00");
  const [expirySeconds, setExpirySeconds] = React.useState(1800);
  const [payout, setPayout] = React.useState(selectedAsset.payoutBase);
  const [currentPrice, setCurrentPrice] = React.useState(selectedAsset.base);

  const [assetMenuOpen, setAssetMenuOpen] = React.useState(false);
  const [timeframeMenuOpen, setTimeframeMenuOpen] = React.useState(false);
  const [indicatorMenuOpen, setIndicatorMenuOpen] = React.useState(false);
  const [toolMenuOpen, setToolMenuOpen] = React.useState(false);
  const [activeTool, setActiveTool] = React.useState<ToolName>("Cursor");
  const [activeIndicators, setActiveIndicators] = React.useState<string[]>([]);
  const [topUpOpen, setTopUpOpen] = React.useState(false);

  const exchangeRate = EXCHANGE_RATES[currency];
  const visibleBalance = balancesUsd[accountType] * exchangeRate;
  const stakeCurrency = stakeUsd * exchangeRate;
  const expectedProfitCurrency = stakeCurrency * (payout / 100);
  const expectedReturnCurrency = stakeCurrency + expectedProfitCurrency;
  const hasEnoughBalance = balancesUsd[accountType] >= stakeUsd;
  const validStake = stakeUsd > 0 && Number.isFinite(stakeUsd);

  React.useEffect(() => {
    chartTypeRef.current = chartType;
  }, [chartType]);

  React.useEffect(() => {
    selectedAssetRef.current = selectedAsset;
  }, [selectedAsset]);

  React.useEffect(() => {
    setStakeInput((stakeUsd * exchangeRate).toFixed(currency === "JPY" ? 0 : 2));
  }, [currency, exchangeRate, stakeUsd]);

  React.useEffect(() => {
    const id = window.setInterval(() => {
      const asset = selectedAssetRef.current;
      const pulse = Math.sin(Date.now() / 4500) * 4;
      const noise = (Math.random() - 0.5) * 5;
      const next = clamp(asset.payoutBase + pulse + noise, 20, 92);
      setPayout(Math.round(next));
    }, 1800);

    return () => window.clearInterval(id);
  }, []);

  React.useEffect(() => {
    candlesRef.current = createInitialCandles(selectedAsset, timeframe);
    const last = candlesRef.current[candlesRef.current.length - 1];

    marketRef.current = {
      price: last.close,
      momentum: 0,
      drift: selectedAsset.volatility * 0.1,
      regimeUntil: Date.now() + 9000,
      candleStartedAt: Date.now(),
    };

    setCurrentPrice(last.close);
  }, [selectedAsset, timeframe]);

  React.useEffect(() => {
    let previous = performance.now();
    let lastUiUpdate = 0;

    function draw(now: number) {
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext("2d");

      if (!canvas || !ctx) {
        animationRef.current = requestAnimationFrame(draw);
        return;
      }

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
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      }

      const dt = Math.min(0.05, Math.max(0.001, (now - previous) / 1000));
      previous = now;

      updateSyntheticMarket(dt);
      renderChart(ctx, width, height);

      if (now - lastUiUpdate > 260) {
        lastUiUpdate = now;
        setCurrentPrice(marketRef.current.price);
      }

      animationRef.current = requestAnimationFrame(draw);
    }

    animationRef.current = requestAnimationFrame(draw);

    return () => {
      if (animationRef.current !== null) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  React.useEffect(() => {
    return () => {
      timeoutRef.current.forEach((id) => window.clearTimeout(id));
      timeoutRef.current = [];
    };
  }, []);

  function updateSyntheticMarket(dt: number) {
    const asset = selectedAssetRef.current;
    const market = marketRef.current;
    const candles = candlesRef.current;
    const now = Date.now();

    if (candles.length === 0) {
      candlesRef.current = createInitialCandles(asset, timeframe);
      return;
    }

    if (now >= market.regimeUntil) {
      market.regimeUntil = now + 6000 + Math.random() * 12000;
      market.drift =
        (Math.random() > 0.5 ? 1 : -1) *
        asset.volatility *
        (0.08 + Math.random() * 0.2);
    }

    const meanReversion = (asset.base - market.price) * 0.008 * dt;
    const momentumNoise = (Math.random() - 0.5) * asset.volatility * 0.12;
    const tickNoise = (Math.random() - 0.5) * asset.volatility * 0.7 * Math.sqrt(dt);
    const microPullback = -market.momentum * 0.045;

    market.momentum =
      market.momentum * 0.985 +
      market.drift * dt +
      momentumNoise * dt +
      meanReversion +
      microPullback * dt;

    market.price = Math.max(
      asset.base * 0.02,
      market.price + market.momentum + tickNoise,
    );

    const last = candles[candles.length - 1];
    last.close = market.price;
    last.high = Math.max(last.high, market.price);
    last.low = Math.min(last.low, market.price);

    const stepMs = timeframeSeconds(timeframe) * 1000;
    if (now - market.candleStartedAt >= stepMs) {
      const close = last.close;
      const newCandle: Candle = {
        time: now,
        open: close,
        high: close,
        low: close,
        close,
      };

      candles.push(newCandle);
      if (candles.length > 120) {
        candles.shift();
        tradesRef.current = tradesRef.current
          .map((trade) => ({ ...trade, entryIndex: trade.entryIndex - 1 }))
          .filter((trade) => trade.entryIndex >= 0 || !trade.resolved);

        resultsRef.current = resultsRef.current.map((result) => ({
          ...result,
          candleIndex: result.candleIndex - 1,
        }));
      }

      market.candleStartedAt = now;
    }
  }

  function renderChart(ctx: CanvasRenderingContext2D, width: number, height: number) {
    const asset = selectedAssetRef.current;
    const rawCandles = candlesRef.current;
    const renderCandles =
      chartTypeRef.current === "heiken" ? toHeikenAshi(rawCandles) : rawCandles;

    const left = 18;
    const right = 74;
    const top = 34;
    const bottom = 40;
    const chartWidth = width - left - right;
    const chartHeight = height - top - bottom;

    ctx.clearRect(0, 0, width, height);

    const background = ctx.createLinearGradient(0, 0, 0, height);
    background.addColorStop(0, "#22385f");
    background.addColorStop(0.45, "#152846");
    background.addColorStop(1, "#0b1629");
    ctx.fillStyle = background;
    ctx.fillRect(0, 0, width, height);

    drawMountains(ctx, left, top, chartWidth, chartHeight);
    drawGrid(ctx, left, top, chartWidth, chartHeight);

    const prices = renderCandles.flatMap((candle) => [
      candle.open,
      candle.high,
      candle.low,
      candle.close,
    ]);

    tradesRef.current.forEach((trade) => prices.push(trade.entryPrice));
    resultsRef.current.forEach((result) => prices.push(result.price));

    const min = Math.min(...prices);
    const max = Math.max(...prices);
    const pad = Math.max((max - min) * 0.18, asset.volatility * 8);
    const low = min - pad;
    const high = max + pad;

    const yForPrice = (price: number) =>
      top + ((high - price) / Math.max(high - low, 0.000001)) * chartHeight;

    const xStep = chartWidth / Math.max(renderCandles.length - 1, 1);
    const candleWidth = clamp(xStep * 0.54, 2, 9);

    drawPriceScale(ctx, asset, width, top, chartHeight, low, high);
    drawTimeScale(ctx, left, top, chartWidth, chartHeight, renderCandles);

    if (chartTypeRef.current === "line") {
      drawLineChart(ctx, renderCandles, left, xStep, yForPrice);
    } else if (chartTypeRef.current === "bars") {
      drawBars(ctx, renderCandles, left, xStep, yForPrice, candleWidth);
    } else {
      drawCandles(ctx, renderCandles, left, xStep, yForPrice, candleWidth);
    }

    if (activeIndicators.length > 0) {
      drawIndicatorOverlay(ctx, renderCandles, left, xStep, yForPrice);
    }

    drawCurrentPrice(ctx, asset, width, left, top, chartWidth, yForPrice);
    drawExpiryLine(ctx, left, top, chartWidth, chartHeight);
    drawTradeMarkers(ctx, left, xStep, yForPrice);
    drawResultMarkers(ctx, left, xStep, yForPrice);
  }

  function drawMountains(
    ctx: CanvasRenderingContext2D,
    left: number,
    top: number,
    width: number,
    height: number,
  ) {
    ctx.save();
    ctx.globalAlpha = 0.22;

    const baseY = top + height * 0.83;
    ctx.fillStyle = "#7da4c8";

    ctx.beginPath();
    ctx.moveTo(left, baseY);
    ctx.lineTo(left + width * 0.18, top + height * 0.48);
    ctx.lineTo(left + width * 0.34, baseY);
    ctx.lineTo(left + width * 0.55, top + height * 0.38);
    ctx.lineTo(left + width * 0.78, baseY);
    ctx.lineTo(left + width, top + height * 0.52);
    ctx.lineTo(left + width, top + height);
    ctx.lineTo(left, top + height);
    ctx.closePath();
    ctx.fill();

    ctx.globalAlpha = 0.16;
    ctx.fillStyle = "#c4d7ed";
    ctx.beginPath();
    ctx.moveTo(left + width * 0.08, baseY);
    ctx.lineTo(left + width * 0.3, top + height * 0.55);
    ctx.lineTo(left + width * 0.5, baseY);
    ctx.lineTo(left + width * 0.72, top + height * 0.5);
    ctx.lineTo(left + width * 0.94, baseY);
    ctx.lineTo(left + width, top + height);
    ctx.lineTo(left, top + height);
    ctx.closePath();
    ctx.fill();

    ctx.restore();
  }

  function drawGrid(
    ctx: CanvasRenderingContext2D,
    left: number,
    top: number,
    width: number,
    height: number,
  ) {
    ctx.save();
    ctx.strokeStyle = "rgba(177, 210, 255, 0.13)";
    ctx.lineWidth = 1;

    for (let i = 0; i <= 8; i += 1) {
      const x = left + (width / 8) * i;
      ctx.beginPath();
      ctx.moveTo(x, top);
      ctx.lineTo(x, top + height);
      ctx.stroke();
    }

    for (let i = 0; i <= 6; i += 1) {
      const y = top + (height / 6) * i;
      ctx.beginPath();
      ctx.moveTo(left, y);
      ctx.lineTo(left + width, y);
      ctx.stroke();
    }

    ctx.restore();
  }

  function drawPriceScale(
    ctx: CanvasRenderingContext2D,
    asset: Asset,
    width: number,
    top: number,
    height: number,
    low: number,
    high: number,
  ) {
    ctx.save();
    ctx.font = "700 12px Roboto, Arial, sans-serif";
    ctx.fillStyle = "rgba(228, 240, 255, 0.82)";
    ctx.textAlign = "right";

    for (let i = 0; i <= 5; i += 1) {
      const price = high - ((high - low) / 5) * i;
      const y = top + (height / 5) * i + 4;
      ctx.fillText(priceText(price, asset), width - 10, y);
    }

    ctx.restore();
  }

  function drawTimeScale(
    ctx: CanvasRenderingContext2D,
    left: number,
    top: number,
    width: number,
    height: number,
    candles: Candle[],
  ) {
    ctx.save();
    ctx.font = "600 11px Roboto, Arial, sans-serif";
    ctx.fillStyle = "rgba(219, 232, 255, 0.62)";
    ctx.textAlign = "center";

    const labels = 5;
    for (let i = 0; i < labels; i += 1) {
      const index = Math.floor((candles.length - 1) * (i / (labels - 1)));
      const candle = candles[index];
      if (!candle) continue;
      const date = new Date(candle.time);
      const label = `${String(date.getHours()).padStart(2, "0")}:${String(
        date.getMinutes(),
      ).padStart(2, "0")}`;
      const x = left + width * (i / (labels - 1));
      ctx.fillText(label, x, top + height + 25);
    }

    ctx.restore();
  }

  function drawCandles(
    ctx: CanvasRenderingContext2D,
    candles: Candle[],
    left: number,
    xStep: number,
    yForPrice: (price: number) => number,
    candleWidth: number,
  ) {
    ctx.save();

    candles.forEach((candle, index) => {
      const x = left + index * xStep;
      const yOpen = yForPrice(candle.open);
      const yClose = yForPrice(candle.close);
      const yHigh = yForPrice(candle.high);
      const yLow = yForPrice(candle.low);
      const bullish = candle.close >= candle.open;
      const color = bullish ? "#6ce8dc" : "#ff725f";

      ctx.strokeStyle = color;
      ctx.fillStyle = color;
      ctx.lineWidth = 1.4;

      ctx.beginPath();
      ctx.moveTo(x, yHigh);
      ctx.lineTo(x, yLow);
      ctx.stroke();

      const bodyTop = Math.min(yOpen, yClose);
      const bodyHeight = Math.max(2, Math.abs(yClose - yOpen));

      roundRect(ctx, x - candleWidth / 2, bodyTop, candleWidth, bodyHeight, 1.5);
      ctx.fill();
    });

    ctx.restore();
  }

  function drawBars(
    ctx: CanvasRenderingContext2D,
    candles: Candle[],
    left: number,
    xStep: number,
    yForPrice: (price: number) => number,
    candleWidth: number,
  ) {
    ctx.save();

    candles.forEach((candle, index) => {
      const x = left + index * xStep;
      const yOpen = yForPrice(candle.open);
      const yClose = yForPrice(candle.close);
      const yHigh = yForPrice(candle.high);
      const yLow = yForPrice(candle.low);
      const bullish = candle.close >= candle.open;
      const color = bullish ? "#6ce8dc" : "#ff725f";

      ctx.strokeStyle = color;
      ctx.lineWidth = 1.5;

      ctx.beginPath();
      ctx.moveTo(x, yHigh);
      ctx.lineTo(x, yLow);
      ctx.moveTo(x - candleWidth * 0.7, yOpen);
      ctx.lineTo(x, yOpen);
      ctx.moveTo(x, yClose);
      ctx.lineTo(x + candleWidth * 0.7, yClose);
      ctx.stroke();
    });

    ctx.restore();
  }

  function drawLineChart(
    ctx: CanvasRenderingContext2D,
    candles: Candle[],
    left: number,
    xStep: number,
    yForPrice: (price: number) => number,
  ) {
    ctx.save();
    ctx.strokeStyle = "#66dbff";
    ctx.lineWidth = 2.2;
    ctx.beginPath();

    candles.forEach((candle, index) => {
      const x = left + index * xStep;
      const y = yForPrice(candle.close);
      if (index === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });

    ctx.stroke();
    ctx.restore();
  }

  function drawIndicatorOverlay(
    ctx: CanvasRenderingContext2D,
    candles: Candle[],
    left: number,
    xStep: number,
    yForPrice: (price: number) => number,
  ) {
    if (candles.length < 10) return;

    ctx.save();
    ctx.strokeStyle = "rgba(251, 224, 117, 0.9)";
    ctx.lineWidth = 1.6;
    ctx.beginPath();

    candles.forEach((_, index) => {
      const from = Math.max(0, index - 8);
      const slice = candles.slice(from, index + 1);
      const average =
        slice.reduce((sum, candle) => sum + candle.close, 0) / Math.max(slice.length, 1);
      const x = left + index * xStep;
      const y = yForPrice(average);

      if (index === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });

    ctx.stroke();
    ctx.restore();
  }

  function drawCurrentPrice(
    ctx: CanvasRenderingContext2D,
    asset: Asset,
    width: number,
    left: number,
    top: number,
    chartWidth: number,
    yForPrice: (price: number) => number,
  ) {
    const y = yForPrice(marketRef.current.price);

    ctx.save();
    ctx.strokeStyle = "rgba(115, 214, 255, 0.8)";
    ctx.setLineDash([7, 7]);
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    ctx.moveTo(left, y);
    ctx.lineTo(left + chartWidth, y);
    ctx.stroke();
    ctx.setLineDash([]);

    const label = priceText(marketRef.current.price, asset);
    ctx.font = "800 13px Roboto, Arial, sans-serif";
    const labelWidth = Math.max(62, ctx.measureText(label).width + 22);
    roundRect(ctx, width - labelWidth - 5, y - 17, labelWidth, 34, 8);
    ctx.fillStyle = "#8acbff";
    ctx.fill();

    ctx.fillStyle = "#ffffff";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(label, width - labelWidth / 2 - 5, y);
    ctx.restore();

    ctx.save();
    ctx.fillStyle = "rgba(238, 246, 255, 0.88)";
    ctx.font = "700 12px Roboto, Arial, sans-serif";
    ctx.fillText(`Current price ${label}`, left + chartWidth - 150, top + 20);
    ctx.restore();
  }

  function drawExpiryLine(
    ctx: CanvasRenderingContext2D,
    left: number,
    top: number,
    chartWidth: number,
    chartHeight: number,
  ) {
    const x = left + chartWidth * 0.78;

    ctx.save();
    ctx.strokeStyle = "rgba(255, 255, 255, 0.86)";
    ctx.lineWidth = 1.6;
    ctx.beginPath();
    ctx.moveTo(x, top);
    ctx.lineTo(x, top + chartHeight);
    ctx.stroke();

    ctx.fillStyle = "rgba(255, 255, 255, 0.94)";
    ctx.beginPath();
    ctx.moveTo(x, top + 6);
    ctx.lineTo(x + 16, top + 6);
    ctx.lineTo(x, top + 17);
    ctx.closePath();
    ctx.fill();

    ctx.font = "700 11px Roboto, Arial, sans-serif";
    ctx.fillStyle = "#ffffff";
    ctx.fillText("Expiration time", x + 8, top + 28);
    ctx.restore();
  }

  function drawTradeMarkers(
    ctx: CanvasRenderingContext2D,
    left: number,
    xStep: number,
    yForPrice: (price: number) => number,
  ) {
    const candles = candlesRef.current;

    ctx.save();
    ctx.font = "800 11px Roboto, Arial, sans-serif";
    ctx.textBaseline = "middle";

    tradesRef.current.forEach((trade) => {
      if (trade.resolved) return;

      const index = clamp(trade.entryIndex, 0, Math.max(0, candles.length - 1));
      const x = left + index * xStep;
      const y = yForPrice(trade.entryPrice);
      const color = trade.direction === "BUY" ? "#53e56b" : "#ff5d4f";

      ctx.strokeStyle = color;
      ctx.setLineDash([4, 4]);
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(left, y);
      ctx.lineTo(x + 2, y);
      ctx.stroke();
      ctx.setLineDash([]);

      const w = Math.max(92, ctx.measureText(trade.label).width + 22);
      roundRect(ctx, x + 8, y - 14, w, 28, 7);
      ctx.fillStyle = color;
      ctx.fill();

      ctx.fillStyle = "#ffffff";
      ctx.textAlign = "center";
      ctx.fillText(trade.label, x + 8 + w / 2, y);
    });

    ctx.restore();
  }

  function drawResultMarkers(
    ctx: CanvasRenderingContext2D,
    left: number,
    xStep: number,
    yForPrice: (price: number) => number,
  ) {
    const candles = candlesRef.current;
    const now = Date.now();
    resultsRef.current = resultsRef.current.filter((result) => result.expiresAt > now);

    ctx.save();
    ctx.font = "900 12px Roboto, Arial, sans-serif";
    ctx.textBaseline = "middle";

    resultsRef.current.forEach((result) => {
      const index = clamp(result.candleIndex, 0, Math.max(0, candles.length - 1));
      const x = left + index * xStep;
      const y = yForPrice(result.price);
      const color = result.won ? "#39df63" : "#ff4f4f";
      const text = `${result.won ? "✓" : "✕"} ${result.label}`;
      const w = Math.max(86, ctx.measureText(text).width + 22);

      roundRect(ctx, x + 8, y - 36, w, 28, 8);
      ctx.fillStyle = color;
      ctx.fill();

      ctx.fillStyle = "#ffffff";
      ctx.textAlign = "center";
      ctx.fillText(text, x + 8 + w / 2, y - 22);
    });

    ctx.restore();
  }

  function changeExpiry(unit: "hours" | "minutes" | "seconds", change: number) {
    const parts = splitTime(expirySeconds);

    if (unit === "hours") parts.hours += change;
    if (unit === "minutes") parts.minutes += change;
    if (unit === "seconds") parts.seconds += change;

    const next = parts.hours * 3600 + parts.minutes * 60 + parts.seconds;
    setExpirySeconds(clamp(next, 5, 18000));
  }

  function handleStakeChange(event: React.ChangeEvent<HTMLInputElement>) {
    const value = event.target.value;
    if (!/^\d*\.?\d{0,2}$/.test(value)) return;

    setStakeInput(value);
    const numeric = Number(value);
    setStakeUsd(Number.isFinite(numeric) ? numeric / exchangeRate : 0);
  }

  function toggleIndicator(indicator: string) {
    setActiveIndicators((previous) =>
      previous.includes(indicator)
        ? previous.filter((item) => item !== indicator)
        : [...previous, indicator],
    );
  }

  function placeTrade(direction: Direction) {
    if (!validStake || !hasEnoughBalance) return;

    const candles = candlesRef.current;
    const entryIndex = Math.max(0, candles.length - 1);
    const entryPrice = marketRef.current.price;
    const id = `${direction}-${Date.now()}-${Math.random()}`;
    const stakeValue = stakeUsd * exchangeRate;

    const trade: TradeMarker = {
      id,
      direction,
      accountType,
      currency,
      entryPrice,
      entryIndex,
      stakeCurrency: stakeValue,
      stakeUsd,
      payout,
      openedAt: Date.now(),
      expiresAt: Date.now() + expirySeconds * 1000,
      label: `${direction} ${shortMoney(currency, stakeValue)}`,
      resolved: false,
    };

    tradesRef.current.push(trade);

    setBalancesUsd((previous) => ({
      ...previous,
      [accountType]: Math.max(0, previous[accountType] - stakeUsd),
    }));

    const timeout = window.setTimeout(() => {
      resolveTrade(id);
    }, expirySeconds * 1000);

    timeoutRef.current.push(timeout);
  }

  function resolveTrade(id: string) {
    const trade = tradesRef.current.find((item) => item.id === id);
    if (!trade || trade.resolved) return;

    const closePrice = marketRef.current.price;
    const won =
      trade.direction === "BUY"
        ? closePrice > trade.entryPrice
        : closePrice < trade.entryPrice;

    trade.resolved = true;

    const profitUsd = trade.stakeUsd * (trade.payout / 100);
    const returnUsd = trade.stakeUsd + profitUsd;
    const resultCurrencyAmount = won ? returnUsd * EXCHANGE_RATES[trade.currency] : 0;

    if (won) {
      setBalancesUsd((previous) => ({
        ...previous,
        [trade.accountType]: previous[trade.accountType] + returnUsd,
      }));
    }

    resultsRef.current.push({
      id: `${id}-result`,
      direction: trade.direction,
      won,
      price: closePrice,
      candleIndex: Math.max(0, candlesRef.current.length - 1),
      label: shortMoney(trade.currency, resultCurrencyAmount),
      expiresAt: Date.now() + 10000,
    });
  }

  function handleAssetSelect(asset: Asset) {
    setSelectedAsset(asset);
    setSelectedCategory(asset.category);
    setAssetMenuOpen(false);
    setPayout(asset.payoutBase);
  }

  function handleFullscreen() {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => undefined);
    } else {
      document.exitFullscreen().catch(() => undefined);
    }
  }

  const unitParts = splitTime(expirySeconds);

  return (
    <main className="neuro-terminal">
      <header className="terminal-topbar">
        <div className="brand-block">
          <div className="brand-icon">N</div>
          <div className="brand-text">NeuroOption</div>
          <button className="star-btn" type="button" aria-label="Favorite">
            ★
          </button>
        </div>

        <div className="account-controls">
          <select
            value={accountType}
            onChange={(event) => setAccountType(event.target.value as AccountType)}
            className="top-select"
          >
            <option value="demo">QT Demo</option>
            <option value="real">QT Real</option>
          </select>

          <select
            value={currency}
            onChange={(event) => setCurrency(event.target.value as Currency)}
            className="top-select currency-select"
          >
            {CURRENCIES.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>

          <div className="balance-pill">{moneyText(currency, visibleBalance)}</div>

          <button className="topup-btn" type="button" onClick={() => setTopUpOpen(true)}>
            TOP UP
          </button>

          <button className="fullscreen-btn" type="button" onClick={handleFullscreen}>
            ⛶
          </button>

          <div className="avatar">SM</div>
        </div>
      </header>

      <section className="terminal-body">
        <aside className="left-sidebar">
          {LEFT_MENU.map((item, index) => (
            <button
              key={item.label}
              className={`left-nav-item ${index === 0 ? "active" : ""}`}
              type="button"
            >
              <span className="left-nav-icon">{item.icon}</span>
              <span className="left-nav-label">{item.label}</span>
            </button>
          ))}
        </aside>

        <section className="chart-panel">
          <div className="chart-toolbar">
            <div className="asset-control-wrap">
              <button
                type="button"
                className="asset-button"
                onClick={() => setAssetMenuOpen((open) => !open)}
              >
                <span>{selectedAsset.symbol}</span>
                <span>⌄</span>
              </button>

              {assetMenuOpen && (
                <div className="floating-menu asset-menu">
                  <div className="asset-tabs">
                    {CATEGORIES.map((category) => (
                      <button
                        key={category}
                        type="button"
                        className={category === selectedCategory ? "active" : ""}
                        onClick={() => setSelectedCategory(category)}
                      >
                        {category}
                      </button>
                    ))}
                  </div>

                  <div className="asset-list">
                    {ASSETS.filter((asset) => asset.category === selectedCategory).map(
                      (asset) => (
                        <button
                          key={asset.symbol}
                          type="button"
                          onClick={() => handleAssetSelect(asset)}
                          className={
                            asset.symbol === selectedAsset.symbol ? "selected" : ""
                          }
                        >
                          <span>{asset.symbol}</span>
                          <small>{asset.name}</small>
                        </button>
                      ),
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="timeframe-wrap">
              <button
                type="button"
                className="mini-tool timeframe-button"
                onClick={() => setTimeframeMenuOpen((open) => !open)}
              >
                📊 {timeframe}
              </button>

              {timeframeMenuOpen && (
                <div className="floating-menu timeframe-menu">
                  {TIMEFRAMES.map((item) => (
                    <button
                      key={item}
                      type="button"
                      className={item === timeframe ? "active" : ""}
                      onClick={() => {
                        setTimeframe(item);
                        setTimeframeMenuOpen(false);
                      }}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="tool-wrap">
              <button
                type="button"
                className="mini-tool"
                onClick={() => setIndicatorMenuOpen((open) => !open)}
              >
                ⋯
              </button>

              {indicatorMenuOpen && (
                <div className="floating-menu indicator-menu">
                  <div className="menu-title">Indicators</div>
                  <div className="indicator-grid">
                    {INDICATORS.map((indicator) => (
                      <button
                        key={indicator}
                        type="button"
                        className={
                          activeIndicators.includes(indicator) ? "active" : ""
                        }
                        onClick={() => toggleIndicator(indicator)}
                      >
                        {indicator}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="tool-wrap">
              <button
                type="button"
                className="mini-tool"
                onClick={() => setToolMenuOpen((open) => !open)}
              >
                ✎
              </button>

              {toolMenuOpen && (
                <div className="floating-menu tools-menu">
                  <div className="menu-title">Drawing tools</div>
                  {DRAWING_TOOLS.map((tool) => (
                    <button
                      key={tool}
                      type="button"
                      className={activeTool === tool ? "active" : ""}
                      onClick={() => {
                        setActiveTool(tool);
                        setToolMenuOpen(false);
                      }}
                    >
                      {tool}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="chart-type-group">
              <button
                type="button"
                className={chartType === "candles" ? "active" : ""}
                onClick={() => setChartType("candles")}
              >
                Candlesticks
              </button>
              <button
                type="button"
                className={chartType === "heiken" ? "active" : ""}
                onClick={() => setChartType("heiken")}
              >
                Heiken Ashi
              </button>
              <button
                type="button"
                className={chartType === "bars" ? "active" : ""}
                onClick={() => setChartType("bars")}
              >
                Bars
              </button>
              <button
                type="button"
                className={chartType === "line" ? "active" : ""}
                onClick={() => setChartType("line")}
              >
                Line
              </button>
            </div>
          </div>

          <div className="chart-info-row">
            <span>{new Date().toLocaleTimeString()} UTC+3</span>
            <span>Tool: {activeTool}</span>
            <span>{selectedAsset.name}</span>
            <span>Current price {priceText(currentPrice, selectedAsset)}</span>
          </div>

          <div className="chart-canvas-wrap">
            <canvas ref={canvasRef} className="trading-canvas" />
          </div>

          <div className="chart-bottom-strip">
            <button type="button">←</button>
            <button type="button">{timeframe} ▲</button>
            <strong>{selectedAsset.name}</strong>
          </div>
        </section>

        <aside className="trade-panel">
          <div className="sentiment-row">
            <span>50%</span>
            <div className="sentiment-bar">
              <div className="sentiment-green" />
              <div className="sentiment-red" />
              <div className="sentiment-pin" />
            </div>
            <span>50%</span>
          </div>

          <section className="trade-box">
            <h3>
              Time <span>ⓘ</span>
            </h3>

            <div className="expiry-main">
              <button type="button" onClick={() => changeExpiry("seconds", -1)}>
                -
              </button>
              <strong>{formatTime(expirySeconds)}</strong>
              <button type="button" onClick={() => changeExpiry("seconds", 1)}>
                +
              </button>
            </div>

            <p className="expiry-limit">Min 00:00:05 · Max 05:00:00</p>

            <div className="expiry-units">
              <div className="expiry-unit">
                <button type="button" onClick={() => changeExpiry("hours", 1)}>
                  +
                </button>
                <strong>{String(unitParts.hours).padStart(2, "0")}</strong>
                <button type="button" onClick={() => changeExpiry("hours", -1)}>
                  -
                </button>
                <span>Hours</span>
              </div>

              <div className="expiry-unit">
                <button type="button" onClick={() => changeExpiry("minutes", 1)}>
                  +
                </button>
                <strong>{String(unitParts.minutes).padStart(2, "0")}</strong>
                <button type="button" onClick={() => changeExpiry("minutes", -1)}>
                  -
                </button>
                <span>Minutes</span>
              </div>

              <div className="expiry-unit">
                <button type="button" onClick={() => changeExpiry("seconds", 1)}>
                  +
                </button>
                <strong>{String(unitParts.seconds).padStart(2, "0")}</strong>
                <button type="button" onClick={() => changeExpiry("seconds", -1)}>
                  -
                </button>
                <span>Seconds</span>
              </div>
            </div>
          </section>

          <section className="trade-box amount-box">
            <h3>
              Amount <span>ⓘ</span>
            </h3>
            <div className="amount-input-wrap">
              <input value={stakeInput} onChange={handleStakeChange} inputMode="decimal" />
              <span>{currency}</span>
            </div>
          </section>

          <section className="payout-box">
            <div>
              <span>Rate</span>
              <strong>+{payout}%</strong>
            </div>
            <div>
              <span>Expected profit</span>
              <strong>{moneyText(currency, expectedProfitCurrency)}</strong>
            </div>
            <div>
              <span>Expected return</span>
              <strong>{moneyText(currency, expectedReturnCurrency)}</strong>
            </div>
          </section>

          {!hasEnoughBalance && (
            <div className="trade-warning">Insufficient {currency} balance.</div>
          )}

          <div className="trade-actions">
            <button
              type="button"
              className="buy-btn"
              disabled={!validStake || !hasEnoughBalance}
              onClick={() => placeTrade("BUY")}
            >
              ↗ BUY
            </button>
            <button type="button" className="ai-btn">
              AI TRADING
            </button>
            <button
              type="button"
              className="sell-btn"
              disabled={!validStake || !hasEnoughBalance}
              onClick={() => placeTrade("SELL")}
            >
              ↘ SELL
            </button>
          </div>
        </aside>

        <aside className="quick-rail">
          {QUICK_MENU.map((item) => (
            <button
              key={item.label}
              type="button"
              onClick={item.label === "Full Screen" ? handleFullscreen : undefined}
            >
              <span>{item.icon}</span>
              <small>{item.label}</small>
            </button>
          ))}
        </aside>
      </section>

      {topUpOpen && (
        <div className="modal-backdrop" onClick={() => setTopUpOpen(false)}>
          <div className="topup-modal" onClick={(event) => event.stopPropagation()}>
            <h2>Top Up</h2>
            <p>
              Payment integration placeholder. Connect M-Pesa, card, or Binance Pay
              here.
            </p>
            <button type="button" onClick={() => setTopUpOpen(false)}>
              Close
            </button>
          </div>
        </div>
      )}
    </main>
  );
}