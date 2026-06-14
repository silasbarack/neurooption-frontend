import { useState } from "react";
import type { FormEvent } from "react";
import { Link } from "react-router-dom";
import "./AuthPages.css";

type ForgotPasswordResponse = {
  message?: string;
  data?: {
    message?: string;
  };
};

const API_URL =
  import.meta.env.VITE_API_URL || "https://neurooption-backend.onrender.com";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setLoading(true);
    setMessage("");
    setSuccess(false);

    try {
      const response = await fetch(`${API_URL}/auth/forgot-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email.trim(),
        }),
      });

      const result: ForgotPasswordResponse = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          result.message || result.data?.message || "Password reset request failed"
        );
      }

      setSuccess(true);
      setMessage(
        result.message ||
          result.data?.message ||
          "Password reset link sent. Please check your email."
      );
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Cannot connect to backend";

      setSuccess(false);
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

        <h2>Forgot Password</h2>

        <p className="auth-subtitle">
          Remembered password? <Link to="/login">Sign in</Link>
        </p>

        <form className="auth-form" onSubmit={handleSubmit}>
          {message && (
            <div className={success ? "auth-success" : "auth-error"}>{message}</div>
          )}

          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />

          <button type="submit" disabled={loading}>
            {loading ? "SENDING..." : "SEND RESET LINK"}
          </button>
        </form>
      </section>
    </main>
  );
}