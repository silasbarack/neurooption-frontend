import { api } from './api';

export const tradingApi = {
  createTrade: (data: any) => api.post('/trades', data),

  settleTrade: (tradeId: string, exitPrice: number) =>
    api.patch(`/trades/${tradeId}/settle`, {
      exitPrice,
    }),

  getUserTrades: (userId: string) =>
    api.get(`/trades/user/${userId}`),

  calculatePayout: (assetId: string, stakeAmount: number) =>
    api.post('/payouts/calculate', {
      assetId,
      stakeAmount,
    }),
};