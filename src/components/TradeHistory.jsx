import React from 'react'
import { useTradeStore } from '../store/tradeStore'

export default function TradeHistory() {
  const { tradeHistory, activeTrades } = useTradeStore()

  const all = [
    ...activeTrades.map(t => ({ ...t, status: 'active' })),
    ...tradeHistory,
  ]

  if (!all.length) return (
    <div style={{ padding:'40px 20px', textAlign:'center', color:'var(--text-muted)' }}>
      <div style={{ fontSize:32, marginBottom:12 }}>📋</div>
      <div style={{ fontSize:14 }}>No trades yet</div>
      <div style={{ fontSize:12, marginTop:6 }}>Place your first trade to see history</div>
    </div>
  )

  return (
    <div className="scrollable" style={{ maxHeight:300 }}>
      <table className="trade-table" style={{ width:'100%' }}>
        <thead>
          <tr>
            <th>Market</th>
            <th>Dir</th>
            <th>Amount</th>
            <th>P/L</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {all.map(t => (
            <tr key={t.id}>
              <td>
                <div style={{ fontWeight:600, fontSize:12 }}>{t.symbol}</div>
                <div style={{ fontSize:10, color:'var(--text-muted)' }}>
                  {new Date(t.openTime).toLocaleTimeString()}
                </div>
              </td>
              <td>
                <span className={`badge ${t.direction === 'up' ? 'badge-up':'badge-down'}`}>
                  {t.direction === 'up' ? '▲':'▼'} {t.direction.toUpperCase()}
                </span>
              </td>
              <td className="mono" style={{ fontSize:12 }}>${t.amount}</td>
              <td className="mono" style={{ fontSize:12, color: t.profit > 0 ? 'var(--neon-green)' : t.profit < 0 ? 'var(--neon-red)' : 'var(--text-muted)' }}>
                {t.profit !== undefined ? `${t.profit > 0 ? '+':''} $${t.profit.toFixed(2)}` : '—'}
              </td>
              <td>
                <span className={`badge ${
                  t.status === 'active' ? 'badge-live' :
                  t.status === 'won'    ? 'badge-up'   : 'badge-down'
                }`} style={{ fontSize:10 }}>
                  {t.status === 'active' ? '⏱ Active' :
                   t.status === 'won'    ? '✓ Won'    : '✗ Lost'}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
