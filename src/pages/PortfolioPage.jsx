import React from 'react'
import { useTradeStore } from '../store/tradeStore'

export default function PortfolioPage() {
  const { balance, demoBalance, tradeHistory, isDemo } = useTradeStore()

  const total = tradeHistory.length
  const wins  = tradeHistory.filter(t => t.status === 'won').length
  const losses = total - wins
  const totalProfit = tradeHistory.reduce((s, t) => s + (t.profit || 0), 0)
  const totalInvested = tradeHistory.reduce((s, t) => s + t.amount, 0)
  const winRate = total ? ((wins / total) * 100).toFixed(1) : '0.0'
  const roi = totalInvested ? ((totalProfit / totalInvested) * 100).toFixed(1) : '0.0'

  const stats = [
    { label:'Total Trades', value: total, color:'var(--neon-cyan)' },
    { label:'Win Rate',     value: `${winRate}%`, color:'var(--neon-green)' },
    { label:'Total Profit', value: `$${totalProfit.toFixed(2)}`, color: totalProfit >= 0 ? 'var(--neon-green)':'var(--neon-red)' },
    { label:'ROI',          value: `${roi}%`, color: roi >= 0 ? 'var(--neon-green)':'var(--neon-red)' },
    { label:'Wins',         value: wins,   color:'var(--neon-green)' },
    { label:'Losses',       value: losses, color:'var(--neon-red)' },
  ]

  return (
    <div style={{ padding:24, maxWidth:1100, margin:'0 auto' }}>
      <div style={{ marginBottom:24 }}>
        <h1 style={{ fontSize:24, fontWeight:700, letterSpacing:-0.5 }}>Portfolio</h1>
        <p style={{ color:'var(--text-muted)', marginTop:4 }}>Your trading performance overview</p>
      </div>

      {/* Balance cards */}
      <div className="grid-2" style={{ marginBottom:24 }}>
        <div className="card">
          <div style={{ fontSize:11, color:'var(--text-muted)', fontWeight:600, marginBottom:8 }}>DEMO BALANCE</div>
          <div className="mono" style={{ fontSize:32, fontWeight:700, color:'var(--neon-blue)' }}>
            ${demoBalance.toLocaleString('en-US', { minimumFractionDigits:2 })}
          </div>
        </div>
        <div className="card">
          <div style={{ fontSize:11, color:'var(--text-muted)', fontWeight:600, marginBottom:8 }}>REAL BALANCE</div>
          <div className="mono" style={{ fontSize:32, fontWeight:700, color:'var(--neon-gold)' }}>
            ${balance.toLocaleString('en-US', { minimumFractionDigits:2 })}
          </div>
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid-3" style={{ marginBottom:24 }}>
        {stats.map(s => (
          <div key={s.label} className="card">
            <div style={{ fontSize:11, color:'var(--text-muted)', fontWeight:600, marginBottom:8 }}>{s.label}</div>
            <div className="mono" style={{ fontSize:26, fontWeight:700, color:s.color }}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* Recent trades */}
      {tradeHistory.length > 0 && (
        <div className="card">
          <div style={{ marginBottom:16, fontWeight:600 }}>Trade History</div>
          <table className="trade-table">
            <thead>
              <tr>
                <th>Market</th><th>Direction</th><th>Amount</th>
                <th>Open</th><th>Close</th><th>P/L</th><th>Result</th>
              </tr>
            </thead>
            <tbody>
              {tradeHistory.slice(0, 30).map(t => (
                <tr key={t.id}>
                  <td><b>{t.symbol}</b></td>
                  <td><span className={`badge ${t.direction==='up'?'badge-up':'badge-down'}`}>
                    {t.direction==='up'?'▲':'▼'} {t.direction.toUpperCase()}
                  </span></td>
                  <td className="mono">${t.amount}</td>
                  <td className="mono" style={{ fontSize:11 }}>{t.openPrice?.toFixed(5)}</td>
                  <td className="mono" style={{ fontSize:11 }}>{t.closePrice?.toFixed(5) || '—'}</td>
                  <td className="mono" style={{ color: t.profit >= 0 ? 'var(--neon-green)':'var(--neon-red)' }}>
                    {t.profit !== undefined ? `${t.profit>=0?'+':''}$${t.profit.toFixed(2)}` : '—'}
                  </td>
                  <td><span className={`badge ${t.status==='won'?'badge-up':'badge-down'}`}>
                    {t.status==='won'?'✓ Won':'✗ Lost'}
                  </span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
