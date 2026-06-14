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

const DEMO_USD_BALANCE = 70000;
const REAL_USD_BALANCE = 0;

const FALLBACK_RATES: Record<CurrencyCode, number> = {
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
  { symbol: "EUR/USD OTC", name: "Euro / US Dollar", category: "Currencies", payout: 91, basePrice: 1.08215 },
  { symbol: "USD/JPY OTC", name: "US Dollar / Japanese Yen", category: "Currencies", payout: 90, basePrice: 157.42 },
  { symbol: "GBP/USD OTC", name: "British Pound / US Dollar", category: "Currencies", payout: 88, basePrice: 1.2718 },
  { symbol: "USD/KES OTC", name: "US Dollar / Kenya Shilling", category: "Currencies", payout: 86, basePrice: 129.4 },

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
  "Alligator",
  "Fractals",
  "Ichimoku",
  "Parabolic SAR",
  "Momentum",
  "Williams %R",
  "Zig Zag",
  "Envelopes",
  "DeMarker",
  "Aroon",
  "Awesome Oscillator",
  "Accelerator Oscillator",
  "OBV",
  "Volume",
  "VWAP",
  "Pivot Points",
  "Keltner Channel",
  "Donchian Channel",
  "SuperTrend",
  "Hull MA",
  "TEMA",
  "TRIX",
  "ROC",
  "MFI",
  "DPO",
  "Elder Ray",
  "Force Index",
  "Standard Deviation",
  "Linear Regression",
  "Price Channel",
  "Fibonacci MA",
];

const DRAWING_TOOLS = [
  "Cursor",
  "Trend Line",
  "Horizontal Line",
  "Vertical Line",
  "Ray",
  "Arrow",
  "Rectangle",
  "Brush",
  "Text",
  "Fibonacci",
  "Parallel Channel",
  "Price Range",
  "Elliott Wave",
];

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function formatExpiry(seconds: number) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;

  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

function formatMoney(value: number, currency: CurrencyCode) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: currency === "JPY" || currency === "XOF" ? 0 : 2,
  }).format(value);
}

function decimals(price: number) {
  if (price >= 10000) return 2;
  if (price >= 100) return 3;
  return 5;
}

function generateCandles(asset: Asset, count = 92): Candle[] {
  const candles: Candle[] = [];
  let price = asset.basePrice;

  for (let i = 0; i < count; i++) {
    const wave = Math.sin(i / 5) * asset.basePrice * 0.0025;
    const pulse = Math.cos(i / 3) * asset.basePrice * 0.0013;
    const open = price;
    const close = open + wave + pulse;

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

function heikenAshi(candles: Candle[]) {
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
}: {
  candles: Candle[];
  chartType: ChartType;
  asset: Asset;
}) {
  const data = chartType === "Heiken Ashi" ? heikenAshi(candles) : candles;

  const width = 1200;
  const height = 720;
  const left = 42;
  const right = 86;
  const top = 32;
  const bottom = 42;

  const chartWidth = width - left - right;
  const chartHeight = height - top - bottom;

  const allPrices = data.flatMap((c) => [c.high, c.low]);
  const min = Math.min(...allPrices);
  const max = Math.max(...allPrices);
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
        <linearGradient id="ntBg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#233a66" stopOpacity="0.96" />
          <stop offset="55%" stopColor="#172844" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#0b1224" stopOpacity="0.98" />
        </linearGradient>
      </defs>

      <rect width={width} height={height} fill="url(#ntBg)" />

      <path
        d="M0 460 L120 320 L245 405 L380 255 L520 420 L700 230 L890 390 L1050 270 L1200 380 L1200 720 L0 720 Z"
        className="nt-mountain"
      />

      {Array.from({ length: 12 }).map((_, i) => {
        const gx = left + (chartWidth / 11) * i;
        return <line key={`v-${i}`} x1={gx} y1={top} x2={gx} y2={height - bottom} className="nt-grid" />;
      })}

      {Array.from({ length: 8 }).map((_, i) => {
        const gy = top + (chartHeight / 7) * i;
        return <line key={`h-${i}`} x1={left} y1={gy} x2={width - right} y2={gy} className="nt-grid" />;
      })}

      <line x1={left} y1={lastY} x2={width - right} y2={lastY} className="nt-price-line" />

      <rect x={width - right + 8} y={lastY - 16} width={72} height={30} rx={7} className="nt-price-label" />
      <text x={width - right + 44} y={lastY + 4} textAnchor="middle" className="nt-price-label-text">
        {lastPrice.toFixed(decimals(lastPrice))}
      </text>

      {Array.from({ length: 5 }).map((_, i) => {
        const price = min + (range / 4) * i;
        return (
          <text key={i} x={width - 12} y={y(price) + 5} textAnchor="end" className="nt-axis-text">
            {price.toFixed(decimals(price))}
          </text>
        );
      })}

      {chartType === "Line" && <path d={linePath} className="nt-line-chart" />}

      {(chartType === "Candlesticks" || chartType === "Heiken Ashi") &&
        data.map((item, index) => {
          const up = item.close >= item.open;
          const cx = x(index);
          const openY = y(item.open);
          const closeY = y(item.close);
          const highY = y(item.high);
          const lowY = y(item.low);
          const bodyTop = Math.min(openY, closeY);
          const bodyHeight = Math.max(Math.abs(closeY - openY), 3);

          return (
            <g key={item.time}>
              <line x1={cx} x2={cx} y1={highY} y2={lowY} className={up ? "nt-wick-up" : "nt-wick-down"} />
              <rect
                x={cx - 5}
                y={bodyTop}
                width={10}
                height={bodyHeight}
                rx={1}
                className={up ? "nt-candle-up" : "nt-candle-down"}
              />
            </g>
          );
        })}

      {chartType === "Bars" &&
        data.map((item, index) => {
          const up = item.close >= item.open;
          const cx = x(index);

          return (
            <g key={item.time}>
              <line x1={cx} x2={cx} y1={y(item.high)} y2={y(item.low)} className={up ? "nt-wick-up" : "nt-wick-down"} />
              <line x1={cx - 8} x2={cx} y1={y(item.open)} y2={y(item.open)} className={up ? "nt-wick-up" : "nt-wick-down"} />
              <line x1={cx} x2={cx + 8} y1={y(item.close)} y2={y(item.close)} className={up ? "nt-wick-up" : "nt-wick-down"} />
            </g>
          );
        })}

      <line x1={width - 210} y1={top} x2={width - 210} y2={height - bottom} className="nt-expiry-line" />
      <polygon points={`${width - 210},${top + 8} ${width - 184},${top + 8} ${width - 210},${top + 21}`} className="nt-expiry-flag" />
      <text x={width - 178} y={top + 34} className="nt-expiry-text">
        Expiration time
      </text>
    </svg>
  );
}

export default function TradingPage() {
  const screenRef = useRef<HTMLDivElement | null>(null);

  const [accountType, setAccountType] = useState<AccountType>("REAL");
  const [currency, setCurrency] = useState<CurrencyCode>("KES");
  const [rates, setRates] = useState<Record<CurrencyCode, number>>(FALLBACK_RATES);

  const [asset, setAsset] = useState<Asset>(ASSETS[0]);
  const [category, setCategory] = useState<AssetCategory>("Currencies");
  const [chartType, setChartType] = useState<ChartType>("Candlesticks");

  const [candles, setCandles] = useState<Candle[]>(() => generateCandles(ASSETS[0]));
  const [amount, setAmount] = useState(100);
  const [expirySeconds, setExpirySeconds] = useState(30 * 60);

  const [panel, setPanel] = useState<"assets" | "indicators" | "drawing" | null>(null);
  const [selectedIndicators, setSelectedIndicators] = useState<string[]>([]);
  const [selectedDrawingTool, setSelectedDrawingTool] = useState("Cursor");

  useEffect(() => {
    fetch("https://open.er-api.com/v6/latest/USD")
      .then((res) => res.json())
      .then((data) => {
        const next = { ...FALLBACK_RATES };

        CURRENCIES.forEach((code) => {
          if (typeof data?.rates?.[code] === "number") {
            next[code] = data.rates[code];
          }
        });

        setRates(next);
      })
      .catch(() => setRates(FALLBACK_RATES));
  }, []);

  useEffect(() => {
    setCandles(generateCandles(asset));
  }, [asset]);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setCandles((old) => {
        const copy = [...old];
        const last = copy[copy.length - 1];

        const movement =
          Math.sin(Date.now() / 620) * asset.basePrice * 0.0005 +
          Math.cos(Date.now() / 880) * asset.basePrice * 0.00035;

        const close = last.close + movement;

        copy[copy.length - 1] = {
          ...last,
          close,
          high: Math.max(last.high, close),
          low: Math.min(last.low, close),
        };

        if (Date.now() - last.time > 2500) {
          return [
            ...copy.slice(1),
            {
              time: Date.now(),
              open: close,
              close,
              high: close + asset.basePrice * 0.0015,
              low: close - asset.basePrice * 0.0015,
            },
          ];
        }

        return copy;
      });
    }, 450);

    return () => window.clearInterval(timer);
  }, [asset]);

  const accountUsdBalance = accountType === "DEMO" ? DEMO_USD_BALANCE : REAL_USD_BALANCE;
  const convertedBalance = accountUsdBalance * rates[currency];
  const expectedProfit = amount * (asset.payout / 100) * rates[currency];
  const filteredAssets = useMemo(() => ASSETS.filter((item) => item.category === category), [category]);

  function changeExpiry(delta: number) {
    setExpirySeconds((current) => clamp(current + delta, 5, 18000));
  }

  function toggleIndicator(name: string) {
    setSelectedIndicators((current) =>
      current.includes(name) ? current.filter((item) => item !== name) : [...current, name]
    );
  }

  async function toggleFullScreen() {
    if (!document.fullscreenElement) {
      await screenRef.current?.requestFullscreen();
    } else {
      await document.exitFullscreen();
    }
  }

  return (
    <div className="nt-screen" ref={screenRef}>
      <aside className="nt-leftbar">
        <div className="nt-logo">
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
            <div className="nt-brand-logo">
              <span />
              <span />
            </div>
            <strong>NeuroOption</strong>
            <button>★</button>
          </div>

          <div className="nt-account">
            <select value={accountType} onChange={(e) => setAccountType(e.target.value as AccountType)}>
              <option value="REAL">QT Real</option>
              <option value="DEMO">QT Demo</option>
            </select>

            <select value={currency} onChange={(e) => setCurrency(e.target.value as CurrencyCode)}>
              {CURRENCIES.map((item) => (
                <option value={item} key={item}>
                  {item}
                </option>
              ))}
            </select>

            <strong>{formatMoney(convertedBalance, currency)}</strong>
            <button className="nt-topup">TOP UP</button>
            <button className="nt-fullscreen" onClick={toggleFullScreen}>⛶</button>
            <div className="nt-avatar">SM</div>
          </div>
        </header>

        <section className="nt-terminal">
          <section className="nt-chart-section">
            <div className="nt-toolbar">
              <button className="nt-asset-btn" onClick={() => setPanel(panel === "assets" ? null : "assets")}>
                {asset.symbol} ▾
              </button>

              <button onClick={() => setPanel(panel === "indicators" ? null : "indicators")}>📊 M1</button>
              <button onClick={() => setPanel(panel === "drawing" ? null : "drawing")}>✎</button>
              <button>•••</button>
              <button>▦</button>

              <div className="nt-chart-types">
                {(["Candlesticks", "Heiken Ashi", "Bars", "Line"] as ChartType[]).map((type) => (
                  <button
                    key={type}
                    className={chartType === type ? "active" : ""}
                    onClick={() => setChartType(type)}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            <div className="nt-clock-row">
              <span>{new Date().toLocaleTimeString()} UTC+3</span>
              <button>⚙</button>
            </div>

            {panel === "assets" && (
              <div className="nt-popover nt-assets-popover">
                <div className="nt-tabs">
                  {(["Currencies", "Cryptocurrencies", "Stocks", "Indices", "Commodities"] as AssetCategory[]).map((item) => (
                    <button key={item} className={category === item ? "active" : ""} onClick={() => setCategory(item)}>
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
                      onClick={() => setSelectedDrawingTool(item)}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="nt-chart-holder">
              <TradingChart candles={candles} chartType={chartType} asset={asset} />
            </div>

            <div className="nt-bottom-row">
              <button>←</button>
              <button>H3 ▴</button>
              <span>{asset.name}</span>
            </div>
          </section>

          <aside className="nt-trade-panel">
            <div className="nt-meter">
              <span>50%</span>
              <div><i style={{ height: `${asset.payout}%` }} /></div>
              <span>0%</span>
            </div>

            <div className="nt-trade-controls">
              <label>Time ⓘ</label>
              <div className="nt-expiry">
                <button onClick={() => changeExpiry(-1)}>-</button>
                <strong>{formatExpiry(expirySeconds)}</strong>
                <button onClick={() => changeExpiry(1)}>+</button>
              </div>

              <label>Amount ⓘ</label>
              <div className="nt-amount">
                <input
                  type="number"
                  min={1}
                  value={amount}
                  onChange={(e) => setAmount(Math.max(1, Number(e.target.value) || 1))}
                />
                <span>{currency}</span>
              </div>

              <label>Payout ⓘ</label>
              <div className="nt-profit">
                <strong>+{asset.payout}%</strong>
                <strong>+{formatMoney(expectedProfit, currency)}</strong>
              </div>

              <button className="nt-buy">↗ BUY</button>
              <button className="nt-ai"><b>AI</b> TRADING</button>
              <button className="nt-sell">↘ SELL</button>
            </div>
          </aside>

          <aside className="nt-rightbar">
            <button>↻<small>Trades</small></button>
            <button>📡<small>Signals</small></button>
            <button>👥<small>Social Trading</small></button>
            <button>◎<small>Express Trades</small></button>
            <button>⌛<small>Pending Trades</small></button>
            <button>⌨<small>Hotkeys</small></button>
            <button onClick={toggleFullScreen}>⛶<small>Full screen</small></button>
          </aside>
        </section>
      </main>
    </div>
  );
}