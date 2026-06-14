import { useState } from 'react';
import type { FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { usersApi } from '../api';
import './AuthPages.css';

export default function DeleteAccountPage() {
  const navigate = useNavigate();

  const [password, setPassword] = useState('');
  const [confirmDelete, setConfirmDelete] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    setMessage('');

    if (!confirmDelete) {
      setError('Please confirm that you want to delete your account.');
      return;
    }

    setLoading(true);

    try {
      const response = await usersApi.deleteAccount({ password });

      localStorage.removeItem('neurooption_token');
      localStorage.removeItem('token');
      localStorage.removeItem('neurooption_user');

      setMessage(response.message || 'Account deleted successfully.');
      setTimeout(() => navigate('/register'), 1200);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not delete account.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="auth-shell">
      <section className="auth-card">
        <div className="auth-brand">
          <div className="auth-logo">N</div>
          <span>NeuroOption</span>
        </div>

        <h1>Delete Account</h1>

        <p className="auth-subtitle">
          This action is permanent. Enter your password to continue.
        </p>

        {error && <div className="auth-error">{error}</div>}
        {message && <div className="auth-success">{message}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <label>
            Password
            <input
              type="password"
              value={password}
              autoComplete="current-password"
              onChange={(event) => setPassword(event.target.value)}
              required
            />
          </label>

          <label className="auth-check">
            <input
              type="checkbox"
              checked={confirmDelete}
              onChange={(event) => setConfirmDelete(event.target.checked)}
            />
            <span>I understand that my account will be permanently deleted.</span>
          </label>

          <button type="submit" disabled={loading} className="danger-button">
            {loading ? 'DELETING...' : 'DELETE ACCOUNT'}
          </button>
        </form>
      </section>
    </main>
  );
}