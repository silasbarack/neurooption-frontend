import React, { useEffect, useRef, useState } from 'react';

const STATS = [
  { label: 'Active Traders', value: '2.4M+' },
  { label: 'Daily Volume', value: '$890M' },
  { label: 'OTC Markets', value: '127+' },
  { label: 'Win Rate AI', value: '84.3%' },
];

const ASSETS = [
  { name: 'EUR/USD OTC', change: '+0.42%', price: '1.08542', up: true },
  { name: 'BTC/USD', change: '-1.23%', price: '67,234', up: false },
  { name: 'GOLD OTC', change: '+0.87%', price: '2,341.5', up: true },
  { name: 'AUD/JPY OTC', change: '+0.31%', price: '98.234', up: true },
  { name: 'TSLA', change: '-2.11%', price: '182.44', up: false },
  { name: 'ETH/USD OTC', change: '+3.42%', price: '3,421.2', up: true },
  { name: 'GBP/USD OTC', change: '-0.19%', price: '1.26781', up: false },
  { name: 'OIL/USD OTC', change: '+1.05%', price: '78.340', up: true },
  { name: 'SPX500 OTC', change: '+0.67%', price: '5,203.4', up: true },
  { name: 'USD/JPY OTC', change: '+0.22%', price: '151.342', up: true },
];

const FEATURES = [
  {
    icon: '⚡',
    title: 'Neural AI Signals',
    desc: 'Transformer-based prediction engine trained on 10+ years of market data across all asset classes.'
  },
  {
    icon: '🌐',
    title: '127+ OTC Markets',
    desc: 'Trade forex, crypto, stocks, commodities, and indices — 24/7 including weekends via OTC.'
  },
  {
    icon: '📊',
    title: 'Advanced Charting',
    desc: 'Professional candlestick charts with 32+ indicators, multi-timeframe analysis and drawing tools.'
  },
  {
    icon: '🔒',
    title: 'Regulated & Secure',
    desc: 'Bank-grade encryption, cold wallet storage, and multi-jurisdiction regulatory compliance.'
  },
  {
    icon: '💰',
    title: 'Up to 98% Payout',
    desc: 'Industry-leading returns on successful trades. Up to 98% on select OTC pairs.'
  },
  {
    icon: '🤖',
    title: 'Social & Copy Trading',
    desc: 'Follow top traders, copy their strategies automatically, and climb the live leaderboard.'
  },
];

export default function LandingPage({ onOpenAuth }) {
  const canvasRef = useRef(null);
  const [tickerPos, setTickerPos] = useState(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    const particles = Array.from({ length: 60 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 1.5 + 0.3,
      dx: (Math.random() - 0.5) * 0.3,
      dy: (Math.random() - 0.5) * 0.3,
      alpha: Math.random() * 0.5 + 0.1,
    }));

    let raf;
    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0,212,255,${p.alpha})`;
        ctx.fill();
        p.x += p.dx; p.y += p.dy;
        if (p.x < 0 || p.x > canvas.width) p.dx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.dy *= -1;
      });
      raf = requestAnimationFrame(draw);
    }
    draw();
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-void)', position: 'relative', overflow: 'hidden' }}>
      {/* Particle canvas */}
      <canvas ref={canvasRef} style={{ position: 'fixed', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', opacity: 0.6 }} />

      {/* Ambient glow */}
      <div style={{ position: 'fixed', top: '-20%', left: '30%', width: '600px', height: '600px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(0,212,255,0.06) 0%, transparent 70%)', pointerEvents: 'none' }} />
      <div style={{ position: 'fixed', bottom: '-10%', right: '20%', width: '400px', height: '400px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(124,77,255,0.06) 0%, transparent 70%)', pointerEvents: 'none' }} />

      {/* NAVBAR */}
      <nav style={{ position: 'sticky', top: 0, zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 48px', borderBottom: '1px solid var(--border-subtle)', backdropFilter: 'blur(20px)', background: 'rgba(3,5,8,0.8)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 32, height: 32, borderRadius: 8, background: 'linear-gradient(135deg, var(--accent-cyan), var(--accent-purple))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>⚡</div>
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 20, letterSpacing: '-0.5px' }}>Neuro<span style={{ color: 'var(--accent-cyan)' }}>Option</span></span>
        </div>
        <div style={{ display: 'flex', gap: 32, fontSize: 13, color: 'var(--text-secondary)' }}>
          {['Markets', 'Features', 'Pricing', 'Academy', 'API'].map(item => (
            <span key={item} style={{ cursor: 'pointer', transition: 'color 0.2s' }} onMouseEnter={e => e.target.style.color = 'var(--text-primary)'} onMouseLeave={e => e.target.style.color = 'var(--text-secondary)'}>{item}</span>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <button onClick={() => onOpenAuth('login')} style={{ padding: '8px 20px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-default)', background: 'transparent', color: 'var(--text-primary)', cursor: 'pointer', fontFamily: 'var(--font-body)', fontSize: 13, transition: 'all 0.2s' }}>
            Log In
          </button>
          <button onClick={() => onOpenAuth('register')} style={{ padding: '8px 20px', borderRadius: 'var(--radius-md)', border: 'none', background: 'linear-gradient(135deg, var(--accent-cyan), #0099ff)', color: '#000', cursor: 'pointer', fontFamily: 'var(--font-body)', fontSize: 13, fontWeight: 600 }}>
            Start Trading
          </button>
        </div>
      </nav>

      {/* TICKER */}
      <div style={{ background: 'var(--bg-deep)', borderBottom: '1px solid var(--border-subtle)', overflow: 'hidden', height: 36, display: 'flex', alignItems: 'center' }}>
        <div style={{ display: 'flex', gap: 48, animation: 'ticker 30s linear infinite', whiteSpace: 'nowrap', padding: '0 24px' }}>
          {[...ASSETS, ...ASSETS].map((a, i) => (
            <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: 12, fontFamily: 'var(--font-mono)' }}>
              <span style={{ color: 'var(--text-secondary)' }}>{a.name}</span>
              <span style={{ fontWeight: 600 }}>{a.price}</span>
              <span style={{ color: a.up ? 'var(--accent-green)' : 'var(--accent-red)' }}>{a.change}</span>
            </span>
          ))}
        </div>
      </div>

      {/* HERO */}
      <section style={{ padding: '100px 48px 80px', textAlign: 'center', position: 'relative', animation: 'fadeInUp 0.8s ease' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'var(--accent-cyan-dim)', border: '1px solid var(--border-accent)', borderRadius: 100, padding: '6px 16px', fontSize: 12, color: 'var(--accent-cyan)', marginBottom: 32, fontFamily: 'var(--font-mono)' }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--accent-cyan)', display: 'inline-block', animation: 'blink 1.5s ease infinite' }} />
          LIVE — 127 OTC Markets Open
        </div>
        <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'clamp(48px, 7vw, 88px)', lineHeight: 1.0, letterSpacing: '-3px', marginBottom: 24 }}>
          Trade Binary Options<br />
          <span style={{ background: 'linear-gradient(135deg, var(--accent-cyan) 0%, #6b8fff 50%, var(--accent-purple) 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
            With Neural Intelligence
          </span>
        </h1>
        <p style={{ fontSize: 18, color: 'var(--text-secondary)', maxWidth: 560, margin: '0 auto 48px', lineHeight: 1.7 }}>
          NeuroOption combines institutional-grade AI with the world's largest OTC market network. Predict market direction. Earn up to 98%.
        </p>
        <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
          <button onClick={() => onOpenAuth('register')} style={{ padding: '16px 40px', borderRadius: 'var(--radius-lg)', border: 'none', background: 'linear-gradient(135deg, var(--accent-cyan), #0099ff)', color: '#000', fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 15, cursor: 'pointer', boxShadow: 'var(--shadow-glow-cyan)' }}>
            Open Free Account →
          </button>
          <button onClick={() => onOpenAuth('login')} style={{ padding: '16px 40px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-default)', background: 'rgba(255,255,255,0.03)', color: 'var(--text-primary)', fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: 15, cursor: 'pointer' }}>
            Demo Account
          </button>
        </div>
      </section>

      {/* STATS */}
      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 1, margin: '0 48px 80px', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-xl)', overflow: 'hidden', background: 'var(--border-subtle)' }}>
        {STATS.map((s, i) => (
          <div key={i} style={{ background: 'var(--bg-surface)', padding: '36px 24px', textAlign: 'center' }}>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 40, color: 'var(--accent-cyan)', letterSpacing: '-1px' }}>{s.value}</div>
            <div style={{ color: 'var(--text-secondary)', fontSize: 13, marginTop: 6 }}>{s.label}</div>
          </div>
        ))}
      </section>

      {/* FEATURES */}
      <section style={{ padding: '0 48px 100px' }}>
        <div style={{ textAlign: 'center', marginBottom: 60 }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 42, letterSpacing: '-1.5px', marginBottom: 12 }}>
            Everything you need to trade
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: 16 }}>Professional tools. Beginner-friendly. AI-powered.</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
          {FEATURES.map((f, i) => (
            <div key={i} style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-default)', borderRadius: 'var(--radius-xl)', padding: '32px', transition: 'all 0.3s', cursor: 'default' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--border-accent)'; e.currentTarget.style.background = 'var(--bg-elevated)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border-default)'; e.currentTarget.style.background = 'var(--bg-surface)'; }}>
              <div style={{ fontSize: 32, marginBottom: 16 }}>{f.icon}</div>
              <h3 style={{ fontWeight: 600, fontSize: 16, marginBottom: 8 }}>{f.title}</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: 13, lineHeight: 1.6 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* MARKETS PREVIEW */}
      <section style={{ padding: '0 48px 100px' }}>
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 42, letterSpacing: '-1.5px', marginBottom: 12 }}>Live Markets</h2>
          <p style={{ color: 'var(--text-secondary)' }}>127+ OTC and real-market assets — 24/7 trading</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 8 }}>
          {ASSETS.map((a, i) => (
            <div key={i} style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-default)', borderRadius: 'var(--radius-lg)', padding: '16px', display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 12, fontWeight: 600 }}>{a.name}</span>
                <span style={{ fontSize: 10, padding: '2px 6px', borderRadius: 4, background: a.up ? 'var(--accent-green-dim)' : 'var(--accent-red-dim)', color: a.up ? 'var(--accent-green)' : 'var(--accent-red)' }}>{a.change}</span>
              </div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 14, fontWeight: 700 }}>{a.price}</div>
              <div style={{ height: 28, background: 'var(--bg-card)', borderRadius: 4, overflow: 'hidden', position: 'relative' }}>
                <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: `${50 + (a.up ? 15 : -15) * Math.random()}%`, background: `linear-gradient(to top, ${a.up ? 'rgba(0,230,118,0.2)' : 'rgba(255,61,113,0.2)'}, transparent)` }} />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{ margin: '0 48px 100px', padding: '64px', background: 'linear-gradient(135deg, var(--bg-surface) 0%, var(--bg-elevated) 100%)', border: '1px solid var(--border-accent)', borderRadius: 'var(--radius-2xl)', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '-50%', left: '50%', transform: 'translateX(-50%)', width: '600px', height: '300px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(0,212,255,0.08) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 48, letterSpacing: '-2px', marginBottom: 16 }}>
          Start with $10. No limits.
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: 16, marginBottom: 40, maxWidth: 400, margin: '0 auto 40px' }}>
          Join 2.4 million traders using NeuroOption's AI-powered binary options platform.
        </p>
        <button onClick={() => onOpenAuth('register')} style={{ padding: '18px 56px', borderRadius: 'var(--radius-lg)', border: 'none', background: 'linear-gradient(135deg, var(--accent-cyan), #0099ff)', color: '#000', fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 16, cursor: 'pointer', boxShadow: 'var(--shadow-glow-cyan)' }}>
          Create Free Account
        </button>
      </section>

      {/* FOOTER */}
      <footer style={{ borderTop: '1px solid var(--border-subtle)', padding: '40px 48px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'var(--text-muted)', fontSize: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 14 }}>Neuro<span style={{ color: 'var(--accent-cyan)' }}>Option</span></span>
          <span>© 2026 All rights reserved</span>
        </div>
        <div style={{ display: 'flex', gap: 24 }}>
          {['Risk Disclosure', 'Terms of Service', 'Privacy Policy', 'AML Policy'].map(t => (
            <span key={t} style={{ cursor: 'pointer' }}>{t}</span>
          ))}
        </div>
        <div>Trading binary options involves risk of loss.</div>
      </footer>
    </div>
  );
}
