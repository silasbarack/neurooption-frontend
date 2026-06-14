import { useState } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { authApi } from "../../api/auth.api";
import "./AuthForms.css";

export default function ResetPasswordForm() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const token = searchParams.get("token") || "";

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");

    if (password !== confirmPassword) {
      setMessage("Passwords do not match.");
      return;
    }

    if (!token) {
      setMessage("Missing reset token.");
      return;
    }

    setLoading(true);

    try {
      await authApi.resetPassword({
        token,
        password,
      });

      setMessage("Password reset successful. Redirecting...");
      setTimeout(() => navigate("/login"), 1200);
    } catch (error) {
      console.error("Reset password error:", error);
      setMessage("Password reset failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="auth-form" onSubmit={handleSubmit}>
      {message && <div className="auth-alert">{message}</div>}

      <label className="auth-label" htmlFor="reset-password">
        New password
      </label>
      <input
        id="reset-password"
        className="auth-input"
        type="password"
        placeholder="Enter new password"
        value={password}
        onChange={(event) => setPassword(event.target.value)}
        required
      />

      <label className="auth-label" htmlFor="confirm-reset-password">
        Confirm password
      </label>
      <input
        id="confirm-reset-password"
        className="auth-input"
        type="password"
        placeholder="Confirm new password"
        value={confirmPassword}
        onChange={(event) => setConfirmPassword(event.target.value)}
        required
      />

      <button className="auth-button" type="submit" disabled={loading}>
        {loading ? "Resetting..." : "RESET PASSWORD"}
      </button>

      <Link className="auth-small-link" to="/login">
        Back to sign in
      </Link>
    </form>
  );
}