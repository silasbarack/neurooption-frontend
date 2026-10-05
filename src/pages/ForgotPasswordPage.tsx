import { useState } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  CircleAlert,
  CircleCheck,
  KeyRound,
  LoaderCircle,
  Mail,
  MailCheck,
} from "lucide-react";
import AuthLayout from "../components/auth/AuthLayout";

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
      }, 1200);
    } catch (error) {
      setSuccess(false);
      setMessage(error instanceof Error ? error.message : "Cannot connect to backend");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthLayout variant="single">
      <div className="au-card">
        <div className="au-card-head">
          <span className="au-card-icon"><KeyRound size={22} aria-hidden="true" /></span>
          <h2>Forgot your password?</h2>
          <p>
            Enter the email you registered with and we'll send you a
            six-digit verification code to reset your password.
          </p>
        </div>

        {message && (
          <div className={`au-alert ${success ? "is-success" : "is-error"}`} role="alert">
            {success ? <CircleCheck size={18} /> : <CircleAlert size={18} />}
            <span>{message}</span>
          </div>
        )}

        <form className="au-form" onSubmit={handleSubmit}>
          <div className="au-field">
            <label htmlFor="email">Email address</label>
            <div className="au-input">
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

          <button className="au-submit" type="submit" disabled={loading}>
            {loading ? (
              <>
                <LoaderCircle size={18} className="au-spin" aria-hidden="true" />
                <span>Sending code...</span>
              </>
            ) : (
              <>
                <span>Send verification code</span>
                <ArrowRight size={18} aria-hidden="true" />
              </>
            )}
          </button>
        </form>

        <div className="au-steps-note">
          <MailCheck size={18} aria-hidden="true" />
          <span>
            The code expires in 10 minutes. Check your spam folder if it doesn't
            arrive within a minute.
          </span>
        </div>

        <div className="au-card-foot">
          <Link to="/login" className="au-back">
            <ArrowLeft size={16} aria-hidden="true" />
            Back to sign in
          </Link>
          <Link to="/reset-password" className="au-link">
            I already have a code
          </Link>
        </div>
      </div>
    </AuthLayout>
  );
}
