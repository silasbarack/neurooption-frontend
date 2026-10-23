import { create } from 'zustand'
import { MARKETS } from '../utils/markets'

const DEFAULT_MARKET = MARKETS.find(m => m.id === 'EUR/USD-OTC')

export const useTradeStore = create((set, get) => ({
  // Auth
  user: null,
  token: null,
  isAuthenticated: false,

  // Account
  balance: 10000.00,
  demoBalance: 10000.00,
  isDemo: true,

  // Active market & chart
  activeMarket: DEFAULT_MARKET,
  chartTimeframe: 60,   // seconds
  chartData: [],

  // Trade form
  tradeAmount: 100,
  tradeExpiry: 60,     // seconds
  direction: null,     // 'up' | 'down'

  // Active trades
  activeTrades: [],
  tradeHistory: [],

  // AI signals
  aiSignals: [],
  aiEnabled: false,

  // UI
  currentPage: 'trade',
  sidebarOpen: true,
  marketCategory: 'OTC_FOREX',
  searchQuery: '',

  // Socket
  socket: null,
  isConnected: false,
  tickData: {},          // { [marketId]: { price, change, changeP, bid, ask, ts } }

  // ─── Actions ────────────────────────────────────────
  setUser: (user, token) => set({ user, token, isAuthenticated: true }),
  logout: () => set({ user: null, token: null, isAuthenticated: false }),

  setActiveMarket: (market) => set({ activeMarket: market, chartData: [] }),
  setChartTimeframe: (tf) => set({ chartTimeframe: tf }),
  appendChartCandle: (candle) => set(s => ({ chartData: [...s.chartData.slice(-499), candle] })),
  setChartData: (data) => set({ chartData: data }),

  setTradeAmount: (amount) => set({ tradeAmount: amount }),
  setTradeExpiry: (expiry) => set({ tradeExpiry: expiry }),
  setDirection: (direction) => set({ direction }),

  toggleDemo: () => set(s => ({ isDemo: !s.isDemo })),

  updateBalance: (amount) => set(s =>
    s.isDemo
      ? { demoBalance: s.demoBalance + amount }
      : { balance: s.balance + amount }
  ),

  getActiveBalance: () => {
    const s = get()
    return s.isDemo ? s.demoBalance : s.balance
  },

  placeTrade: (trade) => {
    const s = get()
    const cost = trade.amount
    const bal = s.isDemo ? s.demoBalance : s.balance
    if (bal < cost) return { ok: false, error: 'Insufficient balance' }

    const newTrade = {
      id: `trade_${Date.now()}`,
      marketId: s.activeMarket.id,
      symbol: s.activeMarket.symbol,
      direction: trade.direction,
      amount: cost,
      expiry: trade.expiry,
      openPrice: s.tickData[s.activeMarket.id]?.price || 0,
      openTime: Date.now(),
      closeTime: Date.now() + trade.expiry * 1000,
      payout: s.activeMarket.payout,
      status: 'active',
      isDemo: s.isDemo,
    }

    if (s.isDemo) {
      set(ss => ({ demoBalance: ss.demoBalance - cost, activeTrades: [...ss.activeTrades, newTrade] }))
    } else {
      set(ss => ({ balance: ss.balance - cost, activeTrades: [...ss.activeTrades, newTrade] }))
    }

    // Auto-resolve after expiry
    setTimeout(() => {
      get().resolveTrade(newTrade.id)
    }, trade.expiry * 1000)

    return { ok: true, trade: newTrade }
  },

  resolveTrade: (tradeId) => {
    const s = get()
    const trade = s.activeTrades.find(t => t.id === tradeId)
    if (!trade) return

    const currentPrice = s.tickData[trade.marketId]?.price || trade.openPrice
    const priceMove = currentPrice - trade.openPrice
    const won = (trade.direction === 'up' && priceMove > 0) ||
                (trade.direction === 'down' && priceMove < 0)

    const profit = won ? trade.amount * (trade.payout / 100) : -trade.amount
    const resolved = { ...trade, status: won ? 'won' : 'lost', closePrice: currentPrice, profit }

    if (trade.isDemo) {
      set(ss => ({
        demoBalance: ss.demoBalance + (won ? trade.amount + profit : 0),
        activeTrades: ss.activeTrades.filter(t => t.id !== tradeId),
        tradeHistory: [resolved, ...ss.tradeHistory].slice(0, 100),
      }))
    } else {
      set(ss => ({
        balance: ss.balance + (won ? trade.amount + profit : 0),
        activeTrades: ss.activeTrades.filter(t => t.id !== tradeId),
        tradeHistory: [resolved, ...ss.tradeHistory].slice(0, 100),
      }))
    }
  },

  updateTick: (marketId, tick) => set(s => ({
    tickData: { ...s.tickData, [marketId]: tick }
  })),

  setAISignals: (signals) => set({ aiSignals: signals }),
  toggleAI: () => set(s => ({ aiEnabled: !s.aiEnabled })),

  setCurrentPage: (page) => set({ currentPage: page }),
  setMarketCategory: (cat) => set({ marketCategory: cat }),
  setSearchQuery: (q) => set({ searchQuery: q }),
  setSocket: (socket, isConnected) => set({ socket, isConnected }),
}))
