import axios from 'axios';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { authApi } from '../../api/auth.api';
import '../../styles/auth.css';

export default function LoginForm() {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  function getErrorMessage(err: unknown) {
    if (axios.isAxiosError(err)) {
      const data = err.response?.data;

      if (Array.isArray(data?.message)) return data.message.join(', ');
      if (typeof data?.message === 'string') return data.message;
      if (!err.response) return 'Cannot connect to backend on port 3000.';
    }

    return 'Invalid email or password';
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError('');

    try {
      const res = await authApi.login({
        email: email.trim().toLowerCase(),
        password,
      });

      localStorage.setItem('accessToken', res.data.accessToken);
      localStorage.setItem('user', JSON.stringify(res.data.user));

      navigate('/trading');
    } catch (err) {
      setError(getErrorMessage(err));
    }
  }

  return (
    <form className="auth-card pocket-style" onSubmit={handleSubmit}>
      <div className="brand">
        <div className="brand-icon">N</div>
        <span>
          <strong>Neuro</strong>Option
        </span>
      </div>

      <h1>Sign in</h1>

      <p>
        New user?{' '}
        <button type="button" onClick={() => navigate('/register')}>
          Registration
        </button>
      </p>

      {error && <div className="auth-error">{error}</div>}

      <input
        type="email"
        placeholder="Email *"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        required
      />

      <input
        type="password"
        placeholder="Password *"
        value={password}
        onChange={(event) => setPassword(event.target.value)}
        required
        minLength={6}
      />

      <button
        type="button"
        className="forgot-link"
        onClick={() => navigate('/forgot-password')}
      >
        Forgot Password?
      </button>

      <button className="primary-auth-btn" type="submit">
        SIGN IN
      </button>
    </form>
  );
}