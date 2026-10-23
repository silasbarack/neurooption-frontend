import { useEffect } from 'react'
import { useTradeStore } from '../store/tradeStore'
import { MARKETS } from '../utils/markets'

const SIGNAL_REASONS = [
  'RSI oversold + MACD bullish crossover detected',
  'Bollinger Band squeeze breakout pattern',
  'Strong support zone bounce confirmed',
  'EMA 20/50 golden cross forming',
  'Stochastic divergence — trend reversal likely',
  'Price action hammer candle at key level',
  'Volume surge confirms directional momentum',
  'Fibonacci 61.8% retracement bounce',
  'OTC market manipulation pattern detected — counter-trade signal',
  'Neural network confidence threshold exceeded',
  'Multi-timeframe confluence bullish/bearish',
  'Engulfing candle pattern at resistance',
]

export function useAISignals() {
  const { setAISignals, aiEnabled } = useTradeStore()

  useEffect(() => {
    if (!aiEnabled) { setAISignals([]); return }

    const generate = () => {
      // Pick 3-5 random markets for signals
      const shuffled = [...MARKETS].sort(() => Math.random() - 0.5).slice(0, 5)
      const signals = shuffled.map(m => ({
        marketId: m.id,
        symbol: m.symbol,
        direction: Math.random() > 0.5 ? 'up' : 'down',
        confidence: 65 + Math.floor(Math.random() * 30),
        reason: SIGNAL_REASONS[Math.floor(Math.random() * SIGNAL_REASONS.length)],
        expiry: [30, 60, 120, 300][Math.floor(Math.random() * 4)],
        ts: Date.now(),
      }))
      setAISignals(signals)
    }

    generate()
    const interval = setInterval(generate, 30000) // refresh every 30s
    return () => clearInterval(interval)
  }, [aiEnabled])
}
