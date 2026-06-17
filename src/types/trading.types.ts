export type AccountType = "QT Demo" | "QT Real";

export type Currency =
  | "USD"
  | "KES"
  | "UGX"
  | "TZS"
  | "NGN"
  | "XOF"
  | "EUR"
  | "CAD"
  | "JPY"
  | "CNY"
  | "AOA"
  | "ZAR"
  | "BRL";

export type AssetCategory =
  | "Currencies"
  | "Cryptocurrencies"
  | "Stocks"
  | "Indices"
  | "Commodities";

export type ChartType = "Candlesticks" | "Heiken Ashi" | "Bars" | "Line";

export type TradeSide = "BUY" | "SELL";

export type Asset = {
  symbol: string;
  label: string;
  category: AssetCategory;
  basePrice: number;
  precision: number;
  payoutBoost: number;
};

export type Candle = {
  open: number;
  high: number;
  low: number;
  close: number;
  time: number;
};

export type TradeMarker = {
  id: string;
  side: TradeSide;
  entryPrice: number;
  label: string;
};

export type ResultMarker = {
  id: string;
  price: number;
  won: boolean;
  label: string;
};

export type TradePayload = {
  asset: string;
  side: TradeSide;
  amount: number;
  currency: Currency;
  expirySeconds: number;
};

export type TradeResponse = {
  id: string;
  message?: string;
};