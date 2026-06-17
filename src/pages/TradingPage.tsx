import React from "react";
import "./TradingPage.css";
import type { AccountCurrency, AccountType } from "../types/auth.types";
import type {
  AssetCategory,
  Candle,
  ChartType,
  Timeframe,
  TradingAsset,
  TradeDirection,
  TradeMarker,
  TradeResultMarker,
} from "../types/trading.types";
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

type Unit = "hours" | "minutes" | "seconds";

type LocalTradeMarker = TradeMarker & {
  x: number;
};

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

const ASSET_CATEGORIES: AssetCategory[] = [
  "Currencies",
  "Cryptocurrencies",
  "Stocks",
  "Indices",
  "Commodities",
];

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

const ASSETS: TradingAsset[] = [
  {
    symbol: "AUD/CAD OTC",
    displayName: "Australian Dollar / Canadian Dollar",
    category: "Currencies",
    market: "OTC",
    basePrice: 0.8421,
    precision: 5,
    payout: 92,
  },
  {
    symbol: "EUR/USD OTC",
    displayName: "Euro / US Dollar",
    category: "Currencies",
    market: "OTC",
    basePrice: 1.1345,
    precision: 5,
    payout: 91,
  },
  {
    symbol: "USD/JPY OTC",
    displayName: "US Dollar / Japanese Yen",
    category: "Currencies",
    market: "OTC",
    basePrice: 157.28,
    precision: 3,
    payout: 88,
  },
  {
    symbol: "BTC/USD OTC",
    displayName: "Bitcoin / US Dollar",
    category: "Cryptocurrencies",
    market: "OTC",
    basePrice: 66420,
    precision: 2,
    payout: 85,
  },
  {
    symbol: "ETH/USD OTC",
    displayName: "Ethereum / US Dollar",
    category: "Cryptocurrencies",
    market: "OTC",
    basePrice: 3520,
    precision: 2,
    payout: 84,
  },
  {
    symbol: "Tesla OTC",
    displayName: "Tesla Inc.",
    category: "Stocks",
    market: "OTC",
    basePrice: 182.45,
    precision: 2,
    payout: 79,
  },
  {
    symbol: "Apple OTC",
    displayName: "Apple Inc.",
    category: "Stocks",
    market: "OTC",
    basePrice: 214.85,
    precision: 2,
    payout: 80,
  },
  {
    symbol: "Amazon OTC",
    displayName: "Amazon.com Inc.",
    category: "Stocks",
    market: "OTC",
    basePrice: 186.55,
    precision: 2,
    payout: 78,
  },
  {
    symbol: "US100 OTC",
    displayName: "Nasdaq 100",
    category: "Indices",
    market: "OTC",
    basePrice: 19888.46,
    precision: 2,
    payout: 86,
  },
  {
    symbol: "US30 OTC",
    displayName: "Dow Jones 30",
    category: "Indices",
    market: "OTC",
    basePrice: 38950.2,
    precision: 2,
    payout: 84,
  },
  {
    symbol: "XAU/USD OTC",
    displayName: "Gold / US Dollar",
    category: "Commodities",
    market: "OTC",
    basePrice: 2328.4,
    precision: 2,
    payout: 87,
  },
  {
    symbol: "Brent OTC",
    displayName: "Brent Crude Oil",
    category: "Commodities",
    market: "OTC",
    basePrice: 82.75,
    precision: 2,
    payout: 82,
  },
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

function timeframeToSeconds(timeframe: Timeframe): number {
  const map: Record<Timeframe, number> = {
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

  return map[timeframe];
}

function assetVolatility(asset: TradingAsset): number {
  if (asset.category === "Cryptocurrencies") return asset.basePrice * 0.0007;
  if (asset.category === "Indices") return asset.basePrice * 0.00022;
  if (asset.category === "Stocks") return asset.basePrice * 0.0015;
  if (asset.category === "Commodities") return asset.basePrice * 0.0012;
  return asset.basePrice * 0.00042;
}

function generateInitialCandles(asset: TradingAsset, count = 96): Candle[] {
  const volatility = assetVolatility(asset);
  const candles: Candle[] = [];
  let price = asset.basePrice;

  for (let index = 0; index < count; index += 1) {
    const wave = Math.sin(index / 5.5) * volatility * 2.8;
    const noise = (Math.random() - 0.5) * volatility * 3.2;
    const open = price;
    const close = Math.max(0.00001, open + wave * 0.08 + noise);
    const high = Math.max(open, close) + Math.random() * volatility * 2.8;
    const low = Math.min(open, close) - Math.random() * volatility * 2.8;

    candles.push({
      id: index + 1,
      time: Date.now() - (count - index) * 60_000,
      open,
      high,
      low,
      close,
    });

    price = close;
  }

  return candles;
}

function makeHeikenAshi(candles: Candle[]): Candle[] {
  const output: Candle[] = [];

  candles.forEach((candle, index) => {
    const close = (candle.open + candle.high + candle.low + candle.close) / 4;
    const previous = output[index - 1];
    const open = previous ? (previous.open + previous.close) / 2 : (candle.open + candle.close) / 2;

    output.push({
      id: candle.id,
      time: candle.time,
      open,
      close,
      high: Math.max(candle.high, open, close),
      low: Math.min(candle.low, open, close),
    });
  });

  return output;
}

function splitExpiry(totalSeconds: number): { hours: number; minutes: number; seconds: number } {
  return {
    hours: Math.floor(totalSeconds / 3600),
    minutes: Math.floor((totalSeconds % 3600) / 60),
    seconds: totalSeconds % 60,
  };
}

export default function TradingPage() {
  const [accountType, setAccountType] = React.useState<AccountType>("QT Demo");
  const [currency, setCurrency] = React.useState<AccountCurrency>("USD");
  const [demoBalanceUsd, setDemoBalanceUsd] = React.useState(70_000);
  const [realBalanceUsd, setRealBalanceUsd] = React.useState(0);

  const [selectedAsset, setSelectedAsset] = React.useState<TradingAsset>(ASSETS[0]);
  const [assetCategory, setAssetCategory] = React.useState<AssetCategory>("Currencies");
  const [chartType, setChartType] = React.useState<ChartType>("Candlesticks");
  const [timeframe, setTimeframe] = React.useState<Timeframe>("M1");
  const [drawingTool, setDrawingTool] = React.useState("Cursor");

  const [amount, setAmount] = React.useState("100");
  const [expirySeconds, setExpirySeconds] = React.useState(30 * 60);
  const [nowTick, setNowTick] = React.useState(Date.now());
  const [currentPrice, setCurrentPrice] = React.useState(selectedAsset.basePrice);
  const [displayCandles, setDisplayCandles] = React.useState<Candle[]>(() => generateInitialCandles(selectedAsset));

  const [assetOpen, setAssetOpen] = React.useState(false);
  const [indicatorOpen, setIndicatorOpen] = React.useState(false);
  const [toolsOpen, setToolsOpen] = React.useState(false);
  const [timeframeOpen, setTimeframeOpen] = React.useState(false);
  const [selectedIndicators, setSelectedIndicators] = React.useState<string[]>([]);
  const [activeTrades, setActiveTrades] = React.useState<LocalTradeMarker[]>([]);
  const [resultMarkers, setResultMarkers] = React.useState<TradeResultMarker[]>([]);

  const candlesRef = React.useRef<Candle[]>([]);
  const priceRef = React.useRef(selectedAsset.basePrice);
  const rafRef = React.useRef<number | null>(null);
  const lastFrameRef = React.useRef(0);
  const lastUiSyncRef = React.useRef(0);
  const lastCandleStartRef = React.useRef(Date.now());
  const candleIdRef = React.useRef(200);

  const activeBalanceUsd = accountType === "QT Demo" ? demoBalanceUsd : realBalanceUsd;
  const convertedBalance = convertFromUsd(activeBalanceUsd, currency);
  const stake = Number(amount) || 0;
  const stakeUsd = convertToUsd(stake, currency);
  const payoutPercent = getDynamicPayout(selectedAsset, nowTick);
  const expectedProfit = calculateExpectedProfit(stake, payoutPercent);
  const expectedReturn = calculateExpectedReturn(stake, payoutPercent);
  const canTrade = stake > 0 && stakeUsd <= activeBalanceUsd;

  const expiryParts = splitExpiry(expirySeconds);

  const visibleCandles = React.useMemo(() => {
    const source = chartType === "Heiken Ashi" ? makeHeikenAshi(displayCandles) : displayCandles;
    return source.slice(-94);
  }, [chartType, displayCandles]);

  React.useEffect(() => {
    const initial = generateInitialCandles(selectedAsset);
    candlesRef.current = initial;
    priceRef.current = initial[initial.length - 1]?.close ?? selectedAsset.basePrice;
    candleIdRef.current = initial.length + 1;
    lastCandleStartRef.current = Date.now();
    setDisplayCandles(initial);
    setCurrentPrice(priceRef.current);
  }, [selectedAsset]);

  React.useEffect(() => {
    function animate(timestamp: number) {
      if (!lastFrameRef.current) {
        lastFrameRef.current = timestamp;
      }

      const delta = Math.min(0.08, (timestamp - lastFrameRef.current) / 1000);
      lastFrameRef.current = timestamp;

      const candles = candlesRef.current;
      const lastCandle = candles[candles.length - 1];

      if (lastCandle) {
        const volatility = assetVolatility(selectedAsset);
        const pulse = Math.sin(timestamp / 550) * volatility * 0.42;
        const fastPulse = Math.sin(timestamp / 170) * volatility * 0.18;
        const randomTick = (Math.random() - 0.5) * volatility * 1.8;
        const nextPrice = Math.max(0.00001, priceRef.current + (pulse + fastPulse + randomTick) * delta);

        priceRef.current = nextPrice;
        lastCandle.close = nextPrice;
        lastCandle.high = Math.max(lastCandle.high, nextPrice);
        lastCandle.low = Math.min(lastCandle.low, nextPrice);

        const candleDurationMs = timeframeToSeconds(timeframe) * 1000;
        const currentTime = Date.now();

        if (currentTime - lastCandleStartRef.current >= candleDurationMs) {
          const open = priceRef.current;
          const newCandle: Candle = {
            id: candleIdRef.current,
            time: currentTime,
            open,
            high: open,
            low: open,
            close: open,
          };

          candleIdRef.current += 1;
          candles.push(newCandle);

          if (candles.length > 120) {
            candles.shift();
          }

          lastCandleStartRef.current = currentTime;
        }
      }

      if (timestamp - lastUiSyncRef.current > 120) {
        lastUiSyncRef.current = timestamp;
        setCurrentPrice(priceRef.current);
        setDisplayCandles([...candlesRef.current]);
        setNowTick(Date.now());
      }

      rafRef.current = window.requestAnimationFrame(animate);
    }

    rafRef.current = window.requestAnimationFrame(animate);

    return () => {
      if (rafRef.current !== null) {
        window.cancelAnimationFrame(rafRef.current);
      }

      rafRef.current = null;
      lastFrameRef.current = 0;
    };
  }, [selectedAsset, timeframe]);

  function updateBalance(nextUsd: number) {
    if (accountType === "QT Demo") {
      setDemoBalanceUsd(Math.max(0, nextUsd));
    } else {
      setRealBalanceUsd(Math.max(0, nextUsd));
    }
  }

  function handleExpiryChange(unit: Unit, delta: 1 | -1) {
    setExpirySeconds((current) => changeExpiryUnit(current, unit, delta));
  }

  function handleTrade(direction: TradeDirection) {
    if (!canTrade) return;

    const entryPrice = priceRef.current;
    const tradeId = randomId("trade");

    updateBalance(activeBalanceUsd - stakeUsd);

    const trade: LocalTradeMarker = {
      id: tradeId,
      direction,
      amount: stake,
      currency,
      entryPrice,
      entryTime: Date.now(),
      expirySeconds,
      payoutPercent,
      expectedProfit,
      expectedReturn,
      settled: false,
      x: 118,
    };

    setActiveTrades((items) => [...items, trade]);

    window.setTimeout(() => {
      const closePrice = priceRef.current;
      const won = getTradeWinStatus(direction, entryPrice, closePrice);
      const returnAmount = won ? expectedReturn : 0;
      const returnUsd = won ? convertToUsd(expectedReturn, currency) : 0;

      if (won) {
        if (accountType === "QT Demo") {
          setDemoBalanceUsd((value) => value + returnUsd);
        } else {
          setRealBalanceUsd((value) => value + returnUsd);
        }
      }

      setActiveTrades((items) => items.filter((item) => item.id !== tradeId));

      const result: TradeResultMarker = {
        id: randomId("result"),
        direction,
        won,
        amount: returnAmount,
        currency,
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

  function renderChart() {
    const width = 1000;
    const height = 590;
    const left = 22;
    const right = 908;
    const top = 42;
    const bottom = 525;
    const priceLabelX = 930;
    const chartHeight = bottom - top;

    const priceValues = visibleCandles.flatMap((candle) => [candle.high, candle.low, candle.open, candle.close]);
    priceValues.push(currentPrice);

    activeTrades.forEach((trade) => priceValues.push(trade.entryPrice));
    resultMarkers.forEach((marker) => priceValues.push(marker.closePrice));

    const minPrice = Math.min(...priceValues);
    const maxPrice = Math.max(...priceValues);
    const range = Math.max(maxPrice - minPrice, selectedAsset.basePrice * 0.002);
    const paddedMin = minPrice - range * 0.18;
    const paddedMax = maxPrice + range * 0.18;

    const yFor = (price: number) => top + ((paddedMax - price) / (paddedMax - paddedMin)) * chartHeight;
    const xStep = (right - left) / Math.max(visibleCandles.length - 1, 1);
    const bodyWidth = Math.max(4, Math.min(10, xStep * 0.56));
    const expiryX = right - 178;
    const currentY = yFor(currentPrice);

    const linePoints = visibleCandles
      .map((candle, index) => `${left + index * xStep},${yFor(candle.close)}`)
      .join(" ");

    return (
      <svg className="chart-svg" viewBox={`0 0 ${width} ${height}`} role="img" aria-label="NeuroOption live chart">
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
          return <line key={`v-${index}`} x1={x} y1={top} x2={x} y2={bottom} className="grid-line" />;
        })}

        {Array.from({ length: 8 }).map((_, index) => {
          const y = top + ((bottom - top) / 7) * index;
          return <line key={`h-${index}`} x1={left} y1={y} x2={right} y2={y} className="grid-line" />;
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
                <g key={candle.id} className={colorClass}>
                  <line x1={x} y1={highY} x2={x} y2={lowY} className="bar-stick" />
                  <line x1={x - bodyWidth} y1={openY} x2={x} y2={openY} className="bar-tick" />
                  <line x1={x} y1={closeY} x2={x + bodyWidth} y2={closeY} className="bar-tick" />
                </g>
              );
            }

            return (
              <g key={candle.id} className={colorClass}>
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
        <path d={`M ${expiryX} ${top - 2} L ${expiryX + 28} ${top - 2} L ${expiryX} ${top + 18} Z`} className="expiry-flag" />
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

        {activeTrades.map((trade) => {
          const y = yFor(trade.entryPrice);
          const label = `${trade.direction} ${formatCurrency(trade.amount, trade.currency)}`;

          return (
            <g key={trade.id}>
              <line x1={left} x2={right} y1={y} y2={y} className={trade.direction === "BUY" ? "trade-line-buy" : "trade-line-sell"} />
              <rect x={trade.x} y={y - 19} width="142" height="38" rx="9" className={trade.direction === "BUY" ? "trade-label-buy" : "trade-label-sell"} />
              <text x={trade.x + 71} y={y + 6} textAnchor="middle" className="trade-label-text">
                {label}
              </text>
            </g>
          );
        })}

        {resultMarkers.map((marker) => {
          const y = yFor(marker.closePrice);
          const text = marker.won ? `✓ ${formatCurrency(marker.amount, marker.currency)}` : `✓ ${formatCurrency(0, marker.currency)}`;

          return (
            <g key={marker.id}>
              <rect
                x={right - 220}
                y={y - 24}
                width="180"
                height="44"
                rx="12"
                className={marker.won ? "result-win" : "result-loss"}
              />
              <text x={right - 130} y={y + 5} textAnchor="middle" className="result-text">
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

              <button type="button" className="topup-button" onClick={() => alert("Top Up module will open here.")}>
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
                        {ASSET_CATEGORIES.map((category) => (
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
                        {ASSETS.filter((asset) => asset.category === assetCategory).map((asset) => (
                          <button
                            key={asset.symbol}
                            type="button"
                            onClick={() => {
                              setSelectedAsset(asset);
                              setAssetOpen(false);
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
                <span>{new Date(nowTick).toLocaleTimeString()} UTC+3</span>
                <span>Tool: {drawingTool}</span>
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
                  <button type="button" onClick={() => setExpirySeconds((value) => Math.max(MIN_EXPIRY_SECONDS, value - 1))}>
                    -
                  </button>
                  <strong>{secondsToTime(expirySeconds)}</strong>
                  <button type="button" onClick={() => setExpirySeconds((value) => Math.min(MAX_EXPIRY_SECONDS, value + 1))}>
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