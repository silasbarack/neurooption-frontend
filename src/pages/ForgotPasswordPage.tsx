import { useState } from 'react';
import type { FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { authApi } from '../api';
import './AuthPages.css';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    try {
      const response = await authApi.forgotPassword({
        email: email.trim().toLowerCase(),
      });

      setMessage(response.message || 'Password reset email sent successfully.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not send reset email.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="auth-shell">
      <section className="auth-card">
        <Link className="auth-back" to="/login">
          ‹ Back to login
        </Link>

        <div className="auth-brand">
          <div className="auth-logo">N</div>
          <span>NeuroOption</span>
        </div>

        <h1>Forgot Password</h1>
        <p className="auth-subtitle">
          Enter your email to receive a password reset link.
        </p>

        {error && <div className="auth-error">{error}</div>}
        {message && <div className="auth-success">{message}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <label>
            Email
            <input
              type="email"
              value={email}
              autoComplete="email"
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </label>

          <button type="submit" disabled={loading}>
            {loading ? 'SENDING...' : 'SEND RESET LINK'}
          </button>
        </form>
      </section>
    </main>
  );
}