import type { AccountType, Currency, TradeSide } from "./trading.types";
import { clearToken, getToken } from "../../utils/storage";

export type BackendTradeStatus = "PENDING" | "WON" | "LOST" | "DRAW";

export type BackendTrade = {
  id: string;
  userId: string;
  asset: string;
  timeframe: string;
  side: TradeSide;
  accountType: AccountType;
  currency: Currency;

  stakeAmount: number;
  stakeUsd: number;

  payoutPercent: number;
  expectedProfitAmount: number;
  expectedProfitUsd: number;
  expectedReturnAmount: number;
  expectedReturnUsd: number;

  entryPrice: number;
  entryTime: number;
  expirySeconds: number;
  expiryTime: number;

  status: BackendTradeStatus;
  closePrice?: number;
  settledAt?: number;

  resultAmount?: number;
  resultUsd?: number;
  profitAmount?: number;
  profitUsd?: number;
};

export const API_BASE_URL = (
  (import.meta.env.VITE_API_URL as string | undefined) || "http://localhost:4000"
).replace(/\/$/, "");

// The backend takes the user from the sign-in token; this is only the
// placeholder it uses for guests.
export const USER_ID = "demo-user";

/** Sends the sign-in token so the trading engine uses the user's own account. */
export function authHeaders(): Record<string, string> {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export const CURRENCY_SYMBOLS: Record<Currency, string> = {
  USD: "$",
  KES: "KES",
  UGX: "UGX",
  TZS: "TZS",
  NGN: "NGN",
  XOF: "XOF",
  EUR: "€",
  CAD: "CAD",
  JPY: "¥",
  CNY: "¥",
  AOA: "AOA",
  ZAR: "R",
  BRL: "R$",
};

export function formatMoney(value: number, currency: Currency) {
  const symbol = CURRENCY_SYMBOLS[currency];

  const decimals =
    currency === "JPY" ||
    currency === "UGX" ||
    currency === "TZS" ||
    currency === "XOF"
      ? 0
      : 2;

  const safeValue = Number.isFinite(value) ? value : 0;

  const formatted = safeValue.toLocaleString("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });

  if (
    currency === "USD" ||
    currency === "EUR" ||
    currency === "JPY" ||
    currency === "ZAR" ||
    currency === "BRL"
  ) {
    return `${symbol}${formatted}`;
  }

  return `${currency} ${formatted}`;
}

export async function fetchJson<T>(url: string, signal?: AbortSignal): Promise<T> {
  const response = await fetch(url, {
    method: "GET",
    headers: {
      Accept: "application/json",
      ...authHeaders(),
    },
    signal,
  });

  if (response.status === 401 && getToken()) {
    // Expired or revoked session: sign in again rather than show stale data.
    clearToken();
    window.location.assign("/login");
  }

  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`);
  }

  return response.json() as Promise<T>;
}

export async function fetchOpenTrades(signal?: AbortSignal) {
  return fetchJson<BackendTrade[]>(
    `${API_BASE_URL}/trading-engine/trades/open?userId=${encodeURIComponent(USER_ID)}`,
    signal
  );
}

export async function fetchTradeHistory(signal?: AbortSignal) {
  return fetchJson<BackendTrade[]>(
    `${API_BASE_URL}/trading-engine/trades/history?userId=${encodeURIComponent(USER_ID)}`,
    signal
  );
}
