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

export default function LoginPage() {
  const navigate = useNavigate();

  const [language, setLanguage] = useState<LanguageCode>(() => {
    return (localStorage.getItem("neurooption_language") as LanguageCode) || "en";
  });
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
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
      const response = await authApi.login({ email, password });

      if (response.token) {
        const storage = rememberMe ? localStorage : sessionStorage;
        storage.setItem("neurooption_token", response.token);
        storage.setItem("neurooption_user", JSON.stringify(response.user || {}));
      }

      setSuccess(true);
      setMessage(response.message || tt("loginSuccess"));

      window.setTimeout(() => {
        navigate("/trading");
      }, 350);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : tt("cannotConnect");
      setMessage(errorMessage || tt("internalError"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="auth-shell auth-premium-shell">
      <header className="auth-topbar auth-premium-topbar">
        <Link to="/" className="auth-brand-link" aria-label="NeuroOption home">
          <span className="auth-logo-mark" aria-hidden="true" />
          <span className="auth-brand">
            <strong>Neuro</strong><em>Option</em>
          </span>
        </Link>

        <nav className="auth-nav" aria-label="Primary navigation">
          <Link to="/trading">Trading</Link>
          <a href="#markets">Markets</a>
          <a href="#platform">Platform</a>
          <a href="#security">Security</a>
        </nav>

        <div className="auth-language">
          <span aria-hidden="true">◎</span>
          <select
            className="auth-language-select"
            value={language}
            onChange={(event) => setLanguage(event.target.value as LanguageCode)}
            aria-label="Language"
          >
            {languages.map((item) => (
              <option key={item.code} value={item.code}>
                {item.label}
              </option>
            ))}
          </select>
        </div>
      </header>

      <section className="auth-premium-grid">
        <aside className="auth-hero-panel">
          <div className="auth-eyebrow">FAST OTC MARKET EXPERIENCE</div>
          <h1>
            Trade with clarity.
            <span>React in real time.</span>
          </h1>
          <p className="auth-hero-copy">
            NeuroOption brings OTC assets, responsive candlestick charts and
            streamlined account controls into one focused trading workspace.
          </p>

          <div className="auth-feature-list">
            <div>
              <span className="auth-feature-icon">↯</span>
              <section>
                <strong>Low-latency market stream</strong>
                <small>WebSocket-driven price and candle updates.</small>
              </section>
            </div>
            <div>
              <span className="auth-feature-icon">▥</span>
              <section>
                <strong>OTC & multi-asset markets</strong>
                <small>Forex, crypto, indices, stocks and commodities.</small>
              </section>
            </div>
            <div>
              <span className="auth-feature-icon">◇</span>
              <section>
                <strong>Secure account access</strong>
                <small>Token-based sessions with protected account routes.</small>
              </section>
            </div>
          </div>

          <div className="auth-hero-stats">
            <div><strong>S5</strong><span>fast timeframe</span></div>
            <div><strong>4×/s</strong><span>market tick target</span></div>
            <div><strong>24/7</strong><span>OTC availability</span></div>
          </div>
        </aside>

        <div className="auth-login-column">
          <div className="auth-card auth-premium-card">
            <div className="auth-card-brand">
              <span className="auth-logo-mark" aria-hidden="true" />
              <span className="auth-brand">
                <strong>Neuro</strong><em>Option</em>
              </span>
            </div>

            <div className="auth-card-heading">
              <span>SIGN IN TO YOUR ACCOUNT</span>
              <h2>{tt("signIn")}</h2>
              <p>
                {tt("notRegistered")}{" "}
                <Link to="/register">{tt("registration")}</Link>
              </p>
            </div>

            {message && (
              <div className={`auth-alert ${success ? "success" : ""}`}>
                {message}
              </div>
            )}

            <form className="auth-form" onSubmit={handleSubmit}>
              <label className="auth-premium-field" htmlFor="email">
                <span>{tt("email")}</span>
                <div>
                  <i aria-hidden="true">✉</i>
                  <input
                    id="email"
                    className="auth-input"
                    type="email"
                    autoComplete="email"
                    value={email}
                    placeholder="you@example.com"
                    onChange={(event) => setEmail(event.target.value)}
                    required
                  />
                </div>
              </label>

              <label className="auth-premium-field" htmlFor="password">
                <span>{tt("password")}</span>
                <div>
                  <i aria-hidden="true">⌑</i>
                  <input
                    id="password"
                    className="auth-input"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    value={password}
                    placeholder={tt("password")}
                    onChange={(event) => setPassword(event.target.value)}
                    required
                  />
                  <button
                    className="auth-password-toggle"
                    type="button"
                    onClick={() => setShowPassword((current) => !current)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </label>

              <div className="auth-options">
                <label className="auth-checkbox">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(event) => setRememberMe(event.target.checked)}
                  />
                  <span>{tt("rememberMe")}</span>
                </label>

                <Link to="/forgot-password" className="auth-recovery">
                  {tt("passwordRecovery")}
                </Link>
              </div>

              <button className="auth-button auth-primary-cta" type="submit" disabled={loading}>
                <span>{loading ? tt("signingIn") : tt("signIn")}</span>
                <b aria-hidden="true">→</b>
              </button>

              <div className="auth-divider"><span>or</span></div>

              <Link className="auth-create-account" to="/register">
                {tt("registration")}
              </Link>
            </form>

            <div className="auth-security-note">
              <span aria-hidden="true">✓</span>
              <p>
                <strong>Protected session</strong>
                <small>Your credentials are sent only to the NeuroOption API.</small>
              </p>
            </div>
          </div>
        </div>

        <aside className="auth-market-preview" id="markets">
          <div className="auth-preview-head">
            <div>
              <span>EUR/USD OTC</span>
              <strong>1.08742</strong>
            </div>
            <b>+0.08%</b>
          </div>

          <div className="auth-preview-timeframes">
            <span>S5</span><span>S10</span><span>S30</span><span className="active">M1</span><span>M5</span>
          </div>

          <div className="auth-preview-chart" aria-label="Decorative candlestick market preview">
            {[
              42, 54, 48, 66, 60, 76, 69, 88, 80, 96, 84, 102, 94, 112, 104,
              122, 114, 130, 119, 138, 126, 146, 136, 154,
            ].map((height, index) => (
              <i
                key={index}
                className={index % 4 === 1 ? "down" : "up"}
                style={{
                  height: `${Math.max(24, height * 0.72)}px`,
                  transform: `translateY(${(index % 5) * 4}px)`,
                }}
              />
            ))}
            <span className="auth-preview-price-line" />
          </div>

          <div className="auth-preview-tradebox">
            <div>
              <span>Payout</span>
              <strong>85%</strong>
            </div>
            <button type="button" className="preview-buy">▲ BUY</button>
            <button type="button" className="preview-sell">▼ SELL</button>
          </div>
          <p>Preview only. Sign in to access the live trading workspace.</p>
        </aside>
      </section>

      <footer className="auth-premium-footer">
        <span>© 2026 NeuroOption</span>
        <div>
          <a href="#terms">Terms</a>
          <a href="#privacy">{tt("privacy")}</a>
          <a href="#contacts">{tt("contacts")}</a>
        </div>
        <strong>21+</strong>
      </footer>
    </main>
  );
}
