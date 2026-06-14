import { useEffect, useMemo, useRef, useState } from "react";
import "./TradingPage.css";

type AssetCategory =
  | "Currencies"
  | "Cryptocurrencies"
  | "Stocks"
  | "Indices"
  | "Commodities";

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

type Asset = {
  symbol: string;
  label: string;
  category: AssetCategory;
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

const CURRENCY_CODES: CurrencyCode[] = [
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
  AOA: 880,
  ZAR: 18.1,
  BRL: 5.35,
};

const ASSETS: Asset[] = [
  { symbol: "EUR/USD OTC", label: "EUR/USD OTC", category: "Currencies", basePrice: 1.0865, payout: 92 },
  { symbol: "GBP/USD OTC", label: "GBP/USD OTC", category: "Currencies", basePrice: 1.2734, payout: 89 },
  { symbol: "USD/JPY OTC", label: "USD/JPY OTC", category: "Currencies", basePrice: 157.28, payout: 82 },
  { symbol: "USD/CHF OTC", label: "USD/CHF OTC", category: "Currencies", basePrice: 0.8931, payout: 86 },
  { symbol: "AUD/USD OTC", label: "AUD/USD OTC", category: "Currencies", basePrice: 0.6612, payout: 84 },
  { symbol: "USD/CAD OTC", label: "USD/CAD OTC", category: "Currencies", basePrice: 1.3715, payout: 83 },

  { symbol: "BTC/USD OTC", label: "Bitcoin OTC", category: "Cryptocurrencies", basePrice: 66400, payout: 78 },
  { symbol: "ETH/USD OTC", label: "Ethereum OTC", category: "Cryptocurrencies", basePrice: 3510, payout: 76 },
  { symbol: "BNB/USD OTC", label: "BNB OTC", category: "Cryptocurrencies", basePrice: 604, payout: 74 },
  { symbol: "SOL/USD OTC", label: "Solana OTC", category: "Cryptocurrencies", basePrice: 145, payout: 72 },

  { symbol: "AAPL OTC", label: "Apple OTC", category: "Stocks", basePrice: 207.4, payout: 75 },
  { symbol: "TSLA OTC", label: "Tesla OTC", category: "Stocks", basePrice: 183.2, payout: 77 },
  { symbol: "AMZN OTC", label: "Amazon OTC", category: "Stocks", basePrice: 189.6, payout: 73 },
  { symbol: "NVDA OTC", label: "NVIDIA OTC", category: "Stocks", basePrice: 122.5, payout: 79 },

  { symbol: "US100 OTC", label: "Nasdaq 100 OTC", category: "Indices", basePrice: 19320, payout: 81 },
  { symbol: "US30 OTC", label: "Dow Jones OTC", category: "Indices", basePrice: 38680, payout: 80 },
  { symbol: "SPX500 OTC", label: "S&P 500 OTC", category: "Indices", basePrice: 5430, payout: 80 },
  { symbol: "GER40 OTC", label: "Germany 40 OTC", category: "Indices", basePrice: 18450, payout: 78 },

  { symbol: "XAU/USD OTC", label: "Gold OTC", category: "Commodities", basePrice: 2328.5, payout: 86 },
  { symbol: "XAG/USD OTC", label: "Silver OTC", category: "Commodities", basePrice: 29.1, payout: 82 },
  { symbol: "WTI/USD OTC", label: "Crude Oil OTC", category: "Commodities", basePrice: 78.4, payout: 79 },
  { symbol: "BRENT/USD OTC", label: "Brent Oil OTC", category: "Commodities", basePrice: 82.1, payout: 78 },
];

const INDICATORS = [
  "Moving Average",
  "EMA",
  "SMA",
  "WMA",
  "MACD",
  "RSI",
  "Stochastic",
  "Bollinger Bands",
  "ADX",
  "ATR",
  "CCI",
  "Momentum",
  "Ichimoku",
  "Parabolic SAR",
  "Williams %R",
  "Fractals",
  "Alligator",
  "Awesome Oscillator",
  "Envelopes",
  "DeMarker",
  "ZigZag",
  "Pivot Points",
  "Donchian Channel",
  "Keltner Channel",
  "VWAP",
  "Volume",
  "OBV",
  "MFI",
  "ROC",
  "TRIX",
  "Aroon",
  "SuperTrend",
  "Heiken Ashi",
  "Price Channel",
  "Fibonacci MA",
  "Hull MA",
  "TEMA",
  "DEMA",
  "Elder Ray",
  "Gator Oscillator",
  "Chaikin Oscillator",
  "Ultimate Oscillator",
];

const DRAWING_TOOLS = [
  "Cursor",
  "Trend Line",
  "Horizontal Line",
  "Vertical Line",
  "Ray",
  "Rectangle",
  "Circle",
  "Arrow",
  "Brush",
  "Text",
  "Fibonacci",
  "Price Range",
];

function getStoredAccountType(): AccountType {
  const value = localStorage.getItem("neuro_account_type");
  return value === "REAL" ? "REAL" : "DEMO";
}

function getStoredCurrency(): CurrencyCode {
  const value = localStorage.getItem("neuro_currency") as CurrencyCode | null;
  return value && CURRENCY_CODES.includes(value) ? value : "USD";
}

function formatPrice(price: number): string {
  if (price >= 10000) return price.toFixed(1);
  if (price >= 1000) return price.toFixed(2);
  if (price >= 100) return price.toFixed(3);
  if (price >= 10) return price.toFixed(4);
  return price.toFixed(5);
}

function formatMoney(amount: number, currency: CurrencyCode): string {
  const maximumFractionDigits = ["JPY", "XOF", "UGX", "TZS", "AOA"].includes(currency) ? 0 : 2;

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits,
  }).format(amount);
}

function generateCandles(basePrice: number, count = 64): Candle[] {
  const candles: Candle[] = [];
  let price = basePrice;

  for (let i = 0; i < count; i += 1) {
    const movement = (Math.random() - 0.47) * basePrice * 0.004;
    const open = price;
    const close = Math.max(0.00001, open + movement);
    const high = Math.max(open, close) + Math.random() * basePrice * 0.002;
    const low = Math.min(open, close) - Math.random() * basePrice * 0.002;

    candles.push({
      time: Date.now() - (count - i) * 1000,
      open,
      high,
      low: Math.max(0.00001, low),
      close,
    });

    price = close;
  }

  return candles;
}

function updateCandles(candles: Candle[], basePrice: number): Candle[] {
  const copy = candles.slice(-63);
  const previous = copy[copy.length - 1];
  const open = previous?.close ?? basePrice;
  const movement = (Math.random() - 0.48) * basePrice * 0.0035;
  const close = Math.max(0.00001, open + movement);
  const high = Math.max(open, close) + Math.random() * basePrice * 0.0015;
  const low = Math.min(open, close) - Math.random() * basePrice * 0.0015;

  copy.push({
    time: Date.now(),
    open,
    high,
    low: Math.max(0.00001, low),
    close,
  });

  return copy;
}

function Chart({ candles, selectedAsset }: { candles: Candle[]; selectedAsset: Asset }) {
  const width = 900;
  const height = 520;
  const padding = 34;

  const highs = candles.map((candle) => candle.high);
  const lows = candles.map((candle) => candle.low);
  const max = Math.max(...highs);
  const min = Math.min(...lows);
  const range = max - min || 1;
  const candleGap = (width - padding * 2) / candles.length;
  const bodyWidth = Math.max(4, candleGap * 0.58);

  const y = (price: number) => {
    return padding + ((max - price) / range) * (height - padding * 2);
  };

  const currentPrice = candles[candles.length - 1]?.close ?? selectedAsset.basePrice;
  const currentY = y(currentPrice);

  return (
    <div className="chart-card">
      <div className="chart-top">
        <div>
          <h2>{selectedAsset.label}</h2>
          <p>{selectedAsset.category} Market</p>
        </div>

        <div className="chart-tools">
          <button>Candles</button>
          <button>Indicators</button>
          <button>Drawing</button>
        </div>
      </div>

      <svg className="chart-svg" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none">
        {[0, 1, 2, 3, 4, 5].map((line) => {
          const yy = padding + line * ((height - padding * 2) / 5);
          return <line key={`h-${line}`} x1={padding} x2={width - padding} y1={yy} y2={yy} className="grid-line" />;
        })}

        {[0, 1, 2, 3, 4, 5, 6, 7].map((line) => {
          const xx = padding + line * ((width - padding * 2) / 7);
          return <line key={`v-${line}`} x1={xx} x2={xx} y1={padding} y2={height - padding} className="grid-line" />;
        })}

        <line x1={padding} x2={width - padding} y1={currentY} y2={currentY} className="current-price-line" />

        {candles.map((candle, index) => {
          const x = padding + index * candleGap + candleGap / 2;
          const openY = y(candle.open);
          const closeY = y(candle.close);
          const highY = y(candle.high);
          const lowY = y(candle.low);
          const isBullish = candle.close >= candle.open;
          const bodyTop = Math.min(openY, closeY);
          const bodyHeight = Math.max(3, Math.abs(closeY - openY));

          return (
            <g key={`${candle.time}-${index}`}>
              <line
                x1={x}
                x2={x}
                y1={highY}
                y2={lowY}
                className={isBullish ? "wick bullish" : "wick bearish"}
              />
              <rect
                x={x - bodyWidth / 2}
                y={bodyTop}
                width={bodyWidth}
                height={bodyHeight}
                rx="2"
                className={isBullish ? "candle bullish" : "candle bearish"}
              />
            </g>
          );
        })}

        <text x={width - 118} y={currentY - 8} className="price-label">
          {formatPrice(currentPrice)}
        </text>
      </svg>
    </div>
  );
}

export default function TradingPage() {
  const [selectedCategory, setSelectedCategory] = useState<AssetCategory>("Currencies");
  const [selectedAsset, setSelectedAsset] = useState<Asset>(ASSETS[0]);
  const [candles, setCandles] = useState<Candle[]>(() => generateCandles(ASSETS[0].basePrice));
  const [prices, setPrices] = useState<Record<string, number>>(() => {
    return ASSETS.reduce<Record<string, number>>((acc, asset) => {
      acc[asset.symbol] = asset.basePrice;
      return acc;
    }, {});
  });

  const [accountType, setAccountType] = useState<AccountType>(() => getStoredAccountType());
  const [currency, setCurrency] = useState<CurrencyCode>(() => getStoredCurrency());
  const [rates, setRates] = useState<Record<CurrencyCode, number>>(FALLBACK_RATES);
  const [tradeAmount, setTradeAmount] = useState(100);
  const [expiry, setExpiry] = useState(30);
  const [activeIndicators, setActiveIndicators] = useState<string[]>([]);
  const [activeTool, setActiveTool] = useState("Cursor");
  const [connectionStatus, setConnectionStatus] = useState<"connected" | "disconnected">("disconnected");

  const timerRef = useRef<number | null>(null);

  const visibleAssets = useMemo(() => {
    return ASSETS.filter((asset) => asset.category === selectedCategory);
  }, [selectedCategory]);

  const baseUsdBalance = accountType === "DEMO" ? 70000 : 0;
  const convertedBalance = baseUsdBalance * (rates[currency] || 1);
  const expectedProfit = tradeAmount * (selectedAsset.payout / 100);

  useEffect(() => {
    localStorage.setItem("neuro_account_type", accountType);
  }, [accountType]);

  useEffect(() => {
    localStorage.setItem("neuro_currency", currency);
  }, [currency]);

  useEffect(() => {
    async function loadRates() {
      try {
        const response = await fetch("https://open.er-api.com/v6/latest/USD");
        const data = await response.json();

        if (data?.rates) {
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
        }
      } catch {
        setRates(FALLBACK_RATES);
      }
    }

    loadRates();
  }, []);

  useEffect(() => {
    setCandles(generateCandles(selectedAsset.basePrice));
  }, [selectedAsset]);

  useEffect(() => {
    timerRef.current = window.setInterval(() => {
      setPrices((current) => {
        const next = { ...current };

        for (const asset of ASSETS) {
          const previous = next[asset.symbol] ?? asset.basePrice;
          const movement = (Math.random() - 0.49) * asset.basePrice * 0.0016;
          next[asset.symbol] = Math.max(0.00001, previous + movement);
        }

        return next;
      });

      setCandles((current) => updateCandles(current, selectedAsset.basePrice));
    }, 850);

    setConnectionStatus("connected");

    return () => {
      if (timerRef.current) {
        window.clearInterval(timerRef.current);
      }
    };
  }, [selectedAsset]);

  function toggleIndicator(indicator: string) {
    setActiveIndicators((current) => {
      if (current.includes(indicator)) {
        return current.filter((item) => item !== indicator);
      }

      return [...current, indicator];
    });
  }

  function placeTrade(direction: "BUY" | "SELL") {
    alert(
      `${direction} trade placed\nAsset: ${selectedAsset.label}\nAmount: ${tradeAmount} ${currency}\nExpiry: ${expiry}s\nExpected profit: ${expectedProfit.toFixed(
        2,
      )}`,
    );
  }

  return (
    <div className="trading-shell">
      <aside className="side-nav">
        <div className="brand-mark">N</div>
        <button className="nav-item active">Trading</button>
        <button className="nav-item">Finance</button>
        <button className="nav-item">Profile</button>
        <button className="nav-item">Market</button>
        <button className="nav-item">Social</button>
        <button className="nav-item">Support</button>
        <button className="nav-item">Help</button>
      </aside>

      <main className="terminal">
        <header className="terminal-header">
          <div className="header-left">
            <div className="logo-pill">N</div>
            <strong>NeuroOption</strong>
            <span className="asset-chip">{selectedAsset.label}</span>
          </div>

          <div className="header-right">
            <select value={accountType} onChange={(event) => setAccountType(event.target.value as AccountType)}>
              <option value="DEMO">Demo</option>
              <option value="REAL">Real</option>
            </select>

            <select value={currency} onChange={(event) => setCurrency(event.target.value as CurrencyCode)}>
              {CURRENCY_CODES.map((code) => (
                <option key={code} value={code}>
                  {code}
                </option>
              ))}
            </select>

            <div className="balance-box">
              <span>{accountType}</span>
              <strong>{formatMoney(convertedBalance, currency)}</strong>
            </div>

            <button className="top-up">TOP UP</button>

            <div className={`connection ${connectionStatus}`}>
              <span />
              {connectionStatus === "connected" ? "Connected" : "Disconnected"}
            </div>
          </div>
        </header>

        <section className="trading-grid">
          <section className="asset-panel">
            <h3>Assets</h3>

            <div className="category-tabs">
              {(["Currencies", "Cryptocurrencies", "Stocks", "Indices", "Commodities"] as AssetCategory[]).map(
                (category) => (
                  <button
                    key={category}
                    className={category === selectedCategory ? "active" : ""}
                    onClick={() => setSelectedCategory(category)}
                  >
                    {category}
                  </button>
                ),
              )}
            </div>

            <div className="asset-list">
              {visibleAssets.map((asset) => (
                <button
                  key={asset.symbol}
                  className={asset.symbol === selectedAsset.symbol ? "asset-row active" : "asset-row"}
                  onClick={() => setSelectedAsset(asset)}
                >
                  <span>{asset.label}</span>
                  <strong>{formatPrice(prices[asset.symbol] ?? asset.basePrice)}</strong>
                </button>
              ))}
            </div>

            <div className="tool-box">
              <h4>Drawing tools</h4>
              <div className="mini-grid">
                {DRAWING_TOOLS.map((tool) => (
                  <button
                    key={tool}
                    className={activeTool === tool ? "active" : ""}
                    onClick={() => setActiveTool(tool)}
                  >
                    {tool}
                  </button>
                ))}
              </div>
            </div>
          </section>

          <section className="chart-area">
            <Chart candles={candles} selectedAsset={selectedAsset} />

            <div className="indicators-panel">
              <div className="panel-title">
                <h3>Indicators</h3>
                <span>{activeIndicators.length} active</span>
              </div>

              <div className="indicator-grid">
                {INDICATORS.map((indicator) => (
                  <button
                    key={indicator}
                    className={activeIndicators.includes(indicator) ? "active" : ""}
                    onClick={() => toggleIndicator(indicator)}
                  >
                    {indicator}
                  </button>
                ))}
              </div>
            </div>
          </section>

          <aside className="trade-panel">
            <div className="price-board">
              <h3>Current Prices</h3>
              {ASSETS.slice(0, 18).map((asset) => (
                <button
                  key={asset.symbol}
                  className={asset.symbol === selectedAsset.symbol ? "price-row active" : "price-row"}
                  onClick={() => {
                    setSelectedCategory(asset.category);
                    setSelectedAsset(asset);
                  }}
                >
                  <span>{asset.symbol}</span>
                  <strong>{formatPrice(prices[asset.symbol] ?? asset.basePrice)}</strong>
                </button>
              ))}
            </div>

            <div className="order-card">
              <label>Trade Amount</label>
              <input
                type="number"
                min="1"
                value={tradeAmount}
                onChange={(event) => setTradeAmount(Number(event.target.value || 1))}
              />

              <label>Time</label>
              <div className="stepper">
                <button onClick={() => setExpiry((value) => Math.max(5, value - 5))}>−</button>
                <strong>{expiry}s</strong>
                <button onClick={() => setExpiry((value) => Math.min(18000, value + 5))}>+</button>
              </div>

              <div className="trade-stat">
                <span>Payout</span>
                <strong>+{selectedAsset.payout}%</strong>
              </div>

              <div className="trade-stat">
                <span>Expected Profit</span>
                <strong>{formatMoney(expectedProfit * (rates[currency] || 1), currency)}</strong>
              </div>

              <button className="buy-button" onClick={() => placeTrade("BUY")}>
                BUY
              </button>

              <button className="sell-button" onClick={() => placeTrade("SELL")}>
                SELL
              </button>
            </div>
          </aside>
        </section>
      </main>
    </div>
  );
}