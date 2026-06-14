import { useState } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./AuthPages.css";

type AuthUser = {
  id?: string;
  email?: string;
  fullName?: string;
};

type AuthResponse = {
  accessToken?: string;
  token?: string;
  user?: AuthUser;
  message?: string;
  data?: {
    accessToken?: string;
    token?: string;
    user?: AuthUser;
    message?: string;
  };
};

const API_URL =
  import.meta.env.VITE_API_URL || "https://neurooption-backend.onrender.com";

export default function LoginPage() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setLoading(true);
    setMessage("");

    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email.trim(),
          password,
        }),
      });

      const result: AuthResponse = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(result.message || result.data?.message || "Login failed");
      }

      const cleanResult = result.data || result;
      const token = cleanResult.accessToken || cleanResult.token;

      if (token) {
        localStorage.setItem("neurooption_token", token);
      }

      if (cleanResult.user) {
        localStorage.setItem("neurooption_user", JSON.stringify(cleanResult.user));
      }

      navigate("/trading", { replace: true });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Cannot connect to backend";

      setMessage(errorMessage);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="auth-page">
      <section className="auth-card">
        <div className="auth-logo">
          <div className="auth-logo-icon">N</div>
          <h1>NeuroOption</h1>
        </div>

        <h2>Sign in</h2>

        <p className="auth-subtitle">
          New user? <Link to="/register">Registration</Link>
        </p>

        <form className="auth-form" onSubmit={handleSubmit}>
          {message && <div className="auth-error">{message}</div>}

          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />

          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />

          <Link className="forgot-link" to="/forgot-password">
            Forgot Password?
          </Link>

          <button type="submit" disabled={loading}>
            {loading ? "SIGNING IN..." : "SIGN IN"}
          </button>
        </form>
      </section>
    </main>
  );
}