import React, { useState } from 'react';

export default function PositionsPanel({ positions, currentPrice }) {
  const [tab, setTab] = useState('open');
  const open = positions.filter(p => p.status === 'open');
  const closed = positions.filter(p => p.status !== 'open');

  const now = Date.now();

  return (
    <div style={{ height: 160, borderTop: '1px solid var(--border-subtle)', background: 'var(--bg-deep)', display: 'flex', flexDirection: 'column', flexShrink: 0 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 0, borderBottom: '1px solid var(--border-subtle)' }}>
        {[['open', `Open (${open.length})`], ['history', `History (${closed.length})`]].map(([t, label]) => (
          <button key={t} onClick={() => setTab(t)} style={{
            padding: '8px 20px', border: 'none', background: 'none', fontSize: 11,
            color: tab === t ? 'var(--accent-cyan)' : 'var(--text-muted)',
            borderBottom: tab === t ? '2px solid var(--accent-cyan)' : '2px solid transparent',
            cursor: 'pointer',
          }}>{label}</button>
        ))}
      </div>

      <div style={{ flex: 1, overflowX: 'auto', overflowY: 'auto' }}>
        {tab === 'open' ? (
          open.length === 0 ? (
            <div style={{ padding: '20px', textAlign: 'center', color: 'var(--text-muted)', fontSize: 12 }}>No open positions</div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 11 }}>
              <thead>
                <tr style={{ color: 'var(--text-muted)' }}>
                  {['Asset', 'Direction', 'Amount', 'Open Price', 'Current', 'Expires', 'P&L'].map(h => (
                    <th key={h} style={{ padding: '6px 12px', textAlign: 'left', fontWeight: 400, whiteSpace: 'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {open.map(p => {
                  const winning = (p.direction === 'CALL' && currentPrice > p.openPrice) ||
                                  (p.direction === 'PUT' && currentPrice < p.openPrice);
                  const timeLeft = Math.max(0, Math.floor((p.expiresAt - now) / 1000));
                  const pnl = winning ? +(p.amount * (p.payout / 100)).toFixed(2) : -p.amount;
                  const dec = p.openPrice > 100 ? 2 : p.openPrice > 1 ? 4 : 5;
                  return (
                    <tr key={p.id} style={{ borderTop: '1px solid var(--border-subtle)' }}>
                      <td style={{ padding: '6px 12px', fontWeight: 600 }}>{p.asset}</td>
                      <td style={{ padding: '6px 12px' }}>
                        <span style={{ color: p.direction === 'CALL' ? 'var(--accent-green)' : 'var(--accent-red)', fontWeight: 700 }}>
                          {p.direction === 'CALL' ? '▲' : '▼'} {p.direction}
                        </span>
                      </td>
                      <td style={{ padding: '6px 12px', fontFamily: 'var(--font-mono)' }}>${p.amount}</td>
                      <td style={{ padding: '6px 12px', fontFamily: 'var(--font-mono)' }}>{p.openPrice.toFixed(dec)}</td>
                      <td style={{ padding: '6px 12px', fontFamily: 'var(--font-mono)', color: winning ? 'var(--accent-green)' : 'var(--accent-red)' }}>{currentPrice.toFixed(dec)}</td>
                      <td style={{ padding: '6px 12px', fontFamily: 'var(--font-mono)', color: timeLeft < 10 ? 'var(--accent-red)' : 'var(--text-secondary)' }}>{timeLeft}s</td>
                      <td style={{ padding: '6px 12px', fontFamily: 'var(--font-mono)', fontWeight: 700, color: pnl >= 0 ? 'var(--accent-green)' : 'var(--accent-red)' }}>
                        {pnl >= 0 ? '+' : ''}${pnl}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )
        ) : (
          closed.length === 0 ? (
            <div style={{ padding: '20px', textAlign: 'center', color: 'var(--text-muted)', fontSize: 12 }}>No closed positions</div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 11 }}>
              <thead>
                <tr style={{ color: 'var(--text-muted)' }}>
                  {['Asset', 'Direction', 'Amount', 'Open Price', 'Close Price', 'Result', 'P&L'].map(h => (
                    <th key={h} style={{ padding: '6px 12px', textAlign: 'left', fontWeight: 400, whiteSpace: 'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {closed.map(p => {
                  const dec = p.openPrice > 100 ? 2 : p.openPrice > 1 ? 4 : 5;
                  const pnl = p.status === 'win' ? +(p.amount * (p.payout / 100)).toFixed(2) : -p.amount;
                  return (
                    <tr key={p.id} style={{ borderTop: '1px solid var(--border-subtle)', opacity: 0.8 }}>
                      <td style={{ padding: '6px 12px', fontWeight: 600 }}>{p.asset}</td>
                      <td style={{ padding: '6px 12px' }}>
                        <span style={{ color: p.direction === 'CALL' ? 'var(--accent-green)' : 'var(--accent-red)', fontWeight: 700 }}>
                          {p.direction === 'CALL' ? '▲' : '▼'} {p.direction}
                        </span>
                      </td>
                      <td style={{ padding: '6px 12px', fontFamily: 'var(--font-mono)' }}>${p.amount}</td>
                      <td style={{ padding: '6px 12px', fontFamily: 'var(--font-mono)' }}>{p.openPrice.toFixed(dec)}</td>
                      <td style={{ padding: '6px 12px', fontFamily: 'var(--font-mono)' }}>{p.closePrice?.toFixed(dec)}</td>
                      <td style={{ padding: '6px 12px' }}>
                        <span style={{
                          padding: '2px 8px', borderRadius: 100, fontSize: 10, fontWeight: 700,
                          background: p.status === 'win' ? 'var(--accent-green-dim)' : 'var(--accent-red-dim)',
                          color: p.status === 'win' ? 'var(--accent-green)' : 'var(--accent-red)',
                        }}>{p.status === 'win' ? 'WIN' : 'LOSS'}</span>
                      </td>
                      <td style={{ padding: '6px 12px', fontFamily: 'var(--font-mono)', fontWeight: 700, color: pnl >= 0 ? 'var(--accent-green)' : 'var(--accent-red)' }}>
                        {pnl >= 0 ? '+' : ''}${pnl}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )
        )}
      </div>
    </div>
  );
}
