import React from "react";
import "./TradingPage.css";
import type { AccountCurrency, AccountType } from "../types/auth.types";
import { convertFromUsd, convertToUsd, formatCurrency } from "../utils/currency";
import { formatPrice, randomId, secondsToTime } from "../utils/format";
import {
  calculateExpectedProfit,
  calculateExpectedReturn,
  changeExpiryUnit,
  getDynamicPayout,
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

const LEFT_NAV = [
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
    symbol: "US30 OTC",
    displayName: "Dow Jones 30",
    category: "Indices",
    market: "OTC",
    basePrice: 38950.2,
    precision: 2,
    volatility: 24,
    payout: 84,
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
    symbol: "Apple OTC",
    displayName: "Apple Inc.",
    category: "Stocks",
    market: "OTC",
    basePrice: 214.85,
    precision: 2,
    volatility: 0.32,
    payout: 82,
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
  {
    symbol: "Brent Oil OTC",
    displayName: "Brent Crude Oil",
    category: "Commodities",
    market: "OTC",
    basePrice: 82.75,
    precision: 2,
    volatility: 0.12,
    payout: 84,
  },
];

function splitExpiry(totalSeconds: number): {
  hours: number;
  minutes: number;
  seconds: number;
} {
  return {
    hours: Math.floor(totalSeconds / 3600),
    minutes: Math.floor((totalSeconds % 3600) / 60),
    seconds: totalSeconds % 60,
  };
}

function createLocalFallbackCandles(asset: OtcAsset, timeframe: OtcTimeframe, count = 120): OtcCandle[] {
  const candles: OtcCandle[] = [];
  let price = asset.basePrice;
  const durationMs = timeframeToMs(timeframe);

  for (let index = 0; index < count; index += 1) {
    const time = Date.now() - (count - index) * durationMs;
    const wave = Math.sin(index / 5.2) * asset.volatility * 1.9;
    const noise = randomNormal() * asset.volatility * 0.85;
    const open = price;
    const close = Math.max(0.00000001, open + wave * 0.22 + noise);
    const high = Math.max(open, close) + Math.abs(randomNormal()) * asset.volatility * 1.15;
    const low = Math.min(open, close) - Math.abs(randomNormal()) * asset.volatility * 1.15;

    candles.push({
      symbol: asset.symbol,
      timeframe,
      time,
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
  const [assets, setAssets] = React.useState<OtcAsset[]>(FALLBACK_ASSETS);
  const [selectedAsset, setSelectedAsset] = React.useState<OtcAsset>(FALLBACK_ASSETS[0]);
  const [assetCategory, setAssetCategory] = React.useState<MarketCategory>("Currencies");
  const [timeframe, setTimeframe] = React.useState<OtcTimeframe>("M1");
  const [chartType, setChartType] = React.useState<ChartType>("Candlesticks");
  const [drawingTool, setDrawingTool] = React.useState("Cursor");

  const [candles, setCandles] = React.useState<OtcCandle[]>(() =>
    createLocalFallbackCandles(FALLBACK_ASSETS[0], "M1")
  );
  const [currentPrice, setCurrentPrice] = React.useState(FALLBACK_ASSETS[0].basePrice);
  const [streamStatus, setStreamStatus] = React.useState<"connecting" | "live" | "reconnecting">(
    "connecting"
  );
  const [serverTime, setServerTime] = React.useState(Date.now());

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

  const [activeTrades, setActiveTrades] = React.useState<ActiveTrade[]>([]);
  const [resultMarkers, setResultMarkers] = React.useState<ResultMarker[]>([]);

  const latestPriceRef = React.useRef(selectedAsset.basePrice);
  const candlesRef = React.useRef<OtcCandle[]>(candles);
  const localFallbackTimerRef = React.useRef<number | null>(null);

  const activeBalanceUsd = accountType === "QT Demo" ? demoBalanceUsd : realBalanceUsd;
  const convertedBalance = convertFromUsd(activeBalanceUsd, currency);

  const stake = Number(amount);
  const safeStake = Number.isFinite(stake) ? Math.max(0, stake) : 0;
  const stakeUsd = convertToUsd(safeStake, currency);

  const payoutPercent = getDynamicPayout(selectedAsset, serverTime);
  const expectedProfit = calculateExpectedProfit(safeStake, payoutPercent);
  const expectedReturn = calculateExpectedReturn(safeStake, payoutPercent);
  const expectedReturnUsd = convertToUsd(expectedReturn, currency);

  const canTrade = safeStake > 0 && stakeUsd <= activeBalanceUsd;
  const expiryParts = splitExpiry(expirySeconds);

  const filteredAssets = React.useMemo(() => {
    return assets.filter((asset) => asset.category === assetCategory);
  }, [assets, assetCategory]);

  const visibleCandles = React.useMemo(() => {
    const source = chartType === "Heiken Ashi" ? makeHeikenAshi(candles) : candles;
    return source.slice(-104);
  }, [candles, chartType]);

  React.useEffect(() => {
    candlesRef.current = candles;
  }, [candles]);

  React.useEffect(() => {
    latestPriceRef.current = currentPrice;
  }, [currentPrice]);

  React.useEffect(() => {
    async function loadAssets() {
      try {
        const response = await fetch(`${API_BASE_URL}/market-data/assets`);
        const data: unknown = await response.json();

        if (isAssetsResponse(data) && data.assets.length > 0) {
          setAssets(data.assets);

          const sameAsset = data.assets.find((asset) => asset.symbol === selectedAsset.symbol);
          if (!sameAsset) {
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
    async function loadInitialCandles() {
      try {
        const url = new URL(`${API_BASE_URL}/market-data/candles`);
        url.searchParams.set("symbol", selectedAsset.symbol);
        url.searchParams.set("timeframe", timeframe);
        url.searchParams.set("limit", "120");

        const response = await fetch(url.toString());
        const data: unknown = await response.json();

        if (isCandlesResponse(data) && data.candles.length > 0) {
          setCandles(data.candles);
          setCurrentPrice(data.candles[data.candles.length - 1].close);
          setServerTime(Date.now());
          return;
        }
      } catch {
        const fallback = createLocalFallbackCandles(selectedAsset, timeframe);
        setCandles(fallback);
        setCurrentPrice(fallback[fallback.length - 1].close);
      }
    }

    void loadInitialCandles();
  }, [selectedAsset, timeframe]);

  React.useEffect(() => {
    setStreamStatus("connecting");

    const url = new URL(`${API_BASE_URL}/market-data/stream`);
    url.searchParams.set("symbol", selectedAsset.symbol);
    url.searchParams.set("timeframe", timeframe);

    const source = new EventSource(url.toString());

    function handlePayload(payload: OtcStreamPayload) {
      if (payload.candles.length === 0) return;

      setStreamStatus("live");
      setCandles(payload.candles);
      setCurrentPrice(payload.price);
      setServerTime(payload.serverTime);

      latestPriceRef.current = payload.price;
      candlesRef.current = payload.candles;
    }

    function handleStreamEvent(event: Event) {
      try {
        const messageEvent = event as MessageEvent<string>;
        const parsed: unknown = JSON.parse(messageEvent.data);

        if (isStreamPayload(parsed)) {
          handlePayload(parsed);
        }
      } catch {
        setStreamStatus("reconnecting");
      }
    }

    source.onopen = () => {
      setStreamStatus("live");
    };

    source.onerror = () => {
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
    if (streamStatus === "live") {
      if (localFallbackTimerRef.current !== null) {
        window.clearInterval(localFallbackTimerRef.current);
        localFallbackTimerRef.current = null;
      }

      return;
    }

    if (localFallbackTimerRef.current !== null) return;

    localFallbackTimerRef.current = window.setInterval(() => {
      const existing = candlesRef.current.length
        ? candlesRef.current
        : createLocalFallbackCandles(selectedAsset, timeframe);

      const next = existing.slice();
      const last = next[next.length - 1];

      if (!last) return;

      const movement =
        Math.sin(Date.now() / 800) * selectedAsset.volatility * 0.12 +
        randomNormal() * selectedAsset.volatility * 0.38;

      const nextPrice = Math.max(0.00000001, last.close + movement);
      const updatedLast: OtcCandle = {
        ...last,
        close: nextPrice,
        high: Math.max(last.high, nextPrice),
        low: Math.min(last.low, nextPrice),
        closed: false,
      };

      next[next.length - 1] = updatedLast;

      if (Date.now() - last.time >= timeframeToMs(timeframe)) {
        updatedLast.closed = true;

        next.push({
          symbol: selectedAsset.symbol,
          timeframe,
          time: Date.now(),
          open: nextPrice,
          high: nextPrice,
          low: nextPrice,
          close: nextPrice,
          closed: false,
        });
      }

      const trimmed = next.slice(-120);
      candlesRef.current = trimmed;
      latestPriceRef.current = nextPrice;

      setCandles(trimmed);
      setCurrentPrice(nextPrice);
      setServerTime(Date.now());
    }, 250);

    return () => {
      if (localFallbackTimerRef.current !== null) {
        window.clearInterval(localFallbackTimerRef.current);
        localFallbackTimerRef.current = null;
      }
    };
  }, [selectedAsset, timeframe, streamStatus]);

  function updateBalance(account: AccountType, nextUsd: number) {
    if (account === "QT Demo") {
      setDemoBalanceUsd(Math.max(0, nextUsd));
      return;
    }

    setRealBalanceUsd(Math.max(0, nextUsd));
  }

  function handleExpiryChange(unit: ExpiryUnit, delta: 1 | -1) {
    setExpirySeconds((current) => changeExpiryUnit(current, unit, delta));
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

  function handleTrade(direction: TradeDirection) {
    if (!canTrade) return;

    const entryPrice = latestPriceRef.current;
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
      const closePrice = latestPriceRef.current;
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

  function renderChart() {
    const width = 1000;
    const height = 590;
    const left = 22;
    const right = 908;
    const top = 42;
    const bottom = 525;
    const priceLabelX = 930;
    const chartHeight = bottom - top;

    const priceValues = visibleCandles.flatMap((candle) => [
      candle.high,
      candle.low,
      candle.open,
      candle.close,
    ]);

    priceValues.push(currentPrice);
    activeTrades.forEach((trade) => priceValues.push(trade.entryPrice));
    resultMarkers.forEach((marker) => priceValues.push(marker.closePrice));

    const rawMin = Math.min(...priceValues);
    const rawMax = Math.max(...priceValues);
    const rawRange = Math.max(rawMax - rawMin, selectedAsset.basePrice * 0.002);

    /*
      This is the auto-follow behaviour:
      when candles move near the top/bottom margin, the chart range recalculates
      from visible candles and moves the screen with price.
    */
    const paddedMin = rawMin - rawRange * 0.2;
    const paddedMax = rawMax + rawRange * 0.2;

    const yFor = (price: number) => top + ((paddedMax - price) / (paddedMax - paddedMin)) * chartHeight;
    const xStep = (right - left) / Math.max(visibleCandles.length - 1, 1);
    const bodyWidth = Math.max(4, Math.min(10, xStep * 0.58));
    const expiryX = right - 178;
    const currentY = yFor(currentPrice);

    const linePoints = visibleCandles
      .map((candle, index) => `${left + index * xStep},${yFor(candle.close)}`)
      .join(" ");

    return (
      <svg className="chart-svg" viewBox={`0 0 ${width} ${height}`} role="img" aria-label="NeuroOption OTC live chart">
        <defs>
          <linearGradient id="chartSky" x1="0" x2="1" y1="0" y2="1">
            <stop offset="0%" stopColor="#24416b" stopOpacity="0.72" />
            <stop offset="100%" stopColor="#0c172e" stopOpacity="0.94" />
          </linearGradient>

          <linearGradient id="mountainFill" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#8fb7d8" stopOpacity="0.24" />
            <stop offset="100%" stopColor="#18233d" stopOpacity="0.08" />
          </linearGradient>
        </defs>

        <rect width={width} height={height} fill="url(#chartSky)" />

        <polygon
          points="20,510 150,330 250,455 385,285 510,500 650,335 760,472 890,360 980,505"
          fill="url(#mountainFill)"
        />

        {Array.from({ length: 11 }).map((_, index) => {
          const x = left + ((right - left) / 10) * index;

          return (
            <line
              key={`vertical-${index}`}
              x1={x}
              y1={top}
              x2={x}
              y2={bottom}
              className="grid-line"
            />
          );
        })}

        {Array.from({ length: 8 }).map((_, index) => {
          const y = top + ((bottom - top) / 7) * index;

          return (
            <line
              key={`horizontal-${index}`}
              x1={left}
              y1={y}
              x2={right}
              y2={y}
              className="grid-line"
            />
          );
        })}

        {chartType === "Line" && <polyline points={linePoints} className="line-chart" />}

        {chartType !== "Line" &&
          visibleCandles.map((candle, index) => {
            const x = left + index * xStep;
            const openY = yFor(candle.open);
            const closeY = yFor(candle.close);
            const highY = yFor(candle.high);
            const lowY = yFor(candle.low);
            const bullish = candle.close >= candle.open;
            const bodyTop = Math.min(openY, closeY);
            const bodyHeight = Math.max(3, Math.abs(openY - closeY));
            const colorClass = bullish ? "candle-bull" : "candle-bear";

            if (chartType === "Bars") {
              return (
                <g key={`${candle.time}-${index}`} className={colorClass}>
                  <line x1={x} y1={highY} x2={x} y2={lowY} className="bar-stick" />
                  <line x1={x - bodyWidth} y1={openY} x2={x} y2={openY} className="bar-tick" />
                  <line x1={x} y1={closeY} x2={x + bodyWidth} y2={closeY} className="bar-tick" />
                </g>
              );
            }

            return (
              <g key={`${candle.time}-${index}`} className={colorClass}>
                <line x1={x} y1={highY} x2={x} y2={lowY} className="wick" />
                <rect
                  x={x - bodyWidth / 2}
                  y={bodyTop}
                  width={bodyWidth}
                  height={bodyHeight}
                  rx="2"
                  className="candle-body"
                />
              </g>
            );
          })}

        <line x1={left} x2={right} y1={currentY} y2={currentY} className="current-price-line" />

        <rect x={priceLabelX - 8} y={currentY - 19} width="76" height="38" rx="9" className="price-pill" />

        <text x={priceLabelX + 30} y={currentY + 6} textAnchor="middle" className="price-pill-text">
          {formatPrice(currentPrice, selectedAsset.precision)}
        </text>

        <line x1={expiryX} x2={expiryX} y1={top - 2} y2={bottom} className="expiry-line" />

        <path
          d={`M ${expiryX} ${top - 2} L ${expiryX + 28} ${top - 2} L ${expiryX} ${top + 18} Z`}
          className="expiry-flag"
        />

        <text x={expiryX + 34} y={top + 20} className="expiry-text">
          Expiration time
        </text>

        {Array.from({ length: 6 }).map((_, index) => {
          const price = paddedMax - ((paddedMax - paddedMin) / 5) * index;
          const y = yFor(price);

          return (
            <text key={`price-${index}`} x={priceLabelX + 6} y={y + 4} className="scale-text">
              {formatPrice(price, selectedAsset.precision)}
            </text>
          );
        })}

        {["13:16", "13:32", "13:48", "14:04"].map((label, index) => {
          const x = left + ((right - left) / 3) * index;

          return (
            <text key={label} x={x} y={bottom + 38} className="time-text">
              {label}
            </text>
          );
        })}

        <text x={right - 86} y={currentY - 21} className="tf-floating">
          {timeframe}
        </text>

        {activeTrades.map((trade, index) => {
          const y = yFor(trade.entryPrice);
          const x = 96 + index * 10;
          const label = `${trade.direction} ${formatCurrency(trade.amount, trade.currency)}`;

          return (
            <g key={trade.id}>
              <line
                x1={left}
                x2={right}
                y1={y}
                y2={y}
                className={trade.direction === "BUY" ? "trade-line-buy" : "trade-line-sell"}
              />

              <rect
                x={x}
                y={y - 19}
                width="156"
                height="38"
                rx="9"
                className={trade.direction === "BUY" ? "trade-label-buy" : "trade-label-sell"}
              />

              <text x={x + 78} y={y + 6} textAnchor="middle" className="trade-label-text">
                {label}
              </text>
            </g>
          );
        })}

        {resultMarkers.map((marker) => {
          const y = yFor(marker.closePrice);
          const text = marker.won
            ? `✓ ${formatCurrency(marker.amount, marker.currency)}`
            : `✕ ${formatCurrency(0, marker.currency)}`;

          return (
            <g key={marker.id}>
              <rect
                x={right - 230}
                y={y - 24}
                width="190"
                height="44"
                rx="12"
                className={marker.won ? "result-win" : "result-loss"}
              />

              <text x={right - 135} y={y + 5} textAnchor="middle" className="result-text">
                {text}
              </text>
            </g>
          );
        })}
      </svg>
    );
  }

  return (
    <main className="trading-page">
      <div className="terminal-shell">
        <aside className="left-sidebar">
          <div className="brand-mini">N</div>

          {LEFT_NAV.map(([icon, label]) => (
            <button key={label} className="nav-button" type="button">
              <span className="nav-icon">{icon}</span>
              <span className="nav-label">{label}</span>
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
                            }}
                          >
                            <span>{asset.symbol}</span>
                            <strong>+{asset.payout}%</strong>
                          </button>
                        ))}

                        {filteredAssets.length === 0 && (
                          <button type="button">
                            <span>No assets loaded</span>
                            <strong>--</strong>
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                <div className="menu-wrap">
                  <button type="button" className="tool-button" onClick={() => setTimeframeOpen((value) => !value)}>
                    📊 {timeframe}
                  </button>

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
                          }}
                        >
                          {item}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <div className="menu-wrap">
                  <button type="button" className="tool-button" onClick={() => setIndicatorOpen((value) => !value)}>
                    📶 Indicators
                  </button>

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
                </div>

                <div className="menu-wrap">
                  <button type="button" className="tool-button" onClick={() => setToolsOpen((value) => !value)}>
                    ✎ {drawingTool}
                  </button>

                  {toolsOpen && (
                    <div className="small-menu">
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
              </div>

              <div className="chart-info-row">
                <span>{new Date(serverTime).toLocaleTimeString()} UTC+3</span>
                <span>{streamStatus === "live" ? "Backend OTC stream live" : "Connecting OTC stream..."}</span>
                <span>{selectedAsset.displayName}</span>
                <span>Current price {formatPrice(currentPrice, selectedAsset.precision)}</span>
              </div>

              <div className="chart-stage">
                {renderChart()}

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
                    <button type="button" onClick={() => handleExpiryChange("hours", 1)}>
                      +
                    </button>
                    <strong>{String(expiryParts.hours).padStart(2, "0")}</strong>
                    <button type="button" onClick={() => handleExpiryChange("hours", -1)}>
                      -
                    </button>
                    <span>Hours</span>
                  </div>

                  <div>
                    <button type="button" onClick={() => handleExpiryChange("minutes", 1)}>
                      +
                    </button>
                    <strong>{String(expiryParts.minutes).padStart(2, "0")}</strong>
                    <button type="button" onClick={() => handleExpiryChange("minutes", -1)}>
                      -
                    </button>
                    <span>Minutes</span>
                  </div>

                  <div>
                    <button type="button" onClick={() => handleExpiryChange("seconds", 1)}>
                      +
                    </button>
                    <strong>{String(expiryParts.seconds).padStart(2, "0")}</strong>
                    <button type="button" onClick={() => handleExpiryChange("seconds", -1)}>
                      -
                    </button>
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

              <button type="button" className="buy-button" disabled={!canTrade} onClick={() => handleTrade("BUY")}>
                ↗ BUY
              </button>

              <button type="button" className="ai-button">
                AI TRADING
              </button>

              <button type="button" className="sell-button" disabled={!canTrade} onClick={() => handleTrade("SELL")}>
                ↘ SELL
              </button>
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