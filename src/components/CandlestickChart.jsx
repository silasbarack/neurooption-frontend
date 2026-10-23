import React, { useEffect, useRef, useState } from 'react';

export default function CandlestickChart({ candles, currentPrice, asset }) {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const [indicators, setIndicators] = useState({ ema20: true, ema50: false, bb: false, volume: true });
  const [drawTool, setDrawTool] = useState(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !candles.length) return;

    const dpr = window.devicePixelRatio || 1;
    const W = container.offsetWidth;
    const H = container.offsetHeight;
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    canvas.style.width = W + 'px';
    canvas.style.height = H + 'px';
    const ctx = canvas.getContext('2d');
    ctx.scale(dpr, dpr);

    const PAD = { top: 20, right: 80, bottom: 80, left: 10 };
    const chartW = W - PAD.left - PAD.right;
    const chartH = H - PAD.top - PAD.bottom;
    const volH = 60;
    const mainH = chartH - volH - 8;

    const visible = candles.slice(-Math.min(candles.length, Math.floor(chartW / 9)));
    const highs = visible.map(c => c.high);
    const lows = visible.map(c => c.low);
    let maxP = Math.max(...highs);
    let minP = Math.min(...lows);
    const pad = (maxP - minP) * 0.08;
    maxP += pad; minP -= pad;

    const toX = (i) => PAD.left + (i / (visible.length - 1)) * chartW;
    const toY = (p) => PAD.top + mainH - ((p - minP) / (maxP - minP)) * mainH;
    const candleW = Math.max(2, chartW / visible.length * 0.7);

    // Background
    ctx.fillStyle = '#080c14';
    ctx.fillRect(0, 0, W, H);

    // Grid
    ctx.strokeStyle = 'rgba(255,255,255,0.04)';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 6; i++) {
      const y = PAD.top + (i / 6) * mainH;
      ctx.beginPath(); ctx.moveTo(PAD.left, y); ctx.lineTo(W - PAD.right, y); ctx.stroke();
      const price = maxP - (i / 6) * (maxP - minP);
      const dec = asset.base > 100 ? 2 : asset.base > 1 ? 4 : 5;
      ctx.fillStyle = 'rgba(136,153,187,0.6)';
      ctx.font = '10px JetBrains Mono, monospace';
      ctx.textAlign = 'left';
      ctx.fillText(price.toFixed(dec), W - PAD.right + 6, y + 4);
    }
    for (let i = 0; i < visible.length; i += Math.ceil(visible.length / 8)) {
      const x = toX(i);
      ctx.beginPath(); ctx.moveTo(x, PAD.top); ctx.lineTo(x, PAD.top + mainH); ctx.stroke();
      const d = new Date(visible[i].time);
      ctx.fillStyle = 'rgba(136,153,187,0.5)';
      ctx.font = '10px JetBrains Mono, monospace';
      ctx.textAlign = 'center';
      ctx.fillText(`${d.getHours().toString().padStart(2,'0')}:${d.getMinutes().toString().padStart(2,'0')}`, x, PAD.top + mainH + 16);
    }

    // EMA helper
    function calcEMA(data, period) {
      const k = 2 / (period + 1);
      let ema = data[0];
      return data.map(v => { ema = v * k + ema * (1 - k); return ema; });
    }

    const closes = visible.map(c => c.close);

    // EMA 20
    if (indicators.ema20) {
      const ema20 = calcEMA(closes, 20);
      ctx.beginPath(); ctx.strokeStyle = 'rgba(0,212,255,0.8)'; ctx.lineWidth = 1.5;
      ema20.forEach((v, i) => { const x = toX(i), y = toY(v); i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y); });
      ctx.stroke();
      ctx.fillStyle = 'rgba(0,212,255,0.8)'; ctx.font = '9px Space Grotesk, sans-serif';
      ctx.fillText('EMA20', W - PAD.right + 4, toY(ema20[ema20.length-1]) - 2);
    }

    // EMA 50
    if (indicators.ema50) {
      const ema50 = calcEMA(closes, 50);
      ctx.beginPath(); ctx.strokeStyle = 'rgba(255,214,0,0.8)'; ctx.lineWidth = 1.5;
      ema50.forEach((v, i) => { const x = toX(i), y = toY(v); i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y); });
      ctx.stroke();
    }

    // Bollinger Bands
    if (indicators.bb && closes.length >= 20) {
      const period = 20;
      const upper = [], lower = [], mid = [];
      for (let i = period - 1; i < closes.length; i++) {
        const slice = closes.slice(i - period + 1, i + 1);
        const mean = slice.reduce((a, b) => a + b, 0) / period;
        const std = Math.sqrt(slice.reduce((a, b) => a + (b - mean) ** 2, 0) / period);
        upper.push(mean + 2 * std); lower.push(mean - 2 * std); mid.push(mean);
      }
      const offset = period - 1;
      [['rgba(124,77,255,0.6)', upper], ['rgba(124,77,255,0.6)', lower], ['rgba(124,77,255,0.3)', mid]].forEach(([color, data]) => {
        ctx.beginPath(); ctx.strokeStyle = color; ctx.lineWidth = 1;
        data.forEach((v, i) => { const x = toX(i + offset), y = toY(v); i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y); });
        ctx.stroke();
      });
    }

    // Candles
    visible.forEach((c, i) => {
      const x = toX(i);
      const isUp = c.close >= c.open;
      const color = isUp ? '#00e676' : '#ff3d71';
      const openY = toY(c.open), closeY = toY(c.close);
      const highY = toY(c.high), lowY = toY(c.low);

      // Wick
      ctx.strokeStyle = color; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(x, highY); ctx.lineTo(x, lowY); ctx.stroke();

      // Body
      const bodyTop = Math.min(openY, closeY);
      const bodyH = Math.max(1, Math.abs(closeY - openY));
      ctx.fillStyle = isUp ? '#00e676' : '#ff3d71';
      ctx.fillRect(x - candleW / 2, bodyTop, candleW, bodyH);
    });

    // Volume bars
    if (indicators.volume) {
      const volTop = PAD.top + mainH + 8;
      const maxVol = Math.max(...visible.map(c => c.volume));
      visible.forEach((c, i) => {
        const x = toX(i);
        const isUp = c.close >= c.open;
        const barH = (c.volume / maxVol) * volH;
        ctx.fillStyle = isUp ? 'rgba(0,230,118,0.25)' : 'rgba(255,61,113,0.25)';
        ctx.fillRect(x - candleW / 2, volTop + volH - barH, candleW, barH);
      });
      ctx.fillStyle = 'rgba(136,153,187,0.4)'; ctx.font = '9px Space Grotesk';
      ctx.fillText('VOL', PAD.left + 4, volTop + 12);
    }

    // Current price line
    const dec = asset.base > 100 ? 2 : asset.base > 1 ? 4 : 5;
    const cpY = toY(currentPrice);
    ctx.setLineDash([4, 4]);
    ctx.strokeStyle = 'rgba(0,212,255,0.6)'; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(PAD.left, cpY); ctx.lineTo(W - PAD.right, cpY); ctx.stroke();
    ctx.setLineDash([]);

    // Price tag
    ctx.fillStyle = '#00d4ff';
    ctx.fillRect(W - PAD.right + 2, cpY - 9, PAD.right - 4, 18);
    ctx.fillStyle = '#000'; ctx.font = 'bold 10px JetBrains Mono, monospace'; ctx.textAlign = 'left';
    ctx.fillText(currentPrice.toFixed(dec), W - PAD.right + 5, cpY + 4);

  }, [candles, currentPrice, indicators, asset]);

  const INDICATOR_BTNS = [
    { key: 'ema20', label: 'EMA 20' },
    { key: 'ema50', label: 'EMA 50' },
    { key: 'bb', label: 'BB' },
    { key: 'volume', label: 'Vol' },
  ];

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden' }}>
      {/* Toolbar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 12px', borderBottom: '1px solid var(--border-subtle)', background: 'var(--bg-deep)' }}>
        <span style={{ fontSize: 10, color: 'var(--text-muted)', marginRight: 4 }}>INDICATORS</span>
        {INDICATOR_BTNS.map(btn => (
          <button key={btn.key} onClick={() => setIndicators(prev => ({ ...prev, [btn.key]: !prev[btn.key] }))} style={{
            padding: '3px 10px', borderRadius: 'var(--radius-sm)', border: '1px solid', fontSize: 10, cursor: 'pointer', fontFamily: 'var(--font-mono)',
            borderColor: indicators[btn.key] ? 'var(--accent-cyan)' : 'var(--border-default)',
            background: indicators[btn.key] ? 'var(--accent-cyan-dim)' : 'transparent',
            color: indicators[btn.key] ? 'var(--accent-cyan)' : 'var(--text-muted)',
          }}>{btn.label}</button>
        ))}
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 6 }}>
          {['📏', '📐', '⭕', '✏️'].map((icon, i) => (
            <button key={i} style={{ background: 'none', border: '1px solid var(--border-default)', borderRadius: 'var(--radius-sm)', width: 24, height: 24, cursor: 'pointer', fontSize: 12, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{icon}</button>
          ))}
        </div>
      </div>
      <div ref={containerRef} style={{ flex: 1, position: 'relative' }}>
        <canvas ref={canvasRef} style={{ display: 'block', width: '100%', height: '100%' }} />
      </div>
    </div>
  );
}
