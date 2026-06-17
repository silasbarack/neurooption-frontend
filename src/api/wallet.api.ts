import { api } from "./api";
import type { TopUpPayload, TopUpResponse, WalletBalance } from "../types/wallet.types";

export const walletApi = {
  getBalance(): Promise<WalletBalance> {
    return api.get<WalletBalance>("/wallet/balance");
  },

  topUp(payload: TopUpPayload): Promise<TopUpResponse> {
    return api.post<TopUpResponse>("/wallet/top-up", payload);
  },
};