import React, { useState, useEffect } from 'react';
import DeleteAccountModal from './DeleteAccountModal';

export default function TopBar({ user, balance, onLogout, currentPrice, selectedAsset }) {
  const [time, setTime] = useState(new Date());
  const [menuOpen, setMenuOpen] = useState(false);
  const [showDelete, setShowDelete] = useState(false);

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const pad = n => n.toString().padStart(2, '0');
  const timeStr = `${pad(time.getUTCHours())}:${pad(time.getUTCMinutes())}:${pad(time.getUTCSeconds())} UTC`;

  return (
    <div style={{ height: 52, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 16px', borderBottom: '1px solid var(--border-subtle)', background: 'var(--bg-deep)', flexShrink: 0 }}>
      {/* Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{ width: 28, height: 28, borderRadius: 7, background: 'linear-gradient(135deg, var(--accent-cyan), var(--accent-purple))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14 }}>⚡</div>
        <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 16, letterSpacing: '-0.5px' }}>Neuro<span style={{ color: 'var(--accent-cyan)' }}>Option</span></span>
        <div style={{ width: 1, height: 20, background: 'var(--border-subtle)', margin: '0 8px' }} />
        <span style={{ fontSize: 10, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>TRADING PLATFORM</span>
      </div>

      {/* Center nav */}
      <div style={{ display: 'flex', gap: 2 }}>
        {['Trade', 'Markets', 'Signals', 'Leaderboard', 'History'].map((item, i) => (
          <button key={item} style={{
            padding: '6px 16px', borderRadius: 'var(--radius-md)', border: 'none', fontSize: 12,
            background: i === 0 ? 'var(--accent-cyan-dim)' : 'transparent',
            color: i === 0 ? 'var(--accent-cyan)' : 'var(--text-secondary)',
            cursor: 'pointer', fontFamily: 'var(--font-body)', fontWeight: i === 0 ? 600 : 400,
          }}>{item}</button>
        ))}
      </div>

      {/* Right info */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-muted)' }}>{timeStr}</div>
        
        {/* Balance */}
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-default)', borderRadius: 'var(--radius-md)', padding: '6px 14px', display: 'flex', flex: 'column', gap: 2 }}>
          <div style={{ fontSize: 9, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Balance</div>
          <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--accent-green)', fontSize: 14 }}>${balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}</div>
        </div>

        {/* Deposit */}
        <button style={{ padding: '6px 16px', borderRadius: 'var(--radius-md)', border: 'none', background: 'linear-gradient(135deg, var(--accent-cyan), #0099ff)', color: '#000', fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 12, cursor: 'pointer' }}>
          + Deposit
        </button>

        {/* User */}
        <div style={{ position: 'relative' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }} onClick={() => setMenuOpen(o => !o)} title="Account">
            <div style={{ width: 30, height: 30, borderRadius: '50%', background: 'linear-gradient(135deg, var(--accent-purple), var(--accent-cyan))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 13, color: '#fff' }}>
              {(user?.name || 'U')[0].toUpperCase()}
            </div>
            <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{user?.name} ▾</span>
          </div>
          {menuOpen && (
            <>
              <div style={{ position: 'fixed', inset: 0, zIndex: 40 }} onClick={() => setMenuOpen(false)} />
              <div style={{ position: 'absolute', right: 0, top: 40, zIndex: 50, minWidth: 170, background: 'var(--bg-surface)', border: '1px solid var(--border-default)', borderRadius: 'var(--radius-md)', padding: 6, boxShadow: '0 8px 24px rgba(0,0,0,0.4)' }}>
                <div style={{ padding: '6px 10px', fontSize: 11, color: 'var(--text-muted)', borderBottom: '1px solid var(--border-subtle)', marginBottom: 4 }}>{user?.email}</div>
                <button onClick={() => { setMenuOpen(false); onLogout(); }} style={{ display: 'block', width: '100%', textAlign: 'left', padding: '8px 10px', background: 'none', border: 'none', color: 'var(--text-primary)', fontSize: 12, cursor: 'pointer', borderRadius: 6 }}>Log out</button>
                <button onClick={() => { setMenuOpen(false); setShowDelete(true); }} style={{ display: 'block', width: '100%', textAlign: 'left', padding: '8px 10px', background: 'none', border: 'none', color: '#ff5252', fontSize: 12, cursor: 'pointer', borderRadius: 6 }}>Delete account</button>
              </div>
            </>
          )}
        </div>
      </div>
      {showDelete && <DeleteAccountModal onClose={() => setShowDelete(false)} onDeleted={() => { setShowDelete(false); onLogout(); }} />}
    </div>
  );
}
