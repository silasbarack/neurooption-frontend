import { useState } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  BadgeCheck,
  CircleAlert,
  CircleCheck,
  CircleDollarSign,
  Eye,
  EyeOff,
  Gamepad2,
  LineChart,
  LoaderCircle,
  Lock,
  Mail,
  ShieldCheck,
  User,
  UserPlus,
} from "lucide-react";
import { authApi } from "../api/auth.api";
import AuthLayout from "../components/auth/AuthLayout";
import { useAuthLanguage } from "../i18n/useAuthLanguage";

const BENEFITS = [
  {
    icon: Gamepad2,
    title: "Free demo account",
    text: "Practise with a demo balance before risking real money.",
  },
  {
    icon: LineChart,
    title: "Professional charts",
    text: "Live candlesticks, 14 timeframes and 20+ indicators.",
  },
  {
    icon: CircleDollarSign,
    title: "Your currency, your language",
    text: "13 account currencies and 15 languages.",
  },
  {
    icon: ShieldCheck,
    title: "Protected account",
    text: "Encrypted sessions and email-verified password recovery.",
  },
];

function passwordStrength(password: string): { score: number; label: string } {
  if (!password) return { score: 0, label: "" };
  let score = 0;
  if (password.length >= 6) score++;
  if (password.length >= 10) score++;
  if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score++;
  if (/\d/.test(password) && /[^A-Za-z0-9]/.test(password)) score++;
  const labels = ["Too short", "Weak", "Fair", "Good", "Strong"];
  return { score, label: password.length < 6 ? labels[0] : labels[score] };
}

export default function RegisterPage() {
  const navigate = useNavigate();
  const { language, setLanguage, tt } = useAuthLanguage();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [accepted, setAccepted] = useState(false);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);

  const strength = passwordStrength(password);
  const mismatch = confirmPassword.length > 0 && confirmPassword !== password;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    setSuccess(false);

    if (password.length < 6) {
      setMessage("Password must be at least 6 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setMessage("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const response = await authApi.register({
        fullName: fullName.trim(),
        email: email.trim().toLowerCase(),
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
      }, 900);
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
    <AuthLayout
      language={language}
      onLanguageChange={setLanguage}
      privacyLabel={tt("privacy")}
      contactsLabel={tt("contacts")}
    >
      <div className="lp-hero">
        <span className="lp-eyebrow">
          <i aria-hidden="true" />
          Open your free account
        </span>
        <h1>
          Start trading in minutes.
          <span>Practise free, go live when ready.</span>
        </h1>
        <p className="lp-lead">
          Create your NeuroOption account to unlock live charts, a risk-free
          demo balance and the full trading workspace. We'll send a welcome
          email as soon as you're registered.
        </p>

        <ul className="lp-benefits">
          {BENEFITS.map(({ icon: Icon, title, text }) => (
            <li key={title}>
              <span className="lp-feature-icon"><Icon size={18} aria-hidden="true" /></span>
              <div>
                <strong>{title}</strong>
                <small>{text}</small>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className="lp-card">
        <div className="lp-card-head">
          <span className="lp-card-icon"><UserPlus size={22} aria-hidden="true" /></span>
          <h2>{tt("registration")}</h2>
          <p>Create your account. It only takes a minute.</p>
        </div>

        {message && (
          <div className={`lp-alert ${success ? "is-success" : "is-error"}`} role="alert">
            {success ? <CircleCheck size={18} /> : <CircleAlert size={18} />}
            <span>{message}</span>
          </div>
        )}

        <form className="lp-form" onSubmit={handleSubmit}>
          <div className="lp-field">
            <label htmlFor="fullName">{tt("fullName")}</label>
            <div className="lp-input">
              <User size={18} aria-hidden="true" />
              <input
                id="fullName"
                type="text"
                autoComplete="name"
                value={fullName}
                placeholder="Jane Wanjiku"
                onChange={(event) => setFullName(event.target.value)}
                required
              />
            </div>
          </div>

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
            <label htmlFor="password">{tt("password")}</label>
            <div className="lp-input">
              <Lock size={18} aria-hidden="true" />
              <input
                id="password"
                className="has-toggle"
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                value={password}
                placeholder="At least 6 characters"
                onChange={(event) => setPassword(event.target.value)}
                minLength={6}
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
            {password && (
              <div className={`lp-strength is-${strength.score}`} aria-live="polite">
                <div className="lp-strength-bars" aria-hidden="true">
                  <i /><i /><i /><i />
                </div>
                <span>{strength.label}</span>
              </div>
            )}
          </div>

          <div className="lp-field">
            <label htmlFor="confirmPassword">Confirm password</label>
            <div className={`lp-input${mismatch ? " is-invalid" : ""}`}>
              <Lock size={18} aria-hidden="true" />
              <input
                id="confirmPassword"
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                value={confirmPassword}
                placeholder="Repeat your password"
                onChange={(event) => setConfirmPassword(event.target.value)}
                aria-invalid={mismatch}
                required
              />
            </div>
            {mismatch && <p className="lp-field-error">Passwords do not match.</p>}
          </div>

          <label className="lp-check lp-check-top">
            <input
              type="checkbox"
              checked={accepted}
              onChange={(event) => setAccepted(event.target.checked)}
              required
            />
            <span>
              I am 21 or older and agree to the{" "}
              <a href="#terms" className="lp-link">{tt("terms")}</a> and{" "}
              <a href="#privacy" className="lp-link">{tt("privacy")}</a>.
            </span>
          </label>

          <button className="lp-submit" type="submit" disabled={loading}>
            {loading ? (
              <>
                <LoaderCircle size={18} className="lp-spin" aria-hidden="true" />
                <span>{tt("registering")}</span>
              </>
            ) : (
              <>
                <span>Create account</span>
                <ArrowRight size={18} aria-hidden="true" />
              </>
            )}
          </button>
        </form>

        <p className="lp-register">
          {tt("alreadyRegistered")}{" "}
          <Link to="/login" className="lp-link">
            {tt("signIn")}
          </Link>
        </p>

        <div className="lp-trust">
          <BadgeCheck size={16} aria-hidden="true" />
          <span>Free to join. Trading involves risk; start on the demo account.</span>
        </div>
      </div>
    </AuthLayout>
  );
}
