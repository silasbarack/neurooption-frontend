// frontend/src/pages/TradingPage.tsx
import { useEffect, useMemo, useRef, useState } from "react";
import type { CSSProperties, WheelEvent } from "react";
import { Link } from "react-router-dom";

type Candle = {
  open: number;
  high: number;
  low: number;
  close: number;
};

type TradeDirection = "BUY" | "SELL";
type ChartType = "Candles" | "Line" | "Bars" | "Heikin Ashi";

type OpenTrade = {
  id: string;
  direction: TradeDirection;
  amount: number;
  entryPrice: number;
  expiryAt: number;
  payout: number;
};

type ClosedTrade = {
  id: string;
  direction: TradeDirection;
  amount: number;
  profit: number;
  won: boolean;
  closedAt: number;
};

const assets = [
  "EUR/USD OTC",
  "GBP/USD OTC",
  "USD/JPY OTC",
  "CAD/JPY OTC",
  "AUD/USD OTC",
  "USD/CAD OTC",
  "EUR/JPY OTC",
  "GBP/JPY OTC",
  "BTC/USD OTC",
  "ETH/USD OTC",
];

const timeframes = ["S5", "S10", "S15", "S30", "M1", "M2", "M3", "M5", "M10", "M15", "M30", "H1", "H4", "D1"];

const indicators = [
  "Alligator",
  "Moving Average",
  "Bollinger Bands",
  "RSI",
  "MACD",
  "Stochastic Oscillator",
  "ADX",
  "ATR",
  "CCI",
  "Momentum",
  "Volume",
  "Parabolic SAR",
  "Ichimoku Kinko Hyo",
  "SuperTrend",
  "Fractal",
  "ZigZag",
  "Aroon",
  "Awesome Oscillator",
  "Bears Power",
  "Bulls Power",
  "DeMarker",
  "Donchian Channel",
  "Envelopes",
  "Keltner Channel",
  "Rate of Change",
  "Vortex",
  "Williams %R",
  "OsMA",
  "Accelerator Oscillator",
  "Schaff Trend Cycle",
  "Bollinger Bands Width",
  "Fractal Chaos Bands",
];

const drawings = [
  "Horizontal Line",
  "Vertical Line",
  "Ray",
  "Trend Line",
  "Parallel Channel",
  "Rectangle",
  "Fibonacci Retracement",
  "Fibonacci Fan",
  "Andrews Pitchfork",
];

const currencies: Record<string, number> = {
  USD: 1,
  KES: 129,
  EUR: 0.92,
  GBP: 0.78,
  TZS: 2600,
  UGX: 3700,
  RWF: 1300,
  NGN: 1500,
  ZAR: 18,
  CAD: 1.37,
  AUD: 1.52,
  JPY: 157,
  CNY: 7.25,
  INR: 83,
};

function createCandles(asset: string, count = 90): Candle[] {
  let seed = asset.split("").reduce((sum, char) => sum + char.charCodeAt(0), 0);
  let price = 1.18 + (seed % 40) / 1000;

  return Array.from({ length: count }, (_, index) => {
    const wave = Math.sin((index + seed) / 5) * 0.0016;
    const noise = Math.sin((index + seed) * 1.7) * 0.0007;
    const open = price;
    const close = Math.max(0.8, open + wave + noise);
    const high = Math.max(open, close) + 0.0008 + Math.abs(Math.sin(index)) * 0.0008;
    const low = Math.min(open, close) - 0.0008 - Math.abs(Math.cos(index)) * 0.0008;

    price = close;

    return { open, high, low, close };
  });
}

function formatMoney(amount: number, currency: string) {
  return `${currency} ${amount.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

function secondsToTime(totalSeconds: number) {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return [hours, minutes, seconds]
    .map((value) => String(value).padStart(2, "0"))
    .join(":");
}

export default function TradingPage() {
  const chartRef = useRef<HTMLDivElement | null>(null);

  const [asset, setAsset] = useState("EUR/USD OTC");
  const [timeframe, setTimeframe] = useState("M1");
  const [chartType, setChartType] = useState<ChartType>("Candles");
  const [indicator, setIndicator] = useState("Alligator");
  const [drawing, setDrawing] = useState("Trend Line");

  const [currency, setCurrency] = useState("USD");
  const [demoBalanceUsd, setDemoBalanceUsd] = useState(70000);
  const [realBalanceUsd] = useState(0);
  const [accountMode, setAccountMode] = useState<"Demo" | "Real">("Demo");

  const [amount, setAmount] = useState(100);
  const [expirySeconds, setExpirySeconds] = useState(60);
  const [expiryUnit, setExpiryUnit] = useState<"Seconds" | "Minutes" | "Hours">("Seconds");

  const [zoom, setZoom] = useState(1);
  const [candles, setCandles] = useState<Candle[]>(() => createCandles(asset));
  const [openTrades, setOpenTrades] = useState<OpenTrade[]>([]);
  const [closedTrades, setClosedTrades] = useState<ClosedTrade[]>([]);
  const [menu, setMenu] = useState<"asset" | "chart" | "indicator" | "drawing" | null>(null);

  const payout = 0.85;
  const payoutPercent = Math.round(payout * 100);

  const displayedBalance =
    accountMode === "Demo"
      ? demoBalanceUsd * currencies[currency]
      : realBalanceUsd * currencies[currency];

  const visibleCandles = useMemo(() => {
    const visibleCount = Math.max(25, Math.floor(75 / zoom));
    return candles.slice(-visibleCount);
  }, [candles, zoom]);

  const latestPrice = visibleCandles[visibleCandles.length - 1]?.close || 1.2;

  useEffect(() => {
    setCandles(createCandles(asset));
    setOpenTrades([]);
    setClosedTrades([]);
  }, [asset]);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setCandles((current) => {
        const previous = current[current.length - 1];
        const movement = (Math.random() - 0.48) * 0.0018;
        const open = previous.close;
        const close = Math.max(0.8, open + movement);
        const high = Math.max(open, close) + Math.random() * 0.001;
        const low = Math.min(open, close) - Math.random() * 0.001;

        return [...current.slice(-120), { open, high, low, close }];
      });

      const now = Date.now();

      setOpenTrades((trades) => {
        const stillOpen: OpenTrade[] = [];

        trades.forEach((trade) => {
          if (trade.expiryAt > now) {
            stillOpen.push(trade);
            return;
          }

          const currentPrice = latestPrice;
          const won =
            trade.direction === "BUY"
              ? currentPrice > trade.entryPrice
              : currentPrice < trade.entryPrice;

          const profit = won ? trade.amount * trade.payout : 0;

          if (won) {
            setDemoBalanceUsd((balance) => balance + trade.amount + profit);
          }

          setClosedTrades((closed) => [
            ...closed,
            {
              id: trade.id,
              direction: trade.direction,
              amount: trade.amount,
              profit,
              won,
              closedAt: Date.now(),
            },
          ]);
        });

        return stillOpen;
      });

      setClosedTrades((trades) =>
        trades.filter((trade) => Date.now() - trade.closedAt < 10000)
      );
    }, 700);

    return () => window.clearInterval(timer);
  }, [latestPrice]);

  function updateExpiry(delta: number) {
    const step = expiryUnit === "Seconds" ? 1 : expiryUnit === "Minutes" ? 60 : 3600;
    const next = expirySeconds + delta * step;
    setExpirySeconds(Math.min(18000, Math.max(5, next)));
  }

  function placeTrade(direction: TradeDirection) {
    if (accountMode !== "Demo") {
      alert("Real account trading should only be enabled after full payment, KYC, compliance, and admin approval.");
      return;
    }

    if (amount <= 0) {
      alert("Enter a valid amount.");
      return;
    }

    if (amount > demoBalanceUsd) {
      alert("Insufficient demo balance.");
      return;
    }

    setDemoBalanceUsd((balance) => balance - amount);

    const trade: OpenTrade = {
      id: crypto.randomUUID(),
      direction,
      amount,
      entryPrice: latestPrice,
      expiryAt: Date.now() + expirySeconds * 1000,
      payout,
    };

    setOpenTrades((trades) => [...trades, trade]);
  }

  function handleWheel(event: WheelEvent<HTMLDivElement>) {
    event.preventDefault();
    const nextZoom = event.deltaY < 0 ? zoom + 0.12 : zoom - 0.12;
    setZoom(Math.min(2.5, Math.max(0.6, nextZoom)));
  }

  function toggleFullScreen() {
    if (!document.fullscreenElement) {
      chartRef.current?.requestFullscreen().catch(() => undefined);
    } else {
      document.exitFullscreen().catch(() => undefined);
    }
  }

  return (
    <main style={styles.page}>
      <aside style={styles.sidebar}>
        <div style={styles.logoCircle}>N</div>
        <Link style={styles.navLink} to="/trading">Trading</Link>
        <Link style={styles.navLink} to="/finance">Finance</Link>
        <Link style={styles.navLink} to="/profile">Profile</Link>
        <Link style={styles.navLink} to="/market">Market</Link>
        <Link style={styles.navLink} to="/chat">Chat</Link>
        <Link style={styles.navLink} to="/help">Help</Link>
      </aside>

      <section style={styles.mainPanel} ref={chartRef}>
        <header style={styles.topBar}>
          <div style={styles.brand}>NeuroOption</div>

          <button style={styles.balancePill}>
            QT {accountMode} {formatMoney(displayedBalance, currency)}
          </button>

          <button style={styles.topUp}>TOP UP</button>

          <button
            style={accountMode === "Demo" ? styles.modeActive : styles.modeButton}
            onClick={() => setAccountMode("Demo")}
          >
            Demo
          </button>

          <button
            style={accountMode === "Real" ? styles.modeActive : styles.modeButton}
            onClick={() => setAccountMode("Real")}
          >
            Real
          </button>
        </header>

        <div style={styles.workspace}>
          <section style={styles.chartArea} onWheel={handleWheel}>
            <div style={styles.toolbar}>
              <button style={styles.selector} onClick={() => setMenu(menu === "asset" ? null : "asset")}>
                {asset} ▾
              </button>

              <button style={styles.toolButton} onClick={() => setMenu(menu === "chart" ? null : "chart")}>
                📊 {chartType}
              </button>

              <button style={styles.toolButton} onClick={() => setMenu(menu === "indicator" ? null : "indicator")}>
                ⚙ {indicator}
              </button>

              <button style={styles.toolButton} onClick={() => setMenu(menu === "drawing" ? null : "drawing")}>
                ✎ {drawing}
              </button>

              <button style={styles.toolButton} onClick={toggleFullScreen}>
                ⛶ Full Screen
              </button>
            </div>

            {menu === "asset" && (
              <div style={styles.dropdown}>
                {assets.map((item) => (
                  <button key={item} style={styles.dropdownItem} onClick={() => { setAsset(item); setMenu(null); }}>
                    {item}
                  </button>
                ))}
              </div>
            )}

            {menu === "chart" && (
              <div style={styles.dropdownWide}>
                {(["Candles", "Line", "Bars", "Heikin Ashi"] as ChartType[]).map((item) => (
                  <button key={item} style={styles.dropdownItem} onClick={() => { setChartType(item); setMenu(null); }}>
                    {item}
                  </button>
                ))}

                <div style={styles.timeframes}>
                  {timeframes.map((item) => (
                    <button
                      key={item}
                      style={item === timeframe ? styles.timeframeActive : styles.timeframe}
                      onClick={() => setTimeframe(item)}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {menu === "indicator" && (
              <div style={styles.indicatorPanel}>
                {indicators.map((item) => (
                  <button key={item} style={styles.dropdownItem} onClick={() => { setIndicator(item); setMenu(null); }}>
                    ☆ {item}
                  </button>
                ))}
              </div>
            )}

            {menu === "drawing" && (
              <div style={styles.dropdownWide}>
                {drawings.map((item) => (
                  <button key={item} style={styles.dropdownItem} onClick={() => { setDrawing(item); setMenu(null); }}>
                    {item}
                  </button>
                ))}
              </div>
            )}

            <div style={styles.timeframeRow}>
              {timeframes.slice(0, 9).map((item) => (
                <button
                  key={item}
                  style={item === timeframe ? styles.timeframeActive : styles.timeframe}
                  onClick={() => setTimeframe(item)}
                >
                  {item}
                </button>
              ))}
            </div>

            <h3 style={styles.indicatorTitle}>{indicator} 13 8 5</h3>

            <Chart
              candles={visibleCandles}
              chartType={chartType}
              latestPrice={latestPrice}
              openTrades={openTrades}
              closedTrades={closedTrades}
              expirySeconds={expirySeconds}
              currency={currency}
            />
          </section>

          <aside style={styles.tradePanel}>
            <label style={styles.panelLabel}>Currency</label>
            <select style={styles.input} value={currency} onChange={(event) => setCurrency(event.target.value)}>
              {Object.keys(currencies).map((item) => (
                <option key={item} value={item}>{item}</option>
              ))}
            </select>

            <label style={styles.panelLabel}>Time</label>
            <div style={styles.expiryTabs}>
              {(["Seconds", "Minutes", "Hours"] as const).map((item) => (
                <button
                  key={item}
                  style={expiryUnit === item ? styles.expiryActive : styles.expiryTab}
                  onClick={() => setExpiryUnit(item)}
                >
                  {item}
                </button>
              ))}
            </div>

            <div style={styles.expiryBox}>
              <button style={styles.stepButton} onClick={() => updateExpiry(-1)}>-</button>
              <strong>{secondsToTime(expirySeconds)}</strong>
              <button style={styles.stepButton} onClick={() => updateExpiry(1)}>+</button>
            </div>

            <label style={styles.panelLabel}>Amount</label>
            <input
              style={styles.input}
              type="number"
              min={1}
              value={amount}
              onChange={(event) => setAmount(Number(event.target.value))}
            />

            <div style={styles.payoutBox}>
              <div><span>Payout</span><strong>+{payoutPercent}%</strong></div>
              <div><span>Profit</span><strong>{formatMoney(amount * payout * currencies[currency], currency)}</strong></div>
              <div><span>Return if won</span><strong>{formatMoney(amount * (1 + payout) * currencies[currency], currency)}</strong></div>
            </div>

            <button style={styles.buyButton} onClick={() => placeTrade("BUY")}>↗ BUY</button>
            <button style={styles.sellButton} onClick={() => placeTrade("SELL")}>↘ SELL</button>
          </aside>
        </div>
      </section>
    </main>
  );
}

function Chart(props: {
  candles: Candle[];
  chartType: ChartType;
  latestPrice: number;
  openTrades: OpenTrade[];
  closedTrades: ClosedTrade[];
  expirySeconds: number;
  currency: string;
}) {
  const { candles, chartType, latestPrice, openTrades, closedTrades, currency } = props;

  const width = 950;
  const height = 520;
  const padding = 35;

  const highs = candles.map((candle) => candle.high);
  const lows = candles.map((candle) => candle.low);
  const max = Math.max(...highs);
  const min = Math.min(...lows);
  const range = max - min || 1;

  function y(price: number) {
    return padding + ((max - price) / range) * (height - padding * 2);
  }

  const candleWidth = Math.max(5, (width - padding * 2) / candles.length - 4);

  const linePath = candles
    .map((candle, index) => {
      const x = padding + index * ((width - padding * 2) / candles.length);
      return `${index === 0 ? "M" : "L"} ${x} ${y(candle.close)}`;
    })
    .join(" ");

  return (
    <div style={styles.svgWrap}>
      <svg viewBox={`0 0 ${width} ${height}`} style={styles.svg}>
        <defs>
          <linearGradient id="chartBg" x1="0" x2="1" y1="0" y2="1">
            <stop offset="0%" stopColor="#101827" />
            <stop offset="100%" stopColor="#050914" />
          </linearGradient>
        </defs>

        <rect width={width} height={height} fill="url(#chartBg)" rx="18" />

        {Array.from({ length: 12 }).map((_, index) => (
          <line
            key={`v-${index}`}
            x1={(index * width) / 12}
            x2={(index * width) / 12}
            y1={0}
            y2={height}
            stroke="rgba(255,255,255,0.06)"
          />
        ))}

        {Array.from({ length: 8 }).map((_, index) => (
          <line
            key={`h-${index}`}
            x1={0}
            x2={width}
            y1={(index * height) / 8}
            y2={(index * height) / 8}
            stroke="rgba(255,255,255,0.06)"
          />
        ))}

        <line x1={0} x2={width} y1={y(latestPrice)} y2={y(latestPrice)} stroke="#5fb7ff" strokeWidth="1.5" />

        {chartType === "Line" ? (
          <path d={linePath} fill="none" stroke="#73f4ba" strokeWidth="2.5" />
        ) : (
          candles.map((candle, index) => {
            const x = padding + index * ((width - padding * 2) / candles.length);
            const up = candle.close >= candle.open;
            const color = up ? "#72f2b0" : "#ff7763";
            const bodyTop = y(Math.max(candle.open, candle.close));
            const bodyBottom = y(Math.min(candle.open, candle.close));

            if (chartType === "Bars") {
              return (
                <g key={index}>
                  <line x1={x} x2={x} y1={y(candle.high)} y2={y(candle.low)} stroke={color} strokeWidth="2" />
                  <line x1={x - 5} x2={x} y1={y(candle.open)} y2={y(candle.open)} stroke={color} strokeWidth="2" />
                  <line x1={x} x2={x + 5} y1={y(candle.close)} y2={y(candle.close)} stroke={color} strokeWidth="2" />
                </g>
              );
            }

            return (
              <g key={index}>
                <line x1={x} x2={x} y1={y(candle.high)} y2={y(candle.low)} stroke={color} strokeWidth="1.4" />
                <rect
                  x={x - candleWidth / 2}
                  y={bodyTop}
                  width={candleWidth}
                  height={Math.max(3, bodyBottom - bodyTop)}
                  rx="1.5"
                  fill={color}
                />
              </g>
            );
          })
        )}

        <path
          d={linePath}
          fill="none"
          stroke="#4f9cff"
          strokeWidth="2"
          opacity="0.75"
        />

        <text x={width - 95} y={y(latestPrice) - 8} fill="#cfeeff" fontSize="13">
          {latestPrice.toFixed(5)}
        </text>

        {openTrades.map((trade, index) => {
          const secondsLeft = Math.max(0, Math.ceil((trade.expiryAt - Date.now()) / 1000));
          const boxColor = trade.direction === "BUY" ? "#37d983" : "#ff5f4f";

          return (
            <g key={trade.id}>
              <rect x={width - 250} y={100 + index * 42} width={105} height={34} rx="8" fill={boxColor} />
              <text x={width - 240} y={122 + index * 42} fill="#fff" fontSize="14" fontWeight="700">
                {trade.direction === "BUY" ? "▲" : "▼"} ${trade.amount}
              </text>
              <text x={width - 170} y={122 + index * 42} fill="#fff" fontSize="12">
                {secondsLeft}s
              </text>
            </g>
          );
        })}

        {closedTrades.map((trade, index) => (
          <g key={trade.id}>
            <rect
              x={width - 250}
              y={245 + index * 42}
              width={130}
              height={34}
              rx="9"
              fill={trade.won ? "#1ed760" : "#ff4d4d"}
              opacity="0.95"
            />
            <text x={width - 238} y={267 + index * 42} fill="#fff" fontSize="14" fontWeight="700">
              {trade.won ? `+$${trade.profit.toFixed(2)} ✓✓` : "$0 ✓✓"}
            </text>
          </g>
        ))}

        <text x={45} y={height - 22} fill="#93a4bd" fontSize="13">
          Mouse wheel / touchpad: zoom in and out
        </text>

        <text x={width - 185} y={height - 22} fill="#93a4bd" fontSize="13">
          Currency: {currency}
        </text>
      </svg>
    </div>
  );
}

const styles: Record<string, CSSProperties> = {
  page: {
    minHeight: "100vh",
    background:
      "radial-gradient(circle at top left, #17233d 0%, #060914 45%, #03040a 100%)",
    color: "#ffffff",
    fontFamily: "Roboto, sans-serif",
    display: "grid",
    gridTemplateColumns: "86px 1fr",
  },
  sidebar: {
    background: "rgba(6,10,19,0.95)",
    borderRight: "1px solid rgba(255,255,255,0.08)",
    padding: "18px 10px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "16px",
  },
  logoCircle: {
    width: "46px",
    height: "46px",
    borderRadius: "50%",
    background: "linear-gradient(135deg,#6bf0a1,#39a7ff)",
    display: "grid",
    placeItems: "center",
    fontWeight: 800,
  },
  navLink: {
    color: "#b9c7dd",
    textDecoration: "none",
    fontSize: "13px",
  },
  mainPanel: {
    overflow: "hidden",
  },
  topBar: {
    height: "72px",
    display: "flex",
    alignItems: "center",
    gap: "18px",
    padding: "0 22px",
    background: "rgba(5,8,16,0.72)",
    borderBottom: "1px solid rgba(255,255,255,0.08)",
  },
  brand: {
    fontSize: "24px",
    fontWeight: 800,
    marginRight: "auto",
  },
  balancePill: {
    background: "#17223a",
    color: "#fff",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: "14px",
    padding: "12px 18px",
    fontWeight: 800,
  },
  topUp: {
    background: "#5ce39c",
    color: "#061011",
    border: "0",
    borderRadius: "14px",
    padding: "12px 18px",
    fontWeight: 900,
  },
  modeButton: {
    background: "#111827",
    color: "#d3d9e6",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: "14px",
    padding: "12px 22px",
    cursor: "pointer",
  },
  modeActive: {
    background: "#62e6a2",
    color: "#071010",
    border: "0",
    borderRadius: "14px",
    padding: "12px 22px",
    fontWeight: 900,
    cursor: "pointer",
  },
  workspace: {
    display: "grid",
    gridTemplateColumns: "1fr 330px",
    height: "calc(100vh - 72px)",
  },
  chartArea: {
    position: "relative",
    padding: "18px",
    overflow: "hidden",
  },
  toolbar: {
    display: "flex",
    gap: "10px",
    marginBottom: "10px",
    flexWrap: "wrap",
  },
  selector: {
    background: "#17223a",
    color: "#fff",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: "10px",
    padding: "10px 14px",
    fontWeight: 800,
    cursor: "pointer",
  },
  toolButton: {
    background: "#1b2945",
    color: "#dbe8ff",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: "10px",
    padding: "10px 12px",
    cursor: "pointer",
  },
  dropdown: {
    position: "absolute",
    zIndex: 20,
    top: "64px",
    left: "18px",
    width: "220px",
    background: "#142039",
    border: "1px solid rgba(255,255,255,0.12)",
    borderRadius: "14px",
    padding: "10px",
    boxShadow: "0 20px 60px rgba(0,0,0,0.45)",
  },
  dropdownWide: {
    position: "absolute",
    zIndex: 20,
    top: "64px",
    left: "220px",
    width: "520px",
    background: "#142039",
    border: "1px solid rgba(255,255,255,0.12)",
    borderRadius: "14px",
    padding: "14px",
    boxShadow: "0 20px 60px rgba(0,0,0,0.45)",
  },
  indicatorPanel: {
    position: "absolute",
    zIndex: 20,
    top: "64px",
    left: "340px",
    width: "680px",
    maxHeight: "420px",
    overflow: "auto",
    background: "#142039",
    border: "1px solid rgba(255,255,255,0.12)",
    borderRadius: "14px",
    padding: "14px",
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "6px",
    boxShadow: "0 20px 60px rgba(0,0,0,0.45)",
  },
  dropdownItem: {
    background: "transparent",
    color: "#e7eefc",
    border: "0",
    textAlign: "left",
    padding: "10px",
    borderRadius: "10px",
    cursor: "pointer",
  },
  timeframes: {
    display: "flex",
    gap: "8px",
    flexWrap: "wrap",
    marginTop: "12px",
  },
  timeframeRow: {
    display: "flex",
    gap: "9px",
    margin: "10px 0",
    flexWrap: "wrap",
  },
  timeframe: {
    background: "#17223a",
    color: "#dbe8ff",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: "10px",
    padding: "8px 13px",
    cursor: "pointer",
  },
  timeframeActive: {
    background: "#62e6a2",
    color: "#061011",
    border: "0",
    borderRadius: "10px",
    padding: "8px 13px",
    fontWeight: 900,
    cursor: "pointer",
  },
  indicatorTitle: {
    textAlign: "center",
    fontSize: "18px",
    margin: "8px 0 12px",
  },
  svgWrap: {
    height: "calc(100vh - 210px)",
    minHeight: "420px",
  },
  svg: {
    width: "100%",
    height: "100%",
    display: "block",
    borderRadius: "18px",
    boxShadow: "0 25px 90px rgba(0,0,0,0.45)",
  },
  tradePanel: {
    background: "rgba(5,8,16,0.86)",
    borderLeft: "1px solid rgba(255,255,255,0.08)",
    padding: "22px",
    overflowY: "auto",
  },
  panelLabel: {
    display: "block",
    color: "#e5edf8",
    fontSize: "14px",
    margin: "18px 0 8px",
  },
  input: {
    width: "100%",
    background: "#17223a",
    color: "#fff",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: "12px",
    padding: "12px",
    outline: "none",
  },
  expiryTabs: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "8px",
  },
  expiryTab: {
    background: "#111827",
    color: "#dbe8ff",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: "10px",
    padding: "10px",
    cursor: "pointer",
  },
  expiryActive: {
    background: "#62e6a2",
    color: "#061011",
    border: "0",
    borderRadius: "10px",
    padding: "10px",
    fontWeight: 900,
    cursor: "pointer",
  },
  expiryBox: {
    marginTop: "12px",
    display: "grid",
    gridTemplateColumns: "50px 1fr 50px",
    alignItems: "center",
    gap: "8px",
    textAlign: "center",
    fontSize: "20px",
  },
  stepButton: {
    background: "#17223a",
    color: "#fff",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: "12px",
    padding: "12px",
    cursor: "pointer",
  },
  payoutBox: {
    background: "#0c1221",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: "16px",
    padding: "14px",
    margin: "18px 0",
    display: "grid",
    gap: "8px",
  },
  buyButton: {
    width: "100%",
    background: "#5ce39c",
    color: "#061011",
    border: "0",
    borderRadius: "14px",
    padding: "16px",
    fontWeight: 900,
    fontSize: "16px",
    cursor: "pointer",
    marginBottom: "12px",
  },
  sellButton: {
    width: "100%",
    background: "#ff665a",
    color: "#fff",
    border: "0",
    borderRadius: "14px",
    padding: "16px",
    fontWeight: 900,
    fontSize: "16px",
    cursor: "pointer",
  },
};