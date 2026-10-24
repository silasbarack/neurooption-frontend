import { useEffect, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { CircleAlert, CircleCheck, LoaderCircle } from "lucide-react";
import Logo from "../components/branding/Logo";
import { authApi } from "../api/auth.api";
import { refreshAccount } from "../components/shell/useAccount";
import { getToken } from "../utils/storage";
import "./DeleteAccountPage.css";

/** Public: the "Verify email address" link in the welcome email lands here. */
export default function VerifyEmailPage() {
  const [params] = useSearchParams();
  const token = params.get("token") ?? "";
  const [state, setState] = useState<"busy" | "done" | "error">(token ? "busy" : "error");
  const [message, setMessage] = useState(token ? "" : "This verification link is missing its code. Open the link from your email again.");
  const started = useRef(false);
  const signedIn = Boolean(getToken());

  useEffect(() => {
    // Tokens are single use, so never submit twice (React strict mode runs effects twice in development).
    if (!token || started.current) return;
    started.current = true;
    authApi.verifyEmail(token)
      .then((r) => {
        setState("done");
        setMessage(r.message);
        if (getToken()) refreshAccount().catch(() => undefined);
      })
      .catch((err) => { setState("error"); setMessage(err instanceof Error ? err.message : "We could not verify your email right now."); });
  }, [token]);

  return (
    <main className="da-done">
      <Link to="/" aria-label="NeuroOption home"><Logo className="da-logo" /></Link>
      {state === "busy" && <p role="status"><LoaderCircle size={18} className="da-spin" aria-hidden="true" /> Confirming your email address…</p>}
      {state === "done" && (
        <>
          <div className="da-done-icon"><CircleCheck size={34} aria-hidden="true" /></div>
          <h1>Email address confirmed</h1>
          <p>{message}</p>
        </>
      )}
      {state === "error" && (
        <>
          <h1>We couldn't verify your email</h1>
          <p className="da-warn" role="alert"><CircleAlert size={16} aria-hidden="true" /> {message}</p>
          <p>Sign in and use <strong>Resend verification email</strong> on My Account to get a new link.</p>
        </>
      )}
      <div className="da-done-actions">
        {signedIn
          ? <Link to="/profile" className="da-btn da-btn-primary">Go to My Account</Link>
          : <Link to="/login" className="da-btn da-btn-primary">Sign in</Link>}
        <Link to="/" className="da-btn da-btn-ghost">Home page</Link>
      </div>
    </main>
  );
}
