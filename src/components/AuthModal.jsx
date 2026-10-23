import React, { useState } from 'react';
import { api } from '../api/client';

const inputStyle = { width: '100%', padding: '12px 16px', background: 'var(--bg-card)', border: '1px solid var(--border-default)', borderRadius: 'var(--radius-md)', color: 'var(--text-primary)', fontFamily: 'var(--font-body)', fontSize: 14, outline: 'none', boxSizing: 'border-box' };
const linkBtn = { background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', fontSize: 12, marginTop: 12, display: 'block', width: '100%', textAlign: 'center' };

// mode: 'login' | 'register' (from the app) — 'forgot' is entered from the login screen.
export default function AuthModal({ mode, onClose, onLogin, onSwitchMode }) {
  const [view, setView] = useState(null); // null = follow `mode`, or 'forgot'
  const [step, setStep] = useState('email'); // forgot flow: 'email' -> 'reset'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');

  const current = view || mode;
  const isForgot = current === 'forgot';

  const reset = () => { setError(''); setInfo(''); };
  const goForgot = () => { reset(); setStep('email'); setCode(''); setPassword(''); setView('forgot'); };
  const goLogin = () => { reset(); setView(null); setPassword(''); setCode(''); onSwitchMode('login'); };

  const run = async (fn) => {
    reset();
    setLoading(true);
    try { await fn(); } catch (e) { setError(e.message || 'Something went wrong. Please try again.'); }
    setLoading(false);
  };

  const toDashboardUser = (u) => ({ name: u.name, email: u.email, balance: Number(u.demoBalance) || 10000, demo: false });

  const submit = () => run(async () => {
    if (current === 'login') {
      const res = await api.auth.login(email.trim(), password);
      onLogin(toDashboardUser(res.user));
    } else if (current === 'register') {
      if (!name.trim()) throw new Error('Please enter your full name');
      const res = await api.auth.register({ name: name.trim(), email: email.trim(), password });
      onLogin(toDashboardUser(res.user));
    } else if (step === 'email') {
      await api.auth.forgotPassword(email.trim());
      setStep('reset');
      setInfo(`If an account exists for ${email.trim()}, we've emailed a 6-digit verification code. It expires in 15 minutes.`);
    } else {
      const res = await api.auth.resetPassword(email.trim(), code.trim(), password);
      setView(null); setPassword(''); setCode('');
      onSwitchMode('login');
      setInfo(res.message);
    }
  });

  const resend = () => run(async () => {
    await api.auth.forgotPassword(email.trim());
    setInfo('A new code has been sent. Any previous code no longer works.');
  });

  const title = isForgot ? (step === 'email' ? 'Reset password' : 'Enter your code') : current === 'login' ? 'Welcome back' : 'Create account';
  const subtitle = isForgot
    ? (step === 'email' ? "Enter your email and we'll send you a 6-digit verification code" : 'Enter the 6-digit code from your email and choose a new password')
    : current === 'login' ? 'Log in to access your trading account' : 'Join 2.4M traders on NeuroOption';
  const buttonLabel = loading ? 'Processing...'
    : isForgot ? (step === 'email' ? 'Send verification code' : 'Reset password')
    : current === 'login' ? 'Log In' : 'Create Account';

  const onKey = (e) => { if (e.key === 'Enter' && !loading) submit(); };

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(3,5,8,0.85)', backdropFilter: 'blur(8px)' }} onClick={onClose}>
      <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-default)', borderRadius: 'var(--radius-2xl)', padding: '40px', width: 420, maxWidth: '92vw', position: 'relative', animation: 'fadeInUp 0.3s ease' }} onClick={e => e.stopPropagation()}>
        <button onClick={onClose} style={{ position: 'absolute', top: 16, right: 16, background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: 20, lineHeight: 1 }}>✕</button>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 32 }}>
          <div style={{ width: 32, height: 32, borderRadius: 8, background: 'linear-gradient(135deg, var(--accent-cyan), var(--accent-purple))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>⚡</div>
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 18 }}>Neuro<span style={{ color: 'var(--accent-cyan)' }}>Option</span></span>
        </div>

        <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 28, marginBottom: 6 }}>{title}</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: 13, marginBottom: 24 }}>{subtitle}</p>

        {info && <div style={{ marginBottom: 16, padding: '10px 14px', background: 'var(--accent-green-dim)', border: '1px solid rgba(0,230,118,0.2)', borderRadius: 'var(--radius-md)', fontSize: 12, color: 'var(--accent-green)' }}>{info}</div>}
        {error && <div role="alert" style={{ marginBottom: 16, padding: '10px 14px', background: 'rgba(255,82,82,0.1)', border: '1px solid rgba(255,82,82,0.3)', borderRadius: 'var(--radius-md)', fontSize: 12, color: '#ff5252' }}>{error}</div>}

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }} onKeyDown={onKey}>
          {current === 'register' && (
            <input placeholder="Full Name" value={name} onChange={e => setName(e.target.value)} style={inputStyle} autoComplete="name" />
          )}
          <input type="email" placeholder="Email address" value={email} onChange={e => setEmail(e.target.value)} style={inputStyle} autoComplete="email" disabled={isForgot && step === 'reset'} />
          {isForgot && step === 'reset' && (
            <input
              placeholder="6-digit code" value={code} inputMode="numeric" maxLength={6} autoComplete="one-time-code"
              onChange={e => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
              style={{ ...inputStyle, textAlign: 'center', letterSpacing: 10, fontSize: 22, fontFamily: 'var(--font-mono)' }}
            />
          )}
          {(!isForgot || step === 'reset') && (
            <input
              type="password" value={password} onChange={e => setPassword(e.target.value)} style={inputStyle}
              placeholder={isForgot ? 'New password (min. 8 characters)' : current === 'register' ? 'Password (min. 8 characters)' : 'Password'}
              autoComplete={current === 'login' ? 'current-password' : 'new-password'}
            />
          )}
        </div>

        <button
          onClick={submit}
          disabled={loading}
          style={{ width: '100%', marginTop: 20, padding: '14px', borderRadius: 'var(--radius-md)', border: 'none', background: loading ? 'var(--bg-hover)' : 'linear-gradient(135deg, var(--accent-cyan), #0099ff)', color: loading ? 'var(--text-muted)' : '#000', fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 15, cursor: loading ? 'not-allowed' : 'pointer', transition: 'all 0.2s' }}
        >
          {buttonLabel}
        </button>

        {current === 'login' && <button onClick={goForgot} style={linkBtn}>Forgot password?</button>}
        {isForgot && step === 'reset' && <button onClick={resend} disabled={loading} style={linkBtn}>Didn't get a code? Send a new one</button>}
        {isForgot && <button onClick={goLogin} style={linkBtn}>← Back to log in</button>}

        {!isForgot && (
          <div style={{ marginTop: 24, textAlign: 'center', fontSize: 13, color: 'var(--text-secondary)' }}>
            {current === 'login' ? "Don't have an account? " : 'Already have an account? '}
            <span onClick={() => { reset(); onSwitchMode(current === 'login' ? 'register' : 'login'); }} style={{ color: 'var(--accent-cyan)', cursor: 'pointer', fontWeight: 600 }}>
              {current === 'login' ? 'Sign up free' : 'Log in'}
            </span>
          </div>
        )}

        {!isForgot && (
          <div style={{ marginTop: 20, padding: '12px 16px', background: 'var(--accent-green-dim)', border: '1px solid rgba(0,230,118,0.2)', borderRadius: 'var(--radius-md)', fontSize: 12, color: 'var(--accent-green)', textAlign: 'center' }}>
            🎁 Get $10,000 demo balance instantly — no deposit required
          </div>
        )}
      </div>
    </div>
  );
}
