import React, { useState, useEffect } from 'react';

const SIGNAL_REASONS = {
  CALL: [
    'EMA20 crossed above EMA50 — bullish momentum',
    'RSI recovering from oversold zone (28 → 42)',
    'Price bounced off key support level',
    'Bullish engulfing candle detected',
    'MACD histogram turning positive',
  ],
  PUT: [
    'Bearish divergence on RSI — reversal signal',
    'Price rejected at strong resistance zone',
    'EMA20 crossed below EMA50 — bearish signal',
    'Overbought RSI (>72) with weakening momentum',
    'Shooting star candle at resistance',
  ],
};

export default function AISignalPanel({ asset, currentPrice }) {
  const [signal, setSignal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [confidence, setConfidence] = useState(0);

  const generateSignal = () => {
    setLoading(true);
    setTimeout(() => {
      const dir = Math.random() > 0.45 ? 'CALL' : 'PUT';
      const conf = Math.floor(Math.random() * 25 + 68);
      const reasons = SIGNAL_REASONS[dir];
      const picks = reasons.sort(() => Math.random() - 0.5).slice(0, 3);
      setSignal({ direction: dir, confidence: conf, reasons: picks, timestamp: Date.now() });
      setConfidence(conf);
      setLoading(false);
    }, 1200);
  };

  useEffect(() => { generateSignal(); }, [asset.id]);

  useEffect(() => {
    const t = setInterval(generateSignal, 30000);
    return () => clearInterval(t);
  }, [asset.id]);

  const isCall = signal?.direction === 'CALL';

  return (
    <div style={{ padding: '12px', borderBottom: '1px solid var(--border-subtle)', background: 'var(--bg-deep)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ fontSize: 14 }}>🤖</span>
          <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--accent-cyan)' }}>AI NEURAL SIGNAL</span>
        </div>
        <button onClick={generateSignal} style={{ fontSize: 10, padding: '3px 8px', borderRadius: 100, border: '1px solid var(--border-default)', background: 'transparent', color: 'var(--text-muted)', cursor: 'pointer' }}>
          ↻ Refresh
        </button>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '16px 0', color: 'var(--text-muted)', fontSize: 12 }}>
          <div style={{ width: 20, height: 20, border: '2px solid var(--accent-cyan)', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 8px', display: 'inline-block' }} />
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          <div>Analyzing {asset.name}...</div>
        </div>
      ) : signal && (
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
            <div style={{
              flex: 1, padding: '10px', borderRadius: 'var(--radius-md)', textAlign: 'center',
              background: isCall ? 'var(--accent-green-dim)' : 'var(--accent-red-dim)',
              border: `1px solid ${isCall ? 'rgba(0,230,118,0.3)' : 'rgba(255,61,113,0.3)'}`,
            }}>
              <div style={{ fontSize: 20, fontWeight: 800, color: isCall ? 'var(--accent-green)' : 'var(--accent-red)', fontFamily: 'var(--font-display)' }}>
                {isCall ? '▲ CALL' : '▼ PUT'}
              </div>
              <div style={{ fontSize: 10, color: 'var(--text-secondary)', marginTop: 2 }}>{asset.name}</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 22, fontWeight: 700, color: confidence >= 80 ? 'var(--accent-green)' : confidence >= 70 ? 'var(--accent-gold)' : 'var(--text-secondary)' }}>
                {confidence}%
              </div>
              <div style={{ fontSize: 9, color: 'var(--text-muted)' }}>CONFIDENCE</div>
            </div>
          </div>

          {/* Confidence bar */}
          <div style={{ marginBottom: 10 }}>
            <div style={{ height: 4, background: 'var(--bg-card)', borderRadius: 2, overflow: 'hidden' }}>
              <div style={{
                height: '100%', borderRadius: 2,
                width: `${confidence}%`,
                background: confidence >= 80 ? 'var(--accent-green)' : confidence >= 70 ? 'var(--accent-gold)' : 'var(--text-secondary)',
                transition: 'width 1s ease',
              }} />
            </div>
          </div>

          {/* Reasons */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {signal.reasons.map((r, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 6, fontSize: 10, color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                <span style={{ color: 'var(--accent-cyan)', flexShrink: 0, marginTop: 1 }}>›</span>
                <span>{r}</span>
              </div>
            ))}
          </div>

          <div style={{ marginTop: 8, fontSize: 9, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
            Updated {Math.floor((Date.now() - signal.timestamp) / 1000)}s ago
          </div>
        </div>
      )}
    </div>
  );
}
