import { useEffect, useMemo, useRef, useState } from "react";
import "./TradingPage.css";

type AccountType = "QT Demo" | "QT Real";
type Direction = "BUY" | "SELL";
type ChartType = "Candlesticks" | "Heiken Ashi" | "Bars" | "Line";
type Category = "Currencies" | "Cryptocurrencies" | "Stocks" | "Indices" | "Commodities";
type Currency = "USD" | "KES" | "UGX" | "TZS" | "NGN" | "XOF" | "EUR" | "CAD" | "JPY" | "CNY" | "AOA" | "ZAR" | "BRL";
type Timeframe = "S5" | "S15" | "S30" | "M1" | "M5" | "M15" | "M30" | "H1" | "H3" | "H4" | "D1";

type Asset = {
  symbol: string;
  name: string;
  category: Category;
  basePrice: number;
  decimals: number;
  payout: number;
};

type Candle = {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
};

type OpenTrade = {
  id: string;
  direction: Direction;
  amount: number;
  amountUsd: number;
  entryPrice: number;
  payout: number;
  openedAt: number;
  expiresAt: number;
};

type TradeResult = {
  id: string;
  direction: Direction;
  won: boolean;
  amount: number;
  profit: number;
  entryPrice: number;
  exitPrice: number;
};

const RATES: Record<Currency, number> = {
  USD: 1,
  KES: 129.65,
  UGX: 3710,
  TZS: 2600,
  NGN: 1535,
  XOF: 602,
  EUR: 0.92,
  CAD: 1.37,
  JPY: 157.2,
  CNY: 7.25,
  AOA: 875,
  ZAR: 18.1,
  BRL: 5.43,
};

const ASSETS: Record<Category, Asset[]> = {
  Currencies: [
    { symbol: "AUD/CAD OTC", name: "Australian Dollar / Canadian Dollar", category: "Currencies", basePrice: 0.8421, decimals: 5, payout: 92 },
    { symbol: "EUR/USD OTC", name: "Euro / United States Dollar", category: "Currencies", basePrice: 1.1335, decimals: 5, payout: 91 },
    { symbol: "USD/JPY OTC", name: "United States Dollar / Japanese Yen", category: "Currencies", basePrice: 157.28, decimals: 3, payout: 88 },
    { symbol: "GBP/USD OTC", name: "British Pound / United States Dollar", category: "Currencies", basePrice: 1.2722, decimals: 5, payout: 89 },
    { symbol: "USD/CAD OTC", name: "United States Dollar / Canadian Dollar", category: "Currencies", basePrice: 1.3725, decimals: 5, payout: 90 },
  ],
  Cryptocurrencies: [
    { symbol: "BTC/USD OTC", name: "Bitcoin / United States Dollar", category: "Cryptocurrencies", basePrice: 66800, decimals: 2, payout: 85 },
    { symbol: "ETH/USD OTC", name: "Ethereum / United States Dollar", category: "Cryptocurrencies", basePrice: 3510, decimals: 2, payout: 84 },
    { symbol: "BNB/USD OTC", name: "BNB / United States Dollar", category: "Cryptocurrencies", basePrice: 604, decimals: 2, payout: 83 },
  ],
  Stocks: [
    { symbol: "AAPL OTC", name: "Apple Inc.", category: "Stocks", basePrice: 213.4, decimals: 2, payout: 82 },
    { symbol: "TSLA OTC", name: "Tesla Inc.", category: "Stocks", basePrice: 184.7, decimals: 2, payout: 82 },
    { symbol: "AMZN OTC", name: "Amazon.com Inc.", category: "Stocks", basePrice: 186.2, decimals: 2, payout: 81 },
  ],
  Indices: [
    { symbol: "US100 OTC", name: "Nasdaq 100", category: "Indices", basePrice: 19888.46, decimals: 2, payout: 85 },
    { symbol: "US30 OTC", name: "Dow Jones 30", category: "Indices", basePrice: 38990.1, decimals: 2, payout: 84 },
    { symbol: "SPX500 OTC", name: "S&P 500", category: "Indices", basePrice: 5430.5, decimals: 2, payout: 83 },
  ],
  Commodities: [
    { symbol: "XAU/USD OTC", name: "Gold / United States Dollar", category: "Commodities", basePrice: 2325.5, decimals: 2, payout: 86 },
    { symbol: "XAG/USD OTC", name: "Silver / United States Dollar", category: "Commodities", basePrice: 29.7, decimals: 3, payout: 84 },
    { symbol: "BRENT OTC", name: "Brent Crude Oil", category: "Commodities", basePrice: 82.4, decimals: 2, payout: 82 },
  ],
};

const TIMEFRAMES: Timeframe[] = ["S5", "S15", "S30", "M1", "M5", "M15", "M30", "H1", "H3", "H4", "D1"];

const INDICATORS = [
  "Moving Average", "EMA", "SMA", "WMA", "Bollinger Bands", "MACD", "RSI", "Stochastic",
  "CCI", "ADX", "ATR", "Alligator", "Fractals", "Ichimoku", "Parabolic SAR", "Momentum",
  "Williams %R", "Awesome Oscillator", "DeMarker", "Envelopes", "Zig Zag", "Aroon",
  "Keltner Channel", "Donchian Channel", "SuperTrend", "VWAP", "Volume", "OBV",
  "Money Flow Index", "ROC", "TRIX", "DPO", "Elder Ray", "Pivot Points", "Fibonacci",
  "Standard Deviation", "Linear Regression", "Price Channel", "Gator Oscillator",
  "Force Index", "Accumulation/Distribution", "Relative Vigor Index",
];

const DRAWING_TOOLS = [
  "Cursor", "Trend Line", "Horizontal Line", "Vertical Line", "Ray", "Arrow",
  "Rectangle", "Ellipse", "Brush", "Text", "Fibonacci Retracement", "Price Label",
];

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

function pad(value: number) {
  return String(value).padStart(2, "0");
}

function formatExpiry(seconds: number) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  return `${pad(h)}:${pad(m)}:${pad(s)}`;
}

function timeframeSeconds(tf: Timeframe) {
  if (tf.startsWith("S")) return Number(tf.slice(1));
  if (tf.startsWith("M")) return Number(tf.slice(1)) * 60;
  if (tf.startsWith("H")) return Number(tf.slice(1)) * 3600;
  return 86400;
}

function formatMoney(value: number, currency: Currency) {
  return `${currency} ${value.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

function generateCandles(asset: Asset, count = 80): Candle[] {
  const candles: Candle[] = [];
  let price = asset.basePrice;

  for (let i = 0; i < count; i += 1) {
    const wave = Math.sin(i / 5) * asset.basePrice * 0.0018;
    const noise = (Math.random() - 0.5) * asset.basePrice * 0.002;
    const open = price;
    const close = Math.max(0.0001, open + wave + noise);
    const high = Math.max(open, close) + Math.random() * asset.basePrice * 0.0012;
    const low = Math.min(open, close) - Math.random() * asset.basePrice * 0.0012;

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
    const previous = result[index - 1];
    const open = previous ? (previous.open + previous.close) / 2 : (candle.open + candle.close) / 2;
    const high = Math.max(candle.high, open, close);
    const low = Math.min(candle.low, open, close);

    result.push({
      ...candle,
      open,
      high,
      low,
      close,
    });
  });

  return result;
}

export default function TradingPage() {
  const [accountType, setAccountType] = useState<AccountType>("QT Demo");
  const [currency, setCurrency] = useState<Currency>("USD");
  const [demoBalanceUsd, setDemoBalanceUsd] = useState(70000);
  const [realBalanceUsd] = useState(0);

  const [selectedAsset, setSelectedAsset] = useState<Asset>(ASSETS.Currencies[0]);
  const [assetCategory, setAssetCategory] = useState<Category>("Currencies");
  const [timeframe, setTimeframe] = useState<Timeframe>("M1");
  const [chartType, setChartType] = useState<ChartType>("Candlesticks");
  const [selectedIndicator, setSelectedIndicator] = useState("Moving Average");
  const [selectedTool, setSelectedTool] = useState("Cursor");

  const [candles, setCandles] = useState<Candle[]>(() => generateCandles(selectedAsset));
  const [amount, setAmount] = useState(100);
  const [expirySeconds, setExpirySeconds] = useState(30 * 60);
  const [openTrades, setOpenTrades] = useState<OpenTrade[]>([]);
  const [tradeResult, setTradeResult] = useState<TradeResult | null>(null);

  const [assetMenuOpen, setAssetMenuOpen] = useState(false);
  const [timeframeMenuOpen, setTimeframeMenuOpen] = useState(false);
  const [indicatorMenuOpen, setIndicatorMenuOpen] = useState(false);
  const [drawingMenuOpen, setDrawingMenuOpen] = useState(false);

  const timerRefs = useRef<number[]>([]);

  const balanceUsd = accountType === "QT Demo" ? demoBalanceUsd : realBalanceUsd;
  const balance = balanceUsd * RATES[currency];
  const currentPrice = candles[candles.length - 1]?.close ?? selectedAsset.basePrice;
  const payoutRate = selectedAsset.payout;
  const expectedProfit = amount * (payoutRate / 100);
  const expectedReturn = amount + expectedProfit;

  const visibleCandles = useMemo(() => {
    if (chartType === "Heiken Ashi") return toHeikenAshi(candles);
    return candles;
  }, [candles, chartType]);

  useEffect(() => {
    setCandles(generateCandles(selectedAsset));
  }, [selectedAsset]);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setCandles((previous) => {
        const last = previous[previous.length - 1];
        if (!last) return generateCandles(selectedAsset);

        const volatility = selectedAsset.basePrice * 0.0018;
        const open = last.close;
        const close = Math.max(0.0001, open + (Math.random() - 0.48) * volatility);
        const high = Math.max(open, close) + Math.random() * volatility * 0.65;
        const low = Math.min(open, close) - Math.random() * volatility * 0.65;

        return [
          ...previous.slice(1),
          {
            time: Date.now(),
            open,
            high,
            low,
            close,
          },
        ];
      });
    }, 850);

    return () => window.clearInterval(interval);
  }, [selectedAsset]);

  useEffect(() => {
    return () => {
      timerRefs.current.forEach((timer) => window.clearTimeout(timer));
    };
  }, []);

  function adjustExpiry(unit: "hours" | "minutes" | "seconds", change: 1 | -1) {
    const step = unit === "hours" ? 3600 : unit === "minutes" ? 60 : 1;
    setExpirySeconds((current) => clamp(current + change * step, 5, 18000));
  }

  function closeMenus() {
    setAssetMenuOpen(false);
    setTimeframeMenuOpen(false);
    setIndicatorMenuOpen(false);
    setDrawingMenuOpen(false);
  }

  function placeTrade(direction: Direction) {
    if (amount <= 0) return;

    const amountUsd = amount / RATES[currency];

    if (accountType === "QT Real") {
      setTradeResult({
        id: crypto.randomUUID(),
        direction,
        won: false,
        amount,
        profit: 0,
        entryPrice: currentPrice,
        exitPrice: currentPrice,
      });
      return;
    }

    if (amountUsd > demoBalanceUsd) return;

    const trade: OpenTrade = {
      id: crypto.randomUUID(),
      direction,
      amount,
      amountUsd,
      entryPrice: currentPrice,
      payout: payoutRate,
      openedAt: Date.now(),
      expiresAt: Date.now() + expirySeconds * 1000,
    };

    setDemoBalanceUsd((balanceValue) => balanceValue - amountUsd);
    setOpenTrades((trades) => [...trades, trade]);

    const timer = window.setTimeout(() => {
      setCandles((latestCandles) => {
        const exitPrice = latestCandles[latestCandles.length - 1]?.close ?? currentPrice;
        const won = direction === "BUY" ? exitPrice > trade.entryPrice : exitPrice < trade.entryPrice;
        const profit = won ? trade.amount * (trade.payout / 100) : 0;
        const returnAmount = won ? trade.amount + profit : 0;

        if (won) {
          setDemoBalanceUsd((balanceValue) => balanceValue + returnAmount / RATES[currency]);
        }

        setOpenTrades((trades) => trades.filter((item) => item.id !== trade.id));
        setTradeResult({
          id: trade.id,
          direction,
          won,
          amount: trade.amount,
          profit,
          entryPrice: trade.entryPrice,
          exitPrice,
        });

        const resultTimer = window.setTimeout(() => setTradeResult(null), 10000);
        timerRefs.current.push(resultTimer);

        return latestCandles;
      });
    }, expirySeconds * 1000);

    timerRefs.current.push(timer);
  }

  function toggleFullscreen() {
    const element = document.documentElement;

    if (!document.fullscreenElement) {
      element.requestFullscreen?.();
    } else {
      document.exitFullscreen?.();
    }
  }

  function chartCoordinates() {
    const width = 1000;
    const height = 620;
    const rightPadding = 76;
    const leftPadding = 28;
    const topPadding = 34;
    const bottomPadding = 52;

    const highs = visibleCandles.map((candle) => candle.high);
    const lows = visibleCandles.map((candle) => candle.low);
    const max = Math.max(...highs);
    const min = Math.min(...lows);
    const range = max - min || 1;

    const xStep = (width - leftPadding - rightPadding) / visibleCandles.length;
    const y = (price: number) => topPadding + ((max - price) / range) * (height - topPadding - bottomPadding);
    const x = (index: number) => leftPadding + index * xStep + xStep / 2;

    return { width, height, rightPadding, leftPadding, topPadding, bottomPadding, max, min, range, xStep, x, y };
  }

  const coords = chartCoordinates();
  const activeCategoryAssets = ASSETS[assetCategory];

  const currentBalanceText = formatMoney(balance, currency).replace(`${currency} `, "");

  return (
    <main className="nt-screen">
      <header className="nt-topbar">
        <div className="nt-brand">
          <span className="nt-logo-dot" />
          <span className="nt-logo-dot second" />
          <strong>NeuroOption</strong>
          <button className="nt-star" type="button">★</button>
        </div>

        <div className="nt-account">
          <select value={accountType} onChange={(event) => setAccountType(event.target.value as AccountType)}>
            <option value="QT Demo">QT Demo</option>
            <option value="QT Real">QT Real</option>
          </select>

          <select value={currency} onChange={(event) => setCurrency(event.target.value as Currency)}>
            {Object.keys(RATES).map((item) => (
              <option key={item} value={item}>{item}</option>
            ))}
          </select>

          <strong title={currentBalanceText}>{currentBalanceText}</strong>

          <button className="nt-topup" type="button">TOP UP</button>
          <button className="nt-fullscreen" type="button" onClick={toggleFullscreen}>⛶</button>
          <div className="nt-avatar">SM</div>
        </div>
      </header>

      <aside className="nt-leftbar">
        <button className="active" type="button"><span>📈</span><small>Trading</small></button>
        <button type="button"><span>💲</span><small>Finance</small></button>
        <button type="button"><span>👤</span><small>Profile</small></button>
        <button type="button"><span>🛒</span><small>Market</small></button>
        <button type="button"><span>💎</span><small>Achievements</small></button>
        <button type="button"><span>🏆</span><small>Tournaments</small></button>
        <button type="button"><span>💬</span><small>Chat</small></button>
        <button type="button"><span>?</span><small>Help</small></button>
        <button className="nt-promo" type="button">PROMO</button>
      </aside>

      <section className="nt-terminal">
        <div className="nt-chart-area">
          <div className="nt-toolbar">
            <button
              className="nt-asset-button"
              type="button"
              onClick={() => {
                closeMenus();
                setAssetMenuOpen(true);
              }}
            >
              {selectedAsset.symbol} ▾
            </button>

            <button
              className="nt-timeframe-main"
              type="button"
              onClick={() => {
                closeMenus();
                setTimeframeMenuOpen(true);
              }}
              title="Timeframe"
            >
              {timeframe}
            </button>

            <button
              type="button"
              onClick={() => {
                closeMenus();
                setDrawingMenuOpen(true);
              }}
              title="Drawing tools"
            >
              ✎
            </button>

            <button
              type="button"
              onClick={() => {
                closeMenus();
                setIndicatorMenuOpen(true);
              }}
              title="Indicators"
            >
              ☷
            </button>

            <button type="button" title="More tools">⋯</button>

            <div className="nt-chart-switches">
              {(["Candlesticks", "Heiken Ashi", "Bars", "Line"] as ChartType[]).map((type) => (
                <button
                  key={type}
                  className={chartType === type ? "active" : ""}
                  type="button"
                  onClick={() => setChartType(type)}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          <div className="nt-subbar">
            <span>{new Date().toLocaleTimeString()} UTC+3</span>
            <span>⚙</span>
            <span>Tool: {selectedTool}</span>
            <strong>{selectedIndicator}</strong>
          </div>

          <div className="nt-floating-tools">
            <button type="button" title="Fast trading">⚡</button>
            <button
              type="button"
              title="Indicators"
              onClick={() => {
                closeMenus();
                setIndicatorMenuOpen(true);
              }}
            >
              ⇈
            </button>
          </div>

          {assetMenuOpen && (
            <div className="nt-popover nt-assets-panel">
              <div className="nt-tabs">
                {(Object.keys(ASSETS) as Category[]).map((category) => (
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

              <div className="nt-assets-list">
                {activeCategoryAssets.map((asset) => (
                  <button
                    key={asset.symbol}
                    type="button"
                    onClick={() => {
                      setSelectedAsset(asset);
                      setAssetMenuOpen(false);
                    }}
                  >
                    <span>{asset.symbol}</span>
                    <small>{asset.name}</small>
                    <b>+{asset.payout}%</b>
                  </button>
                ))}
              </div>
            </div>
          )}

          {timeframeMenuOpen && (
            <div className="nt-popover nt-small-panel">
              <h3>Timeframe</h3>
              <div className="nt-timeframe-grid">
                {TIMEFRAMES.map((item) => (
                  <button
                    key={item}
                    type="button"
                    className={timeframe === item ? "active" : ""}
                    onClick={() => {
                      setTimeframe(item);
                      setExpirySeconds(clamp(timeframeSeconds(item), 5, 18000));
                      setTimeframeMenuOpen(false);
                    }}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
          )}

          {indicatorMenuOpen && (
            <div className="nt-popover nt-indicator-panel">
              <h3>Indicators</h3>
              <div className="nt-indicator-grid">
                {INDICATORS.map((indicator) => (
                  <button
                    key={indicator}
                    type="button"
                    className={selectedIndicator === indicator ? "active" : ""}
                    onClick={() => {
                      setSelectedIndicator(indicator);
                      setIndicatorMenuOpen(false);
                    }}
                  >
                    {indicator}
                  </button>
                ))}
              </div>
            </div>
          )}

          {drawingMenuOpen && (
            <div className="nt-popover nt-small-panel">
              <h3>Drawing tools</h3>
              <div className="nt-tool-grid">
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
            </div>
          )}

          <div className="nt-chart-wrap" onClick={() => closeMenus()}>
            <svg className="nt-chart-svg" viewBox={`0 0 ${coords.width} ${coords.height}`} preserveAspectRatio="none">
              <defs>
                <linearGradient id="mountainFill" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="#486792" stopOpacity="0.42" />
                  <stop offset="100%" stopColor="#162036" stopOpacity="0.12" />
                </linearGradient>
              </defs>

              <rect width="100%" height="100%" fill="#17243c" />
              <polygon
                points="0,520 90,340 210,500 330,280 470,460 610,320 760,470 920,320 1000,430 1000,620 0,620"
                fill="url(#mountainFill)"
              />

              {Array.from({ length: 9 }).map((_, index) => {
                const x = 70 + index * 105;
                return <line key={`v-${index}`} x1={x} x2={x} y1={30} y2={580} className="nt-grid-line" />;
              })}

              {Array.from({ length: 6 }).map((_, index) => {
                const y = 70 + index * 90;
                return <line key={`h-${index}`} x1={30} x2={930} y1={y} y2={y} className="nt-grid-line" />;
              })}

              {chartType === "Line" && (
                <polyline
                  points={visibleCandles.map((candle, index) => `${coords.x(index)},${coords.y(candle.close)}`).join(" ")}
                  fill="none"
                  className="nt-line-chart"
                />
              )}

              {chartType !== "Line" &&
                visibleCandles.map((candle, index) => {
                  const x = coords.x(index);
                  const openY = coords.y(candle.open);
                  const closeY = coords.y(candle.close);
                  const highY = coords.y(candle.high);
                  const lowY = coords.y(candle.low);
                  const bullish = candle.close >= candle.open;
                  const candleClass = bullish ? "bullish" : "bearish";
                  const bodyTop = Math.min(openY, closeY);
                  const bodyHeight = Math.max(3, Math.abs(openY - closeY));
                  const width = Math.max(4, coords.xStep * 0.48);

                  if (chartType === "Bars") {
                    return (
                      <g key={candle.time}>
                        <line x1={x} x2={x} y1={highY} y2={lowY} className={`nt-bar-line ${candleClass}`} />
                        <line x1={x - width / 2} x2={x} y1={openY} y2={openY} className={`nt-bar-line ${candleClass}`} />
                        <line x1={x} x2={x + width / 2} y1={closeY} y2={closeY} className={`nt-bar-line ${candleClass}`} />
                      </g>
                    );
                  }

                  return (
                    <g key={candle.time}>
                      <line x1={x} x2={x} y1={highY} y2={lowY} className={`nt-wick ${candleClass}`} />
                      <rect
                        x={x - width / 2}
                        y={bodyTop}
                        width={width}
                        height={bodyHeight}
                        rx="1.5"
                        className={`nt-candle ${candleClass}`}
                      />
                    </g>
                  );
                })}

              <line x1={30} x2={930} y1={coords.y(currentPrice)} y2={coords.y(currentPrice)} className="nt-current-line" />
              <text x={936} y={coords.y(currentPrice) + 4} className="nt-current-price-text">
                {currentPrice.toFixed(selectedAsset.decimals)}
              </text>

              {Array.from({ length: 6 }).map((_, index) => {
                const price = coords.max - (coords.range / 5) * index;
                return (
                  <text key={index} x={940} y={70 + index * 90 + 4} className="nt-axis-price">
                    {price.toFixed(selectedAsset.decimals)}
                  </text>
                );
              })}

              <line x1={805} x2={805} y1={30} y2={580} className="nt-expiry-line" />
              <text x={820} y={78} className="nt-expiry-label">Expiration time</text>

              {openTrades.map((trade) => (
                <g key={trade.id}>
                  <line x1={30} x2={930} y1={coords.y(trade.entryPrice)} y2={coords.y(trade.entryPrice)} className="nt-entry-line" />
                  <rect x={70} y={coords.y(trade.entryPrice) - 18} width={112} height={28} rx={7} className="nt-entry-badge" />
                  <text x={84} y={coords.y(trade.entryPrice) + 1} className="nt-position-text">
                    {trade.direction} {currency} {trade.amount.toFixed(2)}
                  </text>
                </g>
              ))}

              {tradeResult && (
                <g>
                  <rect
                    x={380}
                    y={292}
                    width={240}
                    height={44}
                    rx={10}
                    className={tradeResult.won ? "nt-result-badge win" : "nt-result-badge lose"}
                  />
                  <text x={405} y={320} className="nt-result-text">
                    {tradeResult.won ? `✓ +${formatMoney(tradeResult.profit, currency)}` : `✓ ${currency} 0.00`}
                  </text>
                </g>
              )}
            </svg>
          </div>

          <div className="nt-chart-footer">
            <button type="button">←</button>
            <button type="button">{timeframe}⌃</button>
            <span>{selectedAsset.name}</span>
          </div>
        </div>

        <aside className="nt-trade-panel">
          <div className="nt-meter">
            <span>50%</span>
            <div><i /></div>
            <span>50%</span>
          </div>

          <div className="nt-trade-box">
            <label>Time ⓘ</label>

            <div className="nt-hms-expiry">
              <div className="nt-hms-column">
                <button type="button" onClick={() => adjustExpiry("hours", 1)}>+</button>
                <strong>{pad(Math.floor(expirySeconds / 3600))}</strong>
                <button type="button" onClick={() => adjustExpiry("hours", -1)}>-</button>
                <span>H</span>
              </div>

              <div className="nt-hms-column">
                <button type="button" onClick={() => adjustExpiry("minutes", 1)}>+</button>
                <strong>{pad(Math.floor((expirySeconds % 3600) / 60))}</strong>
                <button type="button" onClick={() => adjustExpiry("minutes", -1)}>-</button>
                <span>M</span>
              </div>

              <div className="nt-hms-column">
                <button type="button" onClick={() => adjustExpiry("seconds", 1)}>+</button>
                <strong>{pad(expirySeconds % 60)}</strong>
                <button type="button" onClick={() => adjustExpiry("seconds", -1)}>-</button>
                <span>S</span>
              </div>
            </div>

            <div className="nt-expiry-preview">{formatExpiry(expirySeconds)}</div>

            <label>Amount ⓘ</label>
            <div className="nt-amount-box">
              <input
                value={amount}
                min={1}
                type="number"
                onChange={(event) => setAmount(Math.max(1, Number(event.target.value)))}
              />
              <span>{currency}</span>
            </div>

            <label>Payout ⓘ</label>
            <div className="nt-calculation">
              <div>
                <span>Rate</span>
                <strong>+{payoutRate}%</strong>
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

            <button className="nt-buy" type="button" onClick={() => placeTrade("BUY")}>↗ BUY</button>
            <button className="nt-ai" type="button">AI TRADING</button>
            <button className="nt-sell" type="button" onClick={() => placeTrade("SELL")}>↘ SELL</button>
          </div>
        </aside>

        <aside className="nt-rightbar">
          <button type="button"><span>↻</span><small>Trades</small></button>
          <button type="button"><span>📡</span><small>Signals</small></button>
          <button type="button"><span>👥</span><small>Social</small></button>
          <button type="button"><span>◎</span><small>Express</small></button>
          <button type="button"><span>⌛</span><small>Pending</small></button>
          <button type="button" onClick={toggleFullscreen}><span>⛶</span><small>Full screen</small></button>
        </aside>
      </section>
    </main>
  );
}