import type { AccountType, Currency } from "./trading.types";

export type MessageResponse = {
  message: string;
};

export type WalletBalance = {
  accountType: AccountType;
  currency: Currency;
  balance: number;
  balanceUsd?: number;
};

export type Wallet = {
  id: string;
  userId: string;
  currency: Currency;
  balance: number;
  accountType?: AccountType;
  createdAt?: string;
  updatedAt?: string;
};

export type TransactionType = "DEPOSIT" | "WITHDRAWAL" | "TRADE" | "BONUS";

export type TransactionStatus =
  | "PENDING"
  | "APPROVED"
  | "REJECTED"
  | "COMPLETED"
  | "FAILED";

export type Transaction = {
  id: string;
  type: TransactionType | string;
  status: TransactionStatus | string;
  amount: number;
  currency: Currency;
  reference?: string;
  createdAt?: string;
};

export type TopUpPayload = {
  amount: number;
  currency: Currency;
  accountType?: AccountType;
  method?: string;
};

export type TopUpResponse = {
  message: string;
  transaction?: Transaction;
  wallet?: WalletBalance;
};

export type DepositPayload = TopUpPayload;

export type WithdrawPayload = {
  amount: number;
  currency: Currency;
  accountType?: AccountType;
  method?: string;
  accountNumber?: string;
};

export type WalletResponse = {
  wallet: WalletBalance;
};

export type TransactionsResponse = {
  transactions: Transaction[];
};