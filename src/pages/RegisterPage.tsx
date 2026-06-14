import { useState } from 'react';
import type { FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authApi } from '../api';
import './AuthPages.css';

export default function RegisterPage() {
  const navigate = useNavigate();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [promoCode, setPromoCode] = useState('');
  const [acceptedAgreement, setAcceptedAgreement] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    setMessage('');

    if (!acceptedAgreement) {
      setError('You must accept the public offer agreement.');
      return;
    }

    setLoading(true);

    try {
      const response = await authApi.register({
        fullName: fullName.trim(),
        email: email.trim().toLowerCase(),
        phone: phone.trim(),
        password,
        promoCode: promoCode.trim(),
        acceptedAgreement,
      });

      const token = response.accessToken || response.token;

      if (token) {
        localStorage.setItem('neurooption_token', token);
        localStorage.setItem('token', token);
      }

      if (response.user) {
        localStorage.setItem('neurooption_user', JSON.stringify(response.user));
      }

      setMessage(response.message || 'Registration successful.');
      setTimeout(() => navigate('/trading'), 800);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed.');
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

        <h1>Registration</h1>

        <p className="auth-switch">
          Already registered? <Link to="/login">Sign in</Link>
        </p>

        {error && <div className="auth-error">{error}</div>}
        {message && <div className="auth-success">{message}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <label>
            Full name
            <input
              type="text"
              value={fullName}
              autoComplete="name"
              onChange={(event) => setFullName(event.target.value)}
              required
            />
          </label>

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
            Phone
            <input
              type="tel"
              value={phone}
              autoComplete="tel"
              onChange={(event) => setPhone(event.target.value)}
            />
          </label>

          <label>
            Password
            <input
              type="password"
              value={password}
              autoComplete="new-password"
              onChange={(event) => setPassword(event.target.value)}
              required
              minLength={6}
            />
          </label>

          <label>
            Promo code
            <input
              type="text"
              value={promoCode}
              onChange={(event) => setPromoCode(event.target.value)}
              placeholder="Enter promo code if you have one"
            />
          </label>

          <label className="auth-check">
            <input
              type="checkbox"
              checked={acceptedAgreement}
              onChange={(event) => setAcceptedAgreement(event.target.checked)}
            />
            <span>I have read and accepted the public offer agreement</span>
          </label>

          <button type="submit" disabled={loading}>
            {loading ? 'SIGNING UP...' : 'SIGN UP'}
          </button>
        </form>
      </section>
    </main>
  );
}