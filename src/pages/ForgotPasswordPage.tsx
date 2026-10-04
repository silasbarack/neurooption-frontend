import { useState } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import Logo from "../components/branding/Logo";
import "./AuthPages.css";

type ForgotPasswordResponse = { message?: string; data?: { message?: string } };

const API_URL = import.meta.env.VITE_API_URL || "https://neurooption-backend.onrender.com";

export default function ForgotPasswordPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true); setMessage(""); setSuccess(false);

    try {
      const normalizedEmail = email.trim().toLowerCase();
      const response = await fetch(`${API_URL}/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: normalizedEmail }),
      });
      const result: ForgotPasswordResponse = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(result.message || result.data?.message || "Password recovery request failed");

      setSuccess(true);
      setMessage(result.message || result.data?.message || "If the account exists, a six-digit verification code has been sent.");
      window.setTimeout(() => {
        navigate(`/reset-password?email=${encodeURIComponent(normalizedEmail)}`);
      }, 650);
    } catch (error) {
      setSuccess(false);
      setMessage(error instanceof Error ? error.message : "Cannot connect to backend");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="auth-page auth-recovery-page">
      <section className="auth-card auth-recovery-card">
        <Logo className="auth-approved-logo auth-approved-logo-card" />
        <h2>Forgot Password</h2>
        <p className="auth-subtitle">Enter your email and we’ll send a secure six-digit verification code.</p>

        <form className="auth-form" onSubmit={handleSubmit}>
          {message && <div className={success ? "auth-success" : "auth-error"}>{message}</div>}
          <label htmlFor="email">Email address</label>
          <input id="email" type="email" placeholder="you@example.com" value={email}
            onChange={(event) => setEmail(event.target.value)} required />
          <button type="submit" disabled={loading}>{loading ? "SENDING..." : "SEND 6-DIGIT CODE"}</button>
        </form>

        <p className="auth-subtitle">Remembered your password? <Link to="/login">Sign in</Link></p>
      </section>
    </main>
  );
}