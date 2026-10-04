import { useState } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import "./AuthPages.css";

type ResetPasswordResponse = { message?: string; data?: { message?: string } };

const API_URL = import.meta.env.VITE_API_URL || "https://neurooption-backend.onrender.com";

export default function ResetPasswordPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [email, setEmail] = useState(searchParams.get("email") || "");
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true); setMessage(""); setSuccess(false);

    try {
      if (!/^\d{6}$/.test(code)) throw new Error("Enter the six-digit verification code.");
      if (password !== confirmPassword) throw new Error("Passwords do not match");

      const response = await fetch(`${API_URL}/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim().toLowerCase(), code, password }),
      });
      const result: ResetPasswordResponse = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(result.message || result.data?.message || "Password reset failed");

      setSuccess(true);
      setMessage("Password reset successfully. Redirecting to sign in...");
      window.setTimeout(() => navigate("/login", { replace: true }), 1200);
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
        <img className="auth-approved-logo auth-approved-logo-card" src="/neurooption-logo.png" alt="NeuroOption" />
        <h2>Verify & Reset Password</h2>
        <p className="auth-subtitle">Enter the code sent to your email, then choose a new password.</p>

        <form className="auth-form" onSubmit={handleSubmit}>
          {message && <div className={success ? "auth-success" : "auth-error"}>{message}</div>}

          <label htmlFor="email">Email address</label>
          <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />

          <label htmlFor="code">6-digit verification code</label>
          <input id="code" className="auth-code-input" inputMode="numeric" autoComplete="one-time-code"
            maxLength={6} pattern="[0-9]{6}" placeholder="000000" value={code}
            onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0,6))} required />

          <label htmlFor="password">New password</label>
          <input id="password" type="password" minLength={6} value={password}
            onChange={(e) => setPassword(e.target.value)} required />

          <label htmlFor="confirmPassword">Confirm password</label>
          <input id="confirmPassword" type="password" minLength={6} value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)} required />

          <button type="submit" disabled={loading}>{loading ? "RESETTING..." : "RESET PASSWORD"}</button>
        </form>

        <p className="auth-subtitle"><Link to="/forgot-password">Send a new code</Link> · <Link to="/login">Back to sign in</Link></p>
      </section>
    </main>
  );
}