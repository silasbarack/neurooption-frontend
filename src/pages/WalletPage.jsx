import React, { useState } from 'react'
import { useTradeStore } from '../store/tradeStore'

const METHODS = [
  { id:'card',    label:'Credit / Debit Card',  icon:'💳', min:10,  max:50000 },
  { id:'crypto',  label:'Cryptocurrency',        icon:'₿',  min:10,  max:100000 },
  { id:'skrill',  label:'Skrill',               icon:'💜', min:10,  max:10000  },
  { id:'neteller',label:'Neteller',             icon:'🟠', min:10,  max:10000  },
  { id:'pm',      label:'Perfect Money',        icon:'💛', min:5,   max:5000   },
  { id:'wire',    label:'Bank Wire Transfer',   icon:'🏦', min:100, max:500000 },
  { id:'nowpay',  label:'NowPayments (Crypto)', icon:'⚡', min:10,  max:100000 },
]

const CRYPTO_CURRENCIES = ['Bitcoin (BTC)', 'Ethereum (ETH)', 'USDT (TRC20)', 'USDT (ERC20)', 'BNB', 'Solana (SOL)', 'XRP', 'Litecoin (LTC)']

export default function WalletPage() {
  const [tab, setTab] = useState('deposit')
  const [method, setMethod] = useState('card')
  const [amount, setAmount] = useState(100)
  const [crypto, setCrypto] = useState('Bitcoin (BTC)')
  const { balance, demoBalance, updateBalance } = useTradeStore()

  const selected = METHODS.find(m => m.id === method)

  return (
    <div style={{ padding:24, maxWidth:900, margin:'0 auto' }}>
      <div style={{ marginBottom:24 }}>
        <h1 style={{ fontSize:24, fontWeight:700, letterSpacing:-0.5 }}>Wallet</h1>
        <p style={{ color:'var(--text-muted)', marginTop:4 }}>Manage deposits and withdrawals</p>
      </div>

      {/* Balance row */}
      <div className="grid-2" style={{ marginBottom:24 }}>
        <div className="card">
          <div style={{ fontSize:11, color:'var(--text-muted)', fontWeight:600, marginBottom:6 }}>REAL ACCOUNT</div>
          <div className="mono" style={{ fontSize:28, fontWeight:700, color:'var(--neon-gold)' }}>
            ${balance.toLocaleString('en-US', { minimumFractionDigits:2 })}
          </div>
        </div>
        <div className="card">
          <div style={{ fontSize:11, color:'var(--text-muted)', fontWeight:600, marginBottom:6 }}>DEMO ACCOUNT</div>
          <div className="mono" style={{ fontSize:28, fontWeight:700, color:'var(--neon-blue)' }}>
            ${demoBalance.toLocaleString('en-US', { minimumFractionDigits:2 })}
          </div>
        </div>
      </div>

      {/* Tab */}
      <div className="tab-group" style={{ marginBottom:20, display:'inline-flex' }}>
        {['deposit','withdraw','history'].map(t => (
          <button key={t} className={`tab-item ${tab===t?'active':''}`} onClick={() => setTab(t)}>
            {t === 'deposit' ? '⬆ Deposit' : t === 'withdraw' ? '⬇ Withdraw' : '📋 History'}
          </button>
        ))}
      </div>

      {(tab === 'deposit' || tab === 'withdraw') && (
        <div className="grid-2" style={{ gap:20 }}>
          {/* Method list */}
          <div className="card">
            <div style={{ fontSize:13, fontWeight:600, marginBottom:14 }}>Payment Method</div>
            <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
              {METHODS.map(m => (
                <div
                  key={m.id}
                  onClick={() => setMethod(m.id)}
                  style={{
                    padding:'10px 14px', borderRadius:'var(--r-md)',
                    border: method===m.id ? '1px solid var(--neon-blue)' : '1px solid var(--border)',
                    background: method===m.id ? '#2563EB12' : 'transparent',
                    cursor:'pointer', transition:'all 0.15s',
                    display:'flex', alignItems:'center', gap:12
                  }}
                >
                  <span style={{ fontSize:20 }}>{m.icon}</span>
                  <div>
                    <div style={{ fontSize:13, fontWeight:600 }}>{m.label}</div>
                    <div style={{ fontSize:10, color:'var(--text-muted)' }}>
                      Min: ${m.min} · Max: ${m.max.toLocaleString()}
                    </div>
                  </div>
                  {method===m.id && <div style={{ marginLeft:'auto', color:'var(--neon-blue)', fontSize:18 }}>●</div>}
                </div>
              ))}
            </div>
          </div>

          {/* Form */}
          <div className="card">
            <div style={{ fontSize:13, fontWeight:600, marginBottom:16 }}>
              {tab === 'deposit' ? 'Deposit Funds' : 'Withdraw Funds'}
            </div>

            {/* Crypto selector */}
            {(method === 'crypto' || method === 'nowpay') && (
              <div style={{ marginBottom:14 }}>
                <label style={{ fontSize:11, color:'var(--text-muted)', fontWeight:600, display:'block', marginBottom:6 }}>SELECT CURRENCY</label>
                <select className="select" value={crypto} onChange={e => setCrypto(e.target.value)}>
                  {CRYPTO_CURRENCIES.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
            )}

            <div style={{ marginBottom:14 }}>
              <label style={{ fontSize:11, color:'var(--text-muted)', fontWeight:600, display:'block', marginBottom:6 }}>AMOUNT (USD)</label>
              <div style={{ position:'relative' }}>
                <span style={{ position:'absolute', left:12, top:'50%', transform:'translateY(-50%)', color:'var(--text-muted)', fontSize:15 }}>$</span>
                <input
                  className="input" type="number"
                  value={amount} onChange={e => setAmount(Number(e.target.value))}
                  min={selected?.min} max={selected?.max}
                  style={{ paddingLeft:28, fontFamily:'var(--font-mono)', fontWeight:600, fontSize:18 }}
                />
              </div>
              <div style={{ fontSize:10, color:'var(--text-muted)', marginTop:4 }}>
                Min: ${selected?.min} · Max: ${selected?.max?.toLocaleString()}
              </div>
            </div>

            {/* Quick amounts */}
            <div style={{ display:'flex', gap:6, marginBottom:20, flexWrap:'wrap' }}>
              {[50, 100, 250, 500, 1000, 5000].map(a => (
                <button key={a} className="btn btn-ghost btn-sm" onClick={() => setAmount(a)}>${a}</button>
              ))}
            </div>

            {/* Submit */}
            <button
              className="btn btn-primary"
              style={{ width:'100%', padding:14, fontSize:15 }}
              onClick={() => {
                // Demo simulation
                if (tab === 'deposit') updateBalance(amount)
                alert(`${tab === 'deposit' ? 'Deposit' : 'Withdrawal'} of $${amount} via ${selected?.label} submitted!`)
              }}
            >
              {tab === 'deposit' ? `⬆ Deposit $${amount}` : `⬇ Withdraw $${amount}`}
            </button>

            <div style={{ marginTop:12, fontSize:11, color:'var(--text-muted)', textAlign:'center' }}>
              🔒 256-bit SSL encryption · Funds processed within 1-24 hours
            </div>
          </div>
        </div>
      )}

      {tab === 'history' && (
        <div className="card">
          <div style={{ fontSize:13, fontWeight:600, marginBottom:16 }}>Transaction History</div>
          <div style={{ textAlign:'center', padding:'40px 0', color:'var(--text-muted)' }}>
            No transactions yet
          </div>
        </div>
      )}
    </div>
  )
}
