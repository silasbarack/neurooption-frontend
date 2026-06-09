import axios from 'axios';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { authApi } from '../../api/auth.api';
import '../../styles/auth.css';

export default function RegisterForm() {
  const navigate = useNavigate();

  const [fullname, setFullname] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [promoCode, setPromoCode] = useState('50START');
  const [accepted, setAccepted] = useState(false);
  const [error, setError] = useState('');

  function getErrorMessage(err: unknown) {
    if (axios.isAxiosError(err)) {
      const data = err.response?.data;

      if (Array.isArray(data?.message)) {
        return data.message.join(', ');
      }

      if (typeof data?.message === 'string') {
        return data.message;
      }

      if (typeof data?.error === 'string') {
        return data.error;
      }

      if (!err.response) {
        return 'Cannot connect to backend. Make sure backend is running on port 3000.';
      }
    }

    return 'Registration failed. Check your details.';
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError('');

    if (!accepted) {
      setError('Please accept the public offer agreement.');
      return;
    }

    try {
      const res = await authApi.register({
        fullname: fullname.trim(),
        email: email.trim().toLowerCase(),
        phone: phone.trim() || undefined,
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

      <h1>Registration</h1>

      <p>
        Already registered?{' '}
        <button type="button" onClick={() => navigate('/login')}>
          Sign in
        </button>
      </p>

      {error && <div className="auth-error">{error}</div>}

      <input
        placeholder="Full name *"
        value={fullname}
        onChange={(event) => setFullname(event.target.value)}
        required
      />

      <input
        type="email"
        placeholder="Email *"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        required
      />

      <input
        placeholder="Phone"
        value={phone}
        onChange={(event) => setPhone(event.target.value)}
      />

      <input
        type="password"
        placeholder="Password *"
        value={password}
        onChange={(event) => setPassword(event.target.value)}
        required
        minLength={6}
      />

      <small>Enter promo code if you have one</small>

      <input
        placeholder="Promo code"
        value={promoCode}
        onChange={(event) => setPromoCode(event.target.value)}
      />

      <label className="agreement">
        <input
          type="checkbox"
          checked={accepted}
          onChange={(event) => setAccepted(event.target.checked)}
        />
        <span>I have read and accepted the public offer agreement</span>
      </label>

      <button className="primary-auth-btn" type="submit">
        SIGN UP
      </button>
    </form>
  );
}