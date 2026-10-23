import React, { useState, useEffect } from 'react'
import { useTradeStore } from '../store/tradeStore'
import { TIMEFRAMES } from '../utils/markets'

const QUICK_AMOUNTS = [10, 25, 50, 100, 250, 500, 1000]

export default function TradePanel() {
  const {
    activeMarket, tradeAmount, setTradeAmount,
    tradeExpiry, setTradeExpiry, placeTrade,
    isDemo, balance, demoBalance, tickData,
    aiSignals, aiEnabled, toggleAI,
  } = useTradeStore()

  const [countdown, setCountdown] = useState(null)
  const [lastResult, setLastResult] = useState(null)

  const tick = tickData[activeMarket?.id]
  const currentBalance = isDemo ? demoBalance : balance
  const payout = activeMarket?.payout || 85
  const profit = (tradeAmount * payout / 100).toFixed(2)

  // AI signal for current market
  const signal = aiSignals.find(s => s.marketId === activeMarket?.id)

  const handleTrade = (direction) => {
    const result = placeTrade({ amount: tradeAmount, expiry: tradeExpiry, direction })
    if (!result.ok) return

    // Start countdown
    let secs = tradeExpiry
    setCountdown(secs)
    setLastResult(null)
    const timer = setInterval(() => {
      secs--
      setCountdown(secs)
      if (secs <= 0) {
        clearInterval(timer)
        setCountdown(null)
      }
    }, 1000)
  }

  const formatTime = (s) => {
    if (!s) return '00:00'
    const m = Math.floor(s / 60)
    const sec = s % 60
    return `${m.toString().padStart(2,'0')}:${sec.toString().padStart(2,'0')}`
  }

  return (
    <div className="trade-panel" style={{ height:'100%' }}>
      {/* Header */}
      <div className="trade-header">
        <div>
          <div style={{ fontSize:13, fontWeight:600, color:'var(--text-primary)' }}>Quick Trade</div>
          <div style={{ fontSize:11, color:'var(--text-muted)', marginTop:1 }}>
            {activeMarket?.symbol} · {activeMarket?.category}
          </div>
        </div>
        <div className={`badge ${isDemo ? 'badge-blue':'badge-gold'}`}>
          {isDemo ? '🎮 Demo' : '💰 Real'}
        </div>
      </div>

      <div style={{ padding:'14px 16px', flex:1, display:'flex', flexDirection:'column', gap:14, overflowY:'auto' }}>

        {/* Balance */}
        <div className="card-panel" style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
          <span style={{ fontSize:11, color:'var(--text-muted)', fontWeight:600 }}>BALANCE</span>
          <span className="mono" style={{ fontSize:18, fontWeight:700, color:'var(--neon-gold)' }}>
            ${currentBalance.toLocaleString('en-US', { minimumFractionDigits:2, maximumFractionDigits:2 })}
          </span>
        </div>

        {/* Payout ring + timer */}
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
          <div className="payout-ring">
            <span>{payout}%</span>
          </div>
          <div style={{ textAlign:'center' }}>
            <div style={{ fontSize:10, color:'var(--text-muted)', fontWeight:600, marginBottom:4 }}>EXPIRY TIMER</div>
            <div className="expiry-timer">{formatTime(countdown ?? tradeExpiry)}</div>
          </div>
          <div style={{ textAlign:'right' }}>
            <div style={{ fontSize:11, color:'var(--text-muted)' }}>Profit</div>
            <div className="mono value-up" style={{ fontSize:18, fontWeight:700 }}>+${profit}</div>
          </div>
        </div>

        {/* Current price */}
        {tick && (
          <div className="card-panel" style={{ display:'flex', justifyContent:'space-between' }}>
            <div>
              <div style={{ fontSize:10, color:'var(--text-muted)', marginBottom:3 }}>BID</div>
              <div className="mono value-down" style={{ fontSize:13 }}>{tick.bid?.toFixed(5) || '—'}</div>
            </div>
            <div style={{ textAlign:'center' }}>
              <div style={{ fontSize:10, color:'var(--text-muted)', marginBottom:3 }}>PRICE</div>
              <div className="mono" style={{ fontSize:14, fontWeight:700 }}>{tick.price?.toFixed(5) || '—'}</div>
            </div>
            <div style={{ textAlign:'right' }}>
              <div style={{ fontSize:10, color:'var(--text-muted)', marginBottom:3 }}>ASK</div>
              <div className="mono value-up" style={{ fontSize:13 }}>{tick.ask?.toFixed(5) || '—'}</div>
            </div>
          </div>
        )}

        {/* Expiry selector */}
        <div>
          <div style={{ fontSize:11, color:'var(--text-muted)', marginBottom:8, fontWeight:600 }}>EXPIRY TIME</div>
          <div style={{ display:'flex', flexWrap:'wrap', gap:6 }}>
            {TIMEFRAMES.slice(0, 8).map(tf => (
              <button
                key={tf.seconds}
                className={`btn btn-ghost btn-sm ${tradeExpiry === tf.seconds ? 'active' : ''}`}
                style={tradeExpiry === tf.seconds ? { borderColor:'var(--neon-cyan)', color:'var(--neon-cyan)', background:'#06B6D412' } : {}}
                onClick={() => setTradeExpiry(tf.seconds)}
              >{tf.label}</button>
            ))}
          </div>
        </div>

        {/* Amount */}
        <div>
          <div style={{ fontSize:11, color:'var(--text-muted)', marginBottom:8, fontWeight:600 }}>INVESTMENT AMOUNT</div>
          <div style={{ position:'relative', marginBottom:10 }}>
            <span style={{ position:'absolute', left:12, top:'50%', transform:'translateY(-50%)', color:'var(--text-muted)', fontSize:15, fontWeight:600 }}>$</span>
            <input
              type="number" className="input" min="1" max={currentBalance}
              value={tradeAmount}
              onChange={e => setTradeAmount(Math.max(1, Number(e.target.value)))}
              style={{ paddingLeft:28, fontFamily:'var(--font-mono)', fontWeight:600, fontSize:16 }}
            />
          </div>
          <div style={{ display:'flex', gap:5, flexWrap:'wrap' }}>
            {QUICK_AMOUNTS.map(a => (
              <button
                key={a}
                className="btn btn-ghost btn-sm"
                style={tradeAmount === a ? { borderColor:'var(--neon-blue)', color:'var(--neon-blue)' }:{}}
                onClick={() => setTradeAmount(a)}
              >${a}</button>
            ))}
          </div>
        </div>

        {/* AI Signal */}
        {aiEnabled && signal && (
          <div className="card-panel" style={{ borderColor: signal.direction === 'up' ? '#10B98150':'#EF444450' }}>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:6 }}>
              <span style={{ fontSize:11, fontWeight:700, color:'var(--neon-purple)' }}>🤖 AI SIGNAL</span>
              <span className={`badge ${signal.direction === 'up' ? 'badge-up':'badge-down'}`} style={{ fontSize:10 }}>
                {signal.direction.toUpperCase()} · {signal.confidence}%
              </span>
            </div>
            <div style={{ fontSize:11, color:'var(--text-secondary)' }}>{signal.reason}</div>
          </div>
        )}

        {/* Trade buttons */}
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10, marginTop:'auto' }}>
          <button
            className="btn btn-up"
            onClick={() => handleTrade('up')}
            disabled={tradeAmount > currentBalance || countdown !== null}
          >
            ▲ UP
          </button>
          <button
            className="btn btn-down"
            onClick={() => handleTrade('down')}
            disabled={tradeAmount > currentBalance || countdown !== null}
          >
            ▼ DOWN
          </button>
        </div>

        {/* Active countdown */}
        {countdown !== null && (
          <div style={{
            textAlign:'center', padding:'10px', borderRadius:'var(--r-md)',
            background:'#F59E0B10', border:'1px solid #F59E0B40'
          }}>
            <div style={{ fontSize:11, color:'var(--neon-gold)', fontWeight:600 }}>⏱ TRADE ACTIVE</div>
            <div className="mono" style={{ fontSize:20, color:'var(--neon-gold)' }}>{formatTime(countdown)}</div>
          </div>
        )}

        {/* AI toggle */}
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', paddingTop:8, borderTop:'1px solid var(--border)' }}>
          <span style={{ fontSize:12, color:'var(--text-secondary)' }}>🤖 AI Signals</span>
          <div
            onClick={toggleAI}
            style={{
              width:40, height:22, borderRadius:11,
              background: aiEnabled ? 'var(--neon-purple)':'var(--bg-deep)',
              border:'1px solid var(--border)',
              position:'relative', cursor:'pointer', transition:'all 0.2s'
            }}
          >
            <div style={{
              position:'absolute', top:2, left: aiEnabled ? 18:2,
              width:16, height:16, borderRadius:8,
              background:'#fff', transition:'left 0.2s'
            }}/>
          </div>
        </div>
      </div>
    </div>
  )
}
