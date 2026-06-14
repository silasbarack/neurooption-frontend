// frontend/src/pages/TradingPage.tsx
import { useEffect, useMemo, useRef, useState } from "react";
import "./TradingPage.css";

type Candle = {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
};

type TradeDirection = "BUY" | "SELL";

const ASSETS = [
  "EUR/USD OTC",
  "GBP/USD OTC",
  "USD/JPY OTC",
  "CAD/JPY OTC",
  "EUR/JPY OTC",
  "AUD/USD OTC",
  "USD/CAD OTC",
  "BTC/USD OTC",
  "ETH/USD OTC",
  "XAU/USD OTC",
];

function getBackendBaseUrl() {
  return (
    import.meta.env.VITE_API_URL || "https://neurooption-backend.onrender.com"
  ).replace(/\/+$/, "");
}

function getWebSocketUrl(asset: string) {
  const configuredUrl = import.meta.env.VITE_WS_URL as string | undefined;

  if (configuredUrl) {
    return `${configuredUrl.replace(/\/+$/, "")}?asset=${encodeURIComponent(asset)}`;
  }

  const apiUrl = getBackendBaseUrl();

  return `${apiUrl.replace(/^http/, "ws")}/market?asset=${encodeURIComponent(asset)}`;
}

function generateSeedCandles(asset: string): Candle[] {
  const seed = asset
    .split("")
    .reduce((total, char) => total + char.charCodeAt(0), 0);

  const base = 1 + (seed % 90) / 100;
  const now = Date.now();
  const candles: Candle[] = [];

  let lastClose = base;

  for (let index = 120; index >= 0; index--) {
    const time = now - index * 1000;
    const movement = (Math.sin(index / 6) + Math.random() - 0.5) * 0.0015;
    const open = lastClose;
    const close = Math.max(0.0001, open + movement);
    const high = Math.max(open, close) + Math.random() * 0.001;
    const low = Math.min(open, close) - Math.random() * 0.001;

    candles.push({
      time,
      open,
      high,
      low,
      close,
    });

    lastClose = close;
  }

  return candles;
}

function normalizeIncomingCandle(message: any, previous?: Candle): Candle | null {
  const raw = message?.candle || message?.data || message;

  const price = Number(raw?.price || raw?.close || raw?.bid || raw?.ask);
  const time = Number(raw?.time || raw?.timestamp || Date.now());

  if (!Number.isFinite(price)) {
    return null;
  }

  if (raw?.open && raw?.high && raw?.low && raw?.close) {
    return {
      time,
      open: Number(raw.open),
      high: Number(raw.high),
      low: Number(raw.low),
      close: Number(raw.close),
    };
  }

  if (!previous) {
    return {
      time,
      open: price,
      high: price,
      low: price,
      close: price,
    };
  }

  return {
    time,
    open: previous.open,
    high: Math.max(previous.high, price),
    low: Math.min(previous.low, price),
    close: price,
  };
}

function drawCandles(canvas: HTMLCanvasElement, candles: Candle[]) {
  const context = canvas.getContext("2d");
  if (!context) return;

  const ratio = window.devicePixelRatio || 1;
  const width = canvas.clientWidth;
  const height = canvas.clientHeight;

  canvas.width = Math.floor(width * ratio);
  canvas.height = Math.floor(height * ratio);

  context.setTransform(ratio, 0, 0, ratio, 0, 0);
  context.clearRect(0, 0, width, height);

  const gradient = context.createLinearGradient(0, 0, 0, height);
  gradient.addColorStop(0, "#101827");
  gradient.addColorStop(1, "#080d16");
  context.fillStyle = gradient;
  context.fillRect(0, 0, width, height);

  context.strokeStyle = "rgba(148, 163, 184, 0.12)";
  context.lineWidth = 1;

  for (let y = 40; y < height; y += 48) {
    context.beginPath();
    context.moveTo(0, y);
    context.lineTo(width, y);
    context.stroke();
  }

  for (let x = 60; x < width; x += 80) {
    context.beginPath();
    context.moveTo(x, 0);
    context.lineTo(x, height);
    context.stroke();
  }

  if (!candles.length) return;

  const visible = candles.slice(-90);
  const prices = visible.flatMap((candle) => [candle.high, candle.low]);
  const min = Math.min(...prices);
  const max = Math.max(...prices);
  const range = max - min || 1;

  const topPadding = 24;
  const bottomPadding = 28;
  const chartHeight = height - topPadding - bottomPadding;
  const candleGap = 3;
  const candleWidth = Math.max(4, width / visible.length - candleGap);

  function y(price: number) {
    return topPadding + ((max - price) / range) * chartHeight;
  }

  visible.forEach((candle, index) => {
    const x = index * (width / visible.length) + 4;
    const openY = y(candle.open);
    const closeY = y(candle.close);
    const highY = y(candle.high);
    const lowY = y(candle.low);
    const bullish = candle.close >= candle.open;

    context.strokeStyle = bullish ? "#23d18b" : "#ff5c75";
    context.fillStyle = bullish ? "#23d18b" : "#ff5c75";

    context.beginPath();
    context.moveTo(x + candleWidth / 2, highY);
    context.lineTo(x + candleWidth / 2, lowY);
    context.stroke();

    const bodyY = Math.min(openY, closeY);
    const bodyHeight = Math.max(Math.abs(closeY - openY), 2);

    context.fillRect(x, bodyY, candleWidth, bodyHeight);
  });

  const last = visible[visible.length - 1];

  context.fillStyle = "#e5eefc";
  context.font = "600 13px Roboto, sans-serif";
  context.fillText(last.close.toFixed(5), width - 92, y(last.close) - 8);

  context.strokeStyle = "rgba(56, 189, 248, 0.55)";
  context.setLineDash([6, 6]);
  context.beginPath();
  context.moveTo(0, y(last.close));
  context.lineTo(width, y(last.close));
  context.stroke();
  context.setLineDash([]);
}

export default function TradingPage() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationRef = useRef<number | null>(null);
  const candlesRef = useRef<Candle[]>([]);
  const socketRef = useRef<WebSocket | null>(null);

  const [asset, setAsset] = useState("EUR/USD OTC");
  const [connectionStatus, setConnectionStatus] = useState("Connecting");
  const [lastPrice, setLastPrice] = useState<number | null>(null);
  const [amount, setAmount] = useState(100);
  const [expirySeconds, setExpirySeconds] = useState(30);
  const [resultMessage, setResultMessage] = useState("");

  const payout = useMemo(() => 0.82, []);
  const expectedProfit = useMemo(() => amount * payout, [amount, payout]);

  function scheduleDraw() {
    if (animationRef.current) return;

    animationRef.current = requestAnimationFrame(() => {
      animationRef.current = null;

      if (canvasRef.current) {
        drawCandles(canvasRef.current, candlesRef.current);
      }
    });
  }

  useEffect(() => {
    candlesRef.current = generateSeedCandles(asset);
    setLastPrice(candlesRef.current[candlesRef.current.length - 1]?.close ?? null);
    scheduleDraw();

    if (socketRef.current) {
      socketRef.current.close();
    }

    const wsUrl = getWebSocketUrl(asset);
    const socket = new WebSocket(wsUrl);
    socketRef.current = socket;

    socket.onopen = () => {
      setConnectionStatus("Live");
    };

    socket.onmessage = (event) => {
      try {
        const parsed = JSON.parse(event.data);
        const previous = candlesRef.current[candlesRef.current.length - 1];
        const next = normalizeIncomingCandle(parsed, previous);

        if (!next) return;

        const last = candlesRef.current[candlesRef.current.length - 1];
        const sameSecond =
          last && Math.floor(last.time / 1000) === Math.floor(next.time / 1000);

        if (sameSecond) {
          candlesRef.current[candlesRef.current.length - 1] = {
            ...last,
            high: Math.max(last.high, next.high, next.close),
            low: Math.min(last.low, next.low, next.close),
            close: next.close,
          };
        } else {
          candlesRef.current.push(next);
        }

        candlesRef.current = candlesRef.current.slice(-200);
        setLastPrice(next.close);
        scheduleDraw();
      } catch {
        // Ignore invalid socket messages safely.
      }
    };

    socket.onerror = () => {
      setConnectionStatus("Socket Error");
    };

    socket.onclose = () => {
      setConnectionStatus("Disconnected");
    };

    return () => {
      socket.close();
    };
  }, [asset]);

  useEffect(() => {
    const handleResize = () => scheduleDraw();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);

      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  function handleTrade(direction: TradeDirection) {
    const entryPrice =
      candlesRef.current[candlesRef.current.length - 1]?.close || lastPrice;

    if (!entryPrice) {
      setResultMessage("Price is not ready yet.");
      setTimeout(() => setResultMessage(""), 10000);
      return;
    }

    setResultMessage(`${direction} trade placed on ${asset}. Waiting for expiry...`);

    setTimeout(() => {
      const exitPrice =
        candlesRef.current[candlesRef.current.length - 1]?.close || entryPrice;

      const won =
        direction === "BUY" ? exitPrice > entryPrice : exitPrice < entryPrice;

      if (won) {
        setResultMessage(
          `Correct trade. You gained ${expectedProfit.toFixed(2)}.`,
        );
      } else {
        setResultMessage(`Wrong trade. You lost ${amount.toFixed(2)}.`);
      }

      setTimeout(() => {
        setResultMessage("");
      }, 10000);
    }, expirySeconds * 1000);
  }

  return (
    <main className="trading-screen">
      <header className="trading-header">
        <div className="brand-block">
          <div className="brand-icon">N</div>
          <div>
            <h1>NeuroOption</h1>
            <span>Real-time trading terminal</span>
          </div>
        </div>

        <div className="market-status">
          <span className={connectionStatus === "Live" ? "live-dot" : "offline-dot"} />
          {connectionStatus}
        </div>
      </header>

      <section className="trading-layout">
        <aside className="asset-panel">
          <label>Asset</label>
          <select value={asset} onChange={(event) => setAsset(event.target.value)}>
            {ASSETS.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>

          <div className="price-card">
            <span>Current Price</span>
            <strong>{lastPrice ? lastPrice.toFixed(5) : "Loading..."}</strong>
          </div>

          <div className="timeframes">
            {["S5", "S15", "S30", "M1", "M5", "M15"].map((tf) => (
              <button key={tf}>{tf}</button>
            ))}
          </div>
        </aside>

        <section className="chart-card">
          <div className="chart-toolbar">
            <div>
              <strong>{asset}</strong>
              <span>OTC Market</span>
            </div>

            <div className="chart-tools">
              <button>Candles</button>
              <button>Indicators</button>
              <button>Drawing</button>
            </div>
          </div>

          <canvas ref={canvasRef} className="chart-canvas" />

          {resultMessage && <div className="trade-result">{resultMessage}</div>}
        </section>

        <aside className="trade-panel">
          <label>Trade Amount</label>
          <input
            type="number"
            min="1"
            value={amount}
            onChange={(event) => setAmount(Number(event.target.value))}
          />

          <label>Expiry</label>
          <div className="expiry-row">
            <button onClick={() => setExpirySeconds((value) => Math.max(5, value - 1))}>
              -
            </button>
            <strong>{expirySeconds}s</strong>
            <button onClick={() => setExpirySeconds((value) => Math.min(18000, value + 1))}>
              +
            </button>
          </div>

          <div className="profit-preview">
            <span>Payout</span>
            <strong>{Math.round(payout * 100)}%</strong>
          </div>

          <div className="profit-preview">
            <span>Expected Profit</span>
            <strong>{expectedProfit.toFixed(2)}</strong>
          </div>

          <button className="buy-button" onClick={() => handleTrade("BUY")}>
            BUY
          </button>

          <button className="sell-button" onClick={() => handleTrade("SELL")}>
            SELL
          </button>
        </aside>
      </section>
    </main>
  );
}