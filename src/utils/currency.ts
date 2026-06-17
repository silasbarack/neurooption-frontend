import type { AccountCurrency } from "../types/auth.types";

export const LOCAL_EXCHANGE_RATES: Record<AccountCurrency, number> = {
  USD: 1,
  KES: 129,
  UGX: 3720,
  TZS: 2550,
  NGN: 1510,
  XOF: 604,
  EUR: 0.92,
  CAD: 1.36,
  JPY: 157,
  CNY: 7.24,
  AOA: 865,
  ZAR: 18.2,
  BRL: 5.42,
};

export function convertFromUsd(amountUsd: number, currency: AccountCurrency) {
  return amountUsd * LOCAL_EXCHANGE_RATES[currency];
}

export function convertToUsd(amount: number, currency: AccountCurrency) {
  return amount / LOCAL_EXCHANGE_RATES[currency];
}

export function formatCurrency(amount: number, currency: AccountCurrency) {
  const decimals = currency === "JPY" || currency === "UGX" || currency === "TZS" || currency === "XOF" ? 0 : 2;

  const formatted = amount.toLocaleString("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });

  if (currency === "USD") return `$${formatted}`;
  if (currency === "EUR") return `€${formatted}`;
  if (currency === "JPY") return `¥${formatted}`;
  if (currency === "ZAR") return `R${formatted}`;
  if (currency === "BRL") return `R$${formatted}`;

  return `${currency} ${formatted}`;
}