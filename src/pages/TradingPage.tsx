import { useEffect, useMemo, useRef, useState } from "react";
import "./TradingPage.css";

type AccountType = "DEMO" | "REAL";
type AssetCategory =
  | "Currencies"
  | "Cryptocurrencies"
  | "Stocks"
  | "Indices"
  | "Commodities";
type ChartType = "Candlesticks" | "Heiken Ashi" | "Bars" | "Line";
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

const FALLBACK_RATES: Record<CurrencyCode, number> = {
  USD: 1,
  KES: 129,
  UGX: 3700,
  TZS: 2550,
  NGN: 1500,
  XOF: 605,
  EUR: 0.92,
  CAD: 1.36,
  JPY: 157,
  CNY: 7.25,
  AOA: 910,
  ZAR: 18.1,
  BRL: 5.45,
};

const ASSETS: Asset[] = [
  { symbol: "AUD/CAD OTC", name: "Australian Dollar / Canadian Dollar", category: "Currencies", payout: 92, basePrice: 0.82776 },
  { symbol: "EUR/USD OTC", name: "Euro / US Dollar", category: "Currencies", payout: 90, basePrice: 1.0821 },
  { symbol: "GBP/USD OTC", name: "Pound / US Dollar", category: "Currencies", payout: 88, basePrice: 1.2718 },
  { symbol: "USD/JPY OTC", name: "US Dollar / Japanese Yen", category: "Currencies", payout: 89, basePrice: 157.42 },
  { symbol: "USD/KES OTC", name: "US Dollar / Kenya Shilling", category: "Currencies", payout: 85, basePrice: 129.52 },

  { symbol: "BTC/USD OTC", name: "Bitcoin", category: "Cryptocurrencies", payout: 80, basePrice: 67240 },
  { symbol: "ETH/USD OTC", name: "Ethereum", category: "Cryptocurrencies", payout: 78, basePrice: 3510 },
  { symbol: "BNB/USD OTC", name: "BNB", category: "Cryptocurrencies", payout: 76, basePrice: 604 },
  { symbol: "SOL/USD OTC", name: "Solana", category: "Cryptocurrencies", payout: 74, basePrice: 148 },

  { symbol: "AAPL OTC", name: "Apple", category: "Stocks", payout: 82, basePrice: 196.4 },
  { symbol: "TSLA OTC", name: "Tesla", category: "Stocks", payout: 80, basePrice: 178.7 },
  { symbol: "MSFT OTC", name: "Microsoft", category: "Stocks", payout: 81, basePrice: 424.2 },
  { symbol: "NVDA OTC", name: "NVIDIA", category: "Stocks", payout: 83, basePrice: 125.9 },

  { symbol: "US100 OTC", name: "Nasdaq 100", category: "Indices", payout: 85, basePrice: 19888.46 },
  { symbol: "US30 OTC", name: "Dow Jones", category: "Indices", payout: 84, basePrice: 38640 },
  { symbol: "SPX500 OTC", name: "S&P 500", category: "Indices", payout: 84, basePrice: 5430 },
  { symbol: "GER40 OTC", name: "Germany 40", category: "Indices", payout: 82, basePrice: 18420 },

  { symbol: "XAU/USD OTC", name: "Gold", category: "Commodities", payout: 87, basePrice: 2325 },
  { symbol: "XAG/USD OTC", name: "Silver", category: "Commodities", payout: 82, basePrice: 29.5 },
  { symbol: "USOIL OTC", name: "US Oil", category: "Commodities", payout: 80, basePrice: 78.2 },
  { symbol: "BRENT OTC", name: "Brent Oil", category: "Commodities", payout: 79, basePrice: 82.1 },
];

const TIMEFRAMES = ["S5", "S10", "S15", "S30", "M1", "M2", "M3", "M5", "M10", "M15", "M30", "H1", "H4", "D1"];

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

function decimalPlaces(price: number) {
  if (price >= 10000) return 2;
  if (price >= 100) return 3;
  if (price >= 1) return 5;
  return 6;
}

function formatMoney(value: number, currency: CurrencyCode) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: currency === "JPY" || currency === "XOF" ? 0 : 2,
  }).format(value);
}

function createCandles(asset: Asset, count = 60): Candle[] {
  const candles: Candle[] = [];
  let price = asset.basePrice;

  for (let i = 0; i < count; i++) {
    const wave = Math.sin(i / 3.8) * asset.basePrice * 0.0022;
    const noise = Math.cos(i / 4.9) * asset.basePrice * 0.0014;
    const open = price;
    const close = price + wave + noise;
    const high = Math.max(open, close) + asset.basePrice * 0.0018;
    const low = Math.min(open, close) - asset.basePrice * 0.0018;

    candles.push({
      time: Date.now() - (count - i) * 60000,
      open,
      high,
      low,
      close,
    });

    price = close;
  }

  return candles;
}

function toHeikenAshi(candles: Candle[]): Candle[] {
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
      high: Math.max(candle.high, open, close),
      low: Math.min(candle.low, open, close),
      close,
    });
  });

  return result;
}

function ChartSvg({
  candles,
  chartType,
  asset,
}: {
  candles: Candle[];
  chartType: ChartType;
  asset: Asset;
}) {
  const source = chartType === "Heiken Ashi" ? toHeikenAshi(candles) : candles;
  const width = 980;
  const height = 560;
  const padding = 38;

  const prices = source.flatMap((c) => [c.high, c.low]);
  const min = Math.min(...prices);
  const max = Math.max(...prices);
  const range = max - min || 1;

  const xStep = (width - padding * 2) / Math.max(source.length - 1, 1);
  const yFor = (price: number) =>
    height - padding - ((price - min) / range) * (height - padding * 2);

  const linePath = source
    .map((candle, index) => `${index === 0 ? "M" : "L"} ${padding + index * xStep} ${yFor(candle.close)}`)
    .join(" ");

  const lastPrice = source[source.length - 1]?.close ?? asset.basePrice;
  const lastY = yFor(lastPrice);

  return (
    <svg className="po-chart-svg" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none">
      <defs>
        <linearGradient id="poBg" x1="0" x2="1">
          <stop offset="0%" stopColor="#132448" />
          <stop offset="100%" stopColor="#091225" />
        </linearGradient>
      </defs>

      <rect x="0" y="0" width={width} height={height} fill="url(#poBg)" />

      {Array.from({ length: 11 }).map((_, i) => (
        <line
          key={`v-${i}`}
          x1={padding + i * ((width - padding * 2) / 10)}
          y1={padding}
          x2={padding + i * ((width - padding * 2) / 10)}
          y2={height - padding}
          className="po-grid-line"
        />
      ))}

      {Array.from({ length: 9 }).map((_, i) => (
        <line
          key={`h-${i}`}
          x1={padding}
          y1={padding + i * ((height - padding * 2) / 8)}
          x2={width - padding}
          y2={padding + i * ((height - padding * 2) / 8)}
          className="po-grid-line"
        />
      ))}

      <line x1={padding} y1={lastY} x2={width - padding} y2={lastY} className="po-current-line" />
      <text x={width - padding - 4} y={lastY - 8} textAnchor="end" className="po-current-price">
        {lastPrice.toFixed(decimalPlaces(lastPrice))}
      </text>

      {chartType === "Line" && <path d={linePath} className="po-line-path" />}

      {(chartType === "Candlesticks" || chartType === "Heiken Ashi") &&
        source.map((candle, index) => {
          const x = padding + index * xStep;
          const openY = yFor(candle.open);
          const closeY = yFor(candle.close);
          const highY = yFor(candle.high);
          const lowY = yFor(candle.low);
          const bullish = candle.close >= candle.open;
          const bodyTop = Math.min(openY, closeY);
          const bodyHeight = Math.max(Math.abs(closeY - openY), 2);

          return (
            <g key={`${candle.time}-${index}`}>
              <line
                x1={x}
                y1={highY}
                x2={x}
                y2={lowY}
                className={bullish ? "po-wick-up" : "po-wick-down"}
              />
              <rect
                x={x - 4}
                y={bodyTop}
                width={8}
                height={bodyHeight}
                rx={1.6}
                className={bullish ? "po-candle-up" : "po-candle-down"}
              />
            </g>
          );
        })}

      {chartType === "Bars" &&
        source.map((candle, index) => {
          const x = padding + index * xStep;
          const openY = yFor(candle.open);
          const closeY = yFor(candle.close);
          const highY = yFor(candle.high);
          const lowY = yFor(candle.low);
          const bullish = candle.close >= candle.open;

          return (
            <g key={`${candle.time}-${index}`}>
              <line x1={x} y1={highY} x2={x} y2={lowY} className={bullish ? "po-wick-up" : "po-wick-down"} />
              <line x1={x - 6} y1={openY} x2={x} y2={openY} className={bullish ? "po-wick-up" : "po-wick-down"} />
              <line x1={x} y1={closeY} x2={x + 6} y2={closeY} className={bullish ? "po-wick-up" : "po-wick-down"} />
            </g>
          );
        })}
    </svg>
  );
}

export default function TradingPage() {
  const terminalRef = useRef<HTMLDivElement | null>(null);
  const feedTimerRef = useRef<number | null>(null);

  const [accountType, setAccountType] = useState<AccountType>("REAL");
  const [currency, setCurrency] = useState<CurrencyCode>("KES");
  const [rates, setRates] = useState<Record<CurrencyCode, number>>(FALLBACK_RATES);

  const [category, setCategory] = useState<AssetCategory>("Currencies");
  const [selectedAsset, setSelectedAsset] = useState<Asset>(ASSETS[0]);
  const [chartType, setChartType] = useState<ChartType>("Candlesticks");
  const [timeframe, setTimeframe] = useState("M1");
  const [amount, setAmount] = useState<number>(100);
  const [expirySeconds, setExpirySeconds] = useState<number>(30 * 60);
  const [candles, setCandles] = useState<Candle[]>(() => createCandles(ASSETS[0]));
  const [selectedIndicators, setSelectedIndicators] = useState<string[]>([]);
  const [selectedDrawing, setSelectedDrawing] = useState("Trend Line");
  const [showIndicators, setShowIndicators] = useState(false);
  const [showDrawing, setShowDrawing] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [ticketMessage, setTicketMessage] = useState("");

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
      .catch(() => {
        setRates(FALLBACK_RATES);
      });
  }, []);

  useEffect(() => {
    setCandles(createCandles(selectedAsset));
  }, [selectedAsset, timeframe]);

  useEffect(() => {
    if (feedTimerRef.current) {
      window.clearInterval(feedTimerRef.current);
    }

    feedTimerRef.current = window.setInterval(() => {
      setCandles((prev) => {
        const copy = [...prev];
        const last = copy[copy.length - 1];
        const drift = Math.sin(Date.now() / 900) * selectedAsset.basePrice * 0.0008;
        const noise = Math.cos(Date.now() / 700) * selectedAsset.basePrice * 0.00055;
        const nextClose = last.close + drift + noise;

        copy[copy.length - 1] = {
          ...last,
          close: nextClose,
          high: Math.max(last.high, nextClose),
          low: Math.min(last.low, nextClose),
        };

        if (Math.random() > 0.75) {
          const newCandle: Candle = {
            time: Date.now(),
            open: nextClose,
            high: nextClose + selectedAsset.basePrice * 0.0016,
            low: nextClose - selectedAsset.basePrice * 0.0016,
            close: nextClose,
          };

          return [...copy.slice(1), newCandle];
        }

        return copy;
      });
    }, 850);

    return () => {
      if (feedTimerRef.current) {
        window.clearInterval(feedTimerRef.current);
      }
    };
  }, [selectedAsset, timeframe]);

  useEffect(() => {
    const onFullscreenChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };

    document.addEventListener("fullscreenchange", onFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", onFullscreenChange);
    };
  }, []);

  const filteredAssets = useMemo(
    () => ASSETS.filter((asset) => asset.category === category),
    [category]
  );

  const usdBalance = accountType === "DEMO" ? DEMO_USD_BALANCE : REAL_USD_BALANCE;
  const convertedBalance = usdBalance * rates[currency];
  const currentPrice = candles[candles.length - 1]?.close ?? selectedAsset.basePrice;
  const expectedProfit = amount * (selectedAsset.payout / 100);

  function changeExpiry(delta: number) {
    setExpirySeconds((current) => clamp(current + delta, 5, 18000));
  }

  function toggleIndicator(name: string) {
    setSelectedIndicators((current) =>
      current.includes(name)
        ? current.filter((item) => item !== name)
        : [...current, name]
    );
  }

  async function toggleFullscreenMode() {
    try {
      if (!document.fullscreenElement) {
        await terminalRef.current?.requestFullscreen();
      } else {
        await document.exitFullscreen();
      }
    } catch (error) {
      console.error("Fullscreen failed", error);
    }
  }

  function prepareOrder(direction: "BUY" | "SELL") {
    setTicketMessage(
      `${direction} ticket created for ${selectedAsset.symbol} | ${formatMoney(
        amount,
        currency
      )} | Expiry ${formatExpiry(expirySeconds)}`
    );
  }

  return (
    <div className="po-terminal" ref={terminalRef}>
      <aside className="po-left-nav">
        <div className="po-left-brand">
          <div className="po-logo-shape">
            <span />
            <span />
          </div>
          <span>PocketStyle</span>
        </div>

        <button className="po-left-item active">Trading</button>
        <button className="po-left-item">Finance</button>
        <button className="po-left-item">Profile</button>
        <button className="po-left-item">Market</button>
        <button className="po-left-item">Achievements</button>
        <button className="po-left-item">Tournaments</button>
        <button className="po-left-item">Chat</button>
        <button className="po-left-item">Help</button>
      </aside>

      <section className="po-main-area">
        <header className="po-header">
          <div className="po-header-brand">
            <div className="po-logo-shape mini">
              <span />
              <span />
            </div>
            <strong>NeuroOption</strong>
            <button className="po-star">★</button>
          </div>

          <div className="po-header-actions">
            <select
              value={accountType}
              onChange={(e) => setAccountType(e.target.value as AccountType)}
            >
              <option value="REAL">QT Real</option>
              <option value="DEMO">QT Demo</option>
            </select>

            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value as CurrencyCode)}
            >
              {CURRENCIES.map((code) => (
                <option key={code} value={code}>
                  {code}
                </option>
              ))}
            </select>

            <div className="po-balance-box">
              <span>{accountType === "REAL" ? "Real balance" : "Demo balance"}</span>
              <strong>{formatMoney(convertedBalance, currency)}</strong>
            </div>

            <button className="po-top-up">TOP UP</button>
            <div className="po-avatar">SM</div>
          </div>
        </header>

        <div className="po-workspace">
          <aside className="po-market-panel">
            <div className="po-panel-head">
              <h3>Assets</h3>
            </div>

            <div className="po-category-tabs">
              {(["Currencies", "Cryptocurrencies", "Stocks", "Indices", "Commodities"] as AssetCategory[]).map(
                (item) => (
                  <button
                    key={item}
                    className={category === item ? "active" : ""}
                    onClick={() => {
                      setCategory(item);
                      const first = ASSETS.find((asset) => asset.category === item);
                      if (first) setSelectedAsset(first);
                    }}
                  >
                    {item}
                  </button>
                )
              )}
            </div>

            <div className="po-asset-list">
              {filteredAssets.map((asset) => (
                <button
                  key={asset.symbol}
                  className={selectedAsset.symbol === asset.symbol ? "active" : ""}
                  onClick={() => setSelectedAsset(asset)}
                >
                  <div>
                    <strong>{asset.symbol}</strong>
                    <small>{asset.name}</small>
                  </div>
                  <span>{asset.payout}%</span>
                </button>
              ))}
            </div>
          </aside>

          <section className="po-chart-area">
            <div className="po-chart-toolbar">
              <select
                value={selectedAsset.symbol}
                onChange={(e) => {
                  const asset = ASSETS.find((item) => item.symbol === e.target.value);
                  if (asset) {
                    setSelectedAsset(asset);
                    setCategory(asset.category);
                  }
                }}
              >
                {ASSETS.map((asset) => (
                  <option key={asset.symbol} value={asset.symbol}>
                    {asset.symbol}
                  </option>
                ))}
              </select>

              <div className="po-chip-row">
                {TIMEFRAMES.map((item) => (
                  <button
                    key={item}
                    className={timeframe === item ? "active" : ""}
                    onClick={() => setTimeframe(item)}
                  >
                    {item}
                  </button>
                ))}
              </div>

              <div className="po-tool-buttons">
                {(["Candlesticks", "Heiken Ashi", "Bars", "Line"] as ChartType[]).map((type) => (
                  <button
                    key={type}
                    className={chartType === type ? "active" : ""}
                    onClick={() => setChartType(type)}
                  >
                    {type}
                  </button>
                ))}

                <button
                  className={showIndicators ? "active" : ""}
                  onClick={() => {
                    setShowIndicators((prev) => !prev);
                    setShowDrawing(false);
                  }}
                >
                  Indicators ({selectedIndicators.length})
                </button>

                <button
                  className={showDrawing ? "active" : ""}
                  onClick={() => {
                    setShowDrawing((prev) => !prev);
                    setShowIndicators(false);
                  }}
                >
                  Drawing
                </button>

                <button onClick={toggleFullscreenMode}>
                  {isFullscreen ? "Exit Full Screen" : "Full Screen"}
                </button>
              </div>
            </div>

            <div className="po-chart-header">
              <div>
                <h1>{selectedAsset.symbol}</h1>
                <p>{selectedAsset.name}</p>
              </div>

              <div className="po-live-box">
                <span>Current price</span>
                <strong>{currentPrice.toFixed(decimalPlaces(currentPrice))}</strong>
              </div>
            </div>

            <div className="po-chart-stage">
              <div className="po-chart-background" />
              <ChartSvg candles={candles} chartType={chartType} asset={selectedAsset} />

              <div className="po-stage-badges">
                <span>{timeframe}</span>
                <span>{chartType}</span>
                <span>{selectedDrawing}</span>
              </div>

              {showIndicators && (
                <div className="po-floating-panel indicators">
                  <div className="po-floating-title">Indicators</div>
                  <div className="po-floating-grid">
                    {INDICATORS.map((indicator) => (
                      <button
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

              {showDrawing && (
                <div className="po-floating-panel drawing">
                  <div className="po-floating-title">Drawing Tools</div>
                  <div className="po-floating-grid">
                    {DRAWING_TOOLS.map((tool) => (
                      <button
                        key={tool}
                        className={selectedDrawing === tool ? "active" : ""}
                        onClick={() => setSelectedDrawing(tool)}
                      >
                        {tool}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </section>

          <aside className="po-trade-panel">
            <div className="po-order-card">
              <div className="po-control-group">
                <label>Time</label>
                <div className="po-time-control">
                  <button onClick={() => changeExpiry(-1)}>-</button>
                  <strong>{formatExpiry(expirySeconds)}</strong>
                  <button onClick={() => changeExpiry(1)}>+</button>
                </div>

                <div className="po-time-shortcuts">
                  {[5, 15, 30, 60, 300, 900, 1800, 3600, 18000].map((seconds) => (
                    <button
                      key={seconds}
                      className={expirySeconds === seconds ? "active" : ""}
                      onClick={() => setExpirySeconds(seconds)}
                    >
                      {formatExpiry(seconds)}
                    </button>
                  ))}
                </div>
              </div>

              <div className="po-control-group">
                <label>Amount</label>
                <input
                  type="number"
                  min={1}
                  value={amount}
                  onChange={(e) => setAmount(Math.max(1, Number(e.target.value) || 1))}
                />
              </div>

              <div className="po-metric-box">
                <span>Payout</span>
                <strong>+{selectedAsset.payout}%</strong>
              </div>

              <div className="po-metric-box">
                <span>Expected profit</span>
                <strong>{formatMoney(expectedProfit, currency)}</strong>
              </div>

              <button className="po-buy-btn" onClick={() => prepareOrder("BUY")}>
                BUY
              </button>

              <button className="po-ai-btn">AI TRADING</button>

              <button className="po-sell-btn" onClick={() => prepareOrder("SELL")}>
                SELL
              </button>

              {ticketMessage && <p className="po-ticket-message">{ticketMessage}</p>}
            </div>
          </aside>

          <aside className="po-right-rail">
            <button>Trades</button>
            <button>Signals</button>
            <button>Social Trading</button>
            <button>Express Trades</button>
            <button>Pending Trades</button>
            <button>Hotkeys</button>
            <button onClick={toggleFullscreenMode}>
              {isFullscreen ? "Exit" : "Full Screen"}
            </button>
          </aside>
        </div>
      </section>
    </div>
  );
}