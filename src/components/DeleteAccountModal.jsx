import React, { useState } from 'react';
import { api } from '../api/client';

export default function DeleteAccountModal({ onClose, onDeleted }) {
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const confirmDelete = async () => {
    setError('');
    setLoading(true);
    try {
      await api.auth.deleteAccount(password);
      onDeleted();
    } catch (e) {
      setError(e.message || 'Could not delete your account. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 1100, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(3,5,8,0.85)', backdropFilter: 'blur(8px)' }} onClick={onClose}>
      <div style={{ background: 'var(--bg-surface)', border: '1px solid rgba(255,82,82,0.35)', borderRadius: 'var(--radius-2xl)', padding: 32, width: 400, maxWidth: '92vw' }} onClick={e => e.stopPropagation()}>
        <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 22, marginBottom: 8, color: '#ff5252' }}>Delete your account?</h3>
        <p style={{ color: 'var(--text-secondary)', fontSize: 13, lineHeight: 1.6, marginBottom: 18 }}>
          This permanently deletes your NeuroOption account and personal data. This cannot be undone.
          We'll email you a confirmation. Enter your password to continue.
        </p>
        {error && <div role="alert" style={{ marginBottom: 14, padding: '10px 14px', background: 'rgba(255,82,82,0.1)', border: '1px solid rgba(255,82,82,0.3)', borderRadius: 'var(--radius-md)', fontSize: 12, color: '#ff5252' }}>{error}</div>}
        <input
          type="password" placeholder="Your password" value={password} autoFocus autoComplete="current-password"
          onChange={e => setPassword(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter' && password && !loading) confirmDelete(); }}
          style={{ width: '100%', boxSizing: 'border-box', padding: '12px 16px', background: 'var(--bg-card)', border: '1px solid var(--border-default)', borderRadius: 'var(--radius-md)', color: 'var(--text-primary)', fontFamily: 'var(--font-body)', fontSize: 14, outline: 'none' }}
        />
        <div style={{ display: 'flex', gap: 10, marginTop: 18 }}>
          <button onClick={onClose} style={{ flex: 1, padding: 12, borderRadius: 'var(--radius-md)', border: '1px solid var(--border-default)', background: 'transparent', color: 'var(--text-primary)', cursor: 'pointer', fontWeight: 600 }}>Cancel</button>
          <button onClick={confirmDelete} disabled={!password || loading} style={{ flex: 1, padding: 12, borderRadius: 'var(--radius-md)', border: 'none', background: !password || loading ? 'var(--bg-hover)' : '#ff5252', color: !password || loading ? 'var(--text-muted)' : '#fff', cursor: !password || loading ? 'not-allowed' : 'pointer', fontWeight: 700 }}>
            {loading ? 'Deleting...' : 'Delete account'}
          </button>
        </div>
      </div>
    </div>
  );
}
