import type { AccountCurrency } from "../types/auth.types";

export const EXCHANGE_RATES_TO_USD: Record<AccountCurrency, number> = {
  USD: 1,
  KES: 129,
  UGX: 3720,
  TZS: 2600,
  NGN: 1500,
  XOF: 610,
  EUR: 0.92,
  CAD: 1.37,
  JPY: 157,
  CNY: 7.25,
  AOA: 890,
  ZAR: 18.2,
  BRL: 5.45,
};

export const CURRENCY_SYMBOLS: Record<AccountCurrency, string> = {
  USD: "$",
  KES: "KES",
  UGX: "UGX",
  TZS: "TZS",
  NGN: "₦",
  XOF: "XOF",
  EUR: "€",
  CAD: "CAD",
  JPY: "¥",
  CNY: "¥",
  AOA: "AOA",
  ZAR: "R",
  BRL: "R$",
};

export function convertFromUsd(amountUsd: number, currency: AccountCurrency): number {
  const rate = EXCHANGE_RATES_TO_USD[currency] ?? 1;
  return amountUsd * rate;
}

export function convertToUsd(amount: number, currency: AccountCurrency): number {
  const rate = EXCHANGE_RATES_TO_USD[currency] ?? 1;
  return amount / rate;
}

export function formatCurrency(amount: number, currency: AccountCurrency): string {
  const symbol = CURRENCY_SYMBOLS[currency];

  const hasDecimals = Math.abs(amount % 1) > 0.001;

  const formatted = new Intl.NumberFormat("en-US", {
    minimumFractionDigits: hasDecimals ? 2 : 0,
    maximumFractionDigits: 2,
  }).format(amount);

  if (currency === "USD" || currency === "EUR" || currency === "JPY" || currency === "CNY" || currency === "NGN" || currency === "ZAR" || currency === "BRL") {
    return `${symbol}${formatted}`;
  }

  return `${currency} ${formatted}`;
}