import React, { useState } from 'react'
import { useTradeStore } from '../store/tradeStore'
import { MARKETS, MARKET_CATEGORIES } from '../utils/markets'

const CATEGORY_TABS = [
  { key:'OTC_FOREX',       label:'OTC FX',    icon:'💱' },
  { key:'OTC_CRYPTO',      label:'OTC Crypto', icon:'₿' },
  { key:'OTC_COMMODITIES', label:'OTC Comm',  icon:'🥇' },
  { key:'OTC_INDICES',     label:'OTC Idx',   icon:'📊' },
  { key:'OTC_STOCKS',      label:'OTC Stocks',icon:'📈' },
  { key:'LIVE_FOREX',      label:'Live FX',   icon:'🌐' },
  { key:'LIVE_CRYPTO',     label:'Live Crypto',icon:'🔴'},
  { key:'LIVE_COMMODITIES',label:'Live Comm', icon:'⛽' },
  { key:'LIVE_INDICES',    label:'Live Idx',  icon:'🏛️' },
]

export default function MarketList() {
  const {
    activeMarket, setActiveMarket, tickData,
    marketCategory, setMarketCategory,
    searchQuery, setSearchQuery
  } = useTradeStore()

  const filtered = MARKETS.filter(m => {
    const matchCat = m.category === marketCategory
    const matchSearch = !searchQuery || m.symbol.toLowerCase().includes(searchQuery.toLowerCase()) || m.name.toLowerCase().includes(searchQuery.toLowerCase())
    return matchCat && matchSearch
  })

  const formatPrice = (m) => {
    const t = tickData[m.id]
    if (!t) return '—'
    const p = t.price
    if (p > 1000) return p.toFixed(2)
    if (p < 0.01) return p.toFixed(6)
    if (m.symbol.includes('JPY')) return p.toFixed(3)
    return p.toFixed(5)
  }

  const isOTC = (cat) => cat.startsWith('OTC_')

  return (
    <div style={{ height:'100%', display:'flex', flexDirection:'column', background:'var(--bg-surface)' }}>
      {/* Search */}
      <div style={{ padding:'12px 12px 8px' }}>
        <input
          className="input"
          placeholder="🔍 Search markets..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          style={{ fontSize:12 }}
        />
      </div>

      {/* Category scroll tabs */}
      <div style={{ display:'flex', overflowX:'auto', padding:'0 8px 8px', gap:4, scrollbarWidth:'none' }}>
        {CATEGORY_TABS.map(tab => (
          <button
            key={tab.key}
            onClick={() => setMarketCategory(tab.key)}
            style={{
              flexShrink:0,
              padding:'5px 10px',
              borderRadius:'var(--r-sm)',
              fontSize:11,
              fontWeight:600,
              border:'none',
              cursor:'pointer',
              whiteSpace:'nowrap',
              transition:'all 0.15s',
              background: marketCategory === tab.key ? 'var(--neon-blue)' : 'var(--bg-card)',
              color: marketCategory === tab.key ? '#fff' : 'var(--text-muted)',
            }}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {/* Category header */}
      <div style={{ padding:'4px 12px 6px', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
        <span style={{ fontSize:10, fontWeight:600, color:'var(--text-muted)', letterSpacing:1 }}>
          {MARKET_CATEGORIES[marketCategory]?.toUpperCase()}
        </span>
        <span style={{ fontSize:10, color:'var(--text-muted)' }}>{filtered.length} markets</span>
      </div>

      {/* Markets list */}
      <div className="scrollable" style={{ flex:1 }}>
        {filtered.map(market => {
          const t = tickData[market.id]
          const isActive = market.id === activeMarket?.id
          const isUp = (t?.changeP ?? 0) >= 0

          return (
            <div
              key={market.id}
              className={`market-row ${isActive ? 'active' : ''}`}
              onClick={() => setActiveMarket(market)}
            >
              <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                <div className="market-icon">{market.icon}</div>
                <div>
                  <div style={{ fontSize:12, fontWeight:700, lineHeight:1.3 }}>{market.symbol}</div>
                  <div style={{ fontSize:10, color:'var(--text-muted)', lineHeight:1.2, maxWidth:90, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
                    {market.name}
                  </div>
                </div>
              </div>
              <div style={{ textAlign:'right' }}>
                <div className="mono" style={{ fontSize:11, fontWeight:600 }}>
                  {formatPrice(market)}
                </div>
                <div style={{ display:'flex', alignItems:'center', justifyContent:'flex-end', gap:4 }}>
                  <span style={{ fontSize:10, color: isUp ? 'var(--neon-green)':'var(--neon-red)' }}>
                    {isUp ? '▲':'▼'}{Math.abs(t?.changeP ?? 0).toFixed(2)}%
                  </span>
                  <span className="badge badge-gold" style={{ fontSize:9, padding:'1px 5px' }}>
                    {market.payout}%
                  </span>
                </div>
                {isOTC(market.category) && (
                  <div className="badge badge-otc" style={{ fontSize:9, padding:'1px 5px' }}>OTC</div>
                )}
              </div>
            </div>
          )
        })}

        {filtered.length === 0 && (
          <div style={{ padding:'40px 20px', textAlign:'center', color:'var(--text-muted)' }}>
            No markets found
          </div>
        )}
      </div>
    </div>
  )
}
