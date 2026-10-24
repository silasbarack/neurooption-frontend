import { useState } from "react";
import type { FormEvent } from "react";
import { Link } from "react-router-dom";
import { authApi } from "../../api/auth.api";
import "./AuthForms.css";

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    setLoading(true);

    try {
      await authApi.forgotPassword({ email });
      setMessage("Password reset link sent if this email exists.");
    } catch (error) {
      console.error("Forgot password error:", error);
      setMessage("Could not send reset email. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="auth-form" onSubmit={handleSubmit}>
      {message && <div className="auth-alert success">{message}</div>}

      <label className="auth-label" htmlFor="forgot-email">
        Email
      </label>
      <input
        id="forgot-email"
        className="auth-input"
        type="email"
        placeholder="Enter your registered email"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        required
      />

      <button className="auth-button" type="submit" disabled={loading}>
        {loading ? "Sending..." : "SEND RESET LINK"}
      </button>

      <Link className="auth-small-link" to="/login">
        Back to sign in
      </Link>
    </form>
  );
}