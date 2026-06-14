import { useState } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./AuthPages.css";

type RegisterResponse = {
  message?: string;
  accessToken?: string;
  token?: string;
  user?: unknown;
  data?: {
    message?: string;
    accessToken?: string;
    token?: string;
    user?: unknown;
  };
};

const API_URL =
  import.meta.env.VITE_API_URL || "https://neurooption-backend.onrender.com";

export default function RegisterPage() {
  const navigate = useNavigate();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setLoading(true);
    setMessage("");

    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fullName: fullName.trim(),
          email: email.trim(),
          password,
        }),
      });

      const result: RegisterResponse = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          result.message || result.data?.message || "Registration failed"
        );
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

        <h2>Create account</h2>

        <p className="auth-subtitle">
          Already registered? <Link to="/login">Sign in</Link>
        </p>

        <form className="auth-form" onSubmit={handleSubmit}>
          {message && <div className="auth-error">{message}</div>}

          <label htmlFor="fullName">Full name</label>
          <input
            id="fullName"
            type="text"
            placeholder="Full name"
            value={fullName}
            onChange={(event) => setFullName(event.target.value)}
            required
          />

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

          <button type="submit" disabled={loading}>
            {loading ? "CREATING ACCOUNT..." : "REGISTER"}
          </button>
        </form>
      </section>
    </main>
  );
}