import { useEffect, useRef, useCallback } from 'react'
import { useTradeStore } from '../store/tradeStore'
import { MARKETS } from '../utils/markets'

// Base prices for simulation
const BASE_PRICES = {
  'EUR/USD': 1.08540, 'GBP/USD': 1.27230, 'USD/JPY': 149.850, 'USD/CHF': 0.89120,
  'AUD/USD': 0.65340, 'USD/CAD': 1.36450, 'NZD/USD': 0.60120, 'EUR/GBP': 0.85320,
  'EUR/JPY': 162.450, 'GBP/JPY': 190.870, 'USD/SGD': 1.34560, 'USD/MXN': 17.4500,
  'USD/TRY': 32.5600, 'EUR/AUD': 1.66120, 'GBP/AUD': 1.94780, 'AUD/JPY': 97.870,
  'CAD/JPY': 109.780, 'CHF/JPY': 168.230, 'USD/INR': 83.2300, 'USD/BRL': 4.9800,
  'BTC/USD': 67450.00, 'ETH/USD': 3520.00, 'BNB/USD': 598.00, 'SOL/USD': 178.00,
  'XRP/USD': 0.5820, 'ADA/USD': 0.4620, 'DOGE/USD': 0.1580, 'AVAX/USD': 37.80,
  'MATIC/USD': 0.7840, 'LTC/USD': 82.50,
  'XAU/USD': 2340.50, 'XAG/USD': 27.85, 'XPT/USD': 980.00, 'WTI/USD': 78.45,
  'BRENT': 82.30, 'NGAS': 2.340, 'COPPER': 4.250, 'WHEAT': 540.00, 'CORN': 420.00, 'COFFEE': 180.00,
  'US500': 5280.00, 'NAS100': 18450.00, 'US30': 39800.00, 'GER40': 18200.00,
  'UK100': 8100.00, 'FRA40': 7950.00, 'JPN225': 38500.00, 'AUS200': 7850.00,
  'HK50': 17200.00, 'VIX': 14.50,
  'AAPL': 185.20, 'TSLA': 248.50, 'AMZN': 191.30, 'GOOGL': 174.80, 'MSFT': 420.30,
  'META': 512.40, 'NVDA': 875.00, 'NFLX': 628.00, 'UBER': 76.50, 'COIN': 215.00,
  'AMD': 168.00, 'PYPL': 65.80, 'SHOP': 72.40, 'SQ': 68.20, 'BABA': 78.50,
  'X': 54.80, 'DIS': 112.40, 'BAC': 38.90, 'JPM': 198.50, 'GS': 448.00,
}

const VOLATILITY_MAP = { low: 0.00008, medium: 0.00015, high: 0.0003, extreme: 0.0006 }

// Current simulated prices (mutable ref across hook instances)
const simPrices = {}
MARKETS.forEach(m => {
  const base = m.symbol.split('/')[0]
  const sym = m.symbol
  if (!simPrices[m.id]) {
    simPrices[m.id] = BASE_PRICES[sym] || BASE_PRICES[base] || 1.0
  }
})

export function usePriceSimulator() {
  const updateTick = useTradeStore(s => s.updateTick)
  const appendChartCandle = useTradeStore(s => s.appendChartCandle)
  const activeMarket = useTradeStore(s => s.activeMarket)
  const chartTimeframe = useTradeStore(s => s.chartTimeframe)

  const intervalRef = useRef(null)
  const candleRef = useRef({})

  const tick = useCallback(() => {
    const now = Date.now()

    MARKETS.forEach(market => {
      const vol = VOLATILITY_MAP[market.volatility] || 0.00015
      const price = simPrices[market.id]

      // Geometric Brownian Motion with mean reversion
      const base = BASE_PRICES[market.symbol] || BASE_PRICES[market.symbol.split('/')[0]] || price
      const drift = (base - price) * 0.0001
      const noise = (Math.random() - 0.5) * 2 * vol * price
      const newPrice = Math.max(price + drift + noise, price * 0.95)
      simPrices[market.id] = newPrice

      const spread = market.spread
      const bid = newPrice - spread / 2
      const ask = newPrice + spread / 2
      const change = newPrice - (BASE_PRICES[market.symbol] || BASE_PRICES[market.symbol.split('/')[0]] || newPrice)
      const changeP = (change / (BASE_PRICES[market.symbol] || 1)) * 100

      updateTick(market.id, {
        price: newPrice, bid, ask,
        change, changeP, ts: now,
      })
    })

    // Build candle for active market
    const am = activeMarket
    if (!am) return
    const amPrice = simPrices[am.id]
    const tfMs = chartTimeframe * 1000
    const candleOpen = Math.floor(now / tfMs) * tfMs

    if (!candleRef.current[am.id] || candleRef.current[am.id].time !== candleOpen) {
      const prev = candleRef.current[am.id]
      if (prev) appendChartCandle({ ...prev })
      candleRef.current[am.id] = {
        time: candleOpen,
        open: amPrice, high: amPrice, low: amPrice, close: amPrice,
      }
    } else {
      const c = candleRef.current[am.id]
      c.high = Math.max(c.high, amPrice)
      c.low = Math.min(c.low, amPrice)
      c.close = amPrice
    }
  }, [activeMarket, chartTimeframe, updateTick, appendChartCandle])

  useEffect(() => {
    // Seed initial chart data
    const seedCandles = []
    const now = Date.now()
    const tfMs = chartTimeframe * 1000
    let price = simPrices[activeMarket?.id] || 1
    for (let i = 199; i >= 0; i--) {
      const t = Math.floor((now - i * tfMs) / tfMs) * tfMs
      const vol = VOLATILITY_MAP[activeMarket?.volatility] || 0.00015
      const drift = (Math.random() - 0.5) * 0.00002
      const o = price
      price = price * (1 + drift + (Math.random() - 0.5) * vol)
      const h = Math.max(o, price) * (1 + Math.random() * vol * 0.5)
      const l = Math.min(o, price) * (1 - Math.random() * vol * 0.5)
      seedCandles.push({ time: Math.floor(t / 1000), open: o, high: h, low: l, close: price })
    }
    useTradeStore.getState().setChartData(seedCandles)

    intervalRef.current = setInterval(tick, 400)
    return () => clearInterval(intervalRef.current)
  }, [activeMarket?.id, chartTimeframe])

  return { simPrices }
}
