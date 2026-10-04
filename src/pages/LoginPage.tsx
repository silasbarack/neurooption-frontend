import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authApi } from "../api/auth.api";
import Logo from "../components/branding/Logo";
import {
  languages,
  translate,
  type LanguageCode,
} from "../i18n/authI18n";
import {
  ArrowRight,
  ChartCandlestick,
  CircleAlert,
  CircleCheck,
  Eye,
  EyeOff,
  Globe,
  Layers,
  LoaderCircle,
  Lock,
  Mail,
  ShieldCheck,
  Zap,
} from "lucide-react";
import "./LoginPage.css";

// Decorative candles for the market preview: [open, close, high, low] in px
// from the bottom of a 120px chart.
const PREVIEW_CANDLES: Array<[number, number, number, number]> = [
  [21, 51, 68, 8], [46, 29, 61, 21], [25, 51, 63, 17], [46, 36, 55, 25],
  [31, 53, 61, 19], [49, 68, 85, 38], [63, 38, 76, 29], [34, 46, 57, 21],
  [42, 66, 76, 27], [61, 46, 74, 31], [42, 70, 85, 31], [66, 53, 76, 40],
  [49, 68, 85, 38], [63, 81, 95, 55], [76, 55, 85, 42], [51, 76, 89, 42],
  [72, 63, 89, 55], [59, 81, 89, 46], [76, 91, 104, 61], [87, 68, 104, 57],
  [63, 87, 98, 49],
];

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
    <main className="lp">
      <header className="lp-header">
        <Link to="/" className="lp-brand" aria-label="NeuroOption home">
          <Logo className="lp-logo" />
        </Link>

        <nav className="lp-nav" aria-label="Primary navigation">
          <Link to="/trading">Trading</Link>
          <a href="#markets">Markets</a>
          <a href="#platform">Platform</a>
          <a href="#security">Security</a>
        </nav>

        <label className="lp-language">
          <Globe size={16} aria-hidden="true" />
          <select
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
        </label>
      </header>

      <section className="lp-main">
        <div className="lp-hero" id="platform">
          <span className="lp-eyebrow">
            <i aria-hidden="true" />
            Fast OTC market experience
          </span>
          <h1>
            Trade with clarity.
            <span>React in real time.</span>
          </h1>
          <p className="lp-lead">
            NeuroOption brings OTC assets, responsive candlestick charts and
            streamlined account controls into one focused trading workspace.
          </p>

          <div className="lp-market" id="markets" aria-label="Market preview">
            <div className="lp-market-head">
              <div>
                <span className="lp-market-pair">EUR/USD OTC</span>
                <strong className="lp-market-price">1.08742</strong>
              </div>
              <span className="lp-market-change">+0.08%</span>
            </div>
            <div className="lp-market-chart" aria-hidden="true">
              {PREVIEW_CANDLES.map(([open, close, high, low], index) => (
                <span key={index} className={close >= open ? "up" : "down"}>
                  <b style={{ bottom: `${low}px`, height: `${high - low}px` }} />
                  <i
                    style={{
                      bottom: `${Math.min(open, close)}px`,
                      height: `${Math.max(3, Math.abs(close - open))}px`,
                    }}
                  />
                </span>
              ))}
            </div>
            <div className="lp-market-actions">
              <div className="lp-market-payout">
                <span>Payout</span>
                <strong>85%</strong>
              </div>
              <span className="lp-market-buy">Buy</span>
              <span className="lp-market-sell">Sell</span>
            </div>
          </div>

          <ul className="lp-features" id="security">
            <li>
              <span className="lp-feature-icon"><Zap size={18} /></span>
              <div>
                <strong>Low-latency stream</strong>
                <small>Live price and candle updates</small>
              </div>
            </li>
            <li>
              <span className="lp-feature-icon"><Layers size={18} /></span>
              <div>
                <strong>Multi-asset markets</strong>
                <small>Forex, crypto, indices and more</small>
              </div>
            </li>
            <li>
              <span className="lp-feature-icon"><ShieldCheck size={18} /></span>
              <div>
                <strong>Secure access</strong>
                <small>Protected, token-based sessions</small>
              </div>
            </li>
          </ul>
        </div>

        <div className="lp-card">
          <div className="lp-card-head">
            <span className="lp-card-icon"><ChartCandlestick size={22} /></span>
            <h2>{tt("signIn")}</h2>
            <p>Welcome back. Sign in to continue to your trading workspace.</p>
          </div>

          {message && (
            <div className={`lp-alert ${success ? "is-success" : "is-error"}`} role="alert">
              {success ? <CircleCheck size={18} /> : <CircleAlert size={18} />}
              <span>{message}</span>
            </div>
          )}

          <form className="lp-form" onSubmit={handleSubmit}>
            <div className="lp-field">
              <label htmlFor="email">{tt("email")}</label>
              <div className="lp-input">
                <Mail size={18} aria-hidden="true" />
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  placeholder="you@example.com"
                  onChange={(event) => setEmail(event.target.value)}
                  required
                />
              </div>
            </div>

            <div className="lp-field">
              <div className="lp-field-row">
                <label htmlFor="password">{tt("password")}</label>
                <Link to="/forgot-password" className="lp-link">
                  {tt("passwordRecovery")}
                </Link>
              </div>
              <div className="lp-input">
                <Lock size={18} aria-hidden="true" />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  value={password}
                  placeholder="Enter your password"
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

            <label className="lp-check">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(event) => setRememberMe(event.target.checked)}
              />
              <span>{tt("rememberMe")}</span>
            </label>

            <button className="lp-submit" type="submit" disabled={loading}>
              {loading ? (
                <>
                  <LoaderCircle size={18} className="lp-spin" aria-hidden="true" />
                  <span>{tt("signingIn")}</span>
                </>
              ) : (
                <>
                  <span>{tt("signIn")}</span>
                  <ArrowRight size={18} aria-hidden="true" />
                </>
              )}
            </button>
          </form>

          <p className="lp-register">
            {tt("notRegistered")}{" "}
            <Link to="/register" className="lp-link">
              {tt("registration")}
            </Link>
          </p>

          <div className="lp-trust">
            <ShieldCheck size={16} aria-hidden="true" />
            <span>Encrypted connection. Your credentials are sent only to NeuroOption.</span>
          </div>
        </div>
      </section>

      <footer className="lp-footer">
        <span>&copy; 2026 NeuroOption</span>
        <nav aria-label="Legal">
          <a href="#terms">Terms</a>
          <a href="#privacy">{tt("privacy")}</a>
          <a href="#contacts">{tt("contacts")}</a>
        </nav>
        <span className="lp-age">21+</span>
      </footer>
    </main>
  );
}
