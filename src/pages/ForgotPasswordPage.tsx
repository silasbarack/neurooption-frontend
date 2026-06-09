import axios from 'axios';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { authApi } from '../api/auth.api';
import { languages } from '../data/languages';
import '../styles/auth.css';

export default function ForgotPasswordPage() {
  const navigate = useNavigate();

  const [language, setLanguage] = useState('English');
  const [email, setEmail] = useState('');

  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  function getErrorMessage(err: unknown) {
    if (axios.isAxiosError(err)) {
      const data = err.response?.data;

      if (Array.isArray(data?.message)) return data.message.join(', ');
      if (typeof data?.message === 'string') return data.message;
      if (!err.response) return 'Cannot connect to backend.';
    }

    return 'Email could not be sent. Check SMTP settings.';
  }

  async function handleForgotPassword(event: React.FormEvent) {
    event.preventDefault();
    setMessage('');
    setError('');

    try {
      const res = await authApi.forgotPassword({
        email: email.trim().toLowerCase(),
      });

      setMessage(res.data.message || 'Reset link sent. Check your email.');
    } catch (err) {
      setError(getErrorMessage(err));
    }
  }

  return (
    <main className="auth-page light">
      <div className="auth-top">
        <button type="button" onClick={() => navigate('/login')}>
          ‹ Back to login
        </button>

        <select
          className="language-select"
          value={language}
          onChange={(event) => setLanguage(event.target.value)}
        >
          {languages.map((item) => (
            <option key={item.code} value={item.name}>
              {item.name}
            </option>
          ))}
        </select>
      </div>

      <form className="auth-card pocket-style" onSubmit={handleForgotPassword}>
        <div className="brand">
          <div className="brand-icon">N</div>
          <span>
            <strong>Neuro</strong>Option
          </span>
        </div>

        <h1>Forgot Password</h1>

        <p>Enter your email to receive a password reset link.</p>

        {message && <div className="auth-success">{message}</div>}
        {error && <div className="auth-error">{error}</div>}

        <input
          type="email"
          placeholder="Email *"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
        />

        <button className="primary-auth-btn" type="submit">
          SEND RESET LINK
        </button>
      </form>
    </main>
  );
}