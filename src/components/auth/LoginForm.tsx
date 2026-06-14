import { useState } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authApi } from "../../api/auth.api";
import "./AuthForms.css";

type AuthResponse = {
  accessToken?: string;
  token?: string;
  message?: string;
  user?: {
    id?: string;
    email?: string;
    fullName?: string;
    name?: string;
  };
  data?: {
    accessToken?: string;
    token?: string;
    user?: {
      id?: string;
      email?: string;
      fullName?: string;
      name?: string;
    };
  };
};

export default function LoginForm() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    setLoading(true);

    try {
      const response = (await authApi.login({
        email,
        password,
      })) as AuthResponse;

      const token =
        response.accessToken ||
        response.token ||
        response.data?.accessToken ||
        response.data?.token;

      const user = response.user || response.data?.user;

      if (!token) {
        setMessage("Login worked, but no token was returned by backend.");
        return;
      }

      localStorage.setItem("neurooption_token", token);
      localStorage.setItem("neurooption_user", JSON.stringify(user || {}));

      navigate("/trading");
    } catch (error) {
      console.error("Login error:", error);
      setMessage("Invalid email or password.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="auth-form" onSubmit={handleSubmit}>
      {message && <div className="auth-alert">{message}</div>}

      <label className="auth-label" htmlFor="login-email">
        Email
      </label>
      <input
        id="login-email"
        className="auth-input"
        type="email"
        placeholder="Enter your email"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        required
      />

      <label className="auth-label" htmlFor="login-password">
        Password
      </label>
      <input
        id="login-password"
        className="auth-input"
        type="password"
        placeholder="Enter your password"
        value={password}
        onChange={(event) => setPassword(event.target.value)}
        required
      />

      <Link className="auth-small-link" to="/forgot-password">
        Forgot Password?
      </Link>

      <button className="auth-button" type="submit" disabled={loading}>
        {loading ? "Signing in..." : "SIGN IN"}
      </button>
    </form>
  );
}