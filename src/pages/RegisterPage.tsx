import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authApi } from "../api/auth.api";
import {
  languages,
  translate,
  type LanguageCode,
} from "../i18n/authI18n";
import "./AuthPages.css";

export default function RegisterPage() {
  const navigate = useNavigate();

  const [language, setLanguage] = useState<LanguageCode>(() => {
    return (localStorage.getItem("neurooption_language") as LanguageCode) || "en";
  });

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);

  const tt = (key: Parameters<typeof translate>[1]) => translate(language, key);

  useEffect(() => {
    localStorage.setItem("neurooption_language", language);
    document.documentElement.lang = language;
    document.documentElement.dir = language === "ar" ? "rtl" : "ltr";
  }, [language]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setMessage("");
    setSuccess(false);

    try {
      const response = await authApi.register({
        fullName,
        email,
        password,
      });

      if (response.token) {
        localStorage.setItem("neurooption_token", response.token);
        localStorage.setItem("neurooption_user", JSON.stringify(response.user || {}));
      }

      setSuccess(true);
      setMessage(response.message || tt("registerSuccess"));

      setTimeout(() => {
        navigate("/trading");
      }, 700);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : tt("cannotConnect");
      setSuccess(false);
      setMessage(errorMessage || tt("internalError"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="auth-shell">
      <header className="auth-topbar">
        <Link to="/" className="auth-home-link">
          ‹ {tt("home")}
        </Link>

        <div className="auth-language">
          <span>🌐</span>
          <select
            className="auth-language-select"
            value={language}
            onChange={(event) => setLanguage(event.target.value as LanguageCode)}
          >
            {languages.map((item) => (
              <option key={item.code} value={item.code}>
                {item.label}
              </option>
            ))}
          </select>
        </div>
      </header>

      <section className="auth-center">
        <div>
          <div className="auth-card">
            <div className="auth-logo-row">
              <div className="auth-logo-mark" />
              <div className="auth-brand">
                <strong>Neuro</strong>Option
              </div>
            </div>

            <h1 className="auth-title">{tt("registration")}</h1>

            <p className="auth-switch">
              {tt("alreadyRegistered")}
              <Link to="/login">{tt("signIn")}</Link>
            </p>

            {message && (
              <div className={`auth-alert ${success ? "success" : ""}`}>
                {message}
              </div>
            )}

            <form className="auth-form" onSubmit={handleSubmit}>
              <div className="auth-field">
                <label htmlFor="fullName">{tt("fullName")} *</label>
                <input
                  id="fullName"
                  className="auth-input"
                  type="text"
                  value={fullName}
                  placeholder={tt("fullName")}
                  onChange={(event) => setFullName(event.target.value)}
                  required
                />
              </div>

              <div className="auth-field">
                <label htmlFor="email">{tt("email")} *</label>
                <input
                  id="email"
                  className="auth-input"
                  type="email"
                  value={email}
                  placeholder={tt("email")}
                  onChange={(event) => setEmail(event.target.value)}
                  required
                />
              </div>

              <div className="auth-field">
                <label htmlFor="password">{tt("password")} *</label>
                <input
                  id="password"
                  className="auth-input"
                  type="password"
                  value={password}
                  placeholder={tt("password")}
                  onChange={(event) => setPassword(event.target.value)}
                  minLength={6}
                  required
                />
              </div>

              <button className="auth-button" type="submit" disabled={loading}>
                {loading ? tt("registering") : tt("register").toUpperCase()}
              </button>
            </form>
          </div>

          <footer className="auth-footer">
            <div className="auth-footer-links">
              <a href="#contacts">{tt("contacts")}</a>
              <a href="#aml">{tt("aml")}</a>
              <a href="#payment">{tt("payment")}</a>
              <a href="#terms">{tt("terms")}</a>
              <a href="#privacy">{tt("privacy")}</a>
              <a href="#disclosure">{tt("disclosure")}</a>
            </div>

            <div className="auth-copy">
              Copyright © 2026 NeuroOption <span className="auth-age">21+</span>
            </div>
          </footer>
        </div>
      </section>
    </main>
  );
}