import type { AccountCurrency, AccountType } from "./auth.types";

export type WalletBalance = {
  accountType: AccountType;
  currency: AccountCurrency;
  balance: number;
  balanceUsd: number;
};

export type TopUpPayload = {
  amount: number;
  currency: AccountCurrency;
  accountType: AccountType;
};

export type TopUpResponse = {
  success: boolean;
  message: string;
  balance?: number;
};