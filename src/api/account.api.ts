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

export type DeletionReason = { code: string; label: string };

export type DeletionBlocker = {
  code: string;
  message: string;
  action?: { label: string; path: string };
};

export type DeletionCheck = {
  canDelete: boolean;
  blockers: DeletionBlocker[];
  reasons: DeletionReason[];
  confirmationWord: string;
  /** The account email with most of it hidden, e.g. "s***@gmail.com". */
  emailHint: string;
};

export type DeleteAccountRequest = {
  password: string;
  confirmation: string;
  reason?: string;
  comment?: string;
};

export type DeleteAccountResult = {
  success: boolean;
  message: string;
  /** Quote this when contacting Support, e.g. "DEL-3F9A12BC". */
  reference: string;
  /** Legacy immediate-send flag; emailDelivery takes precedence for queued notices. */
  emailSent: boolean;
  emailDelivery?: "queued";
  deletedAt?: string;
  emailHint: string;
};

export const accountApi = {
  me: () => api.get<AccountSummary>("/account/me"),
  deletionCheck: () => api.get<DeletionCheck>("/account/deletion"),
  deleteAccount: async (body: DeleteAccountRequest): Promise<DeleteAccountResult> => {
    const result = await api.post<DeleteAccountResult>("/account/delete", body);
    if (!result || result.success !== true || typeof result.reference !== "string" || !result.reference) {
      throw new Error("Could not verify the deletion result. Check your email or contact Support before trying again.");
    }
    return result;
  },
};

export const marketQuotesApi = {
  quotes: () => api.get<{ serverTime: string; quotes: MarketQuote[] }>("/market-data/quotes", false),
};
