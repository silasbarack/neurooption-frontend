import type { AccountCurrency, AccountType } from "./auth.types";

export type AssetCategory =
  | "Currencies"
  | "Cryptocurrencies"
  | "Stocks"
  | "Indices"
  | "Commodities";

export type ChartType = "Candlesticks" | "Heiken Ashi" | "Bars" | "Line";

export type TradeDirection = "BUY" | "SELL";

export type Timeframe =
  | "S5"
  | "S10"
  | "S15"
  | "S30"
  | "M1"
  | "M2"
  | "M3"
  | "M5"
  | "M10"
  | "M15"
  | "M30"
  | "H1"
  | "H4"
  | "D1";

export type TradingAsset = {
  symbol: string;
  displayName: string;
  category: AssetCategory;
  market: "OTC" | "Real";
  basePrice: number;
  precision: number;
  payout: number;
};

export type Candle = {
  id: number;
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
};

export type TradeMarker = {
  id: string;
  direction: TradeDirection;
  amount: number;
  currency: AccountCurrency;
  entryPrice: number;
  entryTime: number;
  expirySeconds: number;
  payoutPercent: number;
  expectedProfit: number;
  expectedReturn: number;
  settled: boolean;
};

export type TradeResultMarker = {
  id: string;
  direction: TradeDirection;
  won: boolean;
  amount: number;
  currency: AccountCurrency;
  entryPrice: number;
  closePrice: number;
  createdAt: number;
};

export type TradingAccountState = {
  accountType: AccountType;
  currency: AccountCurrency;
  demoBalanceUsd: number;
  realBalanceUsd: number;
};