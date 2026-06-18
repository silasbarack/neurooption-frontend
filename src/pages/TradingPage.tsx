import React from "react";
import "./TradingPage.css";

type AccountType = "Demo" | "Real";
type Currency = "USD" | "KES";
type Direction = "BUY" | "SELL";
type ChartType = "Candles" | "Bars" | "Line";
type BottomTab = "Open Trades" | "Trade History" | "Signals";

type Asset = {
  symbol: string;
  name: string;
  basePrice: number;
  precision: number;
  payout: number;
};

type Candle = {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
};

type TradeMarker = {
  id: string;
  direction: Direction;
  entryPrice: number;
  label: string;
};

type ResultMarker = {
  id: string;
  price: number;
  won: boolean;
  label: string;
};

const ASSETS: Asset[] = [
  { symbol: "EUR/USD OTC", name: "Euro / United States Dollar", basePrice: 1.09284, precision: 5, payout: 92 },
  { symbol: "GBP/USD OTC", name: "British Pound / United States Dollar", basePrice: 1.27941, precision: 5, payout: 92 },
  { symbol: "USD/JPY OTC", name: "US Dollar / Japanese Yen", basePrice: 156.243, precision: 3, payout: 91 },
  { symbol: "AUD/CAD OTC", name: "Australian Dollar / Canadian Dollar", basePrice: 0.84218, precision: 5, payout: 90 },
  { symbol: "USD/CAD OTC", name: "US Dollar / Canadian Dollar", basePrice: 1.37152, precision: 5, payout: 90 },
];

const WATCHLIST = [
  { symbol: "EUR/USD OTC", payout: 92 },
  { symbol: "GBP/USD OTC", payout: 92 },
  { symbol: "USD/JPY OTC", payout: 91 },
  { symbol: "AUD/USD OTC", payout: 92 },
  { symbol: "USD/CAD OTC", payout: 90 },
];

const TIMEFRAMES = ["S5", "S15", "S30", "M1", "M5", "M15", "H1"];
const CHART_TYPES: ChartType[] = ["Candles", "Bars", "Line"];

const LEFT_MENU = [
  ["📈", "Trade"],
  ["🛒", "Market"],
  ["📡", "Signals"],
  ["🔁", "Copy Trade"],
  ["🏆", "Tournaments"],
  ["📅", "Calendar"],
  ["?", "Help"],
];

const TOP_MENU = ["Trading", "Trade History", "Cashier", "Bonuses", "Affiliates", "Help Center"];

const EXCHANGE_RATES: Record<Currency, number> = {
  USD: 1,
  KES: 129,
};

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function formatMoney(value: number, currency: Currency) {
  const safeValue = Number.isFinite(value) ? value : 0;

  if (currency === "USD") {
    return `$${safeValue.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  }

  return `KES ${safeValue.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

function formatExpiry(totalSeconds: number) {
  const safe = clamp(totalSeconds, 5, 5 * 60 * 60);
  const hours = Math.floor(safe / 3600);
  const minutes = Math.floor((safe % 3600) / 60);
  const seconds = safe % 60;

  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
    2,
    "0"
  )}:${String(seconds).padStart(2, "0")}`;
}

function seededRandom(seed: number) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

function getSyntheticVolatility(asset: Asset) {
  if (asset.basePrice < 3) return asset.basePrice * 0.00008;
  if (asset.basePrice < 200) return asset.basePrice * 0.00012;
  return asset.basePrice * 0.00006;
}

function createInitialCandles(asset: Asset) {
  const candles: Candle[] = [];
  const now = Date.now();
  const volatility = getSyntheticVolatility(asset);
  let price = asset.basePrice;

  for (let index = 0; index < 90; index += 1) {
    const trend = Math.sin(index / 8) * volatility * 8;
    const pullback = Math.sin(index / 19) * volatility * 4;
    const noise = (seededRandom(index * 19 + asset.basePrice) - 0.5) * volatility * 6;

    const open = price;
    const close = Math.max(0.00001, open + trend + pullback + noise);
    const body = Math.abs(close - open);
    const wick = volatility * (3.2 + seededRandom(index * 31) * 5) + body * 0.35;

    candles.push({
      time: now - (90 - index) * 60_000,
      open,
      close,
      high: Math.max(open, close) + wick,
      low: Math.max(0.00001, Math.min(open, close) - wick),
    });

    price = close;
  }

  return candles;
}

function updateSyntheticM1(candles: Candle[], asset: Asset) {
  const current = candles.length > 0 ? candles.slice() : createInitialCandles(asset);
  const latest = current[current.length - 1];
  const now = Date.now();
  const volatility = getSyntheticVolatility(asset);

  if (now - latest.time >= 60_000) {
    const open = latest.close;
    current.push({
      time: now,
      open,
      high: open,
      low: open,
      close: open,
    });

    return current.slice(-90);
  }

  const candleAge = clamp((now - latest.time) / 60_000, 0, 1);
  const slowTrend = Math.sin(now / 32_000) * volatility * 0.42;
  const microTrend = Math.sin(now / 9_000) * volatility * 0.2;
  const tick = (Math.random() - 0.5) * volatility * 0.7;
  const meanReturn = (latest.open - latest.close) * 0.008 * candleAge;

  const nextClose = Math.max(0.00001, latest.close + slowTrend + microTrend + tick + meanReturn);
  const wickPush = Math.abs(tick) * 0.8 + volatility * (0.12 + candleAge * 0.25);

  current[current.length - 1] = {
    ...latest,
    close: nextClose,
    high: Math.max(latest.high, nextClose + wickPush),
    low: Math.max(0.00001, Math.min(latest.low, nextClose - wickPush)),
  };

  return current.slice(-90);
}

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number
) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
}

function drawChart(
  canvas: HTMLCanvasElement,
  candles: Candle[],
  asset: Asset,
  chartType: ChartType,
  timeframe: string,
  tradeMarkers: TradeMarker[],
  resultMarkers: ResultMarker[]
) {
  const ctx = canvas.getContext("2d");
  const rect = canvas.getBoundingClientRect();

  if (!ctx || rect.width <= 0 || rect.height <= 0) return;

  const dpr = window.devicePixelRatio || 1;
  canvas.width = Math.floor(rect.width * dpr);
  canvas.height = Math.floor(rect.height * dpr);
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

  const width = rect.width;
  const height = rect.height;
  const left = 18;
  const right = 82;
  const top = 52;
  const bottom = 42;
  const chartWidth = width - left - right;
  const chartHeight = height - top - bottom;

  ctx.clearRect(0, 0, width, height);

  const bg = ctx.createLinearGradient(0, 0, 0, height);
  bg.addColorStop(0, "#0c1b31");
  bg.addColorStop(0.5, "#0b1629");
  bg.addColorStop(1, "#08111f");
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, width, height);

  ctx.strokeStyle = "rgba(105, 141, 184, 0.18)";
  ctx.lineWidth = 1;

  for (let i = 0; i <= 12; i += 1) {
    const x = left + (chartWidth / 12) * i;
    ctx.beginPath();
    ctx.moveTo(x, top);
    ctx.lineTo(x, height - bottom);
    ctx.stroke();
  }

  for (let i = 0; i <= 8; i += 1) {
    const y = top + (chartHeight / 8) * i;
    ctx.beginPath();
    ctx.moveTo(left, y);
    ctx.lineTo(width - right, y);
    ctx.stroke();
  }

  const prices = candles.flatMap((candle) => [
    candle.open,
    candle.high,
    candle.low,
    candle.close,
  ]);

  tradeMarkers.forEach((trade) => prices.push(trade.entryPrice));
  resultMarkers.forEach((result) => prices.push(result.price));

  let min = Math.min(...prices);
  let max = Math.max(...prices);
  const padding = Math.max((max - min) * 0.16, asset.basePrice * 0.0005);
  min -= padding;
  max += padding;

  const yOf = (price: number) => top + ((max - price) / (max - min)) * chartHeight;
  const xOf = (index: number) => left + (index / Math.max(candles.length - 1, 1)) * chartWidth;

  const candleWidth = clamp(chartWidth / candles.length * 0.55, 3, 8);

  if (chartType === "Line") {
    ctx.strokeStyle = "#3ba7ff";
    ctx.lineWidth = 2;
    ctx.beginPath();

    candles.forEach((candle, index) => {
      const x = xOf(index);
      const y = yOf(candle.close);

      if (index === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });

    ctx.stroke();
  } else {
    candles.forEach((candle, index) => {
      const x = xOf(index);
      const openY = yOf(candle.open);
      const closeY = yOf(candle.close);
      const highY = yOf(candle.high);
      const lowY = yOf(candle.low);
      const bullish = candle.close >= candle.open;
      const color = bullish ? "#20c989" : "#f14d55";

      ctx.strokeStyle = color;
      ctx.fillStyle = color;
      ctx.lineWidth = 1.2;

      if (chartType === "Bars") {
        ctx.beginPath();
        ctx.moveTo(x, highY);
        ctx.lineTo(x, lowY);
        ctx.moveTo(x - candleWidth, openY);
        ctx.lineTo(x, openY);
        ctx.moveTo(x, closeY);
        ctx.lineTo(x + candleWidth, closeY);
        ctx.stroke();
        return;
      }

      ctx.beginPath();
      ctx.moveTo(x, highY);
      ctx.lineTo(x, lowY);
      ctx.stroke();

      const bodyTop = Math.min(openY, closeY);
      const bodyHeight = Math.max(2, Math.abs(openY - closeY));
      ctx.fillRect(x - candleWidth / 2, bodyTop, candleWidth, bodyHeight);
    });
  }

  const latest = candles[candles.length - 1];
  const currentY = yOf(latest.close);

  ctx.setLineDash([6, 5]);
  ctx.strokeStyle = "#4da0ff";
  ctx.lineWidth = 1.2;
  ctx.beginPath();
  ctx.moveTo(left, currentY);
  ctx.lineTo(width - right + 4, currentY);
  ctx.stroke();
  ctx.setLineDash([]);

  ctx.fillStyle = "#2e9cff";
  roundRect(ctx, width - right + 10, currentY - 14, 64, 28, 6);
  ctx.fill();

  ctx.fillStyle = "#ffffff";
  ctx.font = "700 11px Roboto, sans-serif";
  ctx.textAlign = "center";
  ctx.fillText(latest.close.toFixed(asset.precision), width - right + 42, currentY + 4);

  ctx.fillStyle = "rgba(225, 237, 255, 0.82)";
  ctx.font = "700 11px Roboto, sans-serif";
  ctx.textAlign = "right";

  for (let i = 0; i <= 5; i += 1) {
    const price = max - ((max - min) / 5) * i;
    const y = yOf(price);
    ctx.fillText(price.toFixed(asset.precision), width - 10, y + 4);
  }

  const expiryX = left + chartWidth * 0.82;
  ctx.strokeStyle = "rgba(255,255,255,0.82)";
  ctx.lineWidth = 1.2;
  ctx.beginPath();
  ctx.moveTo(expiryX, top);
  ctx.lineTo(expiryX, height - bottom);
  ctx.stroke();

  ctx.fillStyle = "#ffffff";
  ctx.font = "700 11px Roboto, sans-serif";
  ctx.textAlign = "left";
  ctx.fillText("Expiration time", expiryX + 8, top + 18);

  const currentCandleSeconds = Math.max(0, 60 - Math.floor((Date.now() - latest.time) / 1000));
  ctx.textAlign = "center";
  ctx.fillText(`${timeframe}`, expiryX - 42, currentY - 6);
  ctx.fillText(`00:${String(currentCandleSeconds).padStart(2, "0")}`, expiryX - 42, currentY + 10);

  ctx.fillStyle = "rgba(220, 233, 255, 0.72)";
  ctx.font = "600 10px Roboto, sans-serif";
  ctx.textAlign = "left";
  ctx.fillText(
    `${asset.symbol} · O ${latest.open.toFixed(asset.precision)} H ${latest.high.toFixed(asset.precision)} L ${latest.low.toFixed(asset.precision)} C ${latest.close.toFixed(asset.precision)}`,
    left + 5,
    top - 18
  );

  ctx.textAlign = "center";
  ctx.fillStyle = "rgba(220, 233, 255, 0.6)";
  ["09:30", "09:45", "10:00", "10:15", "10:30", "10:45", "11:00", "11:15", "11:30", "11:45", "12:00"].forEach(
    (time, index) => {
      const x = left + (chartWidth / 10) * index;
      ctx.fillText(time, x, height - 14);
    }
  );

  tradeMarkers.forEach((trade, index) => {
    const y = yOf(trade.entryPrice);
    const x = left + 18 + index * 8;

    ctx.setLineDash([4, 4]);
    ctx.strokeStyle = trade.direction === "BUY" ? "#20d873" : "#ff4f58";
    ctx.beginPath();
    ctx.moveTo(left, y);
    ctx.lineTo(width - right, y);
    ctx.stroke();
    ctx.setLineDash([]);

    ctx.fillStyle = trade.direction === "BUY" ? "#18c96a" : "#f24d55";
    roundRect(ctx, x, y - 13, 112, 26, 6);
    ctx.fill();

    ctx.fillStyle = "#ffffff";
    ctx.font = "800 10px Roboto, sans-serif";
    ctx.textAlign = "left";
    ctx.fillText(trade.label, x + 8, y + 4);
  });

  resultMarkers.forEach((result) => {
    const y = yOf(result.price);
    const x = width - right - 132;

    ctx.fillStyle = result.won ? "#20c873" : "#f04d55";
    roundRect(ctx, x, y - 15, 124, 30, 8);
    ctx.fill();

    ctx.fillStyle = "#ffffff";
    ctx.font = "900 11px Roboto, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(result.label, x + 62, y + 4);
  });
}

export default function TradingPage() {
  const canvasRef = React.useRef<HTMLCanvasElement | null>(null);
  const candlesRef = React.useRef<Candle[]>(createInitialCandles(ASSETS[0]));
  const expiryRef = React.useRef(60);

  const [asset, setAsset] = React.useState<Asset>(ASSETS[0]);
  const [assetMenuOpen, setAssetMenuOpen] = React.useState(false);
  const [timeframe, setTimeframe] = React.useState("M1");
  const [chartType, setChartType] = React.useState<ChartType>("Candles");
  const [accountType, setAccountType] = React.useState<AccountType>("Demo");
  const [currency, setCurrency] = React.useState<Currency>("USD");
  const [balanceUsd, setBalanceUsd] = React.useState(70000);
  const [amount, setAmount] = React.useState("100");
  const [expirySeconds, setExpirySeconds] = React.useState(60);
  const [bottomTab, setBottomTab] = React.useState<BottomTab>("Open Trades");
  const [candles, setCandles] = React.useState<Candle[]>(candlesRef.current);
  const [tradeMarkers, setTradeMarkers] = React.useState<TradeMarker[]>([]);
  const [resultMarkers, setResultMarkers] = React.useState<ResultMarker[]>([]);

  const exchangeRate = EXCHANGE_RATES[currency];
  const balanceDisplay = balanceUsd * exchangeRate;
  const stake = Math.max(0, Number(amount) || 0);
  const stakeUsd = stake / exchangeRate;
  const profit = stake * (asset.payout / 100);
  const canTrade = stake > 0 && stakeUsd <= balanceUsd;

  React.useEffect(() => {
    const fresh = createInitialCandles(asset);
    candlesRef.current = fresh;
    setCandles(fresh);
    setTradeMarkers([]);
    setResultMarkers([]);
  }, [asset]);

  React.useEffect(() => {
    expiryRef.current = expirySeconds;
  }, [expirySeconds]);

  React.useEffect(() => {
    const interval = window.setInterval(() => {
      const next = updateSyntheticM1(candlesRef.current, asset);
      candlesRef.current = next;
      setCandles(next);
    }, 320);

    return () => window.clearInterval(interval);
  }, [asset]);

  React.useEffect(() => {
    if (!canvasRef.current) return;

    drawChart(canvasRef.current, candles, asset, chartType, timeframe, tradeMarkers, resultMarkers);
  }, [candles, asset, chartType, timeframe, tradeMarkers, resultMarkers]);

  React.useEffect(() => {
    const handleResize = () => {
      if (!canvasRef.current) return;
      drawChart(canvasRef.current, candlesRef.current, asset, chartType, timeframe, tradeMarkers, resultMarkers);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [asset, chartType, timeframe, tradeMarkers, resultMarkers]);

  function toggleFullscreen() {
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(() => undefined);
      return;
    }

    document.documentElement.requestFullscreen().catch(() => undefined);
  }

  function changeExpiry(delta: number) {
    setExpirySeconds((current) => clamp(current + delta, 5, 5 * 60 * 60));
  }

  function placeTrade(direction: Direction) {
    if (!canTrade) return;

    const latest = candlesRef.current[candlesRef.current.length - 1];
    if (!latest) return;

    const id = `${direction}-${Date.now()}`;
    const entryPrice = latest.close;
    const label = `${direction} ${formatMoney(stake, currency)}`;

    setBalanceUsd((current) => Math.max(0, current - stakeUsd));
    setTradeMarkers((current) => [...current, { id, direction, entryPrice, label }]);

    window.setTimeout(() => {
      const closePrice = candlesRef.current[candlesRef.current.length - 1]?.close ?? entryPrice;
      const won = direction === "BUY" ? closePrice > entryPrice : closePrice < entryPrice;

      setTradeMarkers((current) => current.filter((trade) => trade.id !== id));

      if (won) {
        setBalanceUsd((current) => current + (stake + profit) / exchangeRate);
      }

      const resultId = `${id}-result`;
      setResultMarkers((current) => [
        ...current,
        {
          id: resultId,
          price: closePrice,
          won,
          label: won ? `✓ ${formatMoney(stake + profit, currency)}` : `✕ ${formatMoney(0, currency)}`,
        },
      ]);

      window.setTimeout(() => {
        setResultMarkers((current) => current.filter((result) => result.id !== resultId));
      }, 10000);
    }, expiryRef.current * 1000);
  }

  return (
    <main className="nx-terminal">
      <aside className="nx-sidebar">
        <div className="nx-brand">
          <span>N</span>
          <strong>NeuroOption</strong>
        </div>

        {LEFT_MENU.map(([icon, label]) => (
          <button key={label} className={label === "Trade" ? "active" : ""} type="button">
            <span>{icon}</span>
            <small>{label}</small>
          </button>
        ))}

        <div className="nx-join">JOIN US</div>
      </aside>

      <header className="nx-topbar">
        <nav>
          {TOP_MENU.map((item) => (
            <button key={item} className={item === "Trading" ? "active" : ""} type="button">
              {item}
            </button>
          ))}
        </nav>

        <div className="nx-top-actions">
          <button type="button" className="nx-demo" onClick={() => setAccountType("Demo")}>
            Demo
          </button>
          <button type="button" className="nx-real" onClick={() => setAccountType("Real")}>
            Real
          </button>

          <div className="nx-balance">
            <span>Balance</span>
            <strong>{accountType === "Demo" ? formatMoney(balanceDisplay, currency) : formatMoney(0, currency)}</strong>
          </div>

          <button type="button" className="nx-avatar">SM</button>

          <select value={currency} onChange={(event) => setCurrency(event.target.value as Currency)}>
            <option value="USD">USD</option>
            <option value="KES">KES</option>
          </select>
        </div>
      </header>

      <section className="nx-chart-section">
        <div className="nx-toolbar">
          <div className="nx-asset-wrap">
            <button type="button" className="nx-asset" onClick={() => setAssetMenuOpen((value) => !value)}>
              🇺🇸 {asset.symbol} ☆
            </button>

            {assetMenuOpen && (
              <div className="nx-asset-menu">
                {ASSETS.map((item) => (
                  <button
                    key={item.symbol}
                    type="button"
                    onClick={() => {
                      setAsset(item);
                      setAssetMenuOpen(false);
                    }}
                  >
                    <strong>{item.symbol}</strong>
                    <span>{item.name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          <span className="nx-payout-label">Payout <strong>{asset.payout}%</strong></span>

          <div className="nx-timeframes">
            {TIMEFRAMES.map((item) => (
              <button
                key={item}
                className={timeframe === item ? "active" : ""}
                type="button"
                onClick={() => setTimeframe(item)}
              >
                {item}
              </button>
            ))}
          </div>

          <div className="nx-tools">
            {CHART_TYPES.map((item) => (
              <button
                key={item}
                type="button"
                className={chartType === item ? "active" : ""}
                onClick={() => setChartType(item)}
              >
                {item}
              </button>
            ))}
            <button type="button">Indicators</button>
            <button type="button">✎</button>
            <button type="button">＋</button>
            <button type="button">−</button>
            <button type="button">T</button>
            <button type="button">•••</button>
          </div>

          <button type="button" className="nx-fullscreen" onClick={toggleFullscreen}>
            ⛶
          </button>
        </div>

        <canvas ref={canvasRef} className="nx-chart-canvas" />

        <div className="nx-chart-controls">
          <button type="button">−</button>
          <button type="button">＋</button>
          <button type="button">‹</button>
          <button type="button">›</button>
          <button type="button">↻</button>
        </div>
      </section>

      <aside className="nx-order-panel">
        <div className="nx-order-field">
          <label>Expiry</label>
          <div className="nx-input-row">
            <span>{formatExpiry(expirySeconds)}</span>
            <button type="button" onClick={() => changeExpiry(-1)}>−</button>
            <button type="button" onClick={() => changeExpiry(1)}>＋</button>
          </div>
        </div>

        <div className="nx-order-field">
          <label>Amount</label>
          <div className="nx-input-row">
            <span>$</span>
            <input value={amount} onChange={(event) => setAmount(event.target.value)} />
            <button type="button" onClick={() => setAmount(String(Math.max(1, stake - 1)))}>−</button>
            <button type="button" onClick={() => setAmount(String(stake + 1))}>＋</button>
          </div>
        </div>

        <div className="nx-order-payout">
          <span>Payout</span>
          <strong>+{asset.payout}%</strong>
          <small>Expected Profit</small>
          <b>+{formatMoney(profit, currency)}</b>
        </div>

        <button type="button" className="nx-buy" disabled={!canTrade} onClick={() => placeTrade("BUY")}>
          ↗ BUY
        </button>

        <button type="button" className="nx-sell" disabled={!canTrade} onClick={() => placeTrade("SELL")}>
          ↘ SELL
        </button>
      </aside>

      <section className="nx-bottom">
        <div className="nx-watchlist">
          <h4>Watchlist <span>★</span></h4>

          {WATCHLIST.map((item) => (
            <button key={item.symbol} type="button">
              <span>{item.symbol}</span>
              <strong>{item.payout}%</strong>
            </button>
          ))}
        </div>

        <div className="nx-table-card">
          <div className="nx-tabs">
            {(["Open Trades", "Trade History", "Signals"] as BottomTab[]).map((tab) => (
              <button
                key={tab}
                type="button"
                className={bottomTab === tab ? "active" : ""}
                onClick={() => setBottomTab(tab)}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="nx-empty-table">
            <strong>{bottomTab}</strong>
            <p>No {bottomTab.toLowerCase()} yet.</p>
          </div>
        </div>
      </section>
    </main>
  );
}