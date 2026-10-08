import React from "react";
import { API_BASE_URL, fetchJson } from "./tradesApi";
import { getMarketSocket } from "./marketSocket";

/**
 * Live asset payouts, as published by the backend payout engine.
 *
 * Loaded once over HTTP, then kept current by the market socket: a full
 * snapshot on every (re)connection and an "asset:payout-updated" event for
 * each change. An update only applies if its version is newer, so a delayed
 * or repeated event can never roll a payout back. Components subscribe per
 * asset, so a payout change re-renders only what shows that asset.
 */

export type AssetPayout = {
  symbol: string;
  payoutPercent: number;
  version: number;
  marketType: "OTC" | "REAL";
  updatedAt: string;
};

export type ExpiryAdjustment = { maxSeconds?: number; minSeconds?: number; adjustPercent: number };

export type PayoutQuote = {
  symbol: string;
  payoutPercent: number;
  assetPayoutPercent: number;
  version: number;
  marketType: "OTC" | "REAL";
};

type PayoutsResponse = {
  expiryAdjustments?: ExpiryAdjustment[];
  bounds?: { minPercent: number; maxPercent: number };
  payouts: Array<Partial<AssetPayout> & { symbol: string }>;
};

export const PAYOUT_EVENTS = {
  UPDATED: "asset:payout-updated",
  SNAPSHOT: "asset:payout-snapshot",
} as const;

// Mirrors the backend defaults until the first response replaces them.
let expiryAdjustments: ExpiryAdjustment[] = [
  { maxSeconds: 15, adjustPercent: -3 },
  { maxSeconds: 30, adjustPercent: -2 },
  { minSeconds: 300, adjustPercent: 1 },
];
let bounds = { minPercent: 20, maxPercent: 92 };

const payouts = new Map<string, AssetPayout>();
const symbolListeners = new Map<string, Set<() => void>>();
const anyListeners = new Set<() => void>();
let lastSyncedAt = 0;
let started = false;

function isValid(entry: Partial<AssetPayout> & { symbol: string }): entry is AssetPayout {
  return (
    typeof entry.symbol === "string" &&
    typeof entry.payoutPercent === "number" &&
    Number.isFinite(entry.payoutPercent) &&
    entry.payoutPercent > 0 &&
    entry.payoutPercent <= 100 &&
    typeof entry.version === "number" &&
    Number.isFinite(entry.version)
  );
}

/**
 * Applies one payout if it is newer than what is held. `authoritative` is for
 * state the server states as current (a connection snapshot, a refused
 * trade's quote): it replaces what is held even with a lower version, which
 * happens when a backend without a database restarts.
 */
export function applyPayout(entry: Partial<AssetPayout> & { symbol: string }, authoritative = false) {
  if (!isValid(entry)) return false;
  const current = payouts.get(entry.symbol);
  if (current && (authoritative ? current.version === entry.version && current.payoutPercent === entry.payoutPercent : current.version >= entry.version)) return false;
  payouts.set(entry.symbol, {
    symbol: entry.symbol,
    payoutPercent: entry.payoutPercent,
    version: entry.version,
    marketType: entry.marketType === "REAL" ? "REAL" : "OTC",
    updatedAt: typeof entry.updatedAt === "string" ? entry.updatedAt : new Date().toISOString(),
  });
  symbolListeners.get(entry.symbol)?.forEach((listener) => listener());
  anyListeners.forEach((listener) => listener());
  return true;
}

function applyMany(list: unknown, authoritative = false) {
  if (!Array.isArray(list)) return;
  for (const item of list) {
    if (item && typeof item === "object" && typeof (item as { symbol?: unknown }).symbol === "string") {
      applyPayout(item as AssetPayout, authoritative);
    }
  }
  lastSyncedAt = Date.now();
}

export async function loadPayouts() {
  const data = await fetchJson<PayoutsResponse>(`${API_BASE_URL}/market-data/payouts`);
  if (Array.isArray(data.expiryAdjustments)) expiryAdjustments = data.expiryAdjustments;
  if (data.bounds && Number.isFinite(data.bounds.minPercent) && Number.isFinite(data.bounds.maxPercent)) {
    bounds = data.bounds;
  }
  applyMany(data.payouts);
}

/** Starts listening for payouts (idempotent). */
export function ensurePayoutFeed() {
  if (started || typeof window === "undefined") return;
  started = true;
  const socket = getMarketSocket(API_BASE_URL);
  // Sent on every (re)connection: covers anything missed while offline.
  socket.on(PAYOUT_EVENTS.SNAPSHOT, (data: { payouts?: unknown }) => applyMany(data?.payouts, true));
  socket.on(PAYOUT_EVENTS.UPDATED, (update: AssetPayout) => {
    if (update && typeof update.symbol === "string") applyPayout(update);
  });

  const refresh = () => loadPayouts().catch(() => undefined);
  refresh();
  // Safety net for a socket that cannot connect (e.g. a strict proxy).
  window.setInterval(() => {
    if (!socket.connected && !document.hidden) refresh();
  }, 60_000);
}

export function getPayout(symbol: string) {
  return payouts.get(symbol);
}

/** True while the socket is live or the last HTTP load is recent. */
export function payoutsAreFresh() {
  if (!started) return false;
  const socket = getMarketSocket(API_BASE_URL);
  return lastSyncedAt > 0 && (socket.connected || Date.now() - lastSyncedAt < 90_000);
}

export function expiryAdjustment(expirySeconds: number) {
  for (const rule of expiryAdjustments) {
    if (rule.maxSeconds !== undefined && expirySeconds <= rule.maxSeconds) return rule.adjustPercent;
    if (rule.minSeconds !== undefined && expirySeconds >= rule.minSeconds) return rule.adjustPercent;
  }
  return 0;
}

/** The payout a trade of this length would be accepted at, as the backend computes it. */
export function quotePayout(symbol: string, expirySeconds: number): PayoutQuote | null {
  const entry = payouts.get(symbol);
  if (!entry) return null;
  const adjusted = Math.min(
    Math.max(entry.payoutPercent + expiryAdjustment(expirySeconds), bounds.minPercent),
    bounds.maxPercent,
  );
  return {
    symbol,
    payoutPercent: adjusted,
    assetPayoutPercent: entry.payoutPercent,
    version: entry.version,
    marketType: entry.marketType,
  };
}

function subscribeSymbol(symbol: string, listener: () => void) {
  let set = symbolListeners.get(symbol);
  if (!set) {
    set = new Set();
    symbolListeners.set(symbol, set);
  }
  set.add(listener);
  return () => {
    set!.delete(listener);
  };
}

/** One asset's payout; re-renders only when that asset's payout changes. */
export function useAssetPayout(symbol: string) {
  React.useEffect(() => ensurePayoutFeed(), []);
  const subscribe = React.useCallback((listener: () => void) => subscribeSymbol(symbol, listener), [symbol]);
  const getSnapshot = React.useCallback(() => payouts.get(symbol), [symbol]);
  return React.useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}
