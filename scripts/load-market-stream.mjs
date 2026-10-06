import { io } from "socket.io-client";

const baseUrl = (process.env.MARKET_WS_URL || "http://localhost:4000").replace(/\/$/, "");
const users = Number(process.env.USERS || 100);
const durationMs = Number(process.env.DURATION_MS || 30000);
const symbols = (process.env.SYMBOLS || "EUR/USD OTC,GBP/USD OTC,USD/JPY OTC")
  .split(",")
  .map((value) => value.trim())
  .filter(Boolean);
const timeframe = process.env.TIMEFRAME || "M1";

if (!Number.isInteger(users) || users < 1 || users > 2000) {
  throw new Error("USERS must be an integer between 1 and 2000");
}

const stats = {
  connected: 0,
  ticks: 0,
  candles: 0,
  reconnects: 0,
  connectErrors: 0,
  latencies: [],
};

const sockets = Array.from({ length: users }, (_, index) => {
  const socket = io(`${baseUrl}/market`, {
    transports: ["websocket"],
    upgrade: false,
    reconnection: true,
    reconnectionDelay: 250,
    reconnectionDelayMax: 5000,
    randomizationFactor: 0.5,
    timeout: 5000,
  });

  let hasConnected = false;

  socket.on("connect_error", (error) => {
    stats.connectErrors += 1;
    if (stats.connectErrors <= 3) {
      console.error("connect_error:", error?.message || String(error));
    }
  });

  socket.on("connect", () => {
    if (hasConnected) stats.reconnects += 1;
    hasConnected = true;
    stats.connected += 1;

    const symbol = symbols[index % symbols.length];
    socket.emit("subscribe_symbol", { symbol, timeframe });
  });

  socket.on("disconnect", () => {
    stats.connected = Math.max(0, stats.connected - 1);
  });

  socket.on("price_update", (tick) => {
    stats.ticks += 1;
    const timestamp = Number(tick?.timestamp);
    if (Number.isFinite(timestamp)) {
      const latency = Date.now() - timestamp;
      if (latency >= 0 && latency < 60000) stats.latencies.push(latency);
    }
  });

  socket.on("candle_update", () => {
    stats.candles += 1;
  });

  return socket;
});

await new Promise((resolve) => setTimeout(resolve, durationMs));

for (const socket of sockets) socket.disconnect();

stats.latencies.sort((a, b) => a - b);
const percentile = (ratio) => {
  if (stats.latencies.length === 0) return null;
  return stats.latencies[
    Math.min(
      stats.latencies.length - 1,
      Math.max(0, Math.ceil(stats.latencies.length * ratio) - 1),
    )
  ];
};

console.log(
  JSON.stringify(
    {
      users,
      durationMs,
      symbols,
      ticks: stats.ticks,
      candles: stats.candles,
      reconnects: stats.reconnects,
      connectErrors: stats.connectErrors,
      tickRatePerSecond: Number((stats.ticks / (durationMs / 1000)).toFixed(2)),
      latencyMs: {
        samples: stats.latencies.length,
        p50: percentile(0.5),
        p95: percentile(0.95),
        p99: percentile(0.99),
        max: stats.latencies.at(-1) ?? null,
      },
    },
    null,
    2,
  ),
);


if (stats.latencies.length === 0 || stats.ticks === 0) {
  console.error("Load stage failed: no production market ticks were received.");
  process.exitCode = 1;
}
