import React from 'react'
import TradingChart from '../components/TradingChart'
import TradePanel from '../components/TradePanel'
import MarketList from '../components/MarketList'
import TradeHistory from '../components/TradeHistory'
import { useTradeStore } from '../store/tradeStore'
import { usePriceSimulator } from '../hooks/usePriceSimulator'
import { useAISignals } from '../hooks/useAISignals'

export default function TradePage() {
  usePriceSimulator()
  useAISignals()

  const { tickData, activeMarket, tradeHistory } = useTradeStore()

  const tick = tickData[activeMarket?.id]
  const wins = tradeHistory.filter(t => t.status === 'won').length
  const total = tradeHistory.length
  const winRate = total ? Math.round((wins / total) * 100) : 0

  return (
    <div style={{
      display:'grid',
      gridTemplateColumns:'260px 1fr 280px',
      gridTemplateRows:'1fr auto',
      height:'calc(100vh - 56px)',
      gap:0,
    }}>
      {/* Market List */}
      <div style={{ borderRight:'1px solid var(--border)', overflow:'hidden' }}>
        <MarketList />
      </div>

      {/* Chart + History */}
      <div style={{ display:'flex', flexDirection:'column', overflow:'hidden' }}>
        {/* Chart */}
        <div style={{ flex:1, padding:'12px 12px 0', minHeight:0 }}>
          <TradingChart />
        </div>

        {/* Stats bar */}
        <div style={{
          display:'flex', gap:24, padding:'10px 16px',
          borderTop:'1px solid var(--border)',
          background:'var(--bg-surface)',
          fontSize:12
        }}>
          <div>
            <span style={{ color:'var(--text-muted)' }}>Trades: </span>
            <span className="mono" style={{ fontWeight:600 }}>{total}</span>
          </div>
          <div>
            <span style={{ color:'var(--text-muted)' }}>Win Rate: </span>
            <span className="mono value-up" style={{ fontWeight:600 }}>{winRate}%</span>
          </div>
          <div>
            <span style={{ color:'var(--text-muted)' }}>Wins: </span>
            <span className="mono value-up">{wins}</span>
          </div>
          <div>
            <span style={{ color:'var(--text-muted)' }}>Losses: </span>
            <span className="mono value-down">{total - wins}</span>
          </div>
          <div style={{ marginLeft:'auto' }}>
            <span style={{ color:'var(--text-muted)' }}>Spread: </span>
            <span className="mono" style={{ color:'var(--neon-gold)' }}>
              {activeMarket?.spread}
            </span>
          </div>
        </div>

        {/* Trade History */}
        <div style={{ borderTop:'1px solid var(--border)', background:'var(--bg-surface)' }}>
          <div style={{ padding:'10px 16px 6px', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
            <span style={{ fontSize:12, fontWeight:600, color:'var(--text-secondary)' }}>Recent Trades</span>
          </div>
          <TradeHistory />
        </div>
      </div>

      {/* Trade Panel */}
      <div style={{ borderLeft:'1px solid var(--border)', overflow:'hidden' }}>
        <TradePanel />
      </div>
    </div>
  )
}
