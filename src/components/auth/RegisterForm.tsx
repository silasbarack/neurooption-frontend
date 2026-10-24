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

export default function RegisterForm() {
  const navigate = useNavigate();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    setLoading(true);

    try {
      const response = (await authApi.register({
        fullName,
        email,
        password,
      })) as AuthResponse;

      const token =
        response.accessToken ||
        response.token ||
        response.data?.accessToken ||
        response.data?.token;

      const user = response.user || response.data?.user;

      if (token) {
        localStorage.setItem("neurooption_token", token);
        localStorage.setItem("neurooption_user", JSON.stringify(user || {}));
        navigate("/trading");
        return;
      }

      setMessage("Account created. Please sign in.");
      setTimeout(() => navigate("/login"), 1200);
    } catch (error) {
      console.error("Registration error:", error);
      setMessage("Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="auth-form" onSubmit={handleSubmit}>
      {message && <div className="auth-alert">{message}</div>}

      <label className="auth-label" htmlFor="register-full-name">
        Full name
      </label>
      <input
        id="register-full-name"
        className="auth-input"
        type="text"
        placeholder="Enter your full name"
        value={fullName}
        onChange={(event) => setFullName(event.target.value)}
        required
      />

      <label className="auth-label" htmlFor="register-email">
        Email
      </label>
      <input
        id="register-email"
        className="auth-input"
        type="email"
        placeholder="Enter your email"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        required
      />

      <label className="auth-label" htmlFor="register-password">
        Password
      </label>
      <input
        id="register-password"
        className="auth-input"
        type="password"
        placeholder="Create a password"
        value={password}
        onChange={(event) => setPassword(event.target.value)}
        required
      />

      <button className="auth-button" type="submit" disabled={loading}>
        {loading ? "Creating account..." : "REGISTER"}
      </button>

      <Link className="auth-small-link" to="/login">
        Already have an account? Sign in
      </Link>
    </form>
  );
}