import type { Currency } from "./trading.types";

export type MessageResponse = {
  message: string;
};

export type Wallet = {
  id: string;
  userId: string;
  currency: Currency;
  balance: number;
  accountType?: "QT Demo" | "QT Real";
  createdAt?: string;
  updatedAt?: string;
};

export type TransactionType = "DEPOSIT" | "WITHDRAWAL" | "TRADE" | "BONUS";

export type TransactionStatus = "PENDING" | "APPROVED" | "REJECTED" | "COMPLETED" | "FAILED";

export type Transaction = {
  id: string;
  type: TransactionType | string;
  status: TransactionStatus | string;
  amount: number;
  currency: Currency;
  reference?: string;
  createdAt?: string;
};

export type DepositPayload = {
  amount: number;
  currency: Currency;
  method?: string;
};

export type WithdrawPayload = {
  amount: number;
  currency: Currency;
  method?: string;
  accountNumber?: string;
};