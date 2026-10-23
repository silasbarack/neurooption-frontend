import React from 'react'
import { useTradeStore } from '../store/tradeStore'
import { useAISignals } from '../hooks/useAISignals'
import { usePriceSimulator } from '../hooks/usePriceSimulator'
import { getMarketById } from '../utils/markets'

export default function SignalsPage() {
  usePriceSimulator()
  useAISignals()

  const { aiSignals, aiEnabled, toggleAI, setActiveMarket, setCurrentPage, tickData } = useTradeStore()

  return (
    <div style={{ padding:24, maxWidth:1000, margin:'0 auto' }}>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:24 }}>
        <div>
          <h1 style={{ fontSize:24, fontWeight:700, letterSpacing:-0.5 }}>🤖 AI Signals</h1>
          <p style={{ color:'var(--text-muted)', marginTop:4 }}>Neural network trade recommendations</p>
        </div>
        <div style={{ display:'flex', alignItems:'center', gap:12 }}>
          <span style={{ fontSize:12, color:'var(--text-secondary)' }}>AI Engine</span>
          <div onClick={toggleAI} style={{
            width:48, height:26, borderRadius:13,
            background: aiEnabled ? 'var(--neon-purple)':'var(--bg-card)',
            border:'1px solid var(--border)', position:'relative', cursor:'pointer', transition:'all 0.2s'
          }}>
            <div style={{
              position:'absolute', top:3, left: aiEnabled ? 22:3,
              width:18, height:18, borderRadius:9, background:'#fff', transition:'left 0.2s'
            }}/>
          </div>
        </div>
      </div>

      {!aiEnabled ? (
        <div style={{ textAlign:'center', padding:'80px 0', color:'var(--text-muted)' }}>
          <div style={{ fontSize:48, marginBottom:16 }}>🤖</div>
          <div style={{ fontSize:18, fontWeight:600, marginBottom:8 }}>AI Engine is off</div>
          <div style={{ fontSize:14 }}>Enable the AI engine to receive trading signals</div>
          <button className="btn btn-primary" style={{ marginTop:20 }} onClick={toggleAI}>
            Enable AI Signals
          </button>
        </div>
      ) : aiSignals.length === 0 ? (
        <div style={{ textAlign:'center', padding:'80px 0', color:'var(--text-muted)' }}>
          <div style={{ fontSize:48, marginBottom:16 }}>⏳</div>
          <div>Analyzing markets...</div>
        </div>
      ) : (
        <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
          {aiSignals.map((sig, i) => {
            const market = getMarketById(sig.marketId)
            const tick = tickData[sig.marketId]
            const price = tick?.price || 0
            return (
              <div key={i} className="card" style={{
                borderColor: sig.direction === 'up' ? '#10B98130':'#EF444430',
                display:'grid', gridTemplateColumns:'1fr 1fr 1fr auto',
                alignItems:'center', gap:20
              }}>
                <div style={{ display:'flex', alignItems:'center', gap:12 }}>
                  <span style={{ fontSize:24 }}>{market?.icon}</span>
                  <div>
                    <div style={{ fontWeight:700, fontSize:15 }}>{sig.symbol}</div>
                    <div style={{ fontSize:11, color:'var(--text-muted)' }}>{market?.name}</div>
                  </div>
                </div>

                <div>
                  <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:6 }}>
                    <span className={`badge ${sig.direction==='up'?'badge-up':'badge-down'}`} style={{ fontSize:12, padding:'4px 10px' }}>
                      {sig.direction === 'up' ? '▲ CALL':'▼ PUT'}
                    </span>
                    <span style={{ fontSize:10, color:'var(--text-muted)' }}>Expiry {sig.expiry}s</span>
                  </div>
                  <div style={{ fontSize:11, color:'var(--text-secondary)' }}>{sig.reason}</div>
                </div>

                <div>
                  <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:4 }}>
                    <div style={{
                      height:6, flex:1, borderRadius:3,
                      background:'var(--bg-deep)',
                      position:'relative', overflow:'hidden'
                    }}>
                      <div style={{
                        position:'absolute', left:0, top:0, bottom:0,
                        width:`${sig.confidence}%`,
                        background: sig.confidence > 80 ? 'var(--neon-green)' : sig.confidence > 70 ? 'var(--neon-gold)':'var(--neon-blue)',
                        borderRadius:3
                      }}/>
                    </div>
                    <span className="mono" style={{ fontSize:13, fontWeight:700, color:'var(--neon-cyan)', minWidth:36 }}>
                      {sig.confidence}%
                    </span>
                  </div>
                  <div style={{ fontSize:10, color:'var(--text-muted)' }}>Confidence</div>
                  {price > 0 && (
                    <div className="mono" style={{ fontSize:11, color:'var(--text-secondary)', marginTop:2 }}>
                      @ {price.toFixed(price > 100 ? 2 : 5)}
                    </div>
                  )}
                </div>

                <button
                  className="btn btn-primary btn-sm"
                  onClick={() => {
                    if (market) setActiveMarket(market)
                    setCurrentPage('trade')
                  }}
                >Trade</button>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
