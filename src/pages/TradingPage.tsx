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

const ASSETS: Asset[] = [
  { symbol: "EUR/USD OTC", name: "Euro / US Dollar", category: "Currencies", payout: 92, basePrice: 1.0821 },
  { symbol: "USD/JPY OTC", name: "US Dollar / Yen", category: "Currencies", payout: 90, basePrice: 157.42 },
  { symbol: "GBP/USD OTC", name: "Pound / US Dollar", category: "Currencies", payout: 88, basePrice: 1.2718 },
  { symbol: "USD/KES OTC", name: "US Dollar / Kenya Shilling", category: "Currencies", payout: 86, basePrice: 129.5 },
  { symbol: "AUD/USD OTC", name: "Australian Dollar / US Dollar", category: "Currencies", payout: 84, basePrice: 0.6612 },
  { symbol: "USD/CAD OTC", name: "US Dollar / Canadian Dollar", category: "Currencies", payout: 84, basePrice: 1.3741 },

  { symbol: "BTC/USD OTC", name: "Bitcoin", category: "Cryptocurrencies", payout: 80, basePrice: 67240 },
  { symbol: "ETH/USD OTC", name: "Ethereum", category: "Cryptocurrencies", payout: 78, basePrice: 3510 },
  { symbol: "BNB/USD OTC", name: "BNB", category: "Cryptocurrencies", payout: 76, basePrice: 604 },
  { symbol: "SOL/USD OTC", name: "Solana", category: "Cryptocurrencies", payout: 74, basePrice: 148 },

  { symbol: "AAPL OTC", name: "Apple", category: "Stocks", payout: 82, basePrice: 196.4 },
  { symbol: "TSLA OTC", name: "Tesla", category: "Stocks", payout: 80, basePrice: 178.7 },
  { symbol: "MSFT OTC", name: "Microsoft", category: "Stocks", payout: 81, basePrice: 424.2 },
  { symbol: "NVDA OTC", name: "NVIDIA", category: "Stocks", payout: 83, basePrice: 125.9 },

  { symbol: "US100 OTC", name: "Nasdaq 100", category: "Indices", payout: 85, basePrice: 19680 },
  { symbol: "US30 OTC", name: "Dow Jones", category: "Indices", payout: 84, basePrice: 38640 },
  { symbol: "SPX500 OTC", name: "S&P 500", category: "Indices", payout: 84, basePrice: 5430 },
  { symbol: "GER40 OTC", name: "Germany 40", category: "Indices", payout: 82, basePrice: 18420 },

  { symbol: "XAU/USD OTC", name: "Gold", category: "Commodities", payout: 87, basePrice: 2325 },
  { symbol: "XAG/USD OTC", name: "Silver", category: "Commodities", payout: 82, basePrice: 29.5 },
  { symbol: "USOIL OTC", name: "US Oil", category: "Commodities", payout: 80, basePrice: 78.2 },
  { symbol: "COCOA OTC", name: "Cocoa", category: "Commodities", payout: 78, basePrice: 9480 },
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

function decimalPlaces(price: number) {
  if (price >= 10000) return 2;
  if (price >= 100) return 3;
  return 5;
}

function createCandles(asset: Asset, count = 70): Candle[] {
  const candles: Candle[] = [];
  let price = asset.basePrice;

  for (let i = 0; i < count; i++) {
    const wave = Math.sin(i / 4) * asset.basePrice * 0.0035;
    const noise = Math.cos(i / 3.2) * asset.basePrice * 0.0017;
    const open = price;
    const close = price + wave + noise;
    const high = Math.max(open, close) + asset.basePrice * 0.0018;
    const low = Math.min(open, close) - asset.basePrice * 0.0018;

    candles.push({
      time: Date.now() - (count - i) * 1000,
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

function ChartCanvas({
  candles,
  chartType,
  asset,
}: {
  candles: Candle[];
  chartType: ChartType;
  asset: Asset;
}) {
  const visible = chartType === "Heiken Ashi" ? toHeikenAshi(candles) : candles;
  const width = 900;
  const height = 520;
  const padding = 38;

  const prices = visible.flatMap((candle) => [candle.high, candle.low]);
  const min = Math.min(...prices);
  const max = Math.max(...prices);
  const range = max - min || 1;

  const xStep = (width - padding * 2) / Math.max(visible.length - 1, 1);
  const yFor = (price: number) => height - padding - ((price - min) / range) * (height - padding * 2);

  const linePath = visible
    .map((candle, index) => `${index === 0 ? "M" : "L"} ${padding + index * xStep} ${yFor(candle.close)}`)
    .join(" ");

  const lastPrice = visible[visible.length - 1]?.close ?? asset.basePrice;
  const lastY = yFor(lastPrice);

  return (
    <svg className="no-chart" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none">
      <defs>
        <linearGradient id="chartGlow" x1="0" x2="1">
          <stop offset="0%" stopColor="#2b7cff" stopOpacity="0.15" />
          <stop offset="100%" stopColor="#101a32" stopOpacity="0.2" />
        </linearGradient>
      </defs>

      <rect x="0" y="0" width={width} height={height} fill="url(#chartGlow)" />

      {Array.from({ length: 10 }).map((_, i) => (
        <line
          key={`v-${i}`}
          x1={padding + i * ((width - padding * 2) / 9)}
          y1={padding}
          x2={padding + i * ((width - padding * 2) / 9)}
          y2={height - padding}
          className="no-grid-line"
        />
      ))}

      {Array.from({ length: 8 }).map((_, i) => (
        <line
          key={`h-${i}`}
          x1={padding}
          y1={padding + i * ((height - padding * 2) / 7)}
          x2={width - padding}
          y2={padding + i * ((height - padding * 2) / 7)}
          className="no-grid-line"
        />
      ))}

      <line x1={padding} y1={lastY} x2={width - padding} y2={lastY} className="no-price-line" />
      <text x={width - padding - 4} y={lastY - 8} textAnchor="end" className="no-price-text">
        {lastPrice.toFixed(decimalPlaces(lastPrice))}
      </text>

      {chartType === "Line" && <path d={linePath} className="no-line-chart" />}

      {(chartType === "Candlesticks" || chartType === "Heiken Ashi") &&
        visible.map((candle, index) => {
          const x = padding + index * xStep;
          const openY = yFor(candle.open);
          const closeY = yFor(candle.close);
          const highY = yFor(candle.high);
          const lowY = yFor(candle.low);
          const bullish = candle.close >= candle.open;
          const bodyTop = Math.min(openY, closeY);
          const bodyHeight = Math.max(Math.abs(closeY - openY), 2);

          return (
            <g key={candle.time}>
              <line
                x1={x}
                x2={x}
                y1={highY}
                y2={lowY}
                className={bullish ? "no-wick-up" : "no-wick-down"}
              />
              <rect
                x={x - 4}
                y={bodyTop}
                width={8}
                height={bodyHeight}
                rx={1.8}
                className={bullish ? "no-candle-up" : "no-candle-down"}
              />
            </g>
          );
        })}

      {chartType === "Bars" &&
        visible.map((candle, index) => {
          const x = padding + index * xStep;
          const openY = yFor(candle.open);
          const closeY = yFor(candle.close);
          const highY = yFor(candle.high);
          const lowY = yFor(candle.low);
          const bullish = candle.close >= candle.open;

          return (
            <g key={candle.time}>
              <line x1={x} x2={x} y1={highY} y2={lowY} className={bullish ? "no-wick-up" : "no-wick-down"} />
              <line x1={x - 7} x2={x} y1={openY} y2={openY} className={bullish ? "no-wick-up" : "no-wick-down"} />
              <line x1={x} x2={x + 7} y1={closeY} y2={closeY} className={bullish ? "no-wick-up" : "no-wick-down"} />
            </g>
          );
        })}
    </svg>
  );
}

export default function TradingPage() {
  const [accountType, setAccountType] = useState<AccountType>("DEMO");
  const [currency, setCurrency] = useState<CurrencyCode>("USD");
  const [rates, setRates] = useState<Record<CurrencyCode, number>>(FALLBACK_RATES);
  const [ratesStatus, setRatesStatus] = useState("loading live rates");

  const [category, setCategory] = useState<AssetCategory>("Currencies");
  const [asset, setAsset] = useState<Asset>(ASSETS[0]);
  const [chartType, setChartType] = useState<ChartType>("Candlesticks");
  const [candles, setCandles] = useState<Candle[]>(() => createCandles(ASSETS[0]));

  const [amount, setAmount] = useState(100);
  const [expirySeconds, setExpirySeconds] = useState(30 * 60);
  const [selectedIndicators, setSelectedIndicators] = useState<string[]>([]);
  const [selectedTool, setSelectedTool] = useState("Trend Line");
  const [orderMessage, setOrderMessage] = useState("");

  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    const cached = localStorage.getItem("neurooption_fx_cache");

    if (cached) {
      try {
        const parsed = JSON.parse(cached) as {
          savedAt: number;
          rates: Record<CurrencyCode, number>;
        };

        const ageMs = Date.now() - parsed.savedAt;
        if (ageMs < 60 * 60 * 1000) {
          setRates(parsed.rates);
          setRatesStatus("live rates cached");
          return;
        }
      } catch {
        localStorage.removeItem("neurooption_fx_cache");
      }
    }

    fetch("https://open.er-api.com/v6/latest/USD")
      .then((response) => response.json())
      .then((data) => {
        const nextRates: Record<CurrencyCode, number> = { ...FALLBACK_RATES };

        CURRENCIES.forEach((code) => {
          if (typeof data?.rates?.[code] === "number") {
            nextRates[code] = data.rates[code];
          }
        });

        setRates(nextRates);
        setRatesStatus("live exchange rates");
        localStorage.setItem(
          "neurooption_fx_cache",
          JSON.stringify({
            savedAt: Date.now(),
            rates: nextRates,
          })
        );
      })
      .catch(() => {
        setRates(FALLBACK_RATES);
        setRatesStatus("fallback rates");
      });
  }, []);

  useEffect(() => {
    setCandles(createCandles(asset));
  }, [asset]);

  useEffect(() => {
    if (timerRef.current) {
      window.clearInterval(timerRef.current);
    }

    timerRef.current = window.setInterval(() => {
      setCandles((previous) => {
        const copy = [...previous];
        const last = copy[copy.length - 1];

        const pulse = Math.sin(Date.now() / 700) * asset.basePrice * 0.0009;
        const drift = Math.cos(Date.now() / 1100) * asset.basePrice * 0.0005;
        const nextClose = last.close + pulse + drift;

        const updatedLast: Candle = {
          ...last,
          close: nextClose,
          high: Math.max(last.high, nextClose),
          low: Math.min(last.low, nextClose),
        };

        copy[copy.length - 1] = updatedLast;

        if (Date.now() - last.time > 4500) {
          const newCandle: Candle = {
            time: Date.now(),
            open: nextClose,
            high: nextClose + asset.basePrice * 0.0018,
            low: nextClose - asset.basePrice * 0.0018,
            close: nextClose,
          };

          return [...copy.slice(1), newCandle];
        }

        return copy;
      });
    }, 600);

    return () => {
      if (timerRef.current) {
        window.clearInterval(timerRef.current);
      }
    };
  }, [asset]);

  const filteredAssets = useMemo(
    () => ASSETS.filter((item) => item.category === category),
    [category]
  );

  const balanceUsd = accountType === "DEMO" ? DEMO_USD_BALANCE : REAL_USD_BALANCE;
  const convertedBalance = balanceUsd * rates[currency];
  const expectedProfit = amount * (asset.payout / 100);
  const currentPrice = candles[candles.length - 1]?.close ?? asset.basePrice;

  function changeExpiry(delta: number) {
    setExpirySeconds((value) => clamp(value + delta, 5, 18000));
  }

  function placeTrade(direction: "BUY" | "SELL") {
    setOrderMessage(
      `${direction} order prepared on ${asset.symbol} for ${formatMoney(amount, currency)}. Expiry ${formatExpiry(
        expirySeconds
      )}.`
    );
  }

  function toggleIndicator(name: string) {
    setSelectedIndicators((current) =>
      current.includes(name)
        ? current.filter((item) => item !== name)
        : [...current, name]
    );
  }

  return (
    <main className="no-terminal">
      <aside className="no-left-nav">
        <div className="no-brand-mark">N</div>
        <button className="no-nav-item active">Trading</button>
        <button className="no-nav-item">Finance</button>
        <button className="no-nav-item">Profile</button>
        <button className="no-nav-item">Market</button>
        <button className="no-nav-item">Social</button>
        <button className="no-nav-item">Chat</button>
        <button className="no-nav-item">Help</button>
      </aside>

      <section className="no-main-shell">
        <header className="no-top-bar">
          <div className="no-brand">
            <div className="no-logo-bubbles">
              <span />
              <span />
            </div>
            <strong>NeuroOption</strong>
            <button className="no-star">★</button>
          </div>

          <div className="no-account-box">
            <select value={accountType} onChange={(e) => setAccountType(e.target.value as AccountType)}>
              <option value="DEMO">Demo</option>
              <option value="REAL">Real</option>
            </select>

            <select value={currency} onChange={(e) => setCurrency(e.target.value as CurrencyCode)}>
              {CURRENCIES.map((code) => (
                <option key={code} value={code}>
                  {code}
                </option>
              ))}
            </select>

            <div className="no-balance">
              <span>{accountType === "DEMO" ? "QT Demo" : "QT Real"}</span>
              <strong>{formatMoney(convertedBalance, currency)}</strong>
              <small>{ratesStatus}</small>
            </div>

            <button className="no-top-up">Top up</button>
            <div className="no-avatar">SM</div>
          </div>
        </header>

        <div className="no-trading-grid">
          <section className="no-chart-zone">
            <div className="no-chart-toolbar">
              <select
                value={asset.symbol}
                onChange={(event) => {
                  const next = ASSETS.find((item) => item.symbol === event.target.value);
                  if (next) {
                    setAsset(next);
                    setCategory(next.category);
                  }
                }}
              >
                {ASSETS.map((item) => (
                  <option key={item.symbol} value={item.symbol}>
                    {item.symbol}
                  </option>
                ))}
              </select>

              <div className="no-toolbar-group">
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

            <div className="no-chart-header">
              <div>
                <h1>{asset.symbol}</h1>
                <p>{asset.name}</p>
              </div>
              <div className="no-price-pill">
                <span>Current price</span>
                <strong>{currentPrice.toFixed(decimalPlaces(currentPrice))}</strong>
              </div>
            </div>

            <div className="no-chart-panel">
              <ChartCanvas candles={candles} chartType={chartType} asset={asset} />
            </div>

            <div className="no-bottom-tools">
              <div className="no-tool-block">
                <strong>Drawing</strong>
                <div>
                  {DRAWING_TOOLS.map((tool) => (
                    <button
                      key={tool}
                      className={selectedTool === tool ? "active" : ""}
                      onClick={() => setSelectedTool(tool)}
                    >
                      {tool}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </section>

          <aside className="no-right-panel">
            <div className="no-trade-card">
              <label>Time</label>
              <div className="no-expiry-control">
                <button onClick={() => changeExpiry(-1)}>-</button>
                <strong>{formatExpiry(expirySeconds)}</strong>
                <button onClick={() => changeExpiry(1)}>+</button>
              </div>

              <div className="no-expiry-shortcuts">
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

              <label>Amount</label>
              <input
                type="number"
                min={1}
                value={amount}
                onChange={(event) => setAmount(Math.max(1, Number(event.target.value) || 1))}
              />

              <div className="no-payout-box">
                <span>Payout</span>
                <strong>+{asset.payout}%</strong>
              </div>

              <div className="no-payout-box">
                <span>Expected profit</span>
                <strong>{formatMoney(expectedProfit * rates[currency], currency)}</strong>
              </div>

              <button className="no-buy" onClick={() => placeTrade("BUY")}>
                BUY
              </button>
              <button className="no-ai">AI TRADING</button>
              <button className="no-sell" onClick={() => placeTrade("SELL")}>
                SELL
              </button>

              {orderMessage && <p className="no-order-message">{orderMessage}</p>}
            </div>

            <div className="no-side-icons">
              <button>Trades</button>
              <button>Signals</button>
              <button>Social Trading</button>
              <button>Pending Trades</button>
              <button>Hotkeys</button>
              <button>Full screen</button>
            </div>
          </aside>
        </div>

        <section className="no-lower-drawer">
          <div className="no-assets-drawer">
            <h2>Assets</h2>
            <div className="no-category-tabs">
              {(["Currencies", "Cryptocurrencies", "Stocks", "Indices", "Commodities"] as AssetCategory[]).map(
                (item) => (
                  <button
                    key={item}
                    className={category === item ? "active" : ""}
                    onClick={() => setCategory(item)}
                  >
                    {item}
                  </button>
                )
              )}
            </div>

            <div className="no-asset-list">
              {filteredAssets.map((item) => (
                <button
                  key={item.symbol}
                  className={asset.symbol === item.symbol ? "active" : ""}
                  onClick={() => setAsset(item)}
                >
                  <span>{item.symbol}</span>
                  <small>{item.payout}%</small>
                </button>
              ))}
            </div>
          </div>

          <div className="no-indicators-drawer">
            <h2>Indicators</h2>
            <div className="no-indicator-list">
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
        </section>
      </section>
    </main>
  );
}