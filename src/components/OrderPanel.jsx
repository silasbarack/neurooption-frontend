import React, { useState, useEffect } from 'react';

const DURATIONS = [
  { label: '30s', value: 30 },
  { label: '1m', value: 60 },
  { label: '2m', value: 120 },
  { label: '5m', value: 300 },
  { label: '15m', value: 900 },
  { label: '30m', value: 1800 },
];
const AMOUNTS = [10, 25, 50, 100, 250, 500];

export default function OrderPanel({ asset, balance, onTrade, currentPrice }) {
  const [amount, setAmount] = useState(25);
  const [duration, setDuration] = useState(60);
  const [flash, setFlash] = useState(null);
  const [countdown, setCountdown] = useState(null);

  const profit = +(amount * (asset.payout / 100)).toFixed(2);
  const dec = asset.base > 100 ? 2 : asset.base > 1 ? 4 : 5;

  const handleTrade = (direction) => {
    if (amount > balance) return;
    onTrade(direction, amount, duration);
    setFlash(direction);
    setCountdown(duration);
    setTimeout(() => setFlash(null), 600);
  };

  useEffect(() => {
    if (!countdown) return;
    if (countdown <= 0) { setCountdown(null); return; }
    const t = setTimeout(() => setCountdown(c => c - 1), 1000);
    return () => clearTimeout(t);
  }, [countdown]);

  return (
    <div style={{ padding: '12px', display: 'flex', flexDirection: 'column', gap: 10, borderTop: '1px solid var(--border-subtle)' }}>
      {/* Price display */}
      <div style={{ background: 'var(--bg-card)', borderRadius: 'var(--radius-md)', padding: '10px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: 11, color: 'var(--text-secondary)' }}>CURRENT PRICE</span>
        <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: 15, color: 'var(--accent-cyan)' }}>
          {currentPrice.toFixed(dec)}
        </span>
      </div>

      {/* Amount */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
          <span style={{ fontSize: 11, color: 'var(--text-secondary)' }}>INVESTMENT</span>
          <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>Bal: <span style={{ color: 'var(--accent-green)' }}>${balance.toLocaleString()}</span></span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
          <button onClick={() => setAmount(Math.max(1, amount - 5))} style={{ width: 28, height: 28, borderRadius: 6, border: '1px solid var(--border-default)', background: 'var(--bg-card)', color: 'var(--text-primary)', cursor: 'pointer', fontSize: 16, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>−</button>
          <div style={{ flex: 1, background: 'var(--bg-card)', border: '1px solid var(--border-accent)', borderRadius: 'var(--radius-md)', padding: '8px 12px', display: 'flex', alignItems: 'center', gap: 4 }}>
            <span style={{ color: 'var(--text-muted)', fontSize: 13 }}>$</span>
            <input
              type="number"
              value={amount}
              onChange={e => setAmount(Math.max(1, +e.target.value))}
              style={{ background: 'none', border: 'none', outline: 'none', color: 'var(--text-primary)', fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: 16, width: '100%' }}
            />
          </div>
          <button onClick={() => setAmount(amount + 5)} style={{ width: 28, height: 28, borderRadius: 6, border: '1px solid var(--border-default)', background: 'var(--bg-card)', color: 'var(--text-primary)', cursor: 'pointer', fontSize: 16, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>+</button>
        </div>
        <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
          {AMOUNTS.map(a => (
            <button key={a} onClick={() => setAmount(a)} style={{
              flex: 1, minWidth: 40, padding: '4px 0', borderRadius: 'var(--radius-sm)', border: '1px solid',
              borderColor: amount === a ? 'var(--accent-cyan)' : 'var(--border-default)',
              background: amount === a ? 'var(--accent-cyan-dim)' : 'transparent',
              color: amount === a ? 'var(--accent-cyan)' : 'var(--text-secondary)',
              fontSize: 11, cursor: 'pointer', fontFamily: 'var(--font-mono)',
            }}>${a}</button>
          ))}
        </div>
      </div>

      {/* Duration */}
      <div>
        <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginBottom: 6 }}>EXPIRY TIME</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 4 }}>
          {DURATIONS.map(d => (
            <button key={d.value} onClick={() => setDuration(d.value)} style={{
              padding: '6px', borderRadius: 'var(--radius-sm)', border: '1px solid',
              borderColor: duration === d.value ? 'var(--accent-cyan)' : 'var(--border-default)',
              background: duration === d.value ? 'var(--accent-cyan-dim)' : 'transparent',
              color: duration === d.value ? 'var(--accent-cyan)' : 'var(--text-secondary)',
              fontSize: 11, cursor: 'pointer', fontFamily: 'var(--font-mono)',
            }}>{d.label}</button>
          ))}
        </div>
      </div>

      {/* Profit preview */}
      <div style={{ background: 'var(--accent-green-dim)', border: '1px solid rgba(0,230,118,0.2)', borderRadius: 'var(--radius-md)', padding: '8px 12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: 11, color: 'var(--text-secondary)' }}>POTENTIAL PROFIT</span>
        <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--accent-green)', fontSize: 14 }}>+${profit}</span>
      </div>

      {/* Active trade countdown */}
      {countdown !== null && (
        <div style={{ background: 'var(--bg-card)', borderRadius: 'var(--radius-md)', padding: '8px 12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid var(--accent-cyan-dim)', animation: 'pulse-cyan 2s ease infinite' }}>
          <span style={{ fontSize: 11, color: 'var(--accent-cyan)' }}>⏱ TRADE ACTIVE</span>
          <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--accent-cyan)', fontWeight: 700 }}>{countdown}s</span>
        </div>
      )}

      {/* CALL / PUT Buttons */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
        <button
          onClick={() => handleTrade('CALL')}
          style={{
            padding: '16px 0', borderRadius: 'var(--radius-lg)', border: 'none',
            background: flash === 'CALL' ? '#00ff88' : 'linear-gradient(135deg, #00e676, #00a854)',
            color: '#000', fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 16, cursor: 'pointer',
            boxShadow: flash === 'CALL' ? 'var(--shadow-glow-green)' : 'none',
            transition: 'all 0.15s', transform: flash === 'CALL' ? 'scale(0.97)' : 'scale(1)',
          }}
        >
          ▲ CALL<br />
          <span style={{ fontSize: 10, fontWeight: 400 }}>{asset.payout}%</span>
        </button>
        <button
          onClick={() => handleTrade('PUT')}
          style={{
            padding: '16px 0', borderRadius: 'var(--radius-lg)', border: 'none',
            background: flash === 'PUT' ? '#ff6b93' : 'linear-gradient(135deg, #ff3d71, #cc0040)',
            color: '#fff', fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 16, cursor: 'pointer',
            boxShadow: flash === 'PUT' ? 'var(--shadow-glow-red)' : 'none',
            transition: 'all 0.15s', transform: flash === 'PUT' ? 'scale(0.97)' : 'scale(1)',
          }}
        >
          ▼ PUT<br />
          <span style={{ fontSize: 10, fontWeight: 400 }}>{asset.payout}%</span>
        </button>
      </div>
    </div>
  );
}
