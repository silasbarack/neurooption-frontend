import React, { useState, useEffect } from 'react';

const CATEGORIES = ['All', 'Forex OTC', 'Crypto OTC', 'Commodities OTC', 'Indices OTC', 'Stocks OTC', 'Forex', 'Crypto'];

export default function Sidebar({ assets, selectedAsset, onSelect, tab, onTabChange }) {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [prices, setPrices] = useState(() => {
    const map = {};
    assets.forEach(a => { map[a.id] = a.base; });
    return map;
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setPrices(prev => {
        const next = { ...prev };
        assets.forEach(a => {
          const move = (Math.random() - 0.499) * a.vol * 2;
          next[a.id] = Math.max(0.0001, prev[a.id] + move);
        });
        return next;
      });
    }, 800);
    return () => clearInterval(interval);
  }, [assets]);

  const filtered = assets.filter(a => {
    const matchSearch = a.name.toLowerCase().includes(search.toLowerCase());
    const matchCat = category === 'All' || a.category === category;
    return matchSearch && matchCat;
  });

  return (
    <div style={{ width: 220, borderRight: '1px solid var(--border-subtle)', display: 'flex', flexDirection: 'column', background: 'var(--bg-deep)', flexShrink: 0 }}>
      {/* Tabs */}
      <div style={{ display: 'flex', borderBottom: '1px solid var(--border-subtle)' }}>
        {['assets', 'fav'].map(t => (
          <button key={t} onClick={() => onTabChange(t)} style={{
            flex: 1, padding: '10px', border: 'none', background: 'none',
            color: tab === t ? 'var(--accent-cyan)' : 'var(--text-muted)',
            borderBottom: tab === t ? '2px solid var(--accent-cyan)' : '2px solid transparent',
            fontSize: 11, cursor: 'pointer', textTransform: 'uppercase', letterSpacing: '0.5px',
          }}>{t === 'assets' ? 'Markets' : '★ Fav'}</button>
        ))}
      </div>

      {/* Search */}
      <div style={{ padding: '8px' }}>
        <input
          placeholder="🔍 Search asset..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ width: '100%', padding: '7px 10px', background: 'var(--bg-card)', border: '1px solid var(--border-default)', borderRadius: 'var(--radius-md)', color: 'var(--text-primary)', fontSize: 12, outline: 'none', fontFamily: 'var(--font-body)' }}
        />
      </div>

      {/* Category scroll */}
      <div style={{ overflowX: 'auto', padding: '0 8px 6px', display: 'flex', gap: 4, scrollbarWidth: 'none' }}>
        {CATEGORIES.map(c => (
          <button key={c} onClick={() => setCategory(c)} style={{
            whiteSpace: 'nowrap', padding: '3px 8px', borderRadius: 100, border: '1px solid',
            borderColor: category === c ? 'var(--accent-cyan)' : 'var(--border-default)',
            background: category === c ? 'var(--accent-cyan-dim)' : 'transparent',
            color: category === c ? 'var(--accent-cyan)' : 'var(--text-muted)',
            fontSize: 10, cursor: 'pointer',
          }}>{c}</button>
        ))}
      </div>

      {/* Asset list */}
      <div style={{ flex: 1, overflowY: 'auto' }}>
        {filtered.map(a => {
          const p = prices[a.id] || a.base;
          const change = ((p - a.base) / a.base) * 100;
          const dec = a.base > 100 ? 2 : a.base > 1 ? 4 : 5;
          const isSelected = selectedAsset.id === a.id;
          const isUp = change >= 0;

          return (
            <div
              key={a.id}
              onClick={() => onSelect(a)}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '8px 12px', cursor: 'pointer',
                background: isSelected ? 'var(--bg-elevated)' : 'transparent',
                borderLeft: isSelected ? '2px solid var(--accent-cyan)' : '2px solid transparent',
                transition: 'all 0.15s',
              }}
              onMouseEnter={e => { if (!isSelected) e.currentTarget.style.background = 'var(--bg-surface)'; }}
              onMouseLeave={e => { if (!isSelected) e.currentTarget.style.background = 'transparent'; }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 14 }}>{a.icon}</span>
                <div>
                  <div style={{ fontSize: 11, fontWeight: 600, color: isSelected ? 'var(--text-primary)' : 'var(--text-secondary)' }}>{a.name}</div>
                  <div style={{ fontSize: 9, color: 'var(--text-muted)' }}>{a.payout}% payout</div>
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 600 }}>{p.toFixed(dec)}</div>
                <div style={{ fontSize: 9, color: isUp ? 'var(--accent-green)' : 'var(--accent-red)', fontFamily: 'var(--font-mono)' }}>
                  {isUp ? '+' : ''}{change.toFixed(2)}%
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
