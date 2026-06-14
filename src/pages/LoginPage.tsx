import { useState } from 'react';
import type { FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authApi } from '../api';
import './AuthPages.css';

export default function LoginPage() {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await authApi.login({
        email: email.trim().toLowerCase(),
        password,
      });

      const token = response.accessToken || response.token;

      if (token) {
        localStorage.setItem('neurooption_token', token);
        localStorage.setItem('token', token);
      }

      if (response.user) {
        localStorage.setItem('neurooption_user', JSON.stringify(response.user));
      }

      navigate('/trading');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Cannot connect to backend.');
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

        <h1>Sign in</h1>

        <p className="auth-switch">
          New user? <Link to="/register">Registration</Link>
        </p>

        {error && <div className="auth-error">{error}</div>}

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

          <Link className="auth-small-link" to="/forgot-password">
            Forgot Password?
          </Link>

          <button type="submit" disabled={loading}>
            {loading ? 'SIGNING IN...' : 'SIGN IN'}
          </button>
        </form>
      </section>
    </main>
  );
}