import type {
  MessageResponse,
  TopUpPayload,
  TopUpResponse,
  Transaction,
  TransactionsResponse,
  WalletBalance,
  WalletResponse,
  WithdrawPayload,
} from "../types/wallet.types";

const API_URL = import.meta.env.VITE_API_URL || "https://neurooption-backend.onrender.com";

function getToken() {
  return localStorage.getItem("token") || localStorage.getItem("accessToken") || "";
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
  });

  if (!response.ok) {
    let message = `Request failed with status ${response.status}`;

    try {
      const errorBody = await response.json();
      message = errorBody.message || message;
    } catch {
      // Keep default message.
    }

    throw new Error(message);
  }

  return response.json() as Promise<T>;
}

export async function getWalletBalance(): Promise<WalletBalance> {
  const data = await request<WalletResponse | WalletBalance>("/wallet/balance");
  return "wallet" in data ? data.wallet : data;
}

export async function topUp(payload: TopUpPayload): Promise<TopUpResponse> {
  return request<TopUpResponse>("/wallet/top-up", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function withdraw(payload: WithdrawPayload): Promise<MessageResponse> {
  return request<MessageResponse>("/wallet/withdraw", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function getTransactions(): Promise<Transaction[]> {
  const data = await request<TransactionsResponse | Transaction[]>("/wallet/transactions");
  return Array.isArray(data) ? data : data.transactions;
}

export const walletApi = {
  getWalletBalance,
  topUp,
  withdraw,
  getTransactions,
};

export default walletApi;