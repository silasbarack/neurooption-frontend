import { useEffect, useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, CircleAlert, LoaderCircle, Mail, ShieldCheck, UserRound } from "lucide-react";

import AuthLayout from "../components/auth/AuthLayout";
import { ProviderIcon } from "../components/auth/SocialSignIn";
import { authApi, type SocialSignupPreview } from "../api/auth.api";
import { api } from "../api/api";

const PROVIDER_NAMES = { google: "Google", x: "X", facebook: "Facebook" } as const;

const ERRORS: Record<string, string> = {
  cancelled: "Sign-in was cancelled. You can try again or use your email and password.",
  expired: "That sign-in took too long. Please choose your account again.",
  state: "That sign-in could not be confirmed. Please choose your account again.",
  "email-unverified":
    "An account with this email already exists, but the provider has not confirmed the email. Sign in with your email and password instead.",
  unavailable: "This account is not available. Please contact Support.",
  failed: "We could not finish signing you in. Please try again or use your email and password.",
};

function saveSession(token: string, user: unknown) {
  localStorage.setItem("neurooption_token", token);
  localStorage.setItem("neurooption_user", JSON.stringify(user || {}));
}

/** Google, X and Facebook send people back here with the result in the URL fragment. */
export default function SocialAuthPage() {
  const navigate = useNavigate();
  // Read once: the fragment carries a session token, a sign-up token or an error code.
  const [result] = useState(() => {
    const params = new URLSearchParams(window.location.hash.slice(1));
    return { token: params.get("token"), signup: params.get("signup"), code: params.get("error") };
  });
  const [phase, setPhase] = useState<"working" | "confirm" | "error">(result.token || result.signup ? "working" : "error");
  const [error, setError] = useState(result.token || result.signup ? "" : ERRORS[result.code || ""] || ERRORS.failed);
  const [signupToken, setSignupToken] = useState("");
  const [preview, setPreview] = useState<SocialSignupPreview | null>(null);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [accept, setAccept] = useState(false);
  const [busy, setBusy] = useState(false);

  // Only while this page is open: put the previous title back on the way out.
  useEffect(() => {
    const previous = document.title;
    document.title = "Signing you in | NeuroOption";
    return () => {
      document.title = previous;
    };
  }, []);

  useEffect(() => {
    // The fragment holds a token; take it out of the address bar and history.
    window.history.replaceState(null, "", window.location.pathname);
    const { token, signup } = result;

    if (token) {
      localStorage.setItem("neurooption_token", token);
      api
        .get<Record<string, unknown>>("/account/me")
        .then((me) => saveSession(token, { id: me.id, email: me.email, fullName: me.fullName }))
        .catch(() => saveSession(token, {}))
        .finally(() => navigate("/trading", { replace: true }));
      return;
    }

    if (signup) {
      authApi
        .socialSignupPreview(signup)
        .then((data) => {
          setSignupToken(signup);
          setPreview(data);
          setFullName(data.name || "");
          setPhase("confirm");
        })
        .catch(() => {
          setError(ERRORS.expired);
          setPhase("error");
        });
    }
  }, [navigate, result]);

  async function confirm(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError("");
    try {
      const response = await authApi.socialSignupComplete({
        signupToken,
        acceptTerms: accept,
        fullName: fullName.trim() || undefined,
        email: preview?.email ? undefined : email.trim(),
      });
      if (!response.token) throw new Error(ERRORS.failed);
      saveSession(response.token, response.user);
      navigate("/trading", { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : ERRORS.failed);
      setBusy(false);
    }
  }

  const providerName = preview ? PROVIDER_NAMES[preview.provider] : "";

  return (
    <AuthLayout variant="single">
      <div className="au-card">
        {phase === "working" && (
          <div className="au-social-status" role="status">
            <LoaderCircle size={28} className="au-spin" aria-hidden="true" />
            <h2>Signing you in…</h2>
            <p>One moment while we open your trading workspace.</p>
          </div>
        )}

        {phase === "error" && (
          <div className="au-social-status">
            <span className="au-card-icon"><CircleAlert size={22} aria-hidden="true" /></span>
            <h2>Sign-in not completed</h2>
            <p role="alert">{error}</p>
            <Link to="/login" className="au-submit">
              <span>Back to sign in</span>
              <ArrowRight size={18} aria-hidden="true" />
            </Link>
          </div>
        )}

        {phase === "confirm" && preview && (
          <>
            <div className="au-card-head">
              <span className="au-card-icon au-card-icon-provider"><ProviderIcon provider={preview.provider} /></span>
              <h2>Create your account</h2>
              <p>You're signing up with {providerName}. Check your details and confirm to open your account.</p>
            </div>

            {error && (
              <div className="au-alert is-error" role="alert">
                <CircleAlert size={18} />
                <span>{error}</span>
              </div>
            )}

            <form className="au-form" onSubmit={confirm}>
              <div className="au-field">
                <label htmlFor="social-name">Full name</label>
                <div className="au-input">
                  <UserRound size={18} aria-hidden="true" />
                  <input id="social-name" autoComplete="name" value={fullName} onChange={(e) => setFullName(e.target.value)} maxLength={120} />
                </div>
              </div>

              <div className="au-field">
                <label htmlFor="social-email">Email</label>
                <div className="au-input">
                  <Mail size={18} aria-hidden="true" />
                  {preview.email ? (
                    <input id="social-email" value={preview.email} readOnly />
                  ) : (
                    <input
                      id="social-email"
                      type="email"
                      autoComplete="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  )}
                </div>
                {!preview.email && <small className="au-hint">{providerName} didn't share an email. We'll send a link to confirm this one.</small>}
              </div>

              <label className="au-check">
                <input type="checkbox" checked={accept} onChange={(e) => setAccept(e.target.checked)} required />
                <span>
                  I am 21 or older, agree to the <Link to="/legal/terms" className="au-link">Terms and Conditions</Link> and{" "}
                  <Link to="/legal/privacy" className="au-link">Privacy policy</Link>, and have read the{" "}
                  <Link to="/legal/risk-disclosure" className="au-link">Risk Disclosure</Link>.
                </span>
              </label>

              <button className="au-submit" type="submit" disabled={busy || !accept}>
                {busy ? (
                  <><LoaderCircle size={18} className="au-spin" aria-hidden="true" /><span>Creating your account…</span></>
                ) : (
                  <><span>Create my account</span><ArrowRight size={18} aria-hidden="true" /></>
                )}
              </button>
            </form>

            <p className="au-register">
              Not you? <Link to="/login" className="au-link">Use another account</Link>
            </p>
            <div className="au-trust">
              <ShieldCheck size={16} aria-hidden="true" />
              <span>Free to join. Trading involves risk; start on the demo account.</span>
            </div>
          </>
        )}
      </div>
    </AuthLayout>
  );
}
