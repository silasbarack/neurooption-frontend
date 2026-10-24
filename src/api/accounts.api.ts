import { api } from './api';

export const accountsApi = {
  getUserAccounts: (userId: string) =>
    api.get(`/trading-accounts/user/${userId}`),

  switchDemoCurrency: (userId: string, currency: string) =>
    api.patch(`/demo-accounts/user/${userId}/switch-currency`, {
      currency,
    }),

  switchRealCurrency: (userId: string, currency: string) =>
    api.patch(`/real-accounts/user/${userId}/switch-currency`, {
      currency,
    }),

  resetDemo: (accountId: string) =>
    api.patch(`/demo-accounts/${accountId}/reset`),
};