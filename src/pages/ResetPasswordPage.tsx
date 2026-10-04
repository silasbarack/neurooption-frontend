import { useState } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import {
  ArrowLeft,
  CircleAlert,
  CircleCheck,
  Eye,
  EyeOff,
  LoaderCircle,
  Lock,
  Mail,
  RotateCw,
  ShieldCheck,
} from "lucide-react";
import AuthLayout from "../components/auth/AuthLayout";

type ApiResponse = { message?: string; data?: { message?: string } };

const API_URL = import.meta.env.VITE_API_URL || "https://neurooption-backend.onrender.com";

export default function ResetPasswordPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [email, setEmail] = useState(searchParams.get("email") || "");
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);

  const mismatch = confirmPassword.length > 0 && confirmPassword !== password;

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
      const result: ApiResponse = await response.json().catch(() => ({}));
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

  async function resendCode() {
    const normalizedEmail = email.trim().toLowerCase();
    if (!normalizedEmail) {
      setSuccess(false);
      setMessage("Enter your email address first, then request a new code.");
      return;
    }

    setResending(true); setMessage(""); setSuccess(false);

    try {
      const response = await fetch(`${API_URL}/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: normalizedEmail }),
      });
      const result: ApiResponse = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(result.message || result.data?.message || "Could not send a new code");

      setSuccess(true);
      setMessage("A new six-digit code has been sent if this email is registered.");
      setCode("");
    } catch (error) {
      setSuccess(false);
      setMessage(error instanceof Error ? error.message : "Cannot connect to backend");
    } finally {
      setResending(false);
    }
  }

  return (
    <AuthLayout variant="single">
      <div className="lp-card">
        <div className="lp-card-head">
          <span className="lp-card-icon"><ShieldCheck size={22} aria-hidden="true" /></span>
          <h2>Reset your password</h2>
          <p>Enter the six-digit code we emailed you, then choose a new password.</p>
        </div>

        {message && (
          <div className={`lp-alert ${success ? "is-success" : "is-error"}`} role="alert">
            {success ? <CircleCheck size={18} /> : <CircleAlert size={18} />}
            <span>{message}</span>
          </div>
        )}

        <form className="lp-form" onSubmit={handleSubmit}>
          <div className="lp-field">
            <label htmlFor="email">Email address</label>
            <div className="lp-input">
              <Mail size={18} aria-hidden="true" />
              <input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
              />
            </div>
          </div>

          <div className="lp-field">
            <div className="lp-field-row">
              <label htmlFor="code">Verification code</label>
              <button
                type="button"
                className="lp-text-button"
                onClick={resendCode}
                disabled={resending}
              >
                <RotateCw size={14} className={resending ? "lp-spin" : undefined} aria-hidden="true" />
                {resending ? "Sending..." : "Resend code"}
              </button>
            </div>
            <input
              id="code"
              className="lp-code"
              inputMode="numeric"
              autoComplete="one-time-code"
              pattern="[0-9]{6}"
              placeholder="000000"
              value={code}
              onChange={(event) => setCode(event.target.value.replace(/\D/g, "").slice(0, 6))}
              aria-describedby="code-hint"
              required
            />
            <p id="code-hint" className="lp-hint">The code is valid for 10 minutes.</p>
          </div>

          <div className="lp-field">
            <label htmlFor="password">New password</label>
            <div className="lp-input">
              <Lock size={18} aria-hidden="true" />
              <input
                id="password"
                className="has-toggle"
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                minLength={6}
                placeholder="At least 6 characters"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
              />
              <button
                className="lp-eye"
                type="button"
                onClick={() => setShowPassword((current) => !current)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div className="lp-field">
            <label htmlFor="confirmPassword">Confirm new password</label>
            <div className={`lp-input${mismatch ? " is-invalid" : ""}`}>
              <Lock size={18} aria-hidden="true" />
              <input
                id="confirmPassword"
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                minLength={6}
                placeholder="Repeat your new password"
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                aria-invalid={mismatch}
                required
              />
            </div>
            {mismatch && <p className="lp-field-error">Passwords do not match.</p>}
          </div>

          <button className="lp-submit" type="submit" disabled={loading}>
            {loading ? (
              <>
                <LoaderCircle size={18} className="lp-spin" aria-hidden="true" />
                <span>Resetting...</span>
              </>
            ) : (
              <span>Reset password</span>
            )}
          </button>
        </form>

        <div className="lp-card-foot">
          <Link to="/login" className="lp-back">
            <ArrowLeft size={16} aria-hidden="true" />
            Back to sign in
          </Link>
          <Link to="/forgot-password" className="lp-link">
            Use a different email
          </Link>
        </div>
      </div>
    </AuthLayout>
  );
}
