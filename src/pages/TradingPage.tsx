import { useEffect, useMemo, useRef, useState } from "react";
import "./TradingPage.css";

type AccountType = "DEMO" | "REAL";

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
  symbol: string;
  name: string;
  category: AssetCategory;
  payout: number;
  basePrice: number;
};

type TradePosition = {
  id: string;
  direction: Direction;
  entryPrice: number;
  stake: number;
  currency: CurrencyCode;
  payoutPercent: number;
  openedAt: number;
  expiresAt: number;
  rateAtOpen: number;
};

type ResultFlash = {
  id: string;
  direction: Direction;
  entryPrice: number;
  won: boolean;
  amount: number;
  currency: CurrencyCode;
};

const DEMO_START_USD = 70000;
const REAL_START_USD = 0;

const RATES: Record<CurrencyCode, number> = {
  USD: 1,
  KES: 129,
  UGX: 3700,
  TZS: 2600,
  NGN: 1500,
  XOF: 610,
  EUR: 0.92,
  CAD: 1.37,
  JPY: 157,
  CNY: 7.25,
  AOA: 920,
  ZAR: 18.2,
  BRL: 5.4,
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

const ASSETS: Asset[] = [
  { symbol: "AUD/CAD OTC", name: "Australian Dollar / Canadian Dollar", category: "Currencies", payout: 92, basePrice: 0.82205 },
  { symbol: "EUR/USD OTC", name: "Euro / US Dollar", category: "Currencies", payout: 91, basePrice: 1.08345 },
  { symbol: "USD/JPY OTC", name: "US Dollar / Japanese Yen", category: "Currencies", payout: 90, basePrice: 157.32 },
  { symbol: "GBP/USD OTC", name: "British Pound / US Dollar", category: "Currencies", payout: 88, basePrice: 1.2712 },
  { symbol: "USD/KES OTC", name: "US Dollar / Kenya Shilling", category: "Currencies", payout: 86, basePrice: 129.45 },

  { symbol: "BTC/USD OTC", name: "Bitcoin / US Dollar", category: "Cryptocurrencies", payout: 82, basePrice: 67240 },
  { symbol: "ETH/USD OTC", name: "Ethereum / US Dollar", category: "Cryptocurrencies", payout: 80, basePrice: 3510 },
  { symbol: "BNB/USD OTC", name: "BNB / US Dollar", category: "Cryptocurrencies", payout: 78, basePrice: 604 },

  { symbol: "AAPL OTC", name: "Apple", category: "Stocks", payout: 84, basePrice: 196.4 },
  { symbol: "TSLA OTC", name: "Tesla", category: "Stocks", payout: 82, basePrice: 178.7 },
  { symbol: "NVDA OTC", name: "NVIDIA", category: "Stocks", payout: 85, basePrice: 125.9 },

  { symbol: "US100 OTC", name: "Nasdaq 100", category: "Indices", payout: 85, basePrice: 19888.46 },
  { symbol: "US30 OTC", name: "Dow Jones", category: "Indices", payout: 84, basePrice: 38640 },
  { symbol: "SPX500 OTC", name: "S&P 500", category: "Indices", payout: 84, basePrice: 5430 },

  { symbol: "XAU/USD OTC", name: "Gold / US Dollar", category: "Commodities", payout: 87, basePrice: 2325 },
  { symbol: "XAG/USD OTC", name: "Silver / US Dollar", category: "Commodities", payout: 82, basePrice: 29.5 },
  { symbol: "USOIL OTC", name: "US Oil", category: "Commodities", payout: 80, basePrice: 78.2 },
];

const INDICATORS = [
  "Moving Average", "EMA", "SMA", "WMA", "Bollinger Bands", "RSI", "MACD",
  "Stochastic", "CCI", "ADX", "ATR", "Alligator", "Fractals", "Ichimoku",
  "Parabolic SAR", "Momentum", "Williams %R", "Zig Zag", "Envelopes",
  "DeMarker", "Aroon", "Awesome Oscillator", "Accelerator Oscillator", "OBV",
  "Volume", "VWAP", "Pivot Points", "Keltner Channel", "Donchian Channel",
  "SuperTrend", "Hull MA", "TEMA", "TRIX", "ROC", "MFI", "DPO", "Elder Ray",
  "Force Index", "Standard Deviation", "Linear Regression", "Price Channel",
  "Fibonacci MA",
];

const DRAWING_TOOLS = [
  "Cursor", "Trend Line", "Horizontal Line", "Vertical Line", "Ray", "Arrow",
  "Rectangle", "Brush", "Text", "Fibonacci", "Parallel Channel", "Price Range",
  "Elliott Wave",
];

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function formatExpiry(totalSeconds: number) {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

function formatMoney(value: number, currency: CurrencyCode) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: currency === "JPY" || currency === "XOF" ? 0 : 2,
  }).format(value);
}

function priceDecimals(price: number) {
  if (price >= 10000) return 2;
  if (price >= 100) return 3;
  return 5;
}

function generateCandles(asset: Asset, count = 86): Candle[] {
  const candles: Candle[] = [];
  let price = asset.basePrice;

  for (let i = 0; i < count; i++) {
    const wave = Math.sin(i / 6) * asset.basePrice * 0.0028;
    const noise = Math.cos(i / 4) * asset.basePrice * 0.0014;
    const open = price;
    const close = open + wave + noise;

    candles.push({
      time: Date.now() - (count - i) * 60000,
      open,
      close,
      high: Math.max(open, close) + asset.basePrice * 0.0018,
      low: Math.min(open, close) - asset.basePrice * 0.0018,
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
      time: candle.time,
      open,
      close,
      high: Math.max(candle.high, open, close),
      low: Math.min(candle.low, open, close),
    });
  });

  return result;
}

function TradingChart({
  candles,
  chartType,
  asset,
  positions,
  flashes,
}: {
  candles: Candle[];
  chartType: ChartType;
  asset: Asset;
  positions: TradePosition[];
  flashes: ResultFlash[];
}) {
  const data = chartType === "Heiken Ashi" ? toHeikenAshi(candles) : candles;

  const width = 1200;
  const height = 720;
  const left = 38;
  const right = 88;
  const top = 28;
  const bottom = 42;

  const chartWidth = width - left - right;
  const chartHeight = height - top - bottom;

  const prices = [
    ...data.flatMap((item) => [item.high, item.low]),
    ...positions.map((item) => item.entryPrice),
    ...flashes.map((item) => item.entryPrice),
  ];

  const min = Math.min(...prices);
  const max = Math.max(...prices);
  const range = max - min || 1;

  const xStep = chartWidth / Math.max(data.length - 1, 1);

  const x = (index: number) => left + index * xStep;
  const y = (price: number) => top + chartHeight - ((price - min) / range) * chartHeight;

  const lastPrice = data[data.length - 1]?.close ?? asset.basePrice;
  const lastY = y(lastPrice);

  const linePath = data
    .map((item, index) => `${index === 0 ? "M" : "L"} ${x(index)} ${y(item.close)}`)
    .join(" ");

  return (
    <svg className="nt-chart-svg" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none">
      <defs>
        <linearGradient id="ntChartBg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#263d68" stopOpacity="0.96" />
          <stop offset="56%" stopColor="#172947" stopOpacity="0.94" />
          <stop offset="100%" stopColor="#0c1528" stopOpacity="0.98" />
        </linearGradient>
      </defs>

      <rect width={width} height={height} fill="url(#ntChartBg)" />

      <path
        d="M0 480 L130 335 L260 455 L390 280 L560 445 L730 255 L900 410 L1065 305 L1200 385 L1200 720 L0 720 Z"
        className="nt-chart-mountain"
      />

      {Array.from({ length: 13 }).map((_, index) => {
        const gx = left + (chartWidth / 12) * index;
        return <line key={`v-${index}`} x1={gx} y1={top} x2={gx} y2={height - bottom} className="nt-grid-line" />;
      })}

      {Array.from({ length: 8 }).map((_, index) => {
        const gy = top + (chartHeight / 7) * index;
        return <line key={`h-${index}`} x1={left} y1={gy} x2={width - right} y2={gy} className="nt-grid-line" />;
      })}

      {chartType === "Line" && <path d={linePath} className="nt-line-chart" />}

      {(chartType === "Candlesticks" || chartType === "Heiken Ashi") &&
        data.map((item, index) => {
          const positive = item.close >= item.open;
          const cx = x(index);
          const openY = y(item.open);
          const closeY = y(item.close);
          const highY = y(item.high);
          const lowY = y(item.low);
          const bodyY = Math.min(openY, closeY);
          const bodyHeight = Math.max(Math.abs(closeY - openY), 3);

          return (
            <g key={item.time}>
              <line x1={cx} x2={cx} y1={highY} y2={lowY} className={positive ? "nt-wick-up" : "nt-wick-down"} />
              <rect
                x={cx - 5}
                y={bodyY}
                width={10}
                height={bodyHeight}
                rx={1}
                className={positive ? "nt-candle-up" : "nt-candle-down"}
              />
            </g>
          );
        })}

      {chartType === "Bars" &&
        data.map((item, index) => {
          const positive = item.close >= item.open;
          const cx = x(index);

          return (
            <g key={item.time}>
              <line x1={cx} x2={cx} y1={y(item.high)} y2={y(item.low)} className={positive ? "nt-wick-up" : "nt-wick-down"} />
              <line x1={cx - 8} x2={cx} y1={y(item.open)} y2={y(item.open)} className={positive ? "nt-wick-up" : "nt-wick-down"} />
              <line x1={cx} x2={cx + 8} y1={y(item.close)} y2={y(item.close)} className={positive ? "nt-wick-up" : "nt-wick-down"} />
            </g>
          );
        })}

      <line x1={left} y1={lastY} x2={width - right} y2={lastY} className="nt-current-price-line" />

      <rect x={width - right + 8} y={lastY - 16} width={74} height={30} rx={7} className="nt-current-price-box" />
      <text x={width - right + 45} y={lastY + 5} textAnchor="middle" className="nt-current-price-text">
        {lastPrice.toFixed(priceDecimals(lastPrice))}
      </text>

      {Array.from({ length: 6 }).map((_, index) => {
        const price = min + (range / 5) * index;
        return (
          <text key={index} x={width - 9} y={y(price) + 5} textAnchor="end" className="nt-axis-price">
            {price.toFixed(priceDecimals(price))}
          </text>
        );
      })}

      <line x1={width - 224} y1={top} x2={width - 224} y2={height - bottom} className="nt-expiry-line" />
      <polygon points={`${width - 224},${top + 8} ${width - 196},${top + 8} ${width - 224},${top + 22}`} className="nt-expiry-flag" />
      <text x={width - 188} y={top + 34} className="nt-expiry-label">
        Expiration time
      </text>

      {positions.map((position) => {
        const py = y(position.entryPrice);

        return (
          <g key={position.id}>
            <line x1={left} x2={width - right} y1={py} y2={py} className="nt-position-line" />
            <rect x={left + 10} y={py - 18} width={190} height={34} rx={8} className={position.direction === "BUY" ? "nt-position-buy" : "nt-position-sell"} />
            <text x={left + 22} y={py + 4} className="nt-position-text">
              {position.direction} {formatMoney(position.stake, position.currency)}
            </text>
          </g>
        );
      })}

      {flashes.map((flash) => {
        const py = y(flash.entryPrice);

        return (
          <g key={flash.id}>
            <rect x={width - right - 245} y={py - 22} width={210} height={40} rx={10} className={flash.won ? "nt-result-win" : "nt-result-loss"} />
            <text x={width - right - 140} y={py + 5} textAnchor="middle" className="nt-result-text">
              ✓ {flash.won ? formatMoney(flash.amount, flash.currency) : formatMoney(0, flash.currency)}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

export default function TradingPage() {
  const screenRef = useRef<HTMLDivElement | null>(null);
  const currentPriceRef = useRef<number>(ASSETS[0].basePrice);

  const [accountType, setAccountType] = useState<AccountType>("DEMO");
  const [currency, setCurrency] = useState<CurrencyCode>("JPY");
  const [demoBalanceUsd, setDemoBalanceUsd] = useState(DEMO_START_USD);
  const [realBalanceUsd] = useState(REAL_START_USD);

  const [asset, setAsset] = useState<Asset>(ASSETS[0]);
  const [category, setCategory] = useState<AssetCategory>("Currencies");
  const [chartType, setChartType] = useState<ChartType>("Candlesticks");

  const [candles, setCandles] = useState<Candle[]>(() => generateCandles(ASSETS[0]));
  const [amount, setAmount] = useState(100);
  const [expirySeconds, setExpirySeconds] = useState(30 * 60);

  const [panel, setPanel] = useState<"assets" | "indicators" | "drawing" | null>(null);
  const [selectedIndicators, setSelectedIndicators] = useState<string[]>([]);
  const [selectedDrawingTool, setSelectedDrawingTool] = useState("Cursor");

  const [positions, setPositions] = useState<TradePosition[]>([]);
  const [flashes, setFlashes] = useState<ResultFlash[]>([]);
  const [notice, setNotice] = useState("");

  const rate = RATES[currency];
  const activeBalanceUsd = accountType === "DEMO" ? demoBalanceUsd : realBalanceUsd;
  const activeBalance = activeBalanceUsd * rate;

  const payoutProfit = amount * (asset.payout / 100);
  const totalReturn = amount + payoutProfit;

  const filteredAssets = useMemo(
    () => ASSETS.filter((item) => item.category === category),
    [category]
  );

  useEffect(() => {
    currentPriceRef.current = asset.basePrice;
    setCandles(generateCandles(asset));
  }, [asset]);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setCandles((current) => {
        const next = [...current];
        const last = next[next.length - 1];

        const movement =
          Math.sin(Date.now() / 650) * asset.basePrice * 0.00045 +
          Math.cos(Date.now() / 920) * asset.basePrice * 0.00035;

        const close = last.close + movement;
        currentPriceRef.current = close;

        next[next.length - 1] = {
          ...last,
          close,
          high: Math.max(last.high, close),
          low: Math.min(last.low, close),
        };

        if (Date.now() - last.time > 2500) {
          return [
            ...next.slice(1),
            {
              time: Date.now(),
              open: close,
              close,
              high: close + asset.basePrice * 0.0015,
              low: close - asset.basePrice * 0.0015,
            },
          ];
        }

        return next;
      });
    }, 420);

    return () => window.clearInterval(timer);
  }, [asset]);

  useEffect(() => {
    const timer = window.setInterval(() => {
      const now = Date.now();
      const due = positions.filter((position) => position.expiresAt <= now);

      if (due.length === 0) return;

      due.forEach((position) => {
        const exitPrice = currentPriceRef.current;
        const won =
          position.direction === "BUY"
            ? exitPrice > position.entryPrice
            : exitPrice < position.entryPrice;

        const payoutAmount = won
          ? position.stake + position.stake * (position.payoutPercent / 100)
          : 0;

        if (won && accountType === "DEMO") {
          setDemoBalanceUsd((current) => current + payoutAmount / position.rateAtOpen);
        }

        const flash: ResultFlash = {
          id: crypto.randomUUID(),
          direction: position.direction,
          entryPrice: position.entryPrice,
          won,
          amount: payoutAmount,
          currency: position.currency,
        };

        setFlashes((current) => [...current, flash]);

        window.setTimeout(() => {
          setFlashes((current) => current.filter((item) => item.id !== flash.id));
        }, 10000);
      });

      setPositions((current) => current.filter((position) => position.expiresAt > now));
    }, 300);

    return () => window.clearInterval(timer);
  }, [positions, accountType]);

  function updateExpiry(delta: number) {
    setExpirySeconds((current) => clamp(current + delta, 5, 18000));
  }

  function toggleIndicator(indicator: string) {
    setSelectedIndicators((current) =>
      current.includes(indicator)
        ? current.filter((item) => item !== indicator)
        : [...current, indicator]
    );
  }

  async function toggleFullScreen() {
    if (!document.fullscreenElement) {
      await screenRef.current?.requestFullscreen();
    } else {
      await document.exitFullscreen();
    }
  }

  function placeTrade(direction: Direction) {
    const stake = Number(amount);

    if (!Number.isFinite(stake) || stake <= 0) {
      setNotice("Enter a valid trade amount.");
      return;
    }

    const stakeUsd = stake / rate;

    if (stakeUsd > activeBalanceUsd) {
      setNotice("Insufficient account balance.");
      return;
    }

    if (accountType === "REAL" && realBalanceUsd <= 0) {
      setNotice("Real account balance is 0. Use Demo or Top Up.");
      return;
    }

    if (accountType === "DEMO") {
      setDemoBalanceUsd((current) => current - stakeUsd);
    }

    const entryPrice = currentPriceRef.current;

    const position: TradePosition = {
      id: crypto.randomUUID(),
      direction,
      entryPrice,
      stake,
      currency,
      payoutPercent: asset.payout,
      openedAt: Date.now(),
      expiresAt: Date.now() + expirySeconds * 1000,
      rateAtOpen: rate,
    };

    setPositions((current) => [...current, position]);
    setNotice(`${direction} trade opened at ${entryPrice.toFixed(priceDecimals(entryPrice))}`);
  }

  return (
    <div className="nt-screen" ref={screenRef}>
      <aside className="nt-leftbar">
        <div className="nt-app-icon">
          <span />
          <span />
        </div>

        <button className="active">📈<small>Trading</small></button>
        <button>💲<small>Finance</small></button>
        <button>👤<small>Profile</small></button>
        <button>🛒<small>Market</small></button>
        <button>💎<small>Achievements</small></button>
        <button>🏆<small>Tournaments</small></button>
        <button>💬<small>Chat</small></button>
        <button>❔<small>Help</small></button>

        <div className="nt-promo">PROMO</div>
        <button>🤖<small>Autotrading</small></button>
      </aside>

      <main className="nt-main">
        <header className="nt-topbar">
          <div className="nt-brand">
            <div className="nt-brand-icon">
              <span />
              <span />
            </div>
            <strong>NeuroOption</strong>
            <button className="nt-star">★</button>
          </div>

          <div className="nt-account">
            <select value={accountType} onChange={(event) => setAccountType(event.target.value as AccountType)}>
              <option value="DEMO">QT Demo</option>
              <option value="REAL">QT Real</option>
            </select>

            <select value={currency} onChange={(event) => setCurrency(event.target.value as CurrencyCode)}>
              {CURRENCIES.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>

            <strong>{formatMoney(activeBalance, currency)}</strong>
            <button className="nt-topup">TOP UP</button>
            <button className="nt-fullscreen" onClick={toggleFullScreen}>⛶</button>
            <div className="nt-avatar">SM</div>
          </div>
        </header>

        <section className="nt-terminal">
          <section className="nt-chart-area">
            <div className="nt-toolbar">
              <button className="nt-asset-button" onClick={() => setPanel(panel === "assets" ? null : "assets")}>
                {asset.symbol} ▾
              </button>

              <button onClick={() => setPanel(panel === "indicators" ? null : "indicators")}>📊 M1</button>
              <button onClick={() => setPanel(panel === "drawing" ? null : "drawing")}>✎</button>
              <button>•••</button>
              <button>▦</button>

              <div className="nt-chart-switches">
                {(["Candlesticks", "Heiken Ashi", "Bars", "Line"] as ChartType[]).map((item) => (
                  <button
                    key={item}
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
              <button>⚙</button>
              {selectedIndicators.length > 0 && (
                <strong>{selectedIndicators.length} indicators active</strong>
              )}
              <strong>Tool: {selectedDrawingTool}</strong>
            </div>

            {notice && (
              <div className="nt-notice">
                {notice}
                <button onClick={() => setNotice("")}>×</button>
              </div>
            )}

            {panel === "assets" && (
              <div className="nt-popover nt-assets-panel">
                <div className="nt-tabs">
                  {(["Currencies", "Cryptocurrencies", "Stocks", "Indices", "Commodities"] as AssetCategory[]).map((item) => (
                    <button
                      key={item}
                      className={category === item ? "active" : ""}
                      onClick={() => setCategory(item)}
                    >
                      {item}
                    </button>
                  ))}
                </div>

                <div className="nt-assets-list">
                  {filteredAssets.map((item) => (
                    <button
                      key={item.symbol}
                      className={asset.symbol === item.symbol ? "active" : ""}
                      onClick={() => {
                        setAsset(item);
                        setPanel(null);
                      }}
                    >
                      <span>{item.symbol}</span>
                      <small>+{item.payout}%</small>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {panel === "indicators" && (
              <div className="nt-popover">
                <h3>42 Indicators</h3>
                <div className="nt-tool-grid">
                  {INDICATORS.map((item) => (
                    <button
                      key={item}
                      className={selectedIndicators.includes(item) ? "active" : ""}
                      onClick={() => toggleIndicator(item)}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {panel === "drawing" && (
              <div className="nt-popover">
                <h3>Drawing Tools</h3>
                <div className="nt-tool-grid">
                  {DRAWING_TOOLS.map((item) => (
                    <button
                      key={item}
                      className={selectedDrawingTool === item ? "active" : ""}
                      onClick={() => {
                        setSelectedDrawingTool(item);
                        setPanel(null);
                      }}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="nt-chart-wrap">
              <TradingChart
                candles={candles}
                chartType={chartType}
                asset={asset}
                positions={positions}
                flashes={flashes}
              />
            </div>

            <div className="nt-chart-footer">
              <button>←</button>
              <button>H3 ▴</button>
              <span>{asset.name}</span>
            </div>
          </section>

          <aside className="nt-trade-panel">
            <div className="nt-meter">
              <span>50%</span>
              <div>
                <i style={{ height: `${asset.payout}%` }} />
              </div>
              <span>0%</span>
            </div>

            <div className="nt-trade-box">
              <label>Time ⓘ</label>
              <div className="nt-expiry-control">
                <button onClick={() => updateExpiry(-1)}>-</button>
                <strong>{formatExpiry(expirySeconds)}</strong>
                <button onClick={() => updateExpiry(1)}>+</button>
              </div>

              <small className="nt-expiry-range">Min 00:00:05 · Max 05:00:00</small>

              <label>Amount ⓘ</label>
              <div className="nt-amount-box">
                <input
                  type="number"
                  min={1}
                  value={amount}
                  onChange={(event) => setAmount(Math.max(1, Number(event.target.value) || 1))}
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
                  <strong>{formatMoney(payoutProfit, currency)}</strong>
                </div>
                <div>
                  <span>Expected return</span>
                  <strong>{formatMoney(totalReturn, currency)}</strong>
                </div>
              </div>

              <button className="nt-buy" onClick={() => placeTrade("BUY")}>↗ BUY</button>
              <button className="nt-ai"><b>AI</b> TRADING</button>
              <button className="nt-sell" onClick={() => placeTrade("SELL")}>↘ SELL</button>
            </div>
          </aside>

          <aside className="nt-rightbar">
            <button>↻<small>Trades</small></button>
            <button>📡<small>Signals</small></button>
            <button>👥<small>Social</small></button>
            <button>◎<small>Express</small></button>
            <button>⌛<small>Pending</small></button>
            <button>⌨<small>Hotkeys</small></button>
            <button onClick={toggleFullScreen}>⛶<small>Full screen</small></button>
          </aside>
        </section>
      </main>
    </div>
  );
}