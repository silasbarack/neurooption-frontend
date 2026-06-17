import React from "react";
import "./TradingPage.css";
import type { AccountCurrency, AccountType } from "../types/auth.types";
import { convertFromUsd, convertToUsd, formatCurrency } from "../utils/currency";
import { clamp, formatPrice, randomId, secondsToTime } from "../utils/format";
import {
  calculateExpectedProfit,
  calculateExpectedReturn,
  changeExpiryUnit,
  getTradeWinStatus,
  MAX_EXPIRY_SECONDS,
  MIN_EXPIRY_SECONDS,
} from "../utils/trading";

type MarketCategory =
  | "Currencies"
  | "Cryptocurrencies"
  | "Indices"
  | "Stocks"
  | "Commodities";

type OtcTimeframe = "M1" | "M2" | "M3" | "M5" | "M15" | "M30" | "H1" | "H4";
type ChartType = "Candlesticks" | "Heiken Ashi" | "Bars" | "Line";
type TradeDirection = "BUY" | "SELL";
type ExpiryUnit = "hours" | "minutes" | "seconds";

type OtcAsset = {
  symbol: string;
  displayName: string;
  category: MarketCategory;
  market: "OTC";
  basePrice: number;
  precision: number;
  volatility: number;
  payout: number;
};

type OtcCandle = {
  symbol: string;
  timeframe: OtcTimeframe;
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
  closed: boolean;
};

type OtcStreamPayload = {
  type: "snapshot" | "tick";
  asset: OtcAsset;
  timeframe: OtcTimeframe;
  price: number;
  serverTime: number;
  candles: OtcCandle[];
};

type AssetsResponse = {
  success: boolean;
  assets: OtcAsset[];
};

type CandlesResponse = {
  success: boolean;
  symbol: string;
  timeframe: OtcTimeframe;
  candles: OtcCandle[];
};

type ActiveTrade = {
  id: string;
  direction: TradeDirection;
  accountType: AccountType;
  amount: number;
  amountUsd: number;
  currency: AccountCurrency;
  entryPrice: number;
  entryTime: number;
  expirySeconds: number;
  payoutPercent: number;
  expectedProfit: number;
  expectedReturn: number;
  expectedReturnUsd: number;
};

type ResultMarker = {
  id: string;
  direction: TradeDirection;
  won: boolean;
  amount: number;
  currency: AccountCurrency;
  entryPrice: number;
  closePrice: number;
  createdAt: number;
};

type NavItem = {
  icon: string;
  label: string;
  path: string;
};

const API_BASE_URL =
  import.meta.env.VITE_API_URL?.replace(/\/$/, "") ||
  "https://neurooption-backend.onrender.com";

const CURRENCIES: AccountCurrency[] = [
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
];

const MARKET_CATEGORIES: MarketCategory[] = [
  "Currencies",
  "Cryptocurrencies",
  "Indices",
  "Stocks",
  "Commodities",
];

const TIMEFRAMES: OtcTimeframe[] = ["M1", "M2", "M3", "M5", "M15", "M30", "H1", "H4"];
const CHART_TYPES: ChartType[] = ["Candlesticks", "Heiken Ashi", "Bars", "Line"];

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

const INDICATORS = [
  "Moving Average",
  "Exponential MA",
  "Weighted MA",
  "Bollinger Bands",
  "MACD",
  "RSI",
  "Stochastic",
  "Stochastic RSI",
  "CCI",
  "ADX",
  "ATR",
  "Momentum",
  "Williams %R",
  "Parabolic SAR",
  "Ichimoku Cloud",
  "Alligator",
  "Fractals",
  "Awesome Oscillator",
  "Accelerator Oscillator",
  "Envelopes",
  "Keltner Channel",
  "Donchian Channel",
  "Zig Zag",
  "SuperTrend",
  "Pivot Points",
  "VWAP",
  "Volume",
  "OBV",
  "Money Flow Index",
  "Chaikin Oscillator",
  "Aroon",
  "DeMarker",
  "TRIX",
  "ROC",
  "DPO",
  "Elder Ray",
  "Force Index",
  "Gator Oscillator",
  "Ultimate Oscillator",
  "Standard Deviation",
  "Linear Regression",
  "Price Channel",
];

const LEFT_NAV: NavItem[] = [
  { icon: "📈", label: "Trading", path: "/trading" },
  { icon: "💵", label: "Finance", path: "/finance" },
  { icon: "👤", label: "Profile", path: "/profile" },
  { icon: "🛒", label: "Market", path: "/market" },
  { icon: "💎", label: "Achievements", path: "/achievements" },
  { icon: "🏆", label: "Tournaments", path: "/tournaments" },
  { icon: "💬", label: "Chat", path: "/chat" },
  { icon: "?", label: "Help", path: "/help" },
  { icon: "🎁", label: "Promo", path: "/promo" },
  { icon: "🤖", label: "Autotrading", path: "/autotrading" },
];

const QUICK_NAV = [
  ["↻", "Trades"],
  ["📡", "Signals"],
  ["👥", "Social Trading"],
  ["◎", "Express Trades"],
  ["⌛", "Pending Trades"],
  ["⌨", "Hotkeys"],
  ["⛶", "Full Screen"],
];

const FALLBACK_ASSETS: OtcAsset[] = [
  {
    symbol: "AUD/CAD OTC",
    displayName: "Australian Dollar / Canadian Dollar",
    category: "Currencies",
    market: "OTC",
    basePrice: 0.8421,
    precision: 5,
    volatility: 0.00022,
    payout: 92,
  },
  {
    symbol: "EUR/USD OTC",
    displayName: "Euro / US Dollar",
    category: "Currencies",
    market: "OTC",
    basePrice: 1.1345,
    precision: 5,
    volatility: 0.00028,
    payout: 91,
  },
  {
    symbol: "USD/JPY OTC",
    displayName: "US Dollar / Japanese Yen",
    category: "Currencies",
    market: "OTC",
    basePrice: 157.28,
    precision: 3,
    volatility: 0.045,
    payout: 88,
  },
  {
    symbol: "Bitcoin OTC",
    displayName: "Bitcoin",
    category: "Cryptocurrencies",
    market: "OTC",
    basePrice: 66420,
    precision: 2,
    volatility: 42,
    payout: 86,
  },
  {
    symbol: "Ethereum OTC",
    displayName: "Ethereum",
    category: "Cryptocurrencies",
    market: "OTC",
    basePrice: 3520,
    precision: 2,
    volatility: 6.8,
    payout: 85,
  },
  {
    symbol: "US100 OTC",
    displayName: "Nasdaq 100",
    category: "Indices",
    market: "OTC",
    basePrice: 19888.46,
    precision: 2,
    volatility: 18,
    payout: 86,
  },
  {
    symbol: "Tesla OTC",
    displayName: "Tesla Inc.",
    category: "Stocks",
    market: "OTC",
    basePrice: 182.45,
    precision: 2,
    volatility: 0.42,
    payout: 81,
  },
  {
    symbol: "Gold OTC",
    displayName: "Gold",
    category: "Commodities",
    market: "OTC",
    basePrice: 2328.4,
    precision: 2,
    volatility: 1.8,
    payout: 87,
  },
];

function randomNormal(): number {
  return Math.random() + Math.random() + Math.random() + Math.random() - 2;
}

function timeframeToMs(timeframe: OtcTimeframe): number {
  const map: Record<OtcTimeframe, number> = {
    M1: 60_000,
    M2: 120_000,
    M3: 180_000,
    M5: 300_000,
    M15: 900_000,
    M30: 1_800_000,
    H1: 3_600_000,
    H4: 14_400_000,
  };

  return map[timeframe];
}

function createFallbackCandles(asset: OtcAsset, timeframe: OtcTimeframe, count = 120): OtcCandle[] {
  const candles: OtcCandle[] = [];
  const duration = timeframeToMs(timeframe);
  let price = asset.basePrice;

  for (let index = 0; index < count; index += 1) {
    const open = price;
    const impulse = Math.sin(index / 5.4) * asset.volatility * 0.35;
    const noise = randomNormal() * asset.volatility * 0.58;
    const close = Math.max(0.00000001, open + impulse + noise);
    const high = Math.max(open, close) + Math.abs(randomNormal()) * asset.volatility * 0.85;
    const low = Math.min(open, close) - Math.abs(randomNormal()) * asset.volatility * 0.85;

    candles.push({
      symbol: asset.symbol,
      timeframe,
      time: Date.now() - (count - index) * duration,
      open,
      high,
      low: Math.max(0.00000001, low),
      close,
      closed: true,
    });

    price = close;
  }

  candles[candles.length - 1].closed = false;
  return candles;
}

function splitExpiry(totalSeconds: number) {
  return {
    hours: Math.floor(totalSeconds / 3600),
    minutes: Math.floor((totalSeconds % 3600) / 60),
    seconds: totalSeconds % 60,
  };
}

function makeHeikenAshi(candles: OtcCandle[]): OtcCandle[] {
  const output: OtcCandle[] = [];

  candles.forEach((candle, index) => {
    const close = (candle.open + candle.high + candle.low + candle.close) / 4;
    const previous = output[index - 1];
    const open = previous ? (previous.open + previous.close) / 2 : (candle.open + candle.close) / 2;

    output.push({
      ...candle,
      open,
      close,
      high: Math.max(candle.high, open, close),
      low: Math.min(candle.low, open, close),
    });
  });

  return output;
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

function isAssetsResponse(data: unknown): data is AssetsResponse {
  return (
    typeof data === "object" &&
    data !== null &&
    "assets" in data &&
    Array.isArray((data as AssetsResponse).assets)
  );
}

function isCandlesResponse(data: unknown): data is CandlesResponse {
  return (
    typeof data === "object" &&
    data !== null &&
    "candles" in data &&
    Array.isArray((data as CandlesResponse).candles)
  );
}

function isStreamPayload(data: unknown): data is OtcStreamPayload {
  return (
    typeof data === "object" &&
    data !== null &&
    "candles" in data &&
    "price" in data &&
    Array.isArray((data as OtcStreamPayload).candles)
  );
}

export default function TradingPage() {
  const canvasRef = React.useRef<HTMLCanvasElement | null>(null);
  const candlesRef = React.useRef<OtcCandle[]>([]);
  const priceRef = React.useRef(0);
  const activeTradesRef = React.useRef<ActiveTrade[]>([]);
  const resultMarkersRef = React.useRef<ResultMarker[]>([]);
  const scaleRef = React.useRef<{ min: number; max: number } | null>(null);
  const frameRef = React.useRef<number | null>(null);
  const streamLiveRef = React.useRef(false);
  const fallbackTickRef = React.useRef(Date.now());
  const fallbackCandleOpenRef = React.useRef(Date.now());

  const [assets, setAssets] = React.useState<OtcAsset[]>(FALLBACK_ASSETS);
  const [selectedAsset, setSelectedAsset] = React.useState<OtcAsset>(FALLBACK_ASSETS[0]);
  const [assetCategory, setAssetCategory] = React.useState<MarketCategory>("Currencies");
  const [timeframe, setTimeframe] = React.useState<OtcTimeframe>("M1");
  const [chartType, setChartType] = React.useState<ChartType>("Candlesticks");
  const [drawingTool, setDrawingTool] = React.useState("Cursor");

  const [serverTime, setServerTime] = React.useState(Date.now());
  const [currentPrice, setCurrentPrice] = React.useState(FALLBACK_ASSETS[0].basePrice);
  const [streamStatus, setStreamStatus] = React.useState<"connecting" | "live" | "reconnecting">("connecting");

  const [accountType, setAccountType] = React.useState<AccountType>("QT Demo");
  const [currency, setCurrency] = React.useState<AccountCurrency>("USD");
  const [demoBalanceUsd, setDemoBalanceUsd] = React.useState(70_000);
  const [realBalanceUsd, setRealBalanceUsd] = React.useState(0);

  const [amount, setAmount] = React.useState("100");
  const [expirySeconds, setExpirySeconds] = React.useState(30 * 60);

  const [assetOpen, setAssetOpen] = React.useState(false);
  const [timeframeOpen, setTimeframeOpen] = React.useState(false);
  const [indicatorOpen, setIndicatorOpen] = React.useState(false);
  const [toolsOpen, setToolsOpen] = React.useState(false);
  const [selectedIndicators, setSelectedIndicators] = React.useState<string[]>([]);
  const [activeNav, setActiveNav] = React.useState("Trading");
  const [activeTrades, setActiveTrades] = React.useState<ActiveTrade[]>([]);
  const [resultMarkers, setResultMarkers] = React.useState<ResultMarker[]>([]);

  const activeBalanceUsd = accountType === "QT Demo" ? demoBalanceUsd : realBalanceUsd;
  const convertedBalance = convertFromUsd(activeBalanceUsd, currency);
  const stake = Number(amount);
  const safeStake = Number.isFinite(stake) ? Math.max(0, stake) : 0;
  const stakeUsd = convertToUsd(safeStake, currency);

  const payoutPercent = React.useMemo(() => {
    const wave = Math.sin(serverTime / 13000) * 4;
    return Math.round(clamp(selectedAsset.payout + wave, 20, 92));
  }, [selectedAsset.payout, serverTime]);

  const expectedProfit = calculateExpectedProfit(safeStake, payoutPercent);
  const expectedReturn = calculateExpectedReturn(safeStake, payoutPercent);
  const expectedReturnUsd = convertToUsd(expectedReturn, currency);
  const canTrade = safeStake > 0 && stakeUsd <= activeBalanceUsd;
  const expiryParts = splitExpiry(expirySeconds);

  const filteredAssets = React.useMemo(() => {
    return assets.filter((asset) => asset.category === assetCategory);
  }, [assets, assetCategory]);

  React.useEffect(() => {
    activeTradesRef.current = activeTrades;
  }, [activeTrades]);

  React.useEffect(() => {
    resultMarkersRef.current = resultMarkers;
  }, [resultMarkers]);

  React.useEffect(() => {
    async function loadAssets() {
      try {
        const response = await fetch(`${API_BASE_URL}/market-data/assets`);
        const data: unknown = await response.json();

        if (isAssetsResponse(data) && data.assets.length > 0) {
          setAssets(data.assets);

          const found = data.assets.find((asset) => asset.symbol === selectedAsset.symbol);

          if (!found) {
            setSelectedAsset(data.assets[0]);
            setAssetCategory(data.assets[0].category);
          }
        }
      } catch {
        setAssets(FALLBACK_ASSETS);
      }
    }

    void loadAssets();
  }, [selectedAsset.symbol]);

  React.useEffect(() => {
    async function loadCandles() {
      try {
        const url = new URL(`${API_BASE_URL}/market-data/candles`);
        url.searchParams.set("symbol", selectedAsset.symbol);
        url.searchParams.set("timeframe", timeframe);
        url.searchParams.set("limit", "120");

        const response = await fetch(url.toString());
        const data: unknown = await response.json();

        if (isCandlesResponse(data) && data.candles.length > 0) {
          candlesRef.current = data.candles;
          priceRef.current = data.candles[data.candles.length - 1].close;
          fallbackCandleOpenRef.current = Date.now();
          setCurrentPrice(priceRef.current);
          scaleRef.current = null;
          return;
        }

        throw new Error("Invalid candle response");
      } catch {
        const fallback = createFallbackCandles(selectedAsset, timeframe);
        candlesRef.current = fallback;
        priceRef.current = fallback[fallback.length - 1].close;
        fallbackCandleOpenRef.current = Date.now();
        setCurrentPrice(priceRef.current);
        scaleRef.current = null;
      }
    }

    void loadCandles();
  }, [selectedAsset, timeframe]);

  React.useEffect(() => {
    streamLiveRef.current = false;
    setStreamStatus("connecting");

    const url = new URL(`${API_BASE_URL}/market-data/stream`);
    url.searchParams.set("symbol", selectedAsset.symbol);
    url.searchParams.set("timeframe", timeframe);

    const source = new EventSource(url.toString());

    function handlePayload(payload: OtcStreamPayload) {
      if (payload.candles.length === 0) return;

      candlesRef.current = payload.candles;
      priceRef.current = payload.price;
      streamLiveRef.current = true;

      setStreamStatus("live");
      setCurrentPrice(payload.price);
      setServerTime(payload.serverTime);
    }

    function handleStreamEvent(event: Event) {
      try {
        const message = event as MessageEvent<string>;
        const parsed: unknown = JSON.parse(message.data);

        if (isStreamPayload(parsed)) {
          handlePayload(parsed);
        }
      } catch {
        setStreamStatus("reconnecting");
      }
    }

    source.onopen = () => {
      streamLiveRef.current = true;
      setStreamStatus("live");
    };

    source.onerror = () => {
      streamLiveRef.current = false;
      setStreamStatus("reconnecting");
    };

    source.addEventListener("message", handleStreamEvent);
    source.addEventListener("snapshot", handleStreamEvent);
    source.addEventListener("tick", handleStreamEvent);

    return () => {
      source.removeEventListener("message", handleStreamEvent);
      source.removeEventListener("snapshot", handleStreamEvent);
      source.removeEventListener("tick", handleStreamEvent);
      source.close();
    };
  }, [selectedAsset.symbol, timeframe]);

  React.useEffect(() => {
    const uiTimer = window.setInterval(() => {
      setCurrentPrice(priceRef.current);
      setServerTime(Date.now());
    }, 350);

    return () => {
      window.clearInterval(uiTimer);
    };
  }, []);

  React.useEffect(() => {
    function animate() {
      applyModerateFallbackMotion();
      drawCanvas();
      frameRef.current = window.requestAnimationFrame(animate);
    }

    frameRef.current = window.requestAnimationFrame(animate);

    return () => {
      if (frameRef.current !== null) {
        window.cancelAnimationFrame(frameRef.current);
      }
    };
  }, [chartType, selectedAsset, timeframe]);

  function applyModerateFallbackMotion() {
    if (streamLiveRef.current) {
      return;
    }

    const now = Date.now();

    if (now - fallbackTickRef.current < 650) {
      return;
    }

    fallbackTickRef.current = now;

    const candles = candlesRef.current;
    const last = candles[candles.length - 1];

    if (!last) return;

    const softPulse = Math.sin(now / 2800) * selectedAsset.volatility * 0.025;
    const noise = randomNormal() * selectedAsset.volatility * 0.08;
    const nextPrice = Math.max(0.00000001, priceRef.current + softPulse + noise);

    priceRef.current = nextPrice;

    last.close = nextPrice;
    last.high = Math.max(last.high, nextPrice);
    last.low = Math.min(last.low, nextPrice);

    if (now - fallbackCandleOpenRef.current >= timeframeToMs(timeframe)) {
      last.closed = true;

      candles.push({
        symbol: selectedAsset.symbol,
        timeframe,
        time: now,
        open: nextPrice,
        high: nextPrice,
        low: nextPrice,
        close: nextPrice,
        closed: false,
      });

      if (candles.length > 120) {
        candles.shift();
      }

      fallbackCandleOpenRef.current = now;
    }
  }

  function drawCanvas() {
    const canvas = canvasRef.current;
    const parent = canvas?.parentElement;

    if (!canvas || !parent) return;

    const rect = parent.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    const width = Math.max(320, rect.width);
    const height = Math.max(240, rect.height);

    if (canvas.width !== Math.floor(width * dpr) || canvas.height !== Math.floor(height * dpr)) {
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
    }

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, width, height);

    const left = 22;
    const rightPad = 78;
    const top = 34;
    const bottomPad = 34;
    const chartRight = width - rightPad;
    const chartBottom = height - bottomPad;
    const chartWidth = chartRight - left;
    const chartHeight = chartBottom - top;

    const background = ctx.createLinearGradient(0, 0, width, height);
    background.addColorStop(0, "#233b65");
    background.addColorStop(0.52, "#142444");
    background.addColorStop(1, "#091226");
    ctx.fillStyle = background;
    ctx.fillRect(0, 0, width, height);

    ctx.save();
    ctx.globalAlpha = 0.18;
    ctx.fillStyle = "#9cbbe8";
    ctx.beginPath();
    ctx.moveTo(0, chartBottom);
    ctx.lineTo(width * 0.18, height * 0.54);
    ctx.lineTo(width * 0.32, chartBottom);
    ctx.lineTo(width * 0.5, height * 0.42);
    ctx.lineTo(width * 0.67, chartBottom);
    ctx.lineTo(width * 0.86, height * 0.55);
    ctx.lineTo(width, chartBottom);
    ctx.lineTo(width, height);
    ctx.lineTo(0, height);
    ctx.closePath();
    ctx.fill();
    ctx.restore();

    ctx.strokeStyle = "rgba(188, 218, 255, 0.13)";
    ctx.lineWidth = 1;

    for (let index = 0; index <= 10; index += 1) {
      const x = left + (chartWidth / 10) * index;
      ctx.beginPath();
      ctx.moveTo(x, top);
      ctx.lineTo(x, chartBottom);
      ctx.stroke();
    }

    for (let index = 0; index <= 7; index += 1) {
      const y = top + (chartHeight / 7) * index;
      ctx.beginPath();
      ctx.moveTo(left, y);
      ctx.lineTo(chartRight, y);
      ctx.stroke();
    }

    const source = chartType === "Heiken Ashi" ? makeHeikenAshi(candlesRef.current) : candlesRef.current;
    const visible = source.slice(-104);

    if (visible.length < 2) return;

    const values = visible.flatMap((candle) => [candle.open, candle.high, candle.low, candle.close]);
    values.push(priceRef.current);
    activeTradesRef.current.forEach((trade) => values.push(trade.entryPrice));
    resultMarkersRef.current.forEach((marker) => values.push(marker.closePrice));

    const rawMin = Math.min(...values);
    const rawMax = Math.max(...values);
    const rawRange = Math.max(rawMax - rawMin, selectedAsset.basePrice * 0.0015);
    const targetMin = rawMin - rawRange * 0.22;
    const targetMax = rawMax + rawRange * 0.22;

    if (!scaleRef.current) {
      scaleRef.current = {
        min: targetMin,
        max: targetMax,
      };
    } else {
      scaleRef.current.min += (targetMin - scaleRef.current.min) * 0.06;
      scaleRef.current.max += (targetMax - scaleRef.current.max) * 0.06;
    }

    const chartMin = scaleRef.current.min;
    const chartMax = scaleRef.current.max;

    const yFor = (price: number) => top + ((chartMax - price) / (chartMax - chartMin)) * chartHeight;
    const xFor = (index: number) => left + (index / Math.max(visible.length - 1, 1)) * chartWidth;
    const candleWidth = clamp(chartWidth / visible.length * 0.58, 3, 9);

    if (chartType === "Line") {
      ctx.strokeStyle = "#64eaff";
      ctx.lineWidth = 2.4;
      ctx.beginPath();

      visible.forEach((candle, index) => {
        const x = xFor(index);
        const y = yFor(candle.close);

        if (index === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });

      ctx.stroke();
    } else {
      visible.forEach((candle, index) => {
        const x = xFor(index);
        const openY = yFor(candle.open);
        const closeY = yFor(candle.close);
        const highY = yFor(candle.high);
        const lowY = yFor(candle.low);
        const bullish = candle.close >= candle.open;
        const color = bullish ? "#5ff2df" : "#ff775f";

        ctx.strokeStyle = color;
        ctx.fillStyle = color;
        ctx.lineWidth = 1.55;

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
          const bodyHeight = Math.max(2, Math.abs(openY - closeY));

          ctx.fillRect(x - candleWidth / 2, bodyTop, candleWidth, bodyHeight);
        }
      });
    }

    const currentY = yFor(priceRef.current);

    ctx.setLineDash([7, 7]);
    ctx.strokeStyle = "rgba(126, 221, 255, 0.92)";
    ctx.lineWidth = 1.25;
    ctx.beginPath();
    ctx.moveTo(left, currentY);
    ctx.lineTo(chartRight, currentY);
    ctx.stroke();
    ctx.setLineDash([]);

    ctx.fillStyle = "#86cfff";
    roundRect(ctx, chartRight + 8, currentY - 17, 66, 34, 9);
    ctx.fill();

    ctx.fillStyle = "#ffffff";
    ctx.font = "700 12px Roboto, Arial, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(formatPrice(priceRef.current, selectedAsset.precision), chartRight + 41, currentY + 5);

    const expiryX = chartRight - 170;
    ctx.strokeStyle = "rgba(255,255,255,0.95)";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(expiryX, top);
    ctx.lineTo(expiryX, chartBottom);
    ctx.stroke();

    ctx.fillStyle = "#ffffff";
    ctx.font = "700 11px Roboto, Arial, sans-serif";
    ctx.textAlign = "left";
    ctx.fillText("Expiration time", expiryX + 8, top + 15);

    ctx.fillStyle = "rgba(230, 242, 255, 0.85)";
    ctx.font = "700 11px Roboto, Arial, sans-serif";
    ctx.textAlign = "right";

    for (let index = 0; index <= 5; index += 1) {
      const price = chartMax - ((chartMax - chartMin) / 5) * index;
      const y = yFor(price);
      ctx.fillText(formatPrice(price, selectedAsset.precision), width - 8, y + 4);
    }

    ctx.fillStyle = "rgba(230, 242, 255, 0.66)";
    ctx.textAlign = "center";

    ["13:16", "13:32", "13:48", "14:04"].forEach((label, index) => {
      const x = left + (chartWidth / 3) * index;
      ctx.fillText(label, x, height - 9);
    });

    ctx.fillStyle = "rgba(255,255,255,0.88)";
    ctx.font = "800 15px Roboto, Arial, sans-serif";
    ctx.fillText(timeframe, chartRight - 80, currentY - 17);

    activeTradesRef.current.forEach((trade, index) => {
      const y = yFor(trade.entryPrice);
      const x = left + 30 + index * 10;
      const label = `${trade.direction} ${formatCurrency(trade.amount, trade.currency)}`;

      ctx.setLineDash([5, 5]);
      ctx.strokeStyle = trade.direction === "BUY" ? "#79f46e" : "#ff7469";
      ctx.beginPath();
      ctx.moveTo(left, y);
      ctx.lineTo(chartRight, y);
      ctx.stroke();
      ctx.setLineDash([]);

      ctx.fillStyle = trade.direction === "BUY" ? "#49d95d" : "#ef5048";
      roundRect(ctx, x, y - 17, 142, 34, 8);
      ctx.fill();

      ctx.fillStyle = "#ffffff";
      ctx.font = "800 11px Roboto, Arial, sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(label, x + 71, y + 4);
    });

    resultMarkersRef.current.forEach((marker) => {
      const y = yFor(marker.closePrice);
      const label = marker.won
        ? `✓ ${formatCurrency(marker.amount, marker.currency)}`
        : `✕ ${formatCurrency(0, marker.currency)}`;

      ctx.fillStyle = marker.won ? "#27c85d" : "#e94c42";
      roundRect(ctx, chartRight - 220, y - 20, 170, 40, 10);
      ctx.fill();

      ctx.fillStyle = "#ffffff";
      ctx.font = "900 12px Roboto, Arial, sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(label, chartRight - 135, y + 5);
    });
  }

  function updateBalance(account: AccountType, nextUsd: number) {
    if (account === "QT Demo") {
      setDemoBalanceUsd(Math.max(0, nextUsd));
    } else {
      setRealBalanceUsd(Math.max(0, nextUsd));
    }
  }

  function handleTrade(direction: TradeDirection) {
    if (!canTrade) return;

    const entryPrice = priceRef.current;
    const tradeId = randomId("trade");

    updateBalance(accountType, activeBalanceUsd - stakeUsd);

    const trade: ActiveTrade = {
      id: tradeId,
      direction,
      accountType,
      amount: safeStake,
      amountUsd: stakeUsd,
      currency,
      entryPrice,
      entryTime: Date.now(),
      expirySeconds,
      payoutPercent,
      expectedProfit,
      expectedReturn,
      expectedReturnUsd,
    };

    setActiveTrades((items) => [...items, trade]);

    window.setTimeout(() => {
      const closePrice = priceRef.current;
      const won = getTradeWinStatus(direction, entryPrice, closePrice);
      const resultAmount = won ? trade.expectedReturn : 0;

      if (won) {
        if (trade.accountType === "QT Demo") {
          setDemoBalanceUsd((value) => value + trade.expectedReturnUsd);
        } else {
          setRealBalanceUsd((value) => value + trade.expectedReturnUsd);
        }
      }

      setActiveTrades((items) => items.filter((item) => item.id !== tradeId));

      const result: ResultMarker = {
        id: randomId("result"),
        direction,
        won,
        amount: resultAmount,
        currency: trade.currency,
        entryPrice,
        closePrice,
        createdAt: Date.now(),
      };

      setResultMarkers((items) => [...items, result]);

      window.setTimeout(() => {
        setResultMarkers((items) => items.filter((item) => item.id !== result.id));
      }, 10_000);
    }, expirySeconds * 1000);
  }

  function handleNavClick(item: NavItem) {
    setActiveNav(item.label);

    if (item.path === "/trading") return;

    window.location.href = item.path;
  }

  function handleExpiryChange(unit: ExpiryUnit, delta: 1 | -1) {
    setExpirySeconds((value) => changeExpiryUnit(value, unit, delta));
  }

  function handleFullscreen() {
    if (!document.fullscreenElement) {
      void document.documentElement.requestFullscreen();
      return;
    }

    void document.exitFullscreen();
  }

  function toggleIndicator(indicator: string) {
    setSelectedIndicators((items) => {
      if (items.includes(indicator)) {
        return items.filter((item) => item !== indicator);
      }

      return [...items, indicator];
    });
  }

  return (
    <main className="trading-page">
      <div className="terminal-shell">
        <aside className="left-sidebar">
          <div className="brand-mini">N</div>

          {LEFT_NAV.map((item) => (
            <button
              key={item.label}
              className={`nav-button ${activeNav === item.label ? "active" : ""}`}
              type="button"
              onClick={() => handleNavClick(item)}
            >
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-label">{item.label}</span>
            </button>
          ))}
        </aside>

        <section className="workspace">
          <header className="terminal-header">
            <div className="brand-row">
              <span className="brand-logo">N</span>
              <span className="brand-name">NeuroOption</span>
              <span className="brand-star">★</span>
            </div>

            <div className="account-row">
              <select value={accountType} onChange={(event) => setAccountType(event.target.value as AccountType)}>
                <option value="QT Demo">QT Demo</option>
                <option value="QT Real">QT Real</option>
              </select>

              <select value={currency} onChange={(event) => setCurrency(event.target.value as AccountCurrency)}>
                {CURRENCIES.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>

              <strong className="balance-text">{formatCurrency(convertedBalance, currency)}</strong>

              <button type="button" className="topup-button" onClick={() => window.alert("Top Up module will open here.")}>
                TOP UP
              </button>

              <button type="button" className="fullscreen-button" onClick={handleFullscreen}>
                ⛶
              </button>

              <div className="avatar">SM</div>
            </div>
          </header>

          <section className="chart-layout">
            <div className="chart-panel">
              <div className="chart-toolbar">
                <div className="menu-wrap">
                  <button type="button" className="asset-button" onClick={() => setAssetOpen((value) => !value)}>
                    <span>{selectedAsset.symbol}</span>
                    <span>⌄</span>
                  </button>

                  {assetOpen && (
                    <div className="asset-menu">
                      <div className="asset-tabs">
                        {MARKET_CATEGORIES.map((category) => (
                          <button
                            key={category}
                            type="button"
                            className={category === assetCategory ? "active" : ""}
                            onClick={() => setAssetCategory(category)}
                          >
                            {category}
                          </button>
                        ))}
                      </div>

                      <div className="asset-list">
                        {filteredAssets.map((asset) => (
                          <button
                            key={asset.symbol}
                            type="button"
                            onClick={() => {
                              setSelectedAsset(asset);
                              setAssetCategory(asset.category);
                              setAssetOpen(false);
                              scaleRef.current = null;
                            }}
                          >
                            <span>{asset.symbol}</span>
                            <strong>+{asset.payout}%</strong>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <button type="button" className="tool-button" onClick={() => setTimeframeOpen((value) => !value)}>
                  📊 {timeframe}
                </button>

                <button type="button" className="tool-button" onClick={() => setIndicatorOpen((value) => !value)}>
                  Indicators
                </button>

                <button type="button" className="tool-button" onClick={() => setToolsOpen((value) => !value)}>
                  ✎ {drawingTool}
                </button>

                <div className="chart-type-row">
                  {CHART_TYPES.map((type) => (
                    <button
                      key={type}
                      type="button"
                      className={type === chartType ? "active" : ""}
                      onClick={() => setChartType(type)}
                    >
                      {type}
                    </button>
                  ))}
                </div>

                {timeframeOpen && (
                  <div className="small-menu timeframe-menu">
                    {TIMEFRAMES.map((item) => (
                      <button
                        key={item}
                        type="button"
                        className={item === timeframe ? "active" : ""}
                        onClick={() => {
                          setTimeframe(item);
                          setTimeframeOpen(false);
                          scaleRef.current = null;
                        }}
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                )}

                {indicatorOpen && (
                  <div className="indicator-menu">
                    {INDICATORS.map((indicator) => (
                      <button
                        key={indicator}
                        type="button"
                        className={selectedIndicators.includes(indicator) ? "active" : ""}
                        onClick={() => toggleIndicator(indicator)}
                      >
                        {indicator}
                      </button>
                    ))}
                  </div>
                )}

                {toolsOpen && (
                  <div className="small-menu tools-menu">
                    {DRAWING_TOOLS.map((tool) => (
                      <button
                        key={tool}
                        type="button"
                        className={tool === drawingTool ? "active" : ""}
                        onClick={() => {
                          setDrawingTool(tool);
                          setToolsOpen(false);
                        }}
                      >
                        {tool}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="chart-info-row">
                <span>{new Date(serverTime).toLocaleTimeString()} UTC+3</span>
                <span>{streamStatus === "live" ? "Backend OTC stream live" : "Moderate fallback active"}</span>
                <span>{selectedAsset.displayName}</span>
                <span>Current price {formatPrice(currentPrice, selectedAsset.precision)}</span>
              </div>

              <div className="chart-stage">
                <canvas ref={canvasRef} className="trading-canvas" />

                <div className="chart-bottom-tag">
                  <button type="button">←</button>
                  <button type="button">{timeframe} ▲</button>
                  <span>{selectedAsset.displayName}</span>
                </div>
              </div>
            </div>

            <aside className="trade-panel">
              <div className="sentiment">
                <strong>50%</strong>
                <div>
                  <span />
                </div>
                <strong>50%</strong>
              </div>

              <section className="time-section">
                <h3>Time ⓘ</h3>

                <div className="expiry-main">
                  <button
                    type="button"
                    onClick={() => setExpirySeconds((value) => Math.max(MIN_EXPIRY_SECONDS, value - 1))}
                  >
                    -
                  </button>

                  <strong>{secondsToTime(expirySeconds)}</strong>

                  <button
                    type="button"
                    onClick={() => setExpirySeconds((value) => Math.min(MAX_EXPIRY_SECONDS, value + 1))}
                  >
                    +
                  </button>
                </div>

                <p>Min 00:00:05 · Max 05:00:00</p>

                <div className="unit-grid">
                  <div>
                    <button type="button" onClick={() => handleExpiryChange("hours", 1)}>+</button>
                    <strong>{String(expiryParts.hours).padStart(2, "0")}</strong>
                    <button type="button" onClick={() => handleExpiryChange("hours", -1)}>-</button>
                    <span>Hours</span>
                  </div>

                  <div>
                    <button type="button" onClick={() => handleExpiryChange("minutes", 1)}>+</button>
                    <strong>{String(expiryParts.minutes).padStart(2, "0")}</strong>
                    <button type="button" onClick={() => handleExpiryChange("minutes", -1)}>-</button>
                    <span>Minutes</span>
                  </div>

                  <div>
                    <button type="button" onClick={() => handleExpiryChange("seconds", 1)}>+</button>
                    <strong>{String(expiryParts.seconds).padStart(2, "0")}</strong>
                    <button type="button" onClick={() => handleExpiryChange("seconds", -1)}>-</button>
                    <span>Seconds</span>
                  </div>
                </div>
              </section>

              <section className="amount-section">
                <h3>Amount ⓘ</h3>

                <label className="amount-input">
                  <input value={amount} onChange={(event) => setAmount(event.target.value)} inputMode="decimal" />
                  <span>{currency}</span>
                </label>
              </section>

              <section className="payout-box">
                <div>
                  <span>Rate</span>
                  <strong>+{payoutPercent}%</strong>
                </div>

                <div>
                  <span>Expected profit</span>
                  <strong>{formatCurrency(expectedProfit, currency)}</strong>
                </div>

                <div>
                  <span>Expected return</span>
                  <strong>{formatCurrency(expectedReturn, currency)}</strong>
                </div>
              </section>

              <div className="trade-actions">
                <button type="button" className="buy-button" disabled={!canTrade} onClick={() => handleTrade("BUY")}>
                  ↗ BUY
                </button>

                <button type="button" className="ai-button">
                  AI TRADING
                </button>

                <button type="button" className="sell-button" disabled={!canTrade} onClick={() => handleTrade("SELL")}>
                  ↘ SELL
                </button>
              </div>
            </aside>
          </section>
        </section>

        <aside className="right-sidebar">
          {QUICK_NAV.map(([icon, label]) => (
            <button key={label} type="button" onClick={label === "Full Screen" ? handleFullscreen : undefined}>
              <span>{icon}</span>
              <strong>{label}</strong>
            </button>
          ))}
        </aside>

        <nav className="mobile-bottom-nav">
          {QUICK_NAV.slice(0, 5).map(([icon, label]) => (
            <button key={label} type="button">
              <span>{icon}</span>
              <strong>{label}</strong>
            </button>
          ))}
        </nav>
      </div>
    </main>
  );
}