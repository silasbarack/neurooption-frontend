import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import "./TradingPage.css";

type AccountType = "Demo" | "Real";
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

type AssetCategory = "Currencies" | "Cryptocurrencies" | "Stocks" | "Indices" | "Commodities";
type Direction = "BUY" | "SELL";
type ChartType = "Candlesticks" | "Heiken Ashi" | "Bars" | "Line";
type ToolMode = "Cursor" | "Trend Line" | "Horizontal Line" | "Brush" | "Text" | "Levels";

type Asset = {
  symbol: string;
  name: string;
  category: AssetCategory;
  basePrice: number;
  volatility: number;
  payout: number;
  decimals: number;
};

type Candle = {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
};

type TradeResult = {
  id: string;
  direction: Direction;
  entryPrice: number;
  exitPrice?: number;
  amount: number;
  profit: number;
  payout: number;
  openedAt: number;
  expiresAt: number;
  status: "OPEN" | "WIN" | "LOSS";
};

const ASSETS: Asset[] = [
  { symbol: "AUD/CAD OTC", name: "Australian Dollar / Canadian Dollar", category: "Currencies", basePrice: 0.84217, volatility: 0.00018, payout: 92, decimals: 5 },
  { symbol: "EUR/USD OTC", name: "Euro / US Dollar", category: "Currencies", basePrice: 1.13351, volatility: 0.00022, payout: 92, decimals: 5 },
  { symbol: "USD/JPY OTC", name: "US Dollar / Japanese Yen", category: "Currencies", basePrice: 157.41, volatility: 0.035, payout: 88, decimals: 3 },
  { symbol: "GBP/USD OTC", name: "British Pound / US Dollar", category: "Currencies", basePrice: 1.26812, volatility: 0.00028, payout: 90, decimals: 5 },
  { symbol: "USD/KES OTC", name: "US Dollar / Kenyan Shilling", category: "Currencies", basePrice: 129.2, volatility: 0.04, payout: 84, decimals: 2 },

  { symbol: "BTC/USD OTC", name: "Bitcoin / US Dollar", category: "Cryptocurrencies", basePrice: 66250, volatility: 95, payout: 86, decimals: 2 },
  { symbol: "ETH/USD OTC", name: "Ethereum / US Dollar", category: "Cryptocurrencies", basePrice: 3520, volatility: 8.5, payout: 85, decimals: 2 },
  { symbol: "BNB/USD OTC", name: "BNB / US Dollar", category: "Cryptocurrencies", basePrice: 605, volatility: 1.7, payout: 82, decimals: 2 },

  { symbol: "AAPL OTC", name: "Apple Inc.", category: "Stocks", basePrice: 212.4, volatility: 0.24, payout: 80, decimals: 2 },
  { symbol: "TSLA OTC", name: "Tesla Inc.", category: "Stocks", basePrice: 178.9, volatility: 0.55, payout: 82, decimals: 2 },
  { symbol: "NVDA OTC", name: "NVIDIA Corporation", category: "Stocks", basePrice: 126.6, volatility: 0.3, payout: 83, decimals: 2 },

  { symbol: "US100 OTC", name: "Nasdaq 100", category: "Indices", basePrice: 19888.46, volatility: 16, payout: 85, decimals: 2 },
  { symbol: "US500 OTC", name: "S&P 500", category: "Indices", basePrice: 5434.15, volatility: 4.5, payout: 84, decimals: 2 },
  { symbol: "GER40 OTC", name: "Germany 40", category: "Indices", basePrice: 18450.8, volatility: 12, payout: 83, decimals: 2 },

  { symbol: "XAU/USD OTC", name: "Gold / US Dollar", category: "Commodities", basePrice: 2326.5, volatility: 2.8, payout: 88, decimals: 2 },
  { symbol: "XAG/USD OTC", name: "Silver / US Dollar", category: "Commodities", basePrice: 29.42, volatility: 0.07, payout: 82, decimals: 3 },
  { symbol: "BRENT OTC", name: "Brent Crude Oil", category: "Commodities", basePrice: 82.35, volatility: 0.18, payout: 81, decimals: 2 },
];

const TIMEFRAMES = ["S5", "S15", "S30", "M1", "M2", "M5", "M15", "M30", "H1", "H3", "H4", "D1"];

const INDICATORS = [
  "Moving Average", "EMA", "SMA", "WMA", "Bollinger Bands", "RSI", "MACD", "Stochastic",
  "ADX", "ATR", "CCI", "Parabolic SAR", "Ichimoku", "Momentum", "Williams %R", "ROC",
  "Awesome Oscillator", "Alligator", "Fractals", "ZigZag", "Envelopes", "Keltner Channel",
  "Donchian Channel", "Pivot Points", "SuperTrend", "VWAP", "Volume", "OBV", "MFI",
  "Aroon", "DeMarker", "Standard Deviation", "Heikin Signal", "Trend Strength", "Price Channel",
  "MA Cross", "Binary Pulse", "Support Resistance", "Volatility Index", "Candle Pattern",
  "Session High Low", "OTC Rhythm",
];

const DRAWING_TOOLS: ToolMode[] = ["Cursor", "Trend Line", "Horizontal Line", "Brush", "Text", "Levels"];

const CURRENCIES: CurrencyCode[] = ["USD", "KES", "UGX", "TZS", "NGN", "XOF", "EUR", "CAD", "JPY", "CNY", "AOA", "ZAR", "BRL"];

const FALLBACK_RATES: Record<CurrencyCode, number> = {
  USD: 1,
  KES: 129,
  UGX: 3720,
  TZS: 2600,
  NGN: 1500,
  XOF: 610,
  EUR: 0.92,
  CAD: 1.37,
  JPY: 157,
  CNY: 7.25,
  AOA: 870,
  ZAR: 18.2,
  BRL: 5.4,
};

function formatSeconds(total: number) {
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

function timeframeSeconds(tf: string) {
  if (tf.startsWith("S")) return Number(tf.slice(1));
  if (tf.startsWith("M")) return Number(tf.slice(1)) * 60;
  if (tf.startsWith("H")) return Number(tf.slice(1)) * 3600;
  return 86400;
}

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

function money(value: number, currency: CurrencyCode) {
  const digits = ["JPY", "XOF", "UGX", "TZS"].includes(currency) ? 0 : 2;
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(value);
}

function randomId() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

function makeInitialCandles(asset: Asset, tfSeconds: number): Candle[] {
  const now = Date.now();
  const candles: Candle[] = [];
  let price = asset.basePrice;

  for (let i = 130; i >= 0; i -= 1) {
    const open = price;
    const wave = Math.sin(i / 7) * asset.volatility * 2.8;
    const noise = (Math.random() - 0.5) * asset.volatility * 5;
    const close = Math.max(0.00001, open + wave + noise);
    const high = Math.max(open, close) + Math.random() * asset.volatility * 4;
    const low = Math.min(open, close) - Math.random() * asset.volatility * 4;

    candles.push({
      time: now - i * tfSeconds * 1000,
      open,
      high,
      low: Math.max(0.00001, low),
      close,
    });

    price = close;
  }

  return candles;
}

function heikenAshi(candles: Candle[]) {
  const result: Candle[] = [];

  candles.forEach((candle, index) => {
    const close = (candle.open + candle.high + candle.low + candle.close) / 4;
    const open = index === 0 ? (candle.open + candle.close) / 2 : (result[index - 1].open + result[index - 1].close) / 2;
    const high = Math.max(candle.high, open, close);
    const low = Math.min(candle.low, open, close);
    result.push({ ...candle, open, high, low, close });
  });

  return result;
}

export default function TradingPage() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationRef = useRef<number | null>(null);
  const lastTickRef = useRef<number>(0);
  const candlesRef = useRef<Candle[]>([]);
  const tradesRef = useRef<TradeResult[]>([]);

  const [accountType, setAccountType] = useState<AccountType>("Demo");
  const [currency, setCurrency] = useState<CurrencyCode>("USD");
  const [rates, setRates] = useState<Record<CurrencyCode, number>>(FALLBACK_RATES);
  const [balanceUsd, setBalanceUsd] = useState(() => Number(localStorage.getItem("neuro_demo_balance_usd") || "70000"));

  const [asset, setAsset] = useState<Asset>(ASSETS[0]);
  const [category, setCategory] = useState<AssetCategory>("Currencies");
  const [chartType, setChartType] = useState<ChartType>("Candlesticks");
  const [timeframe, setTimeframe] = useState("M1");
  const [selectedIndicators, setSelectedIndicators] = useState<string[]>(["Moving Average"]);
  const [tool, setTool] = useState<ToolMode>("Cursor");

  const [expirySeconds, setExpirySeconds] = useState(30 * 60);
  const [amount, setAmount] = useState(100);
  const [activeMenu, setActiveMenu] = useState<"assets" | "timeframes" | "indicators" | "drawings" | null>(null);
  const [status, setStatus] = useState<"Connected" | "Disconnected">("Connected");
  const [notice, setNotice] = useState<string>("");
  const [resultFlash, setResultFlash] = useState<TradeResult | null>(null);
  const [openTrades, setOpenTrades] = useState<TradeResult[]>([]);

  const displayedBalance = accountType === "Real" ? 0 : balanceUsd * rates[currency];
  const displayedAmount = amount;
  const expectedProfit = displayedAmount * (asset.payout / 100);
  const expectedReturn = displayedAmount + expectedProfit;
  const tfSeconds = timeframeSeconds(timeframe);

  const selectedChartCandles = useMemo(() => {
    if (chartType === "Heiken Ashi") return heikenAshi(candlesRef.current);
    return candlesRef.current;
  }, [chartType, asset, timeframe, openTrades, resultFlash]);

  const resetCandles = useCallback((nextAsset: Asset, nextTimeframe: string) => {
    candlesRef.current = makeInitialCandles(nextAsset, timeframeSeconds(nextTimeframe));
  }, []);

  useEffect(() => {
    resetCandles(asset, timeframe);
  }, [asset, timeframe, resetCandles]);

  useEffect(() => {
    localStorage.setItem("neuro_demo_balance_usd", String(balanceUsd));
  }, [balanceUsd]);

  useEffect(() => {
    let alive = true;

    async function loadRates() {
      try {
        const res = await fetch("https://open.er-api.com/v6/latest/USD");
        const data = await res.json();

        if (!alive || !data?.rates) return;

        setRates({
          USD: 1,
          KES: data.rates.KES ?? FALLBACK_RATES.KES,
          UGX: data.rates.UGX ?? FALLBACK_RATES.UGX,
          TZS: data.rates.TZS ?? FALLBACK_RATES.TZS,
          NGN: data.rates.NGN ?? FALLBACK_RATES.NGN,
          XOF: data.rates.XOF ?? FALLBACK_RATES.XOF,
          EUR: data.rates.EUR ?? FALLBACK_RATES.EUR,
          CAD: data.rates.CAD ?? FALLBACK_RATES.CAD,
          JPY: data.rates.JPY ?? FALLBACK_RATES.JPY,
          CNY: data.rates.CNY ?? FALLBACK_RATES.CNY,
          AOA: data.rates.AOA ?? FALLBACK_RATES.AOA,
          ZAR: data.rates.ZAR ?? FALLBACK_RATES.ZAR,
          BRL: data.rates.BRL ?? FALLBACK_RATES.BRL,
        });
      } catch {
        setRates(FALLBACK_RATES);
      }
    }

    loadRates();
    return () => {
      alive = false;
    };
  }, []);

  const convertToUsd = useCallback(
    (value: number) => value / rates[currency],
    [rates, currency]
  );

  const changeExpiry = (unit: "hours" | "minutes" | "seconds", delta: number) => {
    setExpirySeconds((prev) => {
      let next = prev;

      if (unit === "hours") next += delta * 3600;
      if (unit === "minutes") next += delta * 60;
      if (unit === "seconds") next += delta;

      return clamp(next, 5, 5 * 3600);
    });
  };

  const setExpiryPart = (unit: "hours" | "minutes" | "seconds", value: number) => {
    setExpirySeconds((prev) => {
      const h = Math.floor(prev / 3600);
      const m = Math.floor((prev % 3600) / 60);
      const s = prev % 60;

      const nextH = unit === "hours" ? value : h;
      const nextM = unit === "minutes" ? value : m;
      const nextS = unit === "seconds" ? value : s;

      return clamp(nextH * 3600 + nextM * 60 + nextS, 5, 5 * 3600);
    });
  };

  const currentPrice = candlesRef.current[candlesRef.current.length - 1]?.close ?? asset.basePrice;

  const placeTrade = (direction: Direction) => {
    if (accountType === "Real") {
      setNotice("Real account balance is 0. Use Demo until deposits are connected.");
      setTimeout(() => setNotice(""), 4000);
      return;
    }

    if (amount <= 0) {
      setNotice("Enter a valid amount.");
      setTimeout(() => setNotice(""), 3000);
      return;
    }

    if (amount > displayedBalance) {
      setNotice("Insufficient demo balance.");
      setTimeout(() => setNotice(""), 3000);
      return;
    }

    const amountUsd = convertToUsd(amount);
    setBalanceUsd((prev) => Math.max(0, prev - amountUsd));

    const trade: TradeResult = {
      id: randomId(),
      direction,
      entryPrice: currentPrice,
      amount,
      profit: expectedProfit,
      payout: asset.payout,
      openedAt: Date.now(),
      expiresAt: Date.now() + expirySeconds * 1000,
      status: "OPEN",
    };

    tradesRef.current = [...tradesRef.current, trade];
    setOpenTrades([...tradesRef.current.filter((item) => item.status === "OPEN")]);
  };

  const resolveTrades = useCallback(() => {
    const now = Date.now();
    let changed = false;
    let balanceBonusUsd = 0;
    const price = candlesRef.current[candlesRef.current.length - 1]?.close ?? asset.basePrice;

    tradesRef.current = tradesRef.current.map((trade) => {
      if (trade.status !== "OPEN" || now < trade.expiresAt) return trade;

      const won = trade.direction === "BUY" ? price > trade.entryPrice : price < trade.entryPrice;
      const resolved: TradeResult = {
        ...trade,
        exitPrice: price,
        status: won ? "WIN" : "LOSS",
      };

      if (won) {
        balanceBonusUsd += convertToUsd(trade.amount + trade.profit);
      }

      changed = true;
      setResultFlash(resolved);
      setTimeout(() => setResultFlash(null), 10000);

      return resolved;
    });

    if (balanceBonusUsd > 0) setBalanceUsd((prev) => prev + balanceBonusUsd);
    if (changed) setOpenTrades([...tradesRef.current.filter((item) => item.status === "OPEN")]);
  }, [asset.basePrice, convertToUsd]);

  const tickPrice = useCallback(() => {
    const candles = candlesRef.current;
    if (!candles.length) return;

    const now = Date.now();
    const last = candles[candles.length - 1];
    const nextCandleDue = now - last.time >= tfSeconds * 1000;

    const drift = Math.sin(now / 4500) * asset.volatility * 0.55;
    const microMove = (Math.random() - 0.5) * asset.volatility * 2.8;
    const meanRevert = (asset.basePrice - last.close) * 0.0012;
    const nextPrice = Math.max(0.00001, last.close + drift + microMove + meanRevert);

    if (nextCandleDue) {
      candles.push({
        time: now,
        open: last.close,
        high: Math.max(last.close, nextPrice),
        low: Math.min(last.close, nextPrice),
        close: nextPrice,
      });

      if (candles.length > 170) candles.shift();
    } else {
      last.close = nextPrice;
      last.high = Math.max(last.high, nextPrice);
      last.low = Math.min(last.low, nextPrice);
    }

    resolveTrades();
  }, [asset, tfSeconds, resolveTrades]);

  const drawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const parent = canvas.parentElement;
    if (!parent) return;

    const dpr = window.devicePixelRatio || 1;
    const width = parent.clientWidth;
    const height = parent.clientHeight;

    if (canvas.width !== width * dpr || canvas.height !== height * dpr) {
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
    }

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, width, height);

    const gradient = ctx.createLinearGradient(0, 0, 0, height);
    gradient.addColorStop(0, "#263958");
    gradient.addColorStop(1, "#141c31");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    ctx.globalAlpha = 0.17;
    ctx.fillStyle = "#d8e9ff";
    ctx.beginPath();
    ctx.moveTo(0, height * 0.62);
    ctx.lineTo(width * 0.16, height * 0.42);
    ctx.lineTo(width * 0.34, height * 0.72);
    ctx.lineTo(width * 0.56, height * 0.38);
    ctx.lineTo(width * 0.74, height * 0.66);
    ctx.lineTo(width, height * 0.44);
    ctx.lineTo(width, height);
    ctx.lineTo(0, height);
    ctx.closePath();
    ctx.fill();
    ctx.globalAlpha = 1;

    const candles = chartType === "Heiken Ashi" ? heikenAshi(candlesRef.current) : candlesRef.current;
    const visible = candles.slice(-82);
    if (visible.length < 2) return;

    const highs = visible.map((c) => c.high);
    const lows = visible.map((c) => c.low);
    const max = Math.max(...highs);
    const min = Math.min(...lows);
    const pad = (max - min) * 0.14 || asset.volatility * 10;
    const top = max + pad;
    const bottom = min - pad;

    const y = (price: number) => height - ((price - bottom) / (top - bottom)) * height;
    const chartLeft = 18;
    const chartRight = width - 54;
    const chartTop = 8;
    const chartBottom = height - 28;
    const chartWidth = chartRight - chartLeft;
    const chartHeight = chartBottom - chartTop;

    ctx.save();
    ctx.beginPath();
    ctx.rect(chartLeft, chartTop, chartWidth, chartHeight);
    ctx.clip();

    ctx.strokeStyle = "rgba(160,190,235,0.16)";
    ctx.lineWidth = 1;
    for (let i = 0; i <= 8; i += 1) {
      const gx = chartLeft + (chartWidth / 8) * i;
      ctx.beginPath();
      ctx.moveTo(gx, chartTop);
      ctx.lineTo(gx, chartBottom);
      ctx.stroke();
    }

    for (let i = 0; i <= 7; i += 1) {
      const gy = chartTop + (chartHeight / 7) * i;
      ctx.beginPath();
      ctx.moveTo(chartLeft, gy);
      ctx.lineTo(chartRight, gy);
      ctx.stroke();
    }

    const candleGap = chartWidth / visible.length;
    const candleWidth = Math.max(3, Math.min(10, candleGap * 0.58));

    if (chartType === "Line") {
      ctx.strokeStyle = "#61dce6";
      ctx.lineWidth = 2;
      ctx.beginPath();
      visible.forEach((c, i) => {
        const x = chartLeft + i * candleGap + candleGap / 2;
        const py = y(c.close);
        if (i === 0) ctx.moveTo(x, py);
        else ctx.lineTo(x, py);
      });
      ctx.stroke();
    } else {
      visible.forEach((c, i) => {
        const x = chartLeft + i * candleGap + candleGap / 2;
        const openY = y(c.open);
        const closeY = y(c.close);
        const highY = y(c.high);
        const lowY = y(c.low);
        const up = c.close >= c.open;
        const color = up ? "#63e6de" : "#ff695f";

        ctx.strokeStyle = color;
        ctx.fillStyle = color;
        ctx.lineWidth = chartType === "Bars" ? 2 : 1;

        ctx.beginPath();
        ctx.moveTo(x, highY);
        ctx.lineTo(x, lowY);
        ctx.stroke();

        if (chartType === "Bars") {
          ctx.beginPath();
          ctx.moveTo(x - candleWidth / 2, openY);
          ctx.lineTo(x, openY);
          ctx.moveTo(x, closeY);
          ctx.lineTo(x + candleWidth / 2, closeY);
          ctx.stroke();
        } else {
          const bodyTop = Math.min(openY, closeY);
          const bodyHeight = Math.max(2, Math.abs(closeY - openY));
          ctx.fillRect(x - candleWidth / 2, bodyTop, candleWidth, bodyHeight);
        }
      });
    }

    const lastPrice = visible[visible.length - 1].close;
    const priceY = y(lastPrice);

    ctx.strokeStyle = "rgba(102,210,255,0.9)";
    ctx.setLineDash([5, 4]);
    ctx.beginPath();
    ctx.moveTo(chartLeft, priceY);
    ctx.lineTo(chartRight, priceY);
    ctx.stroke();
    ctx.setLineDash([]);

    const expiryX = chartRight - 78;
    ctx.strokeStyle = "rgba(255,255,255,0.95)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(expiryX, chartTop);
    ctx.lineTo(expiryX, chartBottom);
    ctx.stroke();

    ctx.fillStyle = "#ffffff";
    ctx.font = "700 11px Inter, Arial";
    ctx.fillText("Expiration time", expiryX + 8, chartTop + 26);

    openTrades.forEach((trade, index) => {
      const tradeY = y(trade.entryPrice);
      ctx.fillStyle = trade.direction === "BUY" ? "#42e472" : "#ff5d55";
      ctx.fillRect(chartLeft + 8, tradeY - 15 - index * 18, 84, 22);
      ctx.fillStyle = "#fff";
      ctx.font = "800 10px Inter, Arial";
      ctx.fillText(`${trade.direction} ${money(trade.amount, currency)}`, chartLeft + 14, tradeY - index * 18);
    });

    if (resultFlash) {
      const resultY = y(resultFlash.exitPrice ?? lastPrice);
      ctx.fillStyle = resultFlash.status === "WIN" ? "rgba(46,214,99,0.96)" : "rgba(240,70,70,0.96)";
      ctx.fillRect(chartLeft + 10, resultY - 18, 118, 28);
      ctx.fillStyle = "#fff";
      ctx.font = "900 12px Inter, Arial";
      const text = resultFlash.status === "WIN"
        ? `✓ +${money(resultFlash.profit, currency)}`
        : `✓ ${currency} 0`;
      ctx.fillText(text, chartLeft + 18, resultY + 1);
    }

    ctx.restore();

    ctx.fillStyle = "#aebbd8";
    ctx.font = "700 11px Inter, Arial";
    for (let i = 0; i <= 5; i += 1) {
      const price = bottom + ((top - bottom) / 5) * i;
      ctx.fillText(price.toFixed(asset.decimals), width - 50, y(price) + 4);
    }

    ctx.fillStyle = "#dce8ff";
    ctx.font = "800 12px Inter, Arial";
    ctx.fillText(`${timeframe}`, width - 100, priceY - 9);
    ctx.fillText(`${formatSeconds(Math.max(0, Math.floor((Date.now() % (tfSeconds * 1000)) / 1000)))}`, width - 100, priceY + 11);
  }, [asset, chartType, currency, openTrades, resultFlash, tfSeconds, timeframe]);

  useEffect(() => {
    const loop = (timestamp: number) => {
      if (timestamp - lastTickRef.current > 240) {
        tickPrice();
        lastTickRef.current = timestamp;
      }

      drawCanvas();
      animationRef.current = requestAnimationFrame(loop);
    };

    animationRef.current = requestAnimationFrame(loop);

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [drawCanvas, tickPrice]);

  useEffect(() => {
    const online = () => setStatus("Connected");
    const offline = () => setStatus("Disconnected");

    window.addEventListener("online", online);
    window.addEventListener("offline", offline);

    return () => {
      window.removeEventListener("online", online);
      window.removeEventListener("offline", offline);
    };
  }, []);

  const toggleIndicator = (name: string) => {
    setSelectedIndicators((prev) =>
      prev.includes(name) ? prev.filter((item) => item !== name) : [...prev, name]
    );
  };

  return (
    <main className="nt-screen">
      <header className="nt-topbar">
        <div className="nt-brand">
          <span className="nt-brand-mark">N</span>
          <strong>NeuroOption</strong>
          <button className="nt-star" type="button">★</button>
        </div>

        <div className="nt-account">
          <select value={accountType} onChange={(e) => setAccountType(e.target.value as AccountType)}>
            <option value="Demo">QT Demo</option>
            <option value="Real">QT Real</option>
          </select>

          <select value={currency} onChange={(e) => setCurrency(e.target.value as CurrencyCode)}>
            {CURRENCIES.map((item) => (
              <option key={item} value={item}>{item}</option>
            ))}
          </select>

          <strong>{currency} {money(displayedBalance, currency)}</strong>
          <button className="nt-topup" type="button">TOP UP</button>
          <button className="nt-fullscreen" type="button" onClick={() => document.documentElement.requestFullscreen?.()}>
            ⛶
          </button>
          <span className="nt-avatar">SM</span>
        </div>
      </header>

      <aside className="nt-leftbar">
        <button className="active" type="button"><span>📈</span><small>Trading</small></button>
        <button type="button"><span>$</span><small>Finance</small></button>
        <button type="button"><span>👤</span><small>Profile</small></button>
        <button type="button"><span>🛒</span><small>Market</small></button>
        <button type="button"><span>💎</span><small>Achievements</small></button>
        <button type="button"><span>🏆</span><small>Tournaments</small></button>
        <button type="button"><span>💬</span><small>Chat</small></button>
        <button type="button"><span>?</span><small>Help</small></button>
        <button className="promo" type="button"><span>🎁</span><small>Promo</small></button>
        <button type="button"><span>🤖</span><small>Autotrading</small></button>
      </aside>

      <section className="nt-terminal">
        {notice && <div className="nt-notice">{notice}</div>}

        <div className="nt-toolbar">
          <button className="nt-asset-button" type="button" onClick={() => setActiveMenu(activeMenu === "assets" ? null : "assets")}>
            {asset.symbol} ▾
          </button>

          <button
            className="nt-tool-btn"
            type="button"
            title="Candlestick timeframe"
            onClick={() => setActiveMenu(activeMenu === "timeframes" ? null : "timeframes")}
          >
            📊 {timeframe}
          </button>

          <button
            className="nt-tool-btn"
            type="button"
            title="Indicators"
            onClick={() => setActiveMenu(activeMenu === "indicators" ? null : "indicators")}
          >
            sliders
          </button>

          <button
            className="nt-tool-btn"
            type="button"
            title="Drawing tools"
            onClick={() => setActiveMenu(activeMenu === "drawings" ? null : "drawings")}
          >
            ✎
          </button>

          <button className="nt-tool-btn" type="button">•••</button>

          <div className="nt-chart-switches">
            {(["Candlesticks", "Heiken Ashi", "Bars", "Line"] as ChartType[]).map((item) => (
              <button
                key={item}
                type="button"
                className={chartType === item ? "active" : ""}
                onClick={() => setChartType(item)}
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        <div className="nt-subbar">
          <span>{new Date().toLocaleTimeString()} UTC+3</span>
          <span>⚙</span>
          <span>Tool: {tool}</span>
          <strong className={status === "Connected" ? "ok" : "bad"}>● {status}</strong>
        </div>

        {activeMenu === "assets" && (
          <div className="nt-popover nt-assets-panel">
            <div className="nt-tabs">
              {(["Currencies", "Cryptocurrencies", "Stocks", "Indices", "Commodities"] as AssetCategory[]).map((item) => (
                <button
                  key={item}
                  type="button"
                  className={category === item ? "active" : ""}
                  onClick={() => setCategory(item)}
                >
                  {item}
                </button>
              ))}
            </div>

            <div className="nt-assets-list">
              {ASSETS.filter((item) => item.category === category).map((item) => (
                <button
                  key={item.symbol}
                  type="button"
                  onClick={() => {
                    setAsset(item);
                    setActiveMenu(null);
                  }}
                >
                  <span>{item.symbol}</span>
                  <small>{item.name}</small>
                </button>
              ))}
            </div>
          </div>
        )}

        {activeMenu === "timeframes" && (
          <div className="nt-popover nt-small-panel nt-timeframe-panel">
            <h3>Candlestick timeframe</h3>
            <div className="nt-grid-buttons">
              {TIMEFRAMES.map((item) => (
                <button
                  key={item}
                  type="button"
                  className={timeframe === item ? "active" : ""}
                  onClick={() => {
                    setTimeframe(item);
                    setActiveMenu(null);
                  }}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        )}

        {activeMenu === "indicators" && (
          <div className="nt-popover nt-indicator-panel">
            <h3>Indicators</h3>
            <div className="nt-indicator-grid">
              {INDICATORS.map((item) => (
                <button
                  key={item}
                  type="button"
                  className={selectedIndicators.includes(item) ? "active" : ""}
                  onClick={() => toggleIndicator(item)}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        )}

        {activeMenu === "drawings" && (
          <div className="nt-popover nt-small-panel">
            <h3>Drawing tools</h3>
            <div className="nt-grid-buttons">
              {DRAWING_TOOLS.map((item) => (
                <button
                  key={item}
                  type="button"
                  className={tool === item ? "active" : ""}
                  onClick={() => {
                    setTool(item);
                    setActiveMenu(null);
                  }}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        )}

        <section className="nt-chart-area">
          <canvas ref={canvasRef} className="nt-chart-canvas" />
          <div className="nt-chart-footer">
            <button type="button">←</button>
            <button type="button">{timeframe} ▴</button>
            <span>{asset.name}</span>
          </div>
        </section>

        <aside className="nt-trade-panel">
          <div className="nt-meter">
            <span>50%</span>
            <div><i /></div>
            <span>50%</span>
          </div>

          <div className="nt-trade-box">
            <label>Time ⓘ</label>
            <div className="nt-hms-expiry">
              <div className="nt-hms-column">
                <button type="button" onClick={() => changeExpiry("hours", -1)}>-</button>
                <strong>{String(Math.floor(expirySeconds / 3600)).padStart(2, "0")}</strong>
                <button type="button" onClick={() => changeExpiry("hours", 1)}>+</button>
                <span>Hours</span>
              </div>

              <div className="nt-hms-column">
                <button type="button" onClick={() => changeExpiry("minutes", -1)}>-</button>
                <strong>{String(Math.floor((expirySeconds % 3600) / 60)).padStart(2, "0")}</strong>
                <button type="button" onClick={() => changeExpiry("minutes", 1)}>+</button>
                <span>Min</span>
              </div>

              <div className="nt-hms-column">
                <button type="button" onClick={() => changeExpiry("seconds", -1)}>-</button>
                <strong>{String(expirySeconds % 60).padStart(2, "0")}</strong>
                <button type="button" onClick={() => changeExpiry("seconds", 1)}>+</button>
                <span>Sec</span>
              </div>
            </div>

            <div className="nt-expiry-preview">
              <b>{formatSeconds(expirySeconds)}</b>
              <small>Min 00:00:05 · Max 05:00:00</small>
            </div>

            <label>Amount ⓘ</label>
            <div className="nt-amount-box">
              <input
                value={amount}
                min={1}
                type="number"
                onChange={(e) => setAmount(Math.max(1, Number(e.target.value || 1)))}
              />
              <span>{currency}</span>
            </div>

            <label>Payout ⓘ</label>
            <div className="nt-calculation">
              <div>
                <span>Rate</span>
                <strong>+{asset.payout}%</strong>
              </div>
              <div>
                <span>Expected profit</span>
                <strong>{currency} {money(expectedProfit, currency)}</strong>
              </div>
              <div>
                <span>Expected return</span>
                <strong>{currency} {money(expectedReturn, currency)}</strong>
              </div>
            </div>

            <button className="nt-buy" type="button" onClick={() => placeTrade("BUY")}>↗ BUY</button>
            <button className="nt-ai" type="button">AI TRADING</button>
            <button className="nt-sell" type="button" onClick={() => placeTrade("SELL")}>↘ SELL</button>
          </div>
        </aside>
      </section>

      <aside className="nt-rightbar">
        <button type="button"><span>↻</span><small>Trades</small></button>
        <button type="button"><span>📡</span><small>Signals</small></button>
        <button type="button"><span>👥</span><small>Social</small></button>
        <button type="button"><span>◎</span><small>Express</small></button>
        <button type="button"><span>⌛</span><small>Pending</small></button>
        <button type="button"><span>⌨</span><small>Hotkeys</small></button>
        <button type="button" onClick={() => document.documentElement.requestFullscreen?.()}><span>⛶</span><small>Full screen</small></button>
      </aside>
    </main>
  );
}