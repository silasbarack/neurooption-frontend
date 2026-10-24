import { API_BASE_URL } from "./tradesApi";
import { getMarketSocket, MARKET_SOCKET_EVENTS, type ServerTimeResponse } from "./marketSocket";

/**
 * The server's clock, kept locally.
 *
 * The backend's UTC time is sampled over the market socket (on connect, every
 * 30 s, and when the page wakes up). Between samples the clock advances with
 * performance.now(), which is monotonic, so changing the device clock does not
 * move it. If the monotonic and wall clocks disagree (the device slept, or its
 * clock was changed) the wall clock plus the last offset is used until the
 * next sample, which is requested at once.
 */

const RESYNC_MS = 30_000;
const MAX_ACCEPTED_RTT_MS = 5_000;
const DRIFT_TOLERANCE_MS = 1_500;

let anchorServerMs = 0;
let anchorPerfMs = 0;
let anchorWallMs = 0;
let offsetMs = 0;
let bestRttMs = Infinity;
let bestRttAt = 0;
let synced = false;
let started = false;
const listeners = new Set<() => void>();

function notify() {
  listeners.forEach((listener) => listener());
}

/** Current server time (UTC epoch ms). */
export function serverNow() {
  if (!synced) return Date.now();
  const monotonic = anchorServerMs + (performance.now() - anchorPerfMs);
  const wall = Date.now() + offsetMs;
  if (Math.abs(monotonic - wall) > DRIFT_TOLERANCE_MS) {
    requestServerTimeSync();
    return wall;
  }
  return monotonic;
}

/** serverNow() - Date.now(), for code that works from Date.now(). */
export function serverOffsetMs() {
  return serverNow() - Date.now();
}

export function isServerClockSynced() {
  return synced;
}

export function subscribeServerClock(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

/**
 * Records one round trip. Samples with a slow round trip are only used when
 * there is nothing better recent, since their midpoint is less certain.
 */
export function recordServerTimeSample(sentPerf: number, receivedPerf: number, serverTimestamp: number) {
  const rtt = receivedPerf - sentPerf;
  if (!Number.isFinite(serverTimestamp) || !(rtt >= 0) || rtt > MAX_ACCEPTED_RTT_MS) return false;

  const now = performance.now();
  const stale = now - bestRttAt > 2 * 60_000;
  if (synced && !stale && rtt > bestRttMs * 1.5 + 20) return false;

  bestRttMs = rtt;
  bestRttAt = now;
  anchorServerMs = serverTimestamp + rtt / 2;
  anchorPerfMs = receivedPerf;
  anchorWallMs = Date.now() - (performance.now() - receivedPerf);
  offsetMs = anchorServerMs - anchorWallMs;
  synced = true;
  notify();
  return true;
}

let pending = false;

export function requestServerTimeSync() {
  const socket = getMarketSocket(API_BASE_URL);
  if (pending || !socket.connected) return;
  pending = true;
  const sentPerf = performance.now();
  socket.timeout(MAX_ACCEPTED_RTT_MS).emit(
    MARKET_SOCKET_EVENTS.SERVER_TIME,
    { clientSentAt: Date.now() },
    (error: Error | null, response: ServerTimeResponse) => {
      pending = false;
      if (error || !response) return;
      recordServerTimeSample(sentPerf, performance.now(), Number(response.serverTimestamp));
    },
  );
}

/**
 * Coarse sample from a server push (no round trip, so off by the one-way
 * latency). Used only until a proper round-trip sample arrives.
 */
export function seedServerTime(serverTimestamp: number) {
  if (synced || !Number.isFinite(serverTimestamp)) return;
  const now = performance.now();
  recordServerTimeSample(now, now, serverTimestamp);
  // Any real round-trip sample replaces this one.
  bestRttMs = Infinity;
}

/** Starts keeping the clock in sync (idempotent). */
export function ensureServerClock() {
  if (started || typeof window === "undefined") return;
  started = true;
  const socket = getMarketSocket(API_BASE_URL);
  const resync = () => {
    // After a reconnect or wake-up the old round-trip estimate may not hold.
    bestRttAt = 0;
    requestServerTimeSync();
  };
  socket.on("connect", resync);
  socket.on("connected", (data: { serverTimestamp?: number }) => seedServerTime(Number(data?.serverTimestamp)));
  window.setInterval(requestServerTimeSync, RESYNC_MS);
  document.addEventListener("visibilitychange", () => {
    if (!document.hidden) resync();
  });
  window.addEventListener("online", resync);
  window.addEventListener("pageshow", resync);
  if (socket.connected) resync();
}
