import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { CSSProperties } from "react";
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

type AssetCategory =
  | "Currencies"
  | "Cryptocurrencies"
  | "Stocks"
  | "Indices"
  | "Commodities";

type ChartType = "Candlesticks" | "Heiken Ashi" | "Bars" | "Line";
type TradeDirection = "BUY" | "SELL";

type CurrencyMeta = {
  code: CurrencyCode;
  symbol: string;
  rate: number;
};

type Asset = {
  id: string;
  name: string;
  displayName: string;
  category: AssetCategory;
  market: "OTC" | "Real";
  basePrice: number;
  payout: number;
};

type Candle = {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
};

type PendingTrade = {
  id: string;
  direction: TradeDirection;
  accountType: AccountType;
  currency: CurrencyCode;
  amount: number;
  entryPrice: number;
  entryTime: number;
  expiryAt: number;
  payout: number;
  expectedProfit: number;
  expectedReturn: number;
};

type ResultMarker = {
  id: string;
  direction: TradeDirection;
  currency: CurrencyCode;
  amount: number;
  profit: number;
  price: number;
  won: boolean;
};

const CHART_WIDTH = 1000;
const CHART_HEIGHT = 520;
const MIN_EXPIRY_SECONDS = 5;
const MAX_EXPIRY_SECONDS = 5 * 60 * 60;

const CURRENCIES: CurrencyMeta[] = [
  { code: "USD", symbol: "$", rate: 1 },
  { code: "KES", symbol: "KES ", rate: 129 },
  { code: "UGX", symbol: "UGX ", rate: 3700 },
  { code: "TZS", symbol: "TZS ", rate: 2600 },
  { code: "NGN", symbol: "₦", rate: 1500 },
  { code: "XOF", symbol: "XOF ", rate: 600 },
  { code: "EUR", symbol: "€", rate: 0.92 },
  { code: "CAD", symbol: "CAD ", rate: 1.37 },
  { code: "JPY", symbol: "¥", rate: 157 },
  { code: "CNY", symbol: "¥", rate: 7.25 },
  { code: "AOA", symbol: "Kz ", rate: 900 },
  { code: "ZAR", symbol: "R ", rate: 18.2 },
  { code: "BRL", symbol: "R$ ", rate: 5.45 },
];

const EXCHANGE_RATES: Record<CurrencyCode, number> = CURRENCIES.reduce(
  (rates, currency) => {
    rates[currency.code] = currency.rate;
    return rates;
  },
  {} as Record<CurrencyCode, number>,
);

const CURRENCY_SYMBOLS: Record<CurrencyCode, string> = CURRENCIES.reduce(
  (symbols, currency) => {
    symbols[currency.code] = currency.symbol;
    return symbols;
  },
  {} as Record<CurrencyCode, string>,
);

const ASSETS: Asset[] = [
  {
    id: "aud-cad-otc",
    name: "AUD/CAD OTC",
    displayName: "Australian Dollar / Canadian Dollar",
    category: "Currencies",
    market: "OTC",
    basePrice: 0.84217,
    payout: 92,
  },
  {
    id: "eur-usd-otc",
    name: "EUR/USD OTC",
    displayName: "Euro / United States Dollar",
    category: "Currencies",
    market: "OTC",
    basePrice: 1.13351,
    payout: 91,
  },
  {
    id: "usd-jpy-otc",
    name: "USD/JPY OTC",
    displayName: "United States Dollar / Japanese Yen",
    category: "Currencies",
    market: "OTC",
    basePrice: 157.42,
    payout: 88,
  },
  {
    id: "gbp-usd-otc",
    name: "GBP/USD OTC",
    displayName: "British Pound / United States Dollar",
    category: "Currencies",
    market: "OTC",
    basePrice: 1.2748,
    payout: 90,
  },
  {
    id: "btc-usd-otc",
    name: "BTC/USD OTC",
    displayName: "Bitcoin / United States Dollar",
    category: "Cryptocurrencies",
    market: "OTC",
    basePrice: 65200,
    payout: 86,
  },
  {
    id: "eth-usd-otc",
    name: "ETH/USD OTC",
    displayName: "Ethereum / United States Dollar",
    category: "Cryptocurrencies",
    market: "OTC",
    basePrice: 3420,
    payout: 84,
  },
  {
    id: "apple-otc",
    name: "Apple OTC",
    displayName: "Apple Inc.",
    category: "Stocks",
    market: "OTC",
    basePrice: 213.45,
    payout: 82,
  },
  {
    id: "tesla-otc",
    name: "Tesla OTC",
    displayName: "Tesla Inc.",
    category: "Stocks",
    market: "OTC",
    basePrice: 182.32,
    payout: 83,
  },
  {
    id: "us100-otc",
    name: "US100 OTC",
    displayName: "Nasdaq 100",
    category: "Indices",
    market: "OTC",
    basePrice: 19888.46,
    payout: 85,
  },
  {
    id: "sp500-otc",
    name: "SP500 OTC",
    displayName: "S&P 500 Index",
    category: "Indices",
    market: "OTC",
    basePrice: 5420.12,
    payout: 84,
  },
  {
    id: "gold-otc",
    name: "Gold OTC",
    displayName: "Gold",
    category: "Commodities",
    market: "OTC",
    basePrice: 2325.8,
    payout: 87,
  },
  {
    id: "oil-otc",
    name: "Oil OTC",
    displayName: "Crude Oil",
    category: "Commodities",
    market: "OTC",
    basePrice: 78.35,
    payout: 81,
  },
];

const LEFT_NAV_ITEMS = [
  { label: "Trading", icon: "📈" },
  { label: "Finance", icon: "$" },
  { label: "Profile", icon: "👤" },
  { label: "Market", icon: "🛒" },
  { label: "Achievements", icon: "💎" },
  { label: "Tournaments", icon: "🏆" },
  { label: "Chat", icon: "💬" },
  { label: "Help", icon: "?" },
  { label: "Promo", icon: "PROMO" },
  { label: "Autotrading", icon: "🤖" },
];

const RAIL_ITEMS = [
  { label: "Trades", icon: "↻" },
  { label: "Signals", icon: "📡" },
  { label: "Social Trading", icon: "👥" },
  { label: "Express Trades", icon: "◎" },
  { label: "Pending Trades", icon: "⏳" },
  { label: "Hotkeys", icon: "⌨" },
  { label: "Full screen", icon: "⛶" },
];

const CHART_TYPES: ChartType[] = ["Candlesticks", "Heiken Ashi", "Bars", "Line"];

const QUICK_PRESETS = [
  5,
  15,
  30,
  60,
  5 * 60,
  15 * 60,
  30 * 60,
  60 * 60,
  5 * 60 * 60,
];

const INDICATORS = [
  "SMA",
  "EMA",
  "WMA",
  "RSI",
  "MACD",
  "Bollinger Bands",
  "Stochastic",
  "ATR",
  "ADX",
  "CCI",
  "Momentum",
  "Williams %R",
  "Ichimoku",
  "Parabolic SAR",
  "VWAP",
  "Volume",
  "OBV",
  "MFI",
  "ROC",
  "Pivot Points",
  "Fibonacci",
  "ZigZag",
  "SuperTrend",
  "Donchian Channel",
  "Keltner Channel",
  "Envelopes",
  "Alligator",
  "Fractals",
  "Awesome Oscillator",
  "DeMarker",
  "TRIX",
  "DPO",
  "Aroon",
  "Elder Ray",
  "Force Index",
  "Chaikin Oscillator",
  "Accumulation/Distribution",
  "Standard Deviation",
  "Linear Regression",
  "Moving Average Ribbon",
  "Price Channel",
  "Heiken Ashi Signal",
];

const DRAWING_TOOLS = [
  "Cursor",
  "Trend Line",
  "Horizontal Line",
  "Vertical Line",
  "Ray",
  "Rectangle",
  "Brush",
  "Text",
  "Fibonacci",
  "Arrow",
  "Measure",
  "Eraser",
];

function makeId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function clampExpiry(value: number) {
  return Math.min(MAX_EXPIRY_SECONDS, Math.max(MIN_EXPIRY_SECONDS, value));
}

function splitExpiry(totalSeconds: number) {
  const seconds = clampExpiry(Math.floor(totalSeconds));
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;

  return {
    hours,
    minutes,
    seconds: remainingSeconds,
  };
}

function formatExpiry(totalSeconds: number) {
  const parts = splitExpiry(totalSeconds);
  const h = String(parts.hours).padStart(2, "0");
  const m = String(parts.minutes).padStart(2, "0");
  const s = String(parts.seconds).padStart(2, "0");

  return `${h}:${m}:${s}`;
}

function formatMoney(value: number, currency: CurrencyCode) {
  const symbol = CURRENCY_SYMBOLS[currency];
  const fractionDigits = currency === "JPY" || currency === "XOF" ? 0 : 2;

  return `${symbol}${value.toLocaleString("en-US", {
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  })}`;
}

function formatPrice(price: number) {
  if (price >= 1000) {
    return price.toFixed(2);
  }

  if (price >= 100) {
    return price.toFixed(3);
  }

  return price.toFixed(5);
}

function getVolatility(asset: Asset) {
  if (asset.category === "Cryptocurrencies") {
    return Math.max(asset.basePrice * 0.0018, 1);
  }

  if (asset.category === "Stocks" || asset.category === "Indices") {
    return Math.max(asset.basePrice * 0.0009, 0.5);
  }

  if (asset.category === "Commodities") {
    return Math.max(asset.basePrice * 0.0008, 0.05);
  }

  return Math.max(asset.basePrice * 0.00055, 0.00018);
}

function generateInitialCandles(asset: Asset): Candle[] {
  const candles: Candle[] = [];
  let price = asset.basePrice;
  const volatility = getVolatility(asset);

  for (let i = 0; i < 90; i += 1) {
    const open = price;
    const direction = Math.sin(i / 5) * volatility * 1.4;
    const noise = (Math.random() - 0.5) * volatility * 2;
    const close = Math.max(asset.basePrice * 0.05, open + direction + noise);
    const high = Math.max(open, close) + Math.random() * volatility * 1.6;
    const low = Math.min(open, close) - Math.random() * volatility * 1.6;

    candles.push({
      time: Date.now() - (90 - i) * 1000,
      open,
      high,
      low: Math.max(asset.basePrice * 0.01, low),
      close,
    });

    price = close;
  }

  return candles;
}

function appendNextCandle(previous: Candle[], asset: Asset): Candle[] {
  const fallback: Candle = {
    time: Date.now(),
    open: asset.basePrice,
    high: asset.basePrice,
    low: asset.basePrice,
    close: asset.basePrice,
  };

  const last = previous[previous.length - 1] ?? fallback;
  const volatility = getVolatility(asset);
  const open = last.close;
  const wave = Math.sin(Date.now() / 5000) * volatility;
  const noise = (Math.random() - 0.5) * volatility * 2.4;
  const close = Math.max(asset.basePrice * 0.05, open + wave + noise);
  const high = Math.max(open, close) + Math.random() * volatility * 1.5;
  const low = Math.max(
    asset.basePrice * 0.01,
    Math.min(open, close) - Math.random() * volatility * 1.5,
  );

  return [
    ...previous.slice(-110),
    {
      time: Date.now(),
      open,
      high,
      low,
      close,
    },
  ];
}

function getHeikenAshiCandles(candles: Candle[]) {
  const heikenCandles: Candle[] = [];

  candles.forEach((candle) => {
    const close = (candle.open + candle.high + candle.low + candle.close) / 4;
    const previous = heikenCandles[heikenCandles.length - 1];
    const open = previous
      ? (previous.open + previous.close) / 2
      : (candle.open + candle.close) / 2;

    heikenCandles.push({
      time: candle.time,
      open,
      close,
      high: Math.max(candle.high, open, close),
      low: Math.min(candle.low, open, close),
    });
  });

  return heikenCandles;
}

export default function TradingPage() {
  const terminalRef = useRef<HTMLDivElement | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const lastTickRef = useRef<number>(0);
  const priceRef = useRef<number>(ASSETS[0].basePrice);
  const timeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  const [selectedAssetId, setSelectedAssetId] = useState(ASSETS[0].id);
  const [accountType, setAccountType] = useState<AccountType>("Demo");
  const [currency, setCurrency] = useState<CurrencyCode>("USD");
  const [chartType, setChartType] = useState<ChartType>("Candlesticks");
  const [expirySeconds, setExpirySeconds] = useState(30 * 60);
  const [amount, setAmount] = useState(100);
  const [balancesUsd, setBalancesUsd] = useState<Record<AccountType, number>>({
    Demo: 70000,
    Real: 0,
  });

  const [candles, setCandles] = useState<Candle[]>(() =>
    generateInitialCandles(ASSETS[0]),
  );

  const [assetMenuOpen, setAssetMenuOpen] = useState(false);
  const [indicatorMenuOpen, setIndicatorMenuOpen] = useState(false);
  const [drawingMenuOpen, setDrawingMenuOpen] = useState(false);
  const [activeIndicators, setActiveIndicators] = useState<string[]>([]);
  const [activeTool, setActiveTool] = useState("Cursor");
  const [message, setMessage] = useState("");
  const [pendingTrades, setPendingTrades] = useState<PendingTrade[]>([]);
  const [resultMarkers, setResultMarkers] = useState<ResultMarker[]>([]);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const selectedAsset = useMemo(() => {
    return ASSETS.find((asset) => asset.id === selectedAssetId) ?? ASSETS[0];
  }, [selectedAssetId]);

  const assetsByCategory = useMemo<Record<AssetCategory, Asset[]>>(() => {
    const groups: Record<AssetCategory, Asset[]> = {
      Currencies: [],
      Cryptocurrencies: [],
      Stocks: [],
      Indices: [],
      Commodities: [],
    };

    ASSETS.forEach((asset) => {
      groups[asset.category].push(asset);
    });

    return groups;
  }, []);

  const visibleCandles = useMemo(() => {
    const latest = candles.slice(-76);

    if (chartType === "Heiken Ashi") {
      return getHeikenAshiCandles(latest);
    }

    return latest;
  }, [candles, chartType]);

  const chartStats = useMemo(() => {
    const highs = visibleCandles.map((candle) => candle.high);
    const lows = visibleCandles.map((candle) => candle.low);

    const high = highs.length ? Math.max(...highs) : selectedAsset.basePrice * 1.01;
    const low = lows.length ? Math.min(...lows) : selectedAsset.basePrice * 0.99;
    const padding = Math.max((high - low) * 0.18, selectedAsset.basePrice * 0.0005);
    const min = low - padding;
    const max = high + padding;
    const range = Math.max(max - min, selectedAsset.basePrice * 0.001);
    const labels = Array.from({ length: 6 }, (_, index) => {
      return max - (range / 5) * index;
    });

    return {
      min,
      max,
      range,
      labels,
    };
  }, [selectedAsset.basePrice, visibleCandles]);

  const expiryParts = splitExpiry(expirySeconds);
  const selectedRate = EXCHANGE_RATES[currency];
  const balance = balancesUsd[accountType] * selectedRate;
  const expectedProfit = amount * (selectedAsset.payout / 100);
  const expectedReturn = amount + expectedProfit;
  const currentPrice = priceRef.current;

  const linePath = useMemo(() => {
    if (visibleCandles.length === 0) {
      return "";
    }

    const step = CHART_WIDTH / Math.max(visibleCandles.length - 1, 1);

    return visibleCandles
      .map((candle, index) => {
        const x = index * step;
        const y =
          CHART_HEIGHT -
          ((candle.close - chartStats.min) / chartStats.range) * CHART_HEIGHT;

        return `${index === 0 ? "M" : "L"} ${x.toFixed(2)} ${y.toFixed(2)}`;
      })
      .join(" ");
  }, [chartStats.min, chartStats.range, visibleCandles]);

  const priceToSvgY = useCallback(
    (price: number) => {
      return (
        CHART_HEIGHT -
        ((price - chartStats.min) / chartStats.range) * CHART_HEIGHT
      );
    },
    [chartStats.min, chartStats.range],
  );

  const priceToTopPercent = useCallback(
    (price: number) => {
      const y = priceToSvgY(price);
      return Math.min(96, Math.max(4, (y / CHART_HEIGHT) * 100));
    },
    [priceToSvgY],
  );

  const showMessage = useCallback((text: string) => {
    setMessage(text);

    const timer = setTimeout(() => {
      setMessage("");
    }, 3500);

    timeoutsRef.current.push(timer);
  }, []);

  const updateExpiryUnit = useCallback(
    (unit: "hours" | "minutes" | "seconds", delta: number) => {
      setExpirySeconds((previous) => {
        const parts = splitExpiry(previous);
        const nextHours = unit === "hours" ? parts.hours + delta : parts.hours;
        const nextMinutes =
          unit === "minutes" ? parts.minutes + delta : parts.minutes;
        const nextSeconds =
          unit === "seconds" ? parts.seconds + delta : parts.seconds;

        const nextValue = nextHours * 3600 + nextMinutes * 60 + nextSeconds;
        return clampExpiry(nextValue);
      });
    },
    [],
  );

  const toggleIndicator = useCallback((indicator: string) => {
    setActiveIndicators((previous) => {
      if (previous.includes(indicator)) {
        return previous.filter((item) => item !== indicator);
      }

      return [...previous, indicator];
    });
  }, []);

  const resolveTrade = useCallback(
    (trade: PendingTrade) => {
      const exitPrice = priceRef.current;
      const won =
        trade.direction === "BUY"
          ? exitPrice > trade.entryPrice
          : exitPrice < trade.entryPrice;

      if (won) {
        setBalancesUsd((previous) => ({
          ...previous,
          [trade.accountType]:
            previous[trade.accountType] +
            trade.expectedReturn / EXCHANGE_RATES[trade.currency],
        }));
      }

      const result: ResultMarker = {
        id: makeId("result"),
        direction: trade.direction,
        currency: trade.currency,
        amount: trade.amount,
        profit: won ? trade.expectedProfit : 0,
        price: exitPrice,
        won,
      };

      setPendingTrades((previous) =>
        previous.filter((pendingTrade) => pendingTrade.id !== trade.id),
      );

      setResultMarkers((previous) => [...previous, result]);

      const removeTimer = setTimeout(() => {
        setResultMarkers((previous) =>
          previous.filter((marker) => marker.id !== result.id),
        );
      }, 10000);

      timeoutsRef.current.push(removeTimer);
    },
    [],
  );

  const placeTrade = useCallback(
    (direction: TradeDirection) => {
      const stake = Number(amount);

      if (!Number.isFinite(stake) || stake <= 0) {
        showMessage("Enter a valid trade amount.");
        return;
      }

      const stakeUsd = stake / EXCHANGE_RATES[currency];

      if (stakeUsd > balancesUsd[accountType]) {
        showMessage("Insufficient account balance.");
        return;
      }

      const entryPrice = priceRef.current || selectedAsset.basePrice;

      const trade: PendingTrade = {
        id: makeId("trade"),
        direction,
        accountType,
        currency,
        amount: stake,
        entryPrice,
        entryTime: Date.now(),
        expiryAt: Date.now() + expirySeconds * 1000,
        payout: selectedAsset.payout,
        expectedProfit,
        expectedReturn,
      };

      setBalancesUsd((previous) => ({
        ...previous,
        [accountType]: Math.max(0, previous[accountType] - stakeUsd),
      }));

      setPendingTrades((previous) => [...previous, trade]);
      showMessage(`${direction} trade placed at ${formatPrice(entryPrice)}.`);

      const expiryTimer = setTimeout(() => {
        resolveTrade(trade);
      }, expirySeconds * 1000);

      timeoutsRef.current.push(expiryTimer);
    },
    [
      accountType,
      amount,
      balancesUsd,
      currency,
      expectedProfit,
      expectedReturn,
      expirySeconds,
      resolveTrade,
      selectedAsset.basePrice,
      selectedAsset.payout,
      showMessage,
    ],
  );

  const handleFullscreen = useCallback(async () => {
    try {
      if (!document.fullscreenElement) {
        await terminalRef.current?.requestFullscreen();
      } else {
        await document.exitFullscreen();
      }
    } catch {
      showMessage("Full screen is not supported on this browser.");
    }
  }, [showMessage]);

  useEffect(() => {
    const freshCandles = generateInitialCandles(selectedAsset);
    setCandles(freshCandles);
    priceRef.current =
      freshCandles[freshCandles.length - 1]?.close ?? selectedAsset.basePrice;
  }, [selectedAsset]);

  useEffect(() => {
    const animate = (timestamp: number) => {
      if (timestamp - lastTickRef.current >= 700) {
        setCandles((previous) => {
          const nextCandles = appendNextCandle(previous, selectedAsset);
          priceRef.current =
            nextCandles[nextCandles.length - 1]?.close ?? selectedAsset.basePrice;
          return nextCandles;
        });

        lastTickRef.current = timestamp;
      }

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [selectedAsset]);

  useEffect(() => {
    const updateFullscreenState = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };

    document.addEventListener("fullscreenchange", updateFullscreenState);

    return () => {
      document.removeEventListener("fullscreenchange", updateFullscreenState);
    };
  }, []);

  useEffect(() => {
    return () => {
      timeoutsRef.current.forEach((timer) => clearTimeout(timer));
    };
  }, []);

  return (
    <main
      ref={terminalRef}
      className={`trading-terminal ${isFullscreen ? "is-fullscreen" : ""}`}
    >
      <header className="trading-topbar">
        <div className="brand-block">
          <div className="brand-icon">N</div>
          <strong>NeuroOption</strong>
          <button type="button" className="favorite-button">
            ★
          </button>
        </div>

        <div className="account-block">
          <select
            value={accountType}
            onChange={(event) => setAccountType(event.target.value as AccountType)}
            aria-label="Account type"
          >
            <option value="Demo">QT Demo</option>
            <option value="Real">QT Real</option>
          </select>

          <select
            value={currency}
            onChange={(event) => setCurrency(event.target.value as CurrencyCode)}
            aria-label="Currency"
          >
            {CURRENCIES.map((item) => (
              <option key={item.code} value={item.code}>
                {item.code}
              </option>
            ))}
          </select>

          <strong className="balance-display">{formatMoney(balance, currency)}</strong>

          <button type="button" className="top-up-button">
            TOP UP
          </button>

          <button
            type="button"
            className="fullscreen-button"
            onClick={handleFullscreen}
          >
            ⛶
          </button>

          <button type="button" className="profile-button">
            SM
          </button>
        </div>
      </header>

      <div className="trading-shell">
        <aside className="left-sidebar">
          {LEFT_NAV_ITEMS.map((item) => (
            <button
              type="button"
              key={item.label}
              className={item.label === "Trading" ? "active" : ""}
            >
              <span>{item.icon}</span>
              <small>{item.label}</small>
            </button>
          ))}
        </aside>

        <section className="chart-section">
          <div className="chart-toolbar">
            <button
              type="button"
              className="asset-button"
              onClick={() => setAssetMenuOpen((value) => !value)}
            >
              {selectedAsset.name} <span>⌄</span>
            </button>

            <button type="button" className="toolbar-pill">
              M1
            </button>

            <button
              type="button"
              className="toolbar-pill"
              onClick={() => setIndicatorMenuOpen((value) => !value)}
            >
              📊
            </button>

            <button
              type="button"
              className="toolbar-pill"
              onClick={() => setDrawingMenuOpen((value) => !value)}
            >
              ✎
            </button>

            <button type="button" className="toolbar-pill">
              ⋯
            </button>

            <div className="chart-type-group">
              {CHART_TYPES.map((type) => (
                <button
                  type="button"
                  key={type}
                  className={chartType === type ? "selected" : ""}
                  onClick={() => setChartType(type)}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {assetMenuOpen && (
            <div className="floating-panel asset-menu">
              {Object.entries(assetsByCategory).map(([category, assets]) => (
                <div key={category} className="asset-category">
                  <h4>{category}</h4>
                  {assets.map((asset) => (
                    <button
                      type="button"
                      key={asset.id}
                      className={asset.id === selectedAsset.id ? "selected" : ""}
                      onClick={() => {
                        setSelectedAssetId(asset.id);
                        setAssetMenuOpen(false);
                      }}
                    >
                      <span>{asset.name}</span>
                      <small>{asset.payout}%</small>
                    </button>
                  ))}
                </div>
              ))}
            </div>
          )}

          {indicatorMenuOpen && (
            <div className="floating-panel indicators-panel">
              <h4>Indicators</h4>
              <div className="grid-list">
                {INDICATORS.map((indicator) => (
                  <button
                    type="button"
                    key={indicator}
                    className={activeIndicators.includes(indicator) ? "selected" : ""}
                    onClick={() => toggleIndicator(indicator)}
                  >
                    {indicator}
                  </button>
                ))}
              </div>
            </div>
          )}

          {drawingMenuOpen && (
            <div className="floating-panel drawing-panel">
              <h4>Drawing tools</h4>
              <div className="grid-list">
                {DRAWING_TOOLS.map((tool) => (
                  <button
                    type="button"
                    key={tool}
                    className={activeTool === tool ? "selected" : ""}
                    onClick={() => {
                      setActiveTool(tool);
                      setDrawingMenuOpen(false);
                    }}
                  >
                    {tool}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="chart-card">
            <div className="chart-meta">
              <span>{new Date().toLocaleTimeString()} UTC+3</span>
              <span>Tool: {activeTool}</span>
              {activeIndicators.length > 0 && (
                <span>Indicators: {activeIndicators.slice(0, 3).join(", ")}</span>
              )}
            </div>

            <div className="chart-canvas">
              <svg
                viewBox={`0 0 ${CHART_WIDTH} ${CHART_HEIGHT}`}
                preserveAspectRatio="none"
                className="chart-svg"
                role="img"
                aria-label="Trading chart"
              >
                <defs>
                  <linearGradient id="mountainFill" x1="0" x2="1" y1="0" y2="1">
                    <stop offset="0%" stopColor="#5f85c8" stopOpacity="0.18" />
                    <stop offset="100%" stopColor="#0f1b35" stopOpacity="0.12" />
                  </linearGradient>
                </defs>

                <rect width={CHART_WIDTH} height={CHART_HEIGHT} rx="18" />

                {Array.from({ length: 11 }, (_, index) => (
                  <line
                    key={`v-${index}`}
                    x1={(CHART_WIDTH / 10) * index}
                    x2={(CHART_WIDTH / 10) * index}
                    y1="0"
                    y2={CHART_HEIGHT}
                    className="grid-line"
                  />
                ))}

                {Array.from({ length: 7 }, (_, index) => (
                  <line
                    key={`h-${index}`}
                    x1="0"
                    x2={CHART_WIDTH}
                    y1={(CHART_HEIGHT / 6) * index}
                    y2={(CHART_HEIGHT / 6) * index}
                    className="grid-line"
                  />
                ))}

                <path
                  d={`M 0 ${CHART_HEIGHT * 0.72} L 160 ${
                    CHART_HEIGHT * 0.36
                  } L 310 ${CHART_HEIGHT * 0.67} L 510 ${
                    CHART_HEIGHT * 0.42
                  } L 690 ${CHART_HEIGHT * 0.69} L 840 ${
                    CHART_HEIGHT * 0.48
                  } L ${CHART_WIDTH} ${CHART_HEIGHT * 0.65} L ${CHART_WIDTH} ${
                    CHART_HEIGHT
                  } L 0 ${CHART_HEIGHT} Z`}
                  fill="url(#mountainFill)"
                />

                {chartType === "Line" && (
                  <path d={linePath} className="line-chart-path" />
                )}

                {chartType !== "Line" &&
                  visibleCandles.map((candle, index) => {
                    const step = CHART_WIDTH / Math.max(visibleCandles.length - 1, 1);
                    const x = index * step;
                    const candleWidth = Math.max(5, step * 0.52);
                    const openY = priceToSvgY(candle.open);
                    const closeY = priceToSvgY(candle.close);
                    const highY = priceToSvgY(candle.high);
                    const lowY = priceToSvgY(candle.low);
                    const bullish = candle.close >= candle.open;
                    const bodyY = Math.min(openY, closeY);
                    const bodyHeight = Math.max(2, Math.abs(openY - closeY));

                    if (chartType === "Bars") {
                      return (
                        <g key={`${candle.time}-${index}`}>
                          <line
                            x1={x}
                            x2={x}
                            y1={highY}
                            y2={lowY}
                            className={bullish ? "candle-up" : "candle-down"}
                          />
                          <line
                            x1={x - candleWidth / 2}
                            x2={x}
                            y1={openY}
                            y2={openY}
                            className={bullish ? "candle-up" : "candle-down"}
                          />
                          <line
                            x1={x}
                            x2={x + candleWidth / 2}
                            y1={closeY}
                            y2={closeY}
                            className={bullish ? "candle-up" : "candle-down"}
                          />
                        </g>
                      );
                    }

                    return (
                      <g key={`${candle.time}-${index}`}>
                        <line
                          x1={x}
                          x2={x}
                          y1={highY}
                          y2={lowY}
                          className={bullish ? "candle-up" : "candle-down"}
                        />
                        <rect
                          x={x - candleWidth / 2}
                          y={bodyY}
                          width={candleWidth}
                          height={bodyHeight}
                          rx="1.5"
                          className={bullish ? "candle-up-fill" : "candle-down-fill"}
                        />
                      </g>
                    );
                  })}

                <line
                  x1="0"
                  x2={CHART_WIDTH}
                  y1={priceToSvgY(currentPrice)}
                  y2={priceToSvgY(currentPrice)}
                  className="current-price-line"
                />

                <text
                  x={CHART_WIDTH - 88}
                  y={priceToSvgY(currentPrice) - 8}
                  className="current-price-text"
                >
                  {formatPrice(currentPrice)}
                </text>

                <line
                  x1={CHART_WIDTH * 0.86}
                  x2={CHART_WIDTH * 0.86}
                  y1="0"
                  y2={CHART_HEIGHT}
                  className="expiry-line"
                />

                <text
                  x={CHART_WIDTH * 0.86 + 12}
                  y="44"
                  className="expiry-text"
                >
                  Expiration time
                </text>

                {chartStats.labels.map((label, index) => (
                  <text
                    key={label}
                    x={CHART_WIDTH - 82}
                    y={36 + index * 86}
                    className="price-scale-text"
                  >
                    {formatPrice(label)}
                  </text>
                ))}
              </svg>

              {pendingTrades.map((trade) => (
                <div
                  key={trade.id}
                  className={`trade-marker ${trade.direction.toLowerCase()}`}
                  style={
                    {
                      top: `${priceToTopPercent(trade.entryPrice)}%`,
                    } as CSSProperties
                  }
                >
                  {trade.direction} {trade.amount} {trade.currency}
                </div>
              ))}

              {resultMarkers.map((marker) => (
                <div
                  key={marker.id}
                  className={`result-marker ${marker.won ? "won" : "lost"}`}
                  style={
                    {
                      top: `${priceToTopPercent(marker.price)}%`,
                    } as CSSProperties
                  }
                >
                  {marker.won
                    ? `✓ +${formatMoney(marker.profit, marker.currency)}`
                    : `✓ ${formatMoney(0, marker.currency)}`}
                </div>
              ))}

              <div className="chart-footer">
                <button type="button">←</button>
                <button type="button">H3 ▴</button>
                <strong>{selectedAsset.displayName}</strong>
              </div>
            </div>
          </div>
        </section>

        <aside className="trade-panel">
          {message && <div className="trade-message">{message}</div>}

          <div className="sentiment-bar">
            <span>50%</span>
            <div>
              <i />
            </div>
            <span>50%</span>
          </div>

          <div className="control-title">Time ⓘ</div>

          <div className="expiry-control">
            <div className="time-unit">
              <button type="button" onClick={() => updateExpiryUnit("hours", 1)}>
                +
              </button>
              <strong>{String(expiryParts.hours).padStart(2, "0")}</strong>
              <small>Hours</small>
              <button type="button" onClick={() => updateExpiryUnit("hours", -1)}>
                -
              </button>
            </div>

            <div className="time-unit">
              <button type="button" onClick={() => updateExpiryUnit("minutes", 1)}>
                +
              </button>
              <strong>{String(expiryParts.minutes).padStart(2, "0")}</strong>
              <small>Minutes</small>
              <button type="button" onClick={() => updateExpiryUnit("minutes", -1)}>
                -
              </button>
            </div>

            <div className="time-unit">
              <button type="button" onClick={() => updateExpiryUnit("seconds", 1)}>
                +
              </button>
              <strong>{String(expiryParts.seconds).padStart(2, "0")}</strong>
              <small>Seconds</small>
              <button type="button" onClick={() => updateExpiryUnit("seconds", -1)}>
                -
              </button>
            </div>
          </div>

          <div className="expiry-display">{formatExpiry(expirySeconds)}</div>
          <small className="expiry-note">Min 00:00:05 · Max 05:00:00</small>

          <div className="quick-expiry-grid">
            {QUICK_PRESETS.map((preset) => (
              <button
                type="button"
                key={preset}
                className={expirySeconds === preset ? "selected" : ""}
                onClick={() => setExpirySeconds(preset)}
              >
                {formatExpiry(preset)}
              </button>
            ))}
          </div>

          <label className="amount-control">
            <span>Amount ⓘ</span>
            <div>
              <input
                type="number"
                min="1"
                value={amount}
                onChange={(event) => {
                  const value = Number(event.currentTarget.value);
                  setAmount(Number.isFinite(value) ? Math.max(0, value) : 0);
                }}
              />
              <strong>{currency}</strong>
            </div>
          </label>

          <div className="payout-card">
            <div>
              <span>Rate</span>
              <strong>+{selectedAsset.payout}%</strong>
            </div>

            <div>
              <span>Expected profit</span>
              <strong>{formatMoney(expectedProfit, currency)}</strong>
            </div>

            <div>
              <span>Expected return</span>
              <strong>{formatMoney(expectedReturn, currency)}</strong>
            </div>
          </div>

          <button type="button" className="buy-button" onClick={() => placeTrade("BUY")}>
            ↗ BUY
          </button>

          <button type="button" className="ai-button">
            AI TRADING
          </button>

          <button
            type="button"
            className="sell-button"
            onClick={() => placeTrade("SELL")}
          >
            ↘ SELL
          </button>
        </aside>

        <aside className="right-rail">
          {RAIL_ITEMS.map((item) => (
            <button
              type="button"
              key={item.label}
              onClick={item.label === "Full screen" ? handleFullscreen : undefined}
            >
              <span>{item.icon}</span>
              <small>{item.label}</small>
            </button>
          ))}
        </aside>
      </div>
    </main>
  );
}