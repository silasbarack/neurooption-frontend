import { api } from "./api";

export type AccountSummary = {
  id: string;
  accountNumber: string;
  fullName: string;
  email: string;
  phone: string | null;
  role: string;
  status: string;
  kycStatus: "NOT_SUBMITTED" | "PENDING" | "APPROVED" | "REJECTED";
  verified: boolean;
  memberSince: string;
  profile: {
    completion: number;
    checklist: Array<{ key: string; label: string; done: boolean }>;
  };
  real: { currency: string; balance: number; locked: number };
  demo: { currency: string; balance: number };
};

export type MarketQuote = {
  symbol: string;
  label: string;
  category: string;
  precision: number;
  price: number;
  changePercent: number;
  payout: number;
};

export const accountApi = {
  me: () => api.get<AccountSummary>("/account/me"),
};

export const marketQuotesApi = {
  quotes: () => api.get<{ serverTime: string; quotes: MarketQuote[] }>("/market-data/quotes", false),
};
