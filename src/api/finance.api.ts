import { api } from "./api";

export type FinanceStatus =
  | "PENDING"
  | "PROCESSING"
  | "COMPLETED"
  | "FAILED"
  | "REJECTED"
  | "CANCELLED";

export type FinanceTransaction = {
  id: string;
  type: "Deposit" | "Withdrawal";
  method: string;
  amount: number;
  currency: string;
  status: FinanceStatus;
  phone: string | null;
  reference: string | null;
  createdAt: string;
};

export type FinanceOverview = {
  wallet: { currency: string; balance: number; locked: number };
  mpesa: { configured: boolean; environment: string; minAmount: number; maxAmount: number };
  transactions: FinanceTransaction[];
};

export type StkDeposit = {
  depositId: string;
  status: FinanceStatus;
  amount: number;
  currency: string;
  phone: string | null;
  receipt?: string | null;
  message: string;
};

export const financeApi = {
  overview(): Promise<FinanceOverview> {
    return api.get<FinanceOverview>("/finance/me");
  },

  startMpesaDeposit(phone: string, amount: number): Promise<StkDeposit> {
    return api.post<StkDeposit>("/payments/stk/deposits", { phone, amount });
  },

  mpesaDepositStatus(depositId: string): Promise<StkDeposit> {
    return api.get<StkDeposit>(`/payments/stk/deposits/${encodeURIComponent(depositId)}`);
  },

  requestWithdrawal(phone: string, amount: number) {
    return api.post<{ id: string; status: FinanceStatus; amount: number; message: string }>(
      "/finance/me/withdrawals",
      { phone, amount },
    );
  },
};
