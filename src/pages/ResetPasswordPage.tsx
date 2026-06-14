import { useState } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import "./AuthPages.css";

type ResetPasswordResponse = {
  message?: string;
  data?: {
    message?: string;
  };
};

const API_URL =
  import.meta.env.VITE_API_URL || "https://neurooption-backend.onrender.com";

export default function ResetPasswordPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const token = searchParams.get("token") || "";

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setLoading(true);
    setMessage("");
    setSuccess(false);

    try {
      if (!token) {
        throw new Error("Missing reset token");
      }

      if (password !== confirmPassword) {
        throw new Error("Passwords do not match");
      }

      const response = await fetch(`${API_URL}/auth/reset-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token,
          password,
        }),
      });

      const result: ResetPasswordResponse = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          result.message || result.data?.message || "Password reset failed"
        );
      }

      setSuccess(true);
      setMessage("Password reset successfully. Redirecting to login...");

      window.setTimeout(() => {
        navigate("/login", { replace: true });
      }, 1500);
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

        <h2>Reset Password</h2>

        <p className="auth-subtitle">
          Back to <Link to="/login">Sign in</Link>
        </p>

        <form className="auth-form" onSubmit={handleSubmit}>
          {message && (
            <div className={success ? "auth-success" : "auth-error"}>{message}</div>
          )}

          <label htmlFor="password">New password</label>
          <input
            id="password"
            type="password"
            placeholder="New password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />

          <label htmlFor="confirmPassword">Confirm password</label>
          <input
            id="confirmPassword"
            type="password"
            placeholder="Confirm password"
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            required
          />

          <button type="submit" disabled={loading}>
            {loading ? "RESETTING..." : "RESET PASSWORD"}
          </button>
        </form>
      </section>
    </main>
  );
}