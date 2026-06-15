import React from "react";
import "./TradingPage.css";

type AccountType = "QT Demo" | "QT Real";

type Currency =
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
type TradeSide = "BUY" | "SELL";

type Asset = {
  symbol: string;
  label: string;
  category: AssetCategory;
  basePrice: number;
  precision: number;
  payoutBoost: number;
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
  side: TradeSide;
  accountType: AccountType;
  currency: Currency;
  entryPrice: number;
  stake: number;
  profit: number;
  expectedReturn: number;
  label: string;
};

type ResultMarker = {
  id: string;
  price: number;
  won: boolean;
  label: string;
};

const EXCHANGE_RATES: Record<Currency, number> = {
  USD: 1,
  KES: 129,
  UGX: 3720,
  TZS: 2550,
  NGN: 1510,
  XOF: 604,
  EUR: 0.92,
  CAD: 1.36,
  JPY: 157,
  CNY: 7.24,
  AOA: 865,
  ZAR: 18.2,
  BRL: 5.42,
};

const CURRENCY_SYMBOLS: Record<Currency, string> = {
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
  ZAR: "R",
  BRL: "R$",
};

const ASSETS: Asset[] = [
  { symbol: "AUD/CAD OTC", label: "Australian Dollar / Canadian Dollar", category: "Currencies", basePrice: 0.8421, precision: 5, payoutBoost: 7 },
  { symbol: "EUR/USD OTC", label: "Euro / US Dollar", category: "Currencies", basePrice: 1.0845, precision: 5, payoutBoost: 5 },
  { symbol: "USD/JPY OTC", label: "US Dollar / Japanese Yen", category: "Currencies", basePrice: 157.45, precision: 3, payoutBoost: 4 },
  { symbol: "BTC/USD OTC", label: "Bitcoin / US Dollar", category: "Cryptocurrencies", basePrice: 68200, precision: 2, payoutBoost: 1 },
  { symbol: "ETH/USD OTC", label: "Ethereum / US Dollar", category: "Cryptocurrencies", basePrice: 3550, precision: 2, payoutBoost: 2 },
  { symbol: "Tesla OTC", label: "Tesla Inc.", category: "Stocks", basePrice: 181.4, precision: 2, payoutBoost: 3 },
  { symbol: "Apple OTC", label: "Apple Inc.", category: "Stocks", basePrice: 214.2, precision: 2, payoutBoost: 3 },
  { symbol: "Amazon OTC", label: "Amazon.com Inc.", category: "Stocks", basePrice: 185.6, precision: 2, payoutBoost: 3 },
  { symbol: "US100 OTC", label: "Nasdaq 100", category: "Indices", basePrice: 19888.46, precision: 2, payoutBoost: 4 },
  { symbol: "US30 OTC", label: "Dow Jones 30", category: "Indices", basePrice: 38950.9, precision: 2, payoutBoost: 4 },
  { symbol: "XAU/USD OTC", label: "Gold / US Dollar", category: "Commodities", basePrice: 2322.4, precision: 2, payoutBoost: 5 },
  { symbol: "Brent OTC", label: "Brent Crude Oil", category: "Commodities", basePrice: 82.8, precision: 2, payoutBoost: 2 },
];

const TIMEFRAMES = ["S5", "S10", "S15", "S30", "M1", "M2", "M3", "M5", "M10", "M15", "M30", "H1", "H4", "D1"];

const INDICATORS = [
  "Moving Average",
  "Exponential MA",
  "Weighted MA",
  "Bollinger Bands",
  "RSI",
  "MACD",
  "Stochastic",
  "CCI",
  "ADX",
  "ATR",
  "Parabolic SAR",
  "Ichimoku Cloud",
  "Momentum",
  "Williams %R",
  "Awesome Oscillator",
  "Fractals",
  "Alligator",
  "Envelopes",
  "Keltner Channel",
  "Donchian Channel",
  "Zig Zag",
  "Volume",
  "VWAP",
  "SuperTrend",
  "Pivot Points",
  "Fibonacci Levels",
  "Trend Strength",
  "Rate of Change",
  "Aroon",
  "DeMarker",
  "Money Flow Index",
  "OBV",
  "TRIX",
  "DPO",
  "Elder Ray",
  "Hull MA",
  "TEMA",
  "KAMA",
  "Price Channel",
  "Standard Deviation",
  "Variance",
  "Linear Regression",
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
  ["⏳", "Pending Trades"],
  ["⌨", "Hotkeys"],
  ["⛶", "Full Screen"],
];

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function formatTime(totalSeconds: number) {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return [hours, minutes, seconds].map((item) => String(item).padStart(2, "0")).join(":");
}

function splitTime(totalSeconds: number) {
  return {
    hours: Math.floor(totalSeconds / 3600),
    minutes: Math.floor((totalSeconds % 3600) / 60),
    seconds: totalSeconds % 60,
  };
}

function formatMoney(value: number, currency: Currency) {
  const symbol = CURRENCY_SYMBOLS[currency];
  const decimals = currency === "JPY" || currency === "UGX" || currency === "TZS" || currency === "XOF" ? 0 : 2;
  const formatted = value.toLocaleString(undefined, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });

  if (currency === "USD" || currency === "EUR" || currency === "JPY" || currency === "ZAR" || currency === "BRL") {
    return `${symbol}${formatted}`;
  }

  return `${currency} ${formatted}`;
}

function createInitialCandles(asset: Asset) {
  const candles: Candle[] = [];
  let price = asset.basePrice;
  const volatility = asset.basePrice * 0.0025;

  for (let index = 0; index < 100; index += 1) {
    const wave = Math.sin(index / 7) * volatility * 2.2;
    const noise = (Math.random() - 0.5) * volatility;
    const open = price;
    const close = Math.max(0.00001, open + wave * 0.22 + noise);
    const high = Math.max(open, close) + Math.random() * volatility;
    const low = Math.min(open, close) - Math.random() * volatility;

    candles.push({
      open,
      high,
      low,
      close,
      time: Date.now() - (100 - index) * 1000,
    });

    price = close;
  }

  return candles;
}

function mutateCandles(candles: Candle[], asset: Asset) {
  if (candles.length === 0) {
    return createInitialCandles(asset);
  }

  const nextCandles = candles.slice();
  const last = nextCandles[nextCandles.length - 1];
  const volatility = asset.basePrice * 0.0015;
  const move = (Math.random() - 0.5) * volatility;
  const close = Math.max(0.00001, last.close + move);

  nextCandles[nextCandles.length - 1] = {
    ...last,
    close,
    high: Math.max(last.high, close),
    low: Math.min(last.low, close),
  };

  if (Math.random() > 0.64) {
    const previous = nextCandles[nextCandles.length - 1];
    const open = previous.close;
    const nextMove = (Math.random() - 0.5) * volatility * 1.4;
    const nextClose = Math.max(0.00001, open + nextMove);

    nextCandles.push({
      open,
      close: nextClose,
      high: Math.max(open, nextClose) + Math.random() * volatility,
      low: Math.min(open, nextClose) - Math.random() * volatility,
      time: Date.now(),
    });
  }

  return nextCandles.slice(-110);
}

function drawTradingChart(params: {
  canvas: HTMLCanvasElement;
  candles: Candle[];
  asset: Asset;
  chartType: ChartType;
  timeframe: string;
  activeTrades: TradeMarker[];
  resultMarkers: ResultMarker[];
}) {
  const { canvas, candles, asset, chartType, timeframe, activeTrades, resultMarkers } = params;
  const context = canvas.getContext("2d");

  if (!context || candles.length === 0) {
    return;
  }

  const rect = canvas.getBoundingClientRect();
  const dpr = window.devicePixelRatio || 1;

  canvas.width = Math.max(1, Math.floor(rect.width * dpr));
  canvas.height = Math.max(1, Math.floor(rect.height * dpr));

  context.setTransform(dpr, 0, 0, dpr, 0, 0);

  const width = rect.width;
  const height = rect.height;
  const left = 14;
  const right = 76;
  const top = 36;
  const bottom = 34;
  const chartWidth = width - left - right;
  const chartHeight = height - top - bottom;

  context.clearRect(0, 0, width, height);

  const background = context.createLinearGradient(0, 0, width, height);
  background.addColorStop(0, "#172a4d");
  background.addColorStop(0.45, "#111d39");
  background.addColorStop(1, "#0a1022");
  context.fillStyle = background;
  context.fillRect(0, 0, width, height);

  context.save();
  context.globalAlpha = 0.2;
  context.fillStyle = "#8ab6ff";
  context.beginPath();
  context.moveTo(left, height - bottom);
  context.lineTo(left + chartWidth * 0.12, height - bottom - chartHeight * 0.28);
  context.lineTo(left + chartWidth * 0.25, height - bottom - chartHeight * 0.12);
  context.lineTo(left + chartWidth * 0.42, height - bottom - chartHeight * 0.38);
  context.lineTo(left + chartWidth * 0.58, height - bottom - chartHeight * 0.16);
  context.lineTo(left + chartWidth * 0.72, height - bottom - chartHeight * 0.45);
  context.lineTo(left + chartWidth * 0.9, height - bottom - chartHeight * 0.22);
  context.lineTo(left + chartWidth, height - bottom - chartHeight * 0.35);
  context.lineTo(left + chartWidth, height - bottom);
  context.closePath();
  context.fill();
  context.restore();

  const highs = candles.map((candle) => candle.high);
  const lows = candles.map((candle) => candle.low);
  let minPrice = Math.min(...lows);
  let maxPrice = Math.max(...highs);
  const pricePadding = Math.max((maxPrice - minPrice) * 0.18, asset.basePrice * 0.001);

  minPrice -= pricePadding;
  maxPrice += pricePadding;

  const priceToY = (price: number) => {
    return top + ((maxPrice - price) / (maxPrice - minPrice)) * chartHeight;
  };

  const indexToX = (index: number) => {
    return left + (index / Math.max(candles.length - 1, 1)) * chartWidth;
  };

  context.strokeStyle = "rgba(167, 200, 255, 0.14)";
  context.lineWidth = 1;

  for (let column = 0; column <= 9; column += 1) {
    const x = left + (chartWidth / 9) * column;
    context.beginPath();
    context.moveTo(x, top);
    context.lineTo(x, height - bottom);
    context.stroke();
  }

  for (let row = 0; row <= 6; row += 1) {
    const y = top + (chartHeight / 6) * row;
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
      const color = rising ? "#62e6e4" : "#ff725f";

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

        const bodyY = Math.min(openY, closeY);
        const bodyHeight = Math.max(2, Math.abs(openY - closeY));
        context.fillRect(x - candleWidth / 2, bodyY, candleWidth, bodyHeight);
      }
    });
  }

  const currentPrice = candles[candles.length - 1].close;
  const currentY = priceToY(currentPrice);

  context.setLineDash([6, 6]);
  context.strokeStyle = "#79dcff";
  context.lineWidth = 1.3;
  context.beginPath();
  context.moveTo(left, currentY);
  context.lineTo(width - right + 4, currentY);
  context.stroke();
  context.setLineDash([]);

  context.fillStyle = "#86c9ff";
  context.beginPath();
  context.roundRect(width - right + 8, currentY - 18, 64, 36, 9);
  context.fill();

  context.fillStyle = "#ffffff";
  context.font = "700 13px Inter, Arial, sans-serif";
  context.textAlign = "center";
  context.fillText(currentPrice.toFixed(asset.precision), width - right + 40, currentY + 5);

  context.fillStyle = "rgba(226, 238, 255, 0.8)";
  context.font = "700 13px Inter, Arial, sans-serif";
  context.textAlign = "left";
  context.fillText(`${new Date().toLocaleTimeString()} UTC+3`, left + 8, top - 12);

  context.textAlign = "right";
  context.fillText(`Current price ${currentPrice.toFixed(asset.precision)}`, width - right - 10, top - 12);

  context.strokeStyle = "rgba(255,255,255,0.9)";
  context.lineWidth = 1.6;
  const expiryX = left + chartWidth * 0.82;
  context.beginPath();
  context.moveTo(expiryX, top);
  context.lineTo(expiryX, height - bottom);
  context.stroke();

  context.fillStyle = "#ffffff";
  context.textAlign = "left";
  context.font = "700 12px Inter, Arial, sans-serif";
  context.fillText("⚑", expiryX + 4, top + 12);
  context.fillText("Expiration time", expiryX + 10, top + 30);

  context.fillStyle = "rgba(232, 240, 255, 0.82)";
  context.font = "700 12px Inter, Arial, sans-serif";
  context.textAlign = "right";

  for (let index = 0; index <= 5; index += 1) {
    const price = maxPrice - ((maxPrice - minPrice) / 5) * index;
    const y = priceToY(price);
    context.fillText(price.toFixed(asset.precision), width - 10, y + 4);
  }

  context.fillStyle = "rgba(232, 240, 255, 0.64)";
  context.font = "600 12px Inter, Arial, sans-serif";
  context.textAlign = "center";
  ["13:16", "13:32", "13:48", "14:04"].forEach((time, index) => {
    const x = left + chartWidth * (0.12 + index * 0.25);
    context.fillText(time, x, height - 10);
  });

  context.fillStyle = "rgba(255, 255, 255, 0.86)";
  context.font = "800 17px Inter, Arial, sans-serif";
  context.textAlign = "left";
  context.fillText(timeframe, expiryX - 58, currentY - 10);

  activeTrades.forEach((trade, index) => {
    const y = priceToY(trade.entryPrice);
    const markerX = left + 28 + index * 8;

    context.strokeStyle = trade.side === "BUY" ? "#62e87c" : "#ff655f";
    context.setLineDash([4, 4]);
    context.beginPath();
    context.moveTo(left, y);
    context.lineTo(width - right, y);
    context.stroke();
    context.setLineDash([]);

    context.fillStyle = trade.side === "BUY" ? "#48d567" : "#f15c55";
    context.beginPath();
    context.roundRect(markerX, y - 16, 128, 32, 8);
    context.fill();

    context.fillStyle = "#ffffff";
    context.font = "800 12px Inter, Arial, sans-serif";
    context.textAlign = "left";
    context.fillText(trade.label, markerX + 10, y + 4);
  });

  resultMarkers.forEach((marker) => {
    const y = priceToY(marker.price);
    const x = width - right - 150;

    context.fillStyle = marker.won ? "#47d86b" : "#f05a54";
    context.beginPath();
    context.roundRect(x, y - 18, 138, 36, 10);
    context.fill();

    context.fillStyle = "#ffffff";
    context.font = "900 13px Inter, Arial, sans-serif";
    context.textAlign = "center";
    context.fillText(marker.label, x + 69, y + 5);
  });
}

export default function TradingPage() {
  const canvasRef = React.useRef<HTMLCanvasElement | null>(null);
  const candlesRef = React.useRef<Candle[]>([]);
  const [renderTick, setRenderTick] = React.useState(0);

  const [accountType, setAccountType] = React.useState<AccountType>("QT Demo");
  const [currency, setCurrency] = React.useState<Currency>("USD");
  const [balancesUsd, setBalancesUsd] = React.useState<Record<AccountType, number>>({
    "QT Demo": 70000,
    "QT Real": 0,
  });

  const [selectedAssetSymbol, setSelectedAssetSymbol] = React.useState("AUD/CAD OTC");
  const [activeAssetCategory, setActiveAssetCategory] = React.useState<AssetCategory>("Currencies");
  const [assetMenuOpen, setAssetMenuOpen] = React.useState(false);

  const [chartType, setChartType] = React.useState<ChartType>("Candlesticks");
  const [timeframe, setTimeframe] = React.useState("M1");
  const [timeframeOpen, setTimeframeOpen] = React.useState(false);

  const [indicatorOpen, setIndicatorOpen] = React.useState(false);
  const [selectedIndicators, setSelectedIndicators] = React.useState<string[]>([]);
  const [drawingOpen, setDrawingOpen] = React.useState(false);
  const [selectedTool, setSelectedTool] = React.useState("Cursor");

  const [expirySeconds, setExpirySeconds] = React.useState(29 * 60);
  const [amount, setAmount] = React.useState("100");
  const [activeTrades, setActiveTrades] = React.useState<TradeMarker[]>([]);
  const [resultMarkers, setResultMarkers] = React.useState<ResultMarker[]>([]);
  const [payout, setPayout] = React.useState(92);

  const selectedAsset = ASSETS.find((asset) => asset.symbol === selectedAssetSymbol) ?? ASSETS[0];
  const exchangeRate = EXCHANGE_RATES[currency];
  const balance = balancesUsd[accountType] * exchangeRate;
  const stake = Number(amount);
  const safeStake = Number.isFinite(stake) ? Math.max(0, stake) : 0;
  const expectedProfit = safeStake * (payout / 100);
  const expectedReturn = safeStake + expectedProfit;
  const canTrade = safeStake > 0 && safeStake / exchangeRate <= balancesUsd[accountType];

  const expiryParts = splitTime(expirySeconds);

  React.useEffect(() => {
    candlesRef.current = createInitialCandles(selectedAsset);
    setRenderTick((value) => value + 1);
  }, [selectedAssetSymbol]);

  React.useEffect(() => {
    let frame = 0;
    let lastUpdate = 0;

    const loop = (time: number) => {
      if (time - lastUpdate > 190) {
        candlesRef.current = mutateCandles(candlesRef.current, selectedAsset);
        setRenderTick((value) => (value + 1) % 1000000);
        lastUpdate = time;
      }

      frame = window.requestAnimationFrame(loop);
    };

    frame = window.requestAnimationFrame(loop);

    return () => {
      window.cancelAnimationFrame(frame);
    };
  }, [selectedAssetSymbol]);

  React.useEffect(() => {
    const timer = window.setInterval(() => {
      const next = 20 + ((selectedAsset.payoutBoost + Math.floor(Math.random() * 72)) % 73);
      setPayout(clamp(next, 20, 92));
    }, 2500);

    return () => {
      window.clearInterval(timer);
    };
  }, [selectedAssetSymbol]);

  React.useEffect(() => {
    if (!canvasRef.current) {
      return;
    }

    drawTradingChart({
      canvas: canvasRef.current,
      candles: candlesRef.current,
      asset: selectedAsset,
      chartType,
      timeframe,
      activeTrades,
      resultMarkers,
    });
  }, [renderTick, selectedAssetSymbol, chartType, timeframe, activeTrades, resultMarkers]);

  function adjustExpiry(unit: "hours" | "minutes" | "seconds", delta: number) {
    const unitSeconds = unit === "hours" ? 3600 : unit === "minutes" ? 60 : 1;
    setExpirySeconds((current) => clamp(current + delta * unitSeconds, 5, 18000));
  }

  function toggleIndicator(name: string) {
    setSelectedIndicators((current) => {
      if (current.includes(name)) {
        return current.filter((item) => item !== name);
      }

      return [...current, name];
    });
  }

  function toggleFullscreen() {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => undefined);
      return;
    }

    document.exitFullscreen().catch(() => undefined);
  }

  function handleTopUp() {
    window.alert("Top Up placeholder: connect this button to your deposit flow.");
  }

  function placeTrade(side: TradeSide) {
    if (!canTrade) {
      return;
    }

    const latestCandle = candlesRef.current[candlesRef.current.length - 1];

    if (!latestCandle) {
      return;
    }

    const tradeId = `${Date.now()}-${Math.random()}`;
    const entryPrice = latestCandle.close;
    const stakeUsd = safeStake / exchangeRate;
    const profitCurrency = safeStake * (payout / 100);
    const returnCurrency = safeStake + profitCurrency;
    const returnUsd = returnCurrency / exchangeRate;

    const trade: TradeMarker = {
      id: tradeId,
      side,
      accountType,
      currency,
      entryPrice,
      stake: safeStake,
      profit: profitCurrency,
      expectedReturn: returnCurrency,
      label: `${side} ${formatMoney(safeStake, currency)}`,
    };

    setBalancesUsd((current) => ({
      ...current,
      [accountType]: current[accountType] - stakeUsd,
    }));

    setActiveTrades((current) => [...current, trade]);

    window.setTimeout(() => {
      const closePrice = candlesRef.current[candlesRef.current.length - 1]?.close ?? entryPrice;
      const won = side === "BUY" ? closePrice > entryPrice : closePrice < entryPrice;

      setActiveTrades((current) => current.filter((item) => item.id !== tradeId));

      if (won) {
        setBalancesUsd((current) => ({
          ...current,
          [accountType]: current[accountType] + returnUsd,
        }));
      }

      const resultId = `${tradeId}-result`;

      setResultMarkers((current) => [
        ...current,
        {
          id: resultId,
          price: closePrice,
          won,
          label: won ? `✓ ${formatMoney(returnCurrency, currency)}` : `✕ ${formatMoney(0, currency)}`,
        },
      ]);

      window.setTimeout(() => {
        setResultMarkers((current) => current.filter((item) => item.id !== resultId));
      }, 10000);
    }, expirySeconds * 1000);
  }

  return (
    <main className="trading-terminal">
      <header className="terminal-header">
        <div className="brand-block">
          <span className="brand-icon">N</span>
          <span className="brand-name">NeuroOption</span>
          <button type="button" className="star-button">★</button>
        </div>

        <div className="account-strip">
          <select value={accountType} onChange={(event) => setAccountType(event.target.value as AccountType)}>
            <option value="QT Demo">QT Demo</option>
            <option value="QT Real">QT Real</option>
          </select>

          <select value={currency} onChange={(event) => setCurrency(event.target.value as Currency)}>
            {Object.keys(EXCHANGE_RATES).map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>

          <strong className="balance-text">{formatMoney(balance, currency)}</strong>

          <button type="button" className="top-up-button" onClick={handleTopUp}>
            TOP UP
          </button>

          <button type="button" className="fullscreen-button" onClick={toggleFullscreen}>
            ⛶
          </button>

          <span className="avatar">SM</span>
        </div>
      </header>

      <section className="terminal-body">
        <aside className="left-sidebar">
          {LEFT_NAV.map(([icon, label]) => (
            <button key={label} type="button" className={`left-nav-item ${label === "Trading" ? "active" : ""}`}>
              <span>{icon}</span>
              <small>{label}</small>
            </button>
          ))}
        </aside>

        <section className="chart-zone">
          <div className="chart-toolbar">
            <div className="asset-selector">
              <button type="button" className="asset-trigger" onClick={() => setAssetMenuOpen((value) => !value)}>
                <span>{selectedAsset.symbol}</span>
                <strong>⌄</strong>
              </button>

              {assetMenuOpen && (
                <div className="asset-menu">
                  <div className="asset-tabs">
                    {(["Currencies", "Cryptocurrencies", "Stocks", "Indices", "Commodities"] as AssetCategory[]).map((category) => (
                      <button
                        type="button"
                        key={category}
                        className={activeAssetCategory === category ? "active" : ""}
                        onClick={() => setActiveAssetCategory(category)}
                      >
                        {category}
                      </button>
                    ))}
                  </div>

                  <div className="asset-list">
                    {ASSETS.filter((asset) => asset.category === activeAssetCategory).map((asset) => (
                      <button
                        type="button"
                        key={asset.symbol}
                        onClick={() => {
                          setSelectedAssetSymbol(asset.symbol);
                          setAssetMenuOpen(false);
                        }}
                      >
                        <strong>{asset.symbol}</strong>
                        <span>{asset.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="timeframe-selector">
              <button type="button" onClick={() => setTimeframeOpen((value) => !value)}>
                📊 {timeframe}
              </button>

              {timeframeOpen && (
                <div className="timeframe-menu">
                  {TIMEFRAMES.map((item) => (
                    <button
                      type="button"
                      key={item}
                      className={timeframe === item ? "active" : ""}
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

            <button type="button" className="tool-button" onClick={() => setIndicatorOpen((value) => !value)}>
              Indicators
            </button>

            <button type="button" className="tool-button" onClick={() => setDrawingOpen((value) => !value)}>
              ✎ {selectedTool}
            </button>

            <button type="button" className="tool-button compact">•••</button>
          </div>

          <div className="chart-type-switch">
            {(["Candlesticks", "Heiken Ashi", "Bars", "Line"] as ChartType[]).map((type) => (
              <button
                type="button"
                key={type}
                className={chartType === type ? "active" : ""}
                onClick={() => setChartType(type)}
              >
                {type}
              </button>
            ))}
          </div>

          {indicatorOpen && (
            <div className="floating-menu indicators-menu">
              <h3>42 Indicators</h3>
              <div>
                {INDICATORS.map((indicator) => (
                  <button
                    type="button"
                    key={indicator}
                    className={selectedIndicators.includes(indicator) ? "active" : ""}
                    onClick={() => toggleIndicator(indicator)}
                  >
                    {indicator}
                  </button>
                ))}
              </div>
            </div>
          )}

          {drawingOpen && (
            <div className="floating-menu drawing-menu">
              <h3>Drawing tools</h3>
              <div>
                {DRAWING_TOOLS.map((tool) => (
                  <button
                    type="button"
                    key={tool}
                    className={selectedTool === tool ? "active" : ""}
                    onClick={() => {
                      setSelectedTool(tool);
                      setDrawingOpen(false);
                    }}
                  >
                    {tool}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="chart-canvas-wrap">
            <canvas ref={canvasRef} className="trading-canvas" />
          </div>

          <div className="chart-footer">
            <button type="button">←</button>
            <button type="button">{timeframe} ▴</button>
            <strong>{selectedAsset.label}</strong>
          </div>
        </section>

        <aside className="trade-panel">
          <div className="sentiment-bar">
            <span>50%</span>
            <div>
              <i />
            </div>
            <span>50%</span>
          </div>

          <section className="time-card">
            <h3>Time ⓘ</h3>

            <div className="time-main">
              <button type="button" onClick={() => adjustExpiry("seconds", -1)}>-</button>
              <strong>{formatTime(expirySeconds)}</strong>
              <button type="button" onClick={() => adjustExpiry("seconds", 1)}>+</button>
            </div>

            <p>Min 00:00:05 · Max 05:00:00</p>

            <div className="expiry-units">
              <div>
                <button type="button" onClick={() => adjustExpiry("hours", 1)}>+</button>
                <strong>{String(expiryParts.hours).padStart(2, "0")}</strong>
                <button type="button" onClick={() => adjustExpiry("hours", -1)}>-</button>
                <small>Hours</small>
              </div>

              <div>
                <button type="button" onClick={() => adjustExpiry("minutes", 1)}>+</button>
                <strong>{String(expiryParts.minutes).padStart(2, "0")}</strong>
                <button type="button" onClick={() => adjustExpiry("minutes", -1)}>-</button>
                <small>Minutes</small>
              </div>

              <div>
                <button type="button" onClick={() => adjustExpiry("seconds", 1)}>+</button>
                <strong>{String(expiryParts.seconds).padStart(2, "0")}</strong>
                <button type="button" onClick={() => adjustExpiry("seconds", -1)}>-</button>
                <small>Seconds</small>
              </div>
            </div>
          </section>

          <section className="amount-card">
            <h3>Amount ⓘ</h3>
            <label>
              <input
                type="number"
                min="1"
                value={amount}
                onChange={(event) => setAmount(event.target.value)}
              />
              <span>{currency}</span>
            </label>
          </section>

          <section className="payout-card">
            <div>
              <span>Rate</span>
              <strong>+{payout}%</strong>
            </div>

            <div>
              <span>Expected profit</span>
              <strong>{formatMoney(expectedProfit, currency)}</strong>
            </div>

            <div>
              <span>Expected return</span>
              <strong>{formatMoney(expectedReturn, currency)}</strong>
            </div>
          </section>

          {!canTrade && (
            <p className="trade-warning">
              Enter a valid amount within your {accountType} balance.
            </p>
          )}

          <div className="trade-actions">
            <button type="button" className="buy-button" disabled={!canTrade} onClick={() => placeTrade("BUY")}>
              ↗ BUY
            </button>

            <button type="button" className="ai-button">
              AI TRADING
            </button>

            <button type="button" className="sell-button" disabled={!canTrade} onClick={() => placeTrade("SELL")}>
              ↘ SELL
            </button>
          </div>
        </aside>

        <aside className="quick-menu">
          {QUICK_NAV.map(([icon, label]) => (
            <button
              type="button"
              key={label}
              className={label === "Hotkeys" || label === "Full Screen" ? "quick-item desktop-extra" : "quick-item"}
              onClick={label === "Full Screen" ? toggleFullscreen : undefined}
            >
              <span>{icon}</span>
              <small>{label}</small>
            </button>
          ))}
        </aside>
      </section>
    </main>
  );
}