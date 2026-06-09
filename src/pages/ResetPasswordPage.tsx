import axios from 'axios';
import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

import { authApi } from '../api/auth.api';
import { languages } from '../data/languages';
import '../styles/auth.css';

export default function ResetPasswordPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const token = searchParams.get('token') ?? '';

  const [language, setLanguage] = useState('English');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  function getErrorMessage(err: unknown) {
    if (axios.isAxiosError(err)) {
      const data = err.response?.data;

      if (Array.isArray(data?.message)) return data.message.join(', ');
      if (typeof data?.message === 'string') return data.message;
      if (!err.response) return 'Cannot connect to backend.';
    }

    return 'Password reset failed.';
  }

  async function handleResetPassword(event: React.FormEvent) {
    event.preventDefault();
    setMessage('');
    setError('');

    if (!token) {
      setError('Reset token is missing. Open the link from your email again.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    try {
      const res = await authApi.resetPassword({
        token,
        password,
      });

      setMessage(res.data.message || 'Password reset successful.');

      setTimeout(() => {
        navigate('/login');
      }, 1500);
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

      <form className="auth-card pocket-style" onSubmit={handleResetPassword}>
        <div className="brand">
          <div className="brand-icon">N</div>
          <span>
            <strong>Neuro</strong>Option
          </span>
        </div>

        <h1>Reset Password</h1>

        {message && <div className="auth-success">{message}</div>}
        {error && <div className="auth-error">{error}</div>}

        <input
          type="password"
          placeholder="New password *"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
          minLength={6}
        />

        <input
          type="password"
          placeholder="Confirm new password *"
          value={confirmPassword}
          onChange={(event) => setConfirmPassword(event.target.value)}
          required
          minLength={6}
        />

        <button className="primary-auth-btn" type="submit">
          RESET PASSWORD
        </button>
      </form>
    </main>
  );
}