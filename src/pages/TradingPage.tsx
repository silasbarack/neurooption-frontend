import React from "react";
import "./TradingPage.css";

type AccountType = "demo" | "real";

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
type Direction = "BUY" | "SELL";

type Candle = {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
};

type Asset = {
  id: string;
  label: string;
  fullName: string;
  category: AssetCategory;
  basePrice: number;
  precision: number;
  volatility: number;
  payout: number;
};

type TradeMarker = {
  id: string;
  direction: Direction;
  accountType: AccountType;
  entryPrice: number;
  stakeUsd: number;
  stakeDisplay: string;
  expectedReturnUsd: number;
  expectedReturnDisplay: string;
  payout: number;
  createdAt: number;
};

type ResultMarker = {
  id: string;
  direction: Direction;
  price: number;
  won: boolean;
  label: string;
};

const MIN_EXPIRY_SECONDS = 5;
const MAX_EXPIRY_SECONDS = 5 * 60 * 60;

const EXCHANGE_RATES: Record<CurrencyCode, number> = {
  USD: 1,
  KES: 129.5,
  UGX: 3700,
  TZS: 2600,
  NGN: 1500,
  XOF: 610,
  EUR: 0.92,
  CAD: 1.37,
  JPY: 157,
  CNY: 7.25,
  AOA: 870,
  ZAR: 18.2,
  BRL: 5.35,
};

const CURRENCIES: CurrencyCode[] = [
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

const ASSET_GROUPS: Record<AssetCategory, Asset[]> = {
  Currencies: [
    {
      id: "AUDCAD_OTC",
      label: "AUD/CAD OTC",
      fullName: "Australian Dollar / Canadian Dollar",
      category: "Currencies",
      basePrice: 0.84217,
      precision: 5,
      volatility: 0.00045,
      payout: 92,
    },
    {
      id: "EURUSD_OTC",
      label: "EUR/USD OTC",
      fullName: "Euro / United States Dollar",
      category: "Currencies",
      basePrice: 1.1342,
      precision: 5,
      volatility: 0.0005,
      payout: 90,
    },
    {
      id: "USDJPY_OTC",
      label: "USD/JPY OTC",
      fullName: "United States Dollar / Japanese Yen",
      category: "Currencies",
      basePrice: 157.25,
      precision: 3,
      volatility: 0.045,
      payout: 88,
    },
  ],
  Cryptocurrencies: [
    {
      id: "BTCUSD_OTC",
      label: "BTC/USD OTC",
      fullName: "Bitcoin / United States Dollar",
      category: "Cryptocurrencies",
      basePrice: 65420,
      precision: 2,
      volatility: 55,
      payout: 82,
    },
    {
      id: "ETHUSD_OTC",
      label: "ETH/USD OTC",
      fullName: "Ethereum / United States Dollar",
      category: "Cryptocurrencies",
      basePrice: 3520,
      precision: 2,
      volatility: 7.5,
      payout: 84,
    },
  ],
  Stocks: [
    {
      id: "TSLA_OTC",
      label: "Tesla OTC",
      fullName: "Tesla Inc.",
      category: "Stocks",
      basePrice: 185.4,
      precision: 2,
      volatility: 0.8,
      payout: 78,
    },
    {
      id: "AAPL_OTC",
      label: "Apple OTC",
      fullName: "Apple Inc.",
      category: "Stocks",
      basePrice: 213.2,
      precision: 2,
      volatility: 0.55,
      payout: 80,
    },
    {
      id: "AMZN_OTC",
      label: "Amazon OTC",
      fullName: "Amazon.com Inc.",
      category: "Stocks",
      basePrice: 189.7,
      precision: 2,
      volatility: 0.65,
      payout: 81,
    },
  ],
  Indices: [
    {
      id: "US100_OTC",
      label: "US100 OTC",
      fullName: "Nasdaq 100",
      category: "Indices",
      basePrice: 19888.46,
      precision: 2,
      volatility: 32,
      payout: 85,
    },
    {
      id: "US30_OTC",
      label: "US30 OTC",
      fullName: "Dow Jones 30",
      category: "Indices",
      basePrice: 38850.5,
      precision: 2,
      volatility: 45,
      payout: 83,
    },
  ],
  Commodities: [
    {
      id: "XAUUSD_OTC",
      label: "XAU/USD OTC",
      fullName: "Gold / United States Dollar",
      category: "Commodities",
      basePrice: 2338.65,
      precision: 2,
      volatility: 2.8,
      payout: 86,
    },
    {
      id: "BRENT_OTC",
      label: "Brent OTC",
      fullName: "Brent Crude Oil",
      category: "Commodities",
      basePrice: 82.45,
      precision: 2,
      volatility: 0.18,
      payout: 79,
    },
  ],
};

const ALL_ASSETS: Asset[] = ([] as Asset[]).concat(
  ASSET_GROUPS.Currencies,
  ASSET_GROUPS.Cryptocurrencies,
  ASSET_GROUPS.Stocks,
  ASSET_GROUPS.Indices,
  ASSET_GROUPS.Commodities
);

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
  "EMA",
  "SMA",
  "WMA",
  "Bollinger Bands",
  "RSI",
  "MACD",
  "Stochastic",
  "ADX",
  "ATR",
  "CCI",
  "Parabolic SAR",
  "Ichimoku Cloud",
  "Momentum",
  "Williams %R",
  "Fractals",
  "Alligator",
  "Awesome Oscillator",
  "DeMarker",
  "Envelopes",
  "Keltner Channel",
  "Donchian Channel",
  "Pivot Points",
  "VWAP",
  "Volume",
  "OBV",
  "Money Flow Index",
  "Chaikin Oscillator",
  "TRIX",
  "ROC",
  "ZigZag",
  "Supertrend",
  "Hull MA",
  "TEMA",
  "DPO",
  "Aroon",
  "Elder Ray",
  "Force Index",
  "Gator Oscillator",
  "Standard Deviation",
  "Linear Regression",
  "Price Channel",
];

const SIDE_ITEMS = [
  { icon: "📈", label: "Trading" },
  { icon: "💵", label: "Finance" },
  { icon: "👤", label: "Profile" },
  { icon: "🛒", label: "Market" },
  { icon: "💎", label: "Achievements" },
  { icon: "🏆", label: "Tournaments" },
  { icon: "💬", label: "Chat" },
  { icon: "?", label: "Help" },
  { icon: "🎁", label: "Promo" },
  { icon: "🤖", label: "Autotrading" },
];

const QUICK_ITEMS = [
  { icon: "↻", label: "Trades" },
  { icon: "📡", label: "Signals" },
  { icon: "👥", label: "Social Trading" },
  { icon: "◎", label: "Express Trades" },
  { icon: "⏳", label: "Pending Trades" },
  { icon: "⌨", label: "Hotkeys" },
  { icon: "⛶", label: "Full Screen" },
];

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

function formatDuration(totalSeconds: number) {
  const safeSeconds = clamp(totalSeconds, MIN_EXPIRY_SECONDS, MAX_EXPIRY_SECONDS);
  const hours = Math.floor(safeSeconds / 3600);
  const minutes = Math.floor((safeSeconds % 3600) / 60);
  const seconds = safeSeconds % 60;

  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
    2,
    "0"
  )}:${String(seconds).padStart(2, "0")}`;
}

function formatMoney(amount: number, currency: CurrencyCode) {
  const decimals = currency === "JPY" || currency === "XOF" ? 0 : 2;
  const formatted = new Intl.NumberFormat("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(amount);

  if (currency === "USD") return `$${formatted}`;
  if (currency === "EUR") return `€${formatted}`;
  if (currency === "JPY") return `¥${formatted}`;
  return `${currency} ${formatted}`;
}

function createInitialCandles(asset: Asset) {
  const candles: Candle[] = [];
  let price = asset.basePrice;

  for (let index = 0; index < 110; index += 1) {
    const wave = Math.sin(index / 6) * asset.volatility * 1.8;
    const drift = (Math.random() - 0.48) * asset.volatility * 2.4;
    const open = price;
    const close = Math.max(0.00001, open + wave + drift);
    const high = Math.max(open, close) + Math.random() * asset.volatility * 1.8;
    const low = Math.min(open, close) - Math.random() * asset.volatility * 1.8;

    candles.push({
      time: Date.now() - (110 - index) * 1000,
      open,
      high,
      low: Math.max(0.00001, low),
      close,
    });

    price = close;
  }

  return candles;
}

function createNextCandle(previous: Candle, asset: Asset) {
  const pulse = Math.sin(Date.now() / 3200) * asset.volatility * 0.75;
  const movement = (Math.random() - 0.47) * asset.volatility * 2.6 + pulse;
  const open = previous.close;
  const close = Math.max(0.00001, open + movement);
  const high = Math.max(open, close) + Math.random() * asset.volatility * 1.6;
  const low = Math.min(open, close) - Math.random() * asset.volatility * 1.6;

  return {
    time: Date.now(),
    open,
    high,
    low: Math.max(0.00001, low),
    close,
  };
}

function drawChart(
  canvas: HTMLCanvasElement,
  asset: Asset,
  candles: Candle[],
  chartType: ChartType,
  timeframe: string,
  selectedTool: string,
  activeIndicators: string[],
  activeTrades: TradeMarker[],
  resultMarkers: ResultMarker[]
) {
  const parent = canvas.parentElement;
  if (!parent) return;

  const rect = parent.getBoundingClientRect();
  const dpr = window.devicePixelRatio || 1;
  const targetWidth = Math.max(320, Math.floor(rect.width * dpr));
  const targetHeight = Math.max(260, Math.floor(rect.height * dpr));

  if (canvas.width !== targetWidth || canvas.height !== targetHeight) {
    canvas.width = targetWidth;
    canvas.height = targetHeight;
  }

  canvas.style.width = `${rect.width}px`;
  canvas.style.height = `${rect.height}px`;

  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const width = canvas.width;
  const height = canvas.height;
  const leftPad = 28 * dpr;
  const rightPad = 76 * dpr;
  const topPad = 24 * dpr;
  const bottomPad = 42 * dpr;
  const plotWidth = width - leftPad - rightPad;
  const plotHeight = height - topPad - bottomPad;

  ctx.clearRect(0, 0, width, height);

  const background = ctx.createLinearGradient(0, 0, 0, height);
  background.addColorStop(0, "#233a65");
  background.addColorStop(0.55, "#172742");
  background.addColorStop(1, "#101828");
  ctx.fillStyle = background;
  ctx.fillRect(0, 0, width, height);

  ctx.globalAlpha = 0.16;
  ctx.fillStyle = "#8aa6d8";
  ctx.beginPath();
  ctx.moveTo(0, height * 0.74);
  ctx.lineTo(width * 0.16, height * 0.48);
  ctx.lineTo(width * 0.31, height * 0.72);
  ctx.lineTo(width * 0.52, height * 0.43);
  ctx.lineTo(width * 0.72, height * 0.68);
  ctx.lineTo(width * 0.89, height * 0.52);
  ctx.lineTo(width, height * 0.65);
  ctx.lineTo(width, height);
  ctx.lineTo(0, height);
  ctx.closePath();
  ctx.fill();
  ctx.globalAlpha = 1;

  const visible = candles.slice(-90);
  if (visible.length < 4) return;

  const values = visible.flatMap((candle) => [
    candle.open,
    candle.high,
    candle.low,
    candle.close,
  ]);

  activeTrades.forEach((trade) => values.push(trade.entryPrice));
  resultMarkers.forEach((marker) => values.push(marker.price));

  const minPrice = Math.min(...values);
  const maxPrice = Math.max(...values);
  const padding = Math.max((maxPrice - minPrice) * 0.18, asset.volatility * 8);
  const lowRange = minPrice - padding;
  const highRange = maxPrice + padding;

  const xAt = (index: number) =>
    leftPad + (index / Math.max(visible.length - 1, 1)) * plotWidth;

  const yAt = (price: number) =>
    topPad + ((highRange - price) / (highRange - lowRange)) * plotHeight;

  ctx.strokeStyle = "rgba(139, 170, 220, 0.18)";
  ctx.lineWidth = 1 * dpr;

  for (let index = 0; index <= 8; index += 1) {
    const x = leftPad + (plotWidth / 8) * index;
    ctx.beginPath();
    ctx.moveTo(x, topPad);
    ctx.lineTo(x, topPad + plotHeight);
    ctx.stroke();
  }

  for (let index = 0; index <= 6; index += 1) {
    const y = topPad + (plotHeight / 6) * index;
    ctx.beginPath();
    ctx.moveTo(leftPad, y);
    ctx.lineTo(leftPad + plotWidth, y);
    ctx.stroke();
  }

  ctx.fillStyle = "rgba(226, 237, 255, 0.86)";
  ctx.font = `${12 * dpr}px Inter, Arial, sans-serif`;
  ctx.textAlign = "left";

  for (let index = 0; index <= 5; index += 1) {
    const price = highRange - ((highRange - lowRange) / 5) * index;
    const y = yAt(price);
    ctx.fillText(
      price.toFixed(asset.precision),
      leftPad + plotWidth + 10 * dpr,
      y + 4 * dpr
    );
  }

  const candleWidth = clamp(plotWidth / visible.length / 1.6, 3 * dpr, 12 * dpr);

  const candleSource =
    chartType === "Heiken Ashi"
      ? visible.reduce<Candle[]>((items, candle, index) => {
          const previous = items[index - 1];
          const close = (candle.open + candle.high + candle.low + candle.close) / 4;
          const open = previous ? (previous.open + previous.close) / 2 : candle.open;
          const high = Math.max(candle.high, open, close);
          const low = Math.min(candle.low, open, close);
          items.push({ ...candle, open, high, low, close });
          return items;
        }, [])
      : visible;

  if (chartType === "Line") {
    ctx.strokeStyle = "#5bd7ff";
    ctx.lineWidth = 2.4 * dpr;
    ctx.beginPath();

    candleSource.forEach((candle, index) => {
      const x = xAt(index);
      const y = yAt(candle.close);
      if (index === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });

    ctx.stroke();

    const area = ctx.createLinearGradient(0, topPad, 0, topPad + plotHeight);
    area.addColorStop(0, "rgba(91, 215, 255, 0.22)");
    area.addColorStop(1, "rgba(91, 215, 255, 0.01)");
    ctx.lineTo(xAt(candleSource.length - 1), topPad + plotHeight);
    ctx.lineTo(xAt(0), topPad + plotHeight);
    ctx.closePath();
    ctx.fillStyle = area;
    ctx.fill();
  } else {
    candleSource.forEach((candle, index) => {
      const x = xAt(index);
      const openY = yAt(candle.open);
      const closeY = yAt(candle.close);
      const highY = yAt(candle.high);
      const lowY = yAt(candle.low);
      const bullish = candle.close >= candle.open;
      const color = bullish ? "#67e8d8" : "#ff725f";

      ctx.strokeStyle = color;
      ctx.fillStyle = color;
      ctx.lineWidth = 1.4 * dpr;

      if (chartType === "Bars") {
        ctx.beginPath();
        ctx.moveTo(x, highY);
        ctx.lineTo(x, lowY);
        ctx.moveTo(x - candleWidth * 0.55, openY);
        ctx.lineTo(x, openY);
        ctx.moveTo(x, closeY);
        ctx.lineTo(x + candleWidth * 0.55, closeY);
        ctx.stroke();
      } else {
        ctx.beginPath();
        ctx.moveTo(x, highY);
        ctx.lineTo(x, lowY);
        ctx.stroke();

        const bodyTop = Math.min(openY, closeY);
        const bodyHeight = Math.max(Math.abs(closeY - openY), 2 * dpr);

        ctx.fillRect(x - candleWidth / 2, bodyTop, candleWidth, bodyHeight);
      }
    });
  }

  const current = visible[visible.length - 1].close;
  const currentY = yAt(current);

  ctx.strokeStyle = "rgba(118, 211, 255, 0.9)";
  ctx.setLineDash([6 * dpr, 5 * dpr]);
  ctx.lineWidth = 1.1 * dpr;
  ctx.beginPath();
  ctx.moveTo(leftPad, currentY);
  ctx.lineTo(leftPad + plotWidth, currentY);
  ctx.stroke();
  ctx.setLineDash([]);

  const priceLabel = current.toFixed(asset.precision);
  const priceLabelWidth = ctx.measureText(priceLabel).width + 18 * dpr;

  ctx.fillStyle = "#7bb7f7";
  ctx.roundRect(
    leftPad + plotWidth + 4 * dpr,
    currentY - 15 * dpr,
    priceLabelWidth,
    30 * dpr,
    7 * dpr
  );
  ctx.fill();

  ctx.fillStyle = "#ffffff";
  ctx.font = `700 ${12 * dpr}px Inter, Arial, sans-serif`;
  ctx.fillText(priceLabel, leftPad + plotWidth + 13 * dpr, currentY + 4 * dpr);

  const expiryX = leftPad + plotWidth - 122 * dpr;
  ctx.strokeStyle = "rgba(255, 255, 255, 0.92)";
  ctx.lineWidth = 1.5 * dpr;
  ctx.beginPath();
  ctx.moveTo(expiryX, topPad);
  ctx.lineTo(expiryX, topPad + plotHeight);
  ctx.stroke();

  ctx.fillStyle = "#ffffff";
  ctx.beginPath();
  ctx.moveTo(expiryX, topPad + 8 * dpr);
  ctx.lineTo(expiryX + 15 * dpr, topPad + 12 * dpr);
  ctx.lineTo(expiryX, topPad + 18 * dpr);
  ctx.closePath();
  ctx.fill();

  ctx.font = `700 ${11 * dpr}px Inter, Arial, sans-serif`;
  ctx.fillText("Expiration time", expiryX + 10 * dpr, topPad + 32 * dpr);

  activeTrades.forEach((trade, index) => {
    const y = yAt(trade.entryPrice);
    const x = leftPad + 12 * dpr + (index % 3) * 94 * dpr;
    const label = `${trade.direction} ${trade.stakeDisplay}`;

    ctx.strokeStyle = trade.direction === "BUY" ? "#4ade80" : "#ff6b5f";
    ctx.setLineDash([4 * dpr, 3 * dpr]);
    ctx.beginPath();
    ctx.moveTo(leftPad, y);
    ctx.lineTo(leftPad + plotWidth, y);
    ctx.stroke();
    ctx.setLineDash([]);

    ctx.fillStyle = trade.direction === "BUY" ? "#34c96f" : "#ef554c";
    ctx.roundRect(x, y - 15 * dpr, 118 * dpr, 30 * dpr, 8 * dpr);
    ctx.fill();

    ctx.fillStyle = "#ffffff";
    ctx.font = `800 ${10 * dpr}px Inter, Arial, sans-serif`;
    ctx.fillText(label.slice(0, 20), x + 9 * dpr, y + 4 * dpr);
  });

  resultMarkers.forEach((marker, index) => {
    const y = yAt(marker.price);
    const x = leftPad + plotWidth * 0.44 + index * 14 * dpr;
    const widthLabel = ctx.measureText(marker.label).width + 42 * dpr;

    ctx.fillStyle = marker.won ? "#26c96f" : "#e14f43";
    ctx.roundRect(x, y - 18 * dpr, widthLabel, 36 * dpr, 16 * dpr);
    ctx.fill();

    ctx.fillStyle = "#ffffff";
    ctx.font = `900 ${13 * dpr}px Inter, Arial, sans-serif`;
    ctx.fillText(marker.won ? "✓" : "✕", x + 12 * dpr, y + 5 * dpr);

    ctx.font = `800 ${11 * dpr}px Inter, Arial, sans-serif`;
    ctx.fillText(marker.label, x + 30 * dpr, y + 4 * dpr);
  });

  ctx.fillStyle = "rgba(215, 229, 255, 0.72)";
  ctx.font = `${11 * dpr}px Inter, Arial, sans-serif`;
  ctx.textAlign = "center";

  const timeLabels = ["13:16", "13:32", "13:48", "14:04"];
  timeLabels.forEach((label, index) => {
    ctx.fillText(
      label,
      leftPad + (plotWidth / 3) * index,
      height - 13 * dpr
    );
  });

  ctx.fillStyle = "rgba(255,255,255,0.88)";
  ctx.textAlign = "left";
  ctx.font = `700 ${12 * dpr}px Inter, Arial, sans-serif`;
  ctx.fillText(`${timeframe}`, leftPad + plotWidth * 0.72, currentY + 30 * dpr);
  ctx.font = `${11 * dpr}px Inter, Arial, sans-serif`;
  ctx.fillText(selectedTool ? `Tool: ${selectedTool}` : "Tool: Cursor", leftPad + 178 * dpr, topPad + 16 * dpr);

  if (activeIndicators.length > 0) {
    ctx.fillStyle = "rgba(88, 180, 255, 0.2)";
    ctx.roundRect(leftPad + 12 * dpr, topPad + 26 * dpr, 210 * dpr, 28 * dpr, 8 * dpr);
    ctx.fill();

    ctx.fillStyle = "#d8ebff";
    ctx.font = `700 ${10 * dpr}px Inter, Arial, sans-serif`;
    ctx.fillText(
      `Indicators: ${activeIndicators.slice(0, 3).join(", ")}`,
      leftPad + 22 * dpr,
      topPad + 44 * dpr
    );
  }
}

export default function TradingPage() {
  const canvasRef = React.useRef<HTMLCanvasElement | null>(null);
  const candlesRef = React.useRef<Candle[]>([]);
  const currentPriceRef = React.useRef<number>(0);
  const activeTradesRef = React.useRef<TradeMarker[]>([]);
  const resultMarkersRef = React.useRef<ResultMarker[]>([]);
  const timeoutIdsRef = React.useRef<number[]>([]);

  const [accountType, setAccountType] = React.useState<AccountType>("demo");
  const [currency, setCurrency] = React.useState<CurrencyCode>("USD");
  const [balancesUsd, setBalancesUsd] = React.useState({
    demo: 70000,
    real: 0,
  });

  const [assetId, setAssetId] = React.useState("AUDCAD_OTC");
  const [assetCategory, setAssetCategory] =
    React.useState<AssetCategory>("Currencies");
  const [chartType, setChartType] = React.useState<ChartType>("Candlesticks");
  const [timeframe, setTimeframe] = React.useState("M1");
  const [selectedTool, setSelectedTool] = React.useState("Cursor");
  const [activeIndicators, setActiveIndicators] = React.useState<string[]>([]);
  const [candles, setCandles] = React.useState<Candle[]>(
    createInitialCandles(ALL_ASSETS[0])
  );
  const [currentPrice, setCurrentPrice] = React.useState(ALL_ASSETS[0].basePrice);
  const [expirySeconds, setExpirySeconds] = React.useState(30 * 60);
  const [amount, setAmount] = React.useState(100);
  const [assetMenuOpen, setAssetMenuOpen] = React.useState(false);
  const [indicatorMenuOpen, setIndicatorMenuOpen] = React.useState(false);
  const [drawingMenuOpen, setDrawingMenuOpen] = React.useState(false);
  const [timeframeMenuOpen, setTimeframeMenuOpen] = React.useState(false);
  const [mobileToolMenuOpen, setMobileToolMenuOpen] = React.useState(false);
  const [activeTrades, setActiveTrades] = React.useState<TradeMarker[]>([]);
  const [resultMarkers, setResultMarkers] = React.useState<ResultMarker[]>([]);
  const [nowLabel, setNowLabel] = React.useState(
    new Date().toLocaleTimeString([], { hour12: false })
  );

  const selectedAsset = React.useMemo(() => {
    return ALL_ASSETS.find((asset) => asset.id === assetId) || ALL_ASSETS[0];
  }, [assetId]);

  const selectedRate = EXCHANGE_RATES[currency];
  const displayedBalance = balancesUsd[accountType] * selectedRate;

  const payout = React.useMemo(() => {
    const pulse = Math.round(Math.sin(currentPrice * 1000) * 2);
    return clamp(selectedAsset.payout + pulse, 20, 92);
  }, [currentPrice, selectedAsset.payout]);

  const expectedProfit = amount * (payout / 100);
  const expectedReturn = amount + expectedProfit;
  const stakeUsd = amount / selectedRate;
  const hasEnoughBalance = stakeUsd <= balancesUsd[accountType];
  const canTrade = amount > 0 && hasEnoughBalance;

  const expiryParts = React.useMemo(() => {
    return {
      hours: Math.floor(expirySeconds / 3600),
      minutes: Math.floor((expirySeconds % 3600) / 60),
      seconds: expirySeconds % 60,
    };
  }, [expirySeconds]);

  React.useEffect(() => {
    const nextCandles = createInitialCandles(selectedAsset);
    candlesRef.current = nextCandles;
    currentPriceRef.current = nextCandles[nextCandles.length - 1].close;
    setCandles(nextCandles);
    setCurrentPrice(nextCandles[nextCandles.length - 1].close);
  }, [selectedAsset]);

  React.useEffect(() => {
    candlesRef.current = candles;
  }, [candles]);

  React.useEffect(() => {
    currentPriceRef.current = currentPrice;
  }, [currentPrice]);

  React.useEffect(() => {
    activeTradesRef.current = activeTrades;
  }, [activeTrades]);

  React.useEffect(() => {
    resultMarkersRef.current = resultMarkers;
  }, [resultMarkers]);

  React.useEffect(() => {
    const clockId = window.setInterval(() => {
      setNowLabel(new Date().toLocaleTimeString([], { hour12: false }));
    }, 1000);

    return () => window.clearInterval(clockId);
  }, []);

  React.useEffect(() => {
    const marketId = window.setInterval(() => {
      const existing = candlesRef.current;
      const previous = existing[existing.length - 1];

      if (!previous) return;

      const next = createNextCandle(previous, selectedAsset);
      const updated = [...existing.slice(-109), next];

      candlesRef.current = updated;
      currentPriceRef.current = next.close;

      setCandles(updated);
      setCurrentPrice(next.close);
    }, 420);

    return () => window.clearInterval(marketId);
  }, [selectedAsset]);

  React.useEffect(() => {
    let animationId = 0;

    const render = () => {
      const canvas = canvasRef.current;

      if (canvas) {
        drawChart(
          canvas,
          selectedAsset,
          candlesRef.current,
          chartType,
          timeframe,
          selectedTool,
          activeIndicators,
          activeTradesRef.current,
          resultMarkersRef.current
        );
      }

      animationId = window.requestAnimationFrame(render);
    };

    animationId = window.requestAnimationFrame(render);

    return () => window.cancelAnimationFrame(animationId);
  }, [selectedAsset, chartType, timeframe, selectedTool, activeIndicators]);

  React.useEffect(() => {
    return () => {
      timeoutIdsRef.current.forEach((id) => window.clearTimeout(id));
    };
  }, []);

  function updateExpiry(part: "hours" | "minutes" | "seconds", delta: number) {
    const step = part === "hours" ? 3600 : part === "minutes" ? 60 : 1;
    setExpirySeconds((previous) =>
      clamp(previous + step * delta, MIN_EXPIRY_SECONDS, MAX_EXPIRY_SECONDS)
    );
  }

  function toggleIndicator(indicator: string) {
    setActiveIndicators((previous) => {
      if (previous.includes(indicator)) {
        return previous.filter((item) => item !== indicator);
      }

      return [...previous, indicator].slice(-6);
    });
  }

  function handleFullScreen() {
    if (document.fullscreenElement) {
      void document.exitFullscreen();
      return;
    }

    void document.documentElement.requestFullscreen();
  }

  function selectAsset(asset: Asset) {
    setAssetId(asset.id);
    setAssetCategory(asset.category);
    setAssetMenuOpen(false);
  }

  function handleTrade(direction: Direction) {
    if (!canTrade) return;

    const entryPrice = currentPriceRef.current;
    const tradeId = `${direction}_${Date.now()}`;
    const currentCurrency = currency;
    const currentRate = EXCHANGE_RATES[currentCurrency];
    const currentStakeUsd = amount / currentRate;
    const currentProfitUsd = expectedProfit / currentRate;
    const currentReturnUsd = currentStakeUsd + currentProfitUsd;

    const marker: TradeMarker = {
      id: tradeId,
      direction,
      accountType,
      entryPrice,
      stakeUsd: currentStakeUsd,
      stakeDisplay: formatMoney(amount, currentCurrency),
      expectedReturnUsd: currentReturnUsd,
      expectedReturnDisplay: formatMoney(expectedReturn, currentCurrency),
      payout,
      createdAt: Date.now(),
    };

    setBalancesUsd((previous) => ({
      ...previous,
      [accountType]: Math.max(0, previous[accountType] - currentStakeUsd),
    }));

    setActiveTrades((previous) => [...previous, marker]);

    const settleId = window.setTimeout(() => {
      const closePrice = currentPriceRef.current;
      const won =
        direction === "BUY" ? closePrice > entryPrice : closePrice < entryPrice;

      if (won) {
        setBalancesUsd((previous) => ({
          ...previous,
          [marker.accountType]: previous[marker.accountType] + marker.expectedReturnUsd,
        }));
      }

      setActiveTrades((previous) =>
        previous.filter((trade) => trade.id !== marker.id)
      );

      const resultId = `RESULT_${Date.now()}`;
      const result: ResultMarker = {
        id: resultId,
        direction,
        price: closePrice,
        won,
        label: won ? marker.expectedReturnDisplay : formatMoney(0, currentCurrency),
      };

      setResultMarkers((previous) => [...previous, result]);

      const hideId = window.setTimeout(() => {
        setResultMarkers((previous) =>
          previous.filter((item) => item.id !== resultId)
        );
      }, 10000);

      timeoutIdsRef.current.push(hideId);
    }, expirySeconds * 1000);

    timeoutIdsRef.current.push(settleId);
  }

  function renderTimeStepper(
    part: "hours" | "minutes" | "seconds",
    label: string,
    value: number
  ) {
    return (
      <div className="no-time-step">
        <button type="button" onClick={() => updateExpiry(part, 1)}>
          +
        </button>
        <span>{String(value).padStart(2, "0")}</span>
        <button type="button" onClick={() => updateExpiry(part, -1)}>
          -
        </button>
        <small>{label}</small>
      </div>
    );
  }

  return (
    <main className="no-terminal">
      <header className="no-topbar">
        <div className="no-brand">
          <span className="no-brand-mark">N</span>
          <span className="no-brand-name">NeuroOption</span>
          <button className="no-star" type="button">
            ★
          </button>
        </div>

        <div className="no-account-strip">
          <select
            value={accountType}
            onChange={(event) => setAccountType(event.target.value as AccountType)}
            aria-label="Account type"
          >
            <option value="demo">QT Demo</option>
            <option value="real">QT Real</option>
          </select>

          <select
            value={currency}
            onChange={(event) => setCurrency(event.target.value as CurrencyCode)}
            aria-label="Currency"
          >
            {CURRENCIES.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>

          <strong className="no-balance">{formatMoney(displayedBalance, currency)}</strong>

          <button
            className="no-topup"
            type="button"
            onClick={() => window.alert("Top Up flow placeholder. Connect deposits here.")}
          >
            TOP UP
          </button>

          <button className="no-icon-btn" type="button" onClick={handleFullScreen}>
            ⛶
          </button>

          <div className="no-avatar">SM</div>
        </div>
      </header>

      <aside className="no-sidebar">
        {SIDE_ITEMS.map((item) => (
          <button
            key={item.label}
            type="button"
            className={item.label === "Trading" ? "active" : ""}
          >
            <span>{item.icon}</span>
            <small>{item.label}</small>
          </button>
        ))}
      </aside>

      <section className="no-chart-area">
        <div className="no-chart-toolbar">
          <div className="no-menu-wrap">
            <button
              className="no-asset-button"
              type="button"
              onClick={() => setAssetMenuOpen((value) => !value)}
            >
              {selectedAsset.label}
              <span>⌄</span>
            </button>

            {assetMenuOpen && (
              <div className="no-dropdown no-asset-dropdown">
                <div className="no-category-tabs">
                  {(Object.keys(ASSET_GROUPS) as AssetCategory[]).map((category) => (
                    <button
                      key={category}
                      type="button"
                      className={assetCategory === category ? "active" : ""}
                      onClick={() => setAssetCategory(category)}
                    >
                      {category}
                    </button>
                  ))}
                </div>

                <div className="no-asset-list">
                  {ASSET_GROUPS[assetCategory].map((asset) => (
                    <button
                      key={asset.id}
                      type="button"
                      onClick={() => selectAsset(asset)}
                      className={asset.id === selectedAsset.id ? "active" : ""}
                    >
                      <strong>{asset.label}</strong>
                      <small>{asset.fullName}</small>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="no-menu-wrap">
            <button
              className="no-tool-button"
              type="button"
              onClick={() => setTimeframeMenuOpen((value) => !value)}
            >
              📊 {timeframe}
            </button>

            {timeframeMenuOpen && (
              <div className="no-dropdown no-timeframe-dropdown">
                {TIMEFRAMES.map((item) => (
                  <button
                    key={item}
                    type="button"
                    className={timeframe === item ? "active" : ""}
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

          <div className="no-menu-wrap">
            <button
              className="no-tool-button"
              type="button"
              onClick={() => setDrawingMenuOpen((value) => !value)}
            >
              ✎
            </button>

            {drawingMenuOpen && (
              <div className="no-dropdown no-tools-dropdown">
                {DRAWING_TOOLS.map((tool) => (
                  <button
                    key={tool}
                    type="button"
                    className={selectedTool === tool ? "active" : ""}
                    onClick={() => {
                      setSelectedTool(tool);
                      setDrawingMenuOpen(false);
                    }}
                  >
                    {tool}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="no-menu-wrap">
            <button
              className="no-tool-button"
              type="button"
              onClick={() => setIndicatorMenuOpen((value) => !value)}
            >
              ⋯
            </button>

            {indicatorMenuOpen && (
              <div className="no-dropdown no-indicator-dropdown">
                {INDICATORS.map((indicator) => (
                  <button
                    key={indicator}
                    type="button"
                    className={activeIndicators.includes(indicator) ? "active" : ""}
                    onClick={() => toggleIndicator(indicator)}
                  >
                    {indicator}
                  </button>
                ))}
              </div>
            )}
          </div>

          <button
            className="no-tool-button mobile-only"
            type="button"
            onClick={() => setMobileToolMenuOpen((value) => !value)}
          >
            ⚙
          </button>

          <div className="no-chart-types">
            {CHART_TYPES.map((type) => (
              <button
                key={type}
                type="button"
                className={chartType === type ? "active" : ""}
                onClick={() => setChartType(type)}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {mobileToolMenuOpen && (
          <div className="no-mobile-tool-pop">
            <button type="button" onClick={() => setIndicatorMenuOpen(true)}>
              📊 Indicators
            </button>
            <button type="button" onClick={() => setDrawingMenuOpen(true)}>
              ✎ Drawing
            </button>
            <button type="button" onClick={handleFullScreen}>
              ⛶ Full screen
            </button>
          </div>
        )}

        <div className="no-chart-meta">
          <span>{nowLabel} UTC+3</span>
          <span>{selectedAsset.fullName}</span>
          <span>Current price {currentPrice.toFixed(selectedAsset.precision)}</span>
        </div>

        <div className="no-chart-frame">
          <canvas ref={canvasRef} className="no-chart-canvas" />
        </div>

        <div className="no-chart-footer">
          <button type="button">←</button>
          <button type="button">{timeframe} ▴</button>
          <strong>{selectedAsset.fullName}</strong>
        </div>
      </section>

      <aside className="no-trade-panel">
        <div className="no-sentiment">
          <span>50%</span>
          <div>
            <i />
          </div>
          <span>50%</span>
        </div>

        <section className="no-panel-section">
          <h3>
            Time <span>ⓘ</span>
          </h3>

          <div className="no-expiry-display">
            <button type="button" onClick={() => setExpirySeconds((value) => clamp(value - 1, MIN_EXPIRY_SECONDS, MAX_EXPIRY_SECONDS))}>
              -
            </button>
            <strong>{formatDuration(expirySeconds)}</strong>
            <button type="button" onClick={() => setExpirySeconds((value) => clamp(value + 1, MIN_EXPIRY_SECONDS, MAX_EXPIRY_SECONDS))}>
              +
            </button>
          </div>

          <p className="no-minmax">Min 00:00:05 · Max 05:00:00</p>

          <div className="no-time-grid">
            {renderTimeStepper("hours", "Hours", expiryParts.hours)}
            {renderTimeStepper("minutes", "Minutes", expiryParts.minutes)}
            {renderTimeStepper("seconds", "Seconds", expiryParts.seconds)}
          </div>
        </section>

        <section className="no-panel-section">
          <h3>
            Amount <span>ⓘ</span>
          </h3>

          <label className="no-amount-box">
            <input
              value={Number.isFinite(amount) ? amount : 0}
              min={1}
              type="number"
              onChange={(event) => setAmount(Math.max(0, Number(event.target.value)))}
            />
            <span>{currency}</span>
          </label>
        </section>

        <section className="no-payout-box">
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

        {!hasEnoughBalance && (
          <p className="no-warning">Insufficient {accountType === "demo" ? "demo" : "real"} balance.</p>
        )}

        <button
          className="no-trade-btn buy"
          type="button"
          disabled={!canTrade}
          onClick={() => handleTrade("BUY")}
        >
          ↗ BUY
        </button>

        <button className="no-ai-btn" type="button">
          AI TRADING
        </button>

        <button
          className="no-trade-btn sell"
          type="button"
          disabled={!canTrade}
          onClick={() => handleTrade("SELL")}
        >
          ↘ SELL
        </button>
      </aside>

      <aside className="no-quick-rail">
        {QUICK_ITEMS.map((item) => (
          <button
            key={item.label}
            type="button"
            onClick={item.label === "Full Screen" ? handleFullScreen : undefined}
          >
            <span>{item.icon}</span>
            <small>{item.label}</small>
          </button>
        ))}
      </aside>
    </main>
  );
}