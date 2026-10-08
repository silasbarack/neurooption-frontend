import { useState } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authApi } from "../api/auth.api";
import AuthLayout from "../components/auth/AuthLayout";
import { useAuthLanguage } from "../i18n/useAuthLanguage";
import {
  ArrowRight,
  ChartCandlestick,
  CircleAlert,
  CircleCheck,
  Eye,
  EyeOff,
  Layers,
  LoaderCircle,
  Lock,
  Mail,
  ShieldCheck,
  Zap,
} from "lucide-react";

// Decorative candles for the market preview: [open, close, high, low] in px
// from the bottom of a 120px chart.
export default function LoginPage() {
  const navigate = useNavigate();

  const { language, setLanguage, tt } = useAuthLanguage();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);


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
    <AuthLayout
      language={language}
      onLanguageChange={setLanguage}
      privacyLabel={tt("privacy")}
      contactsLabel={tt("contacts")}
    >
      <figure className="au-showcase" id="markets">
        <picture>
          <source
            type="image/webp"
            srcSet="/landing/trading-preview-800.webp 800w, /landing/trading-preview-1600.webp 1600w"
            sizes="(max-width: 900px) 100vw, 680px"
          />
          <img
            src="/landing/trading-preview-1600.jpg"
            alt="NeuroOption trading screen: EUR/USD OTC candlestick chart with the Buy and Sell panel"
            width={1600}
            height={959}
            decoding="async"
            fetchPriority="high"
          />
        </picture>
      </figure>
      <div className="au-hero" id="platform">
        <span className="au-eyebrow">
          <i aria-hidden="true" />
          Fast OTC market experience
        </span>
        <h1>
          Trade with clarity.
          <span>React in real time.</span>
        </h1>
        <p className="au-lead">
          NeuroOption brings OTC assets, responsive candlestick charts and
          streamlined account controls into one focused trading workspace.
        </p>

        <ul className="au-features" id="security">
          <li>
            <span className="au-feature-icon"><Zap size={18} /></span>
            <div>
              <strong>Low-latency stream</strong>
              <small>Live price and candle updates</small>
            </div>
          </li>
          <li>
            <span className="au-feature-icon"><Layers size={18} /></span>
            <div>
              <strong>Multi-asset markets</strong>
              <small>Forex, crypto, indices and more</small>
            </div>
          </li>
          <li>
            <span className="au-feature-icon"><ShieldCheck size={18} /></span>
            <div>
              <strong>Secure access</strong>
              <small>Protected, token-based sessions</small>
            </div>
          </li>
        </ul>
      </div>

      <div className="au-card">
        <div className="au-card-head">
          <span className="au-card-icon"><ChartCandlestick size={22} /></span>
          <h2>{tt("signIn")}</h2>
          <p>Welcome back. Sign in to continue to your trading workspace.</p>
        </div>

        {message && (
          <div className={`au-alert ${success ? "is-success" : "is-error"}`} role="alert">
            {success ? <CircleCheck size={18} /> : <CircleAlert size={18} />}
            <span>{message}</span>
          </div>
        )}

        <form className="au-form" onSubmit={handleSubmit}>
          <div className="au-field">
            <label htmlFor="email">{tt("email")}</label>
            <div className="au-input">
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

          <div className="au-field">
            <div className="au-field-row">
              <label htmlFor="password">{tt("password")}</label>
              <Link to="/forgot-password" className="au-link">
                {tt("passwordRecovery")}
              </Link>
            </div>
            <div className="au-input">
              <Lock size={18} aria-hidden="true" />
              <input
                id="password"
                className="has-toggle"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                value={password}
                placeholder="Enter your password"
                onChange={(event) => setPassword(event.target.value)}
                required
              />
              <button
                className="au-eye"
                type="button"
                onClick={() => setShowPassword((current) => !current)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <label className="au-check">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(event) => setRememberMe(event.target.checked)}
            />
            <span>{tt("rememberMe")}</span>
          </label>

          <button className="au-submit" type="submit" disabled={loading}>
            {loading ? (
              <>
                <LoaderCircle size={18} className="au-spin" aria-hidden="true" />
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

        <p className="au-register">
          {tt("notRegistered")}{" "}
          <Link to="/register" className="au-link">
            {tt("registration")}
          </Link>
        </p>

        <div className="au-trust">
          <ShieldCheck size={16} aria-hidden="true" />
          <span>Encrypted connection. Your credentials are sent only to NeuroOption.</span>
        </div>
      </div>
    </AuthLayout>
  );
}
