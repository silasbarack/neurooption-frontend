import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { getToken } from "../utils/storage";
import { api } from "../api/api";

type Config = { available: boolean; siteKey: string; version: "v2" };
type Result = { verified: boolean; code: string };
type GoogleWidget = {
  render: (element: HTMLElement, options: {
    sitekey: string;
    callback: (response: string) => void;
    "expired-callback": () => void;
    "error-callback": () => void;
  }) => number;
  getResponse: (id: number) => string;
  reset: (id: number) => void;
};
declare global { interface Window { grecaptcha?: GoogleWidget } }

export default function RecaptchaTestPage() {
  const host = useRef<HTMLDivElement>(null);
  const widgetId = useRef<number | null>(null);
  const [status, setStatus] = useState("Loading verification configuration…");
  const [available, setAvailable] = useState(false);
  const [verifiedOnGoogle, setVerifiedOnGoogle] = useState(false);
  const [running, setRunning] = useState(false);
  const [result, setResult] = useState<Result | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function initialize() {
      try {
        const token = getToken();
        if (!token) { setStatus("Sign in to run the verification test."); return; }
        const settings = await api.get<Config>("/auth/recaptcha-test/config");
        if (cancelled) return;
        if (!settings.available || !settings.siteKey || settings.version !== "v2") {
          setStatus("The protected verification test is not enabled yet.");
          return;
        }
        setAvailable(true);
        setStatus("Loading Google's checkbox…");
        if (typeof window.grecaptcha?.render !== "function") {
          await new Promise<void>((resolve, reject) => {
            const existing = document.querySelector('script[data-neurooption-recaptcha-test]');
            if (!existing) {
              const script = document.createElement("script");
              script.dataset.neurooptionRecaptchaTest = "true";
              script.src = "https://www.google.com/recaptcha/api.js?render=explicit";
              script.async = true;
              script.defer = true;
              script.onerror = () => reject(new Error("Google checkbox could not load."));
              document.head.appendChild(script);
            }
            let retries = 0;
            const poll = () => {
              if (cancelled) return resolve();
              if (typeof window.grecaptcha?.render === "function") return resolve();
              if (++retries >= 80) return reject(new Error("Google checkbox initialization timed out."));
              window.setTimeout(poll, 125);
            };
            poll();
          });
        }
        if (cancelled || !host.current || !window.grecaptcha) return;
        widgetId.current = window.grecaptcha.render(host.current, {
          sitekey: settings.siteKey,
          callback: () => { if (!cancelled) { setVerifiedOnGoogle(true); setStatus("Google checkbox completed. Press Verify with NeuroOption."); } },
          "expired-callback": () => { if (!cancelled) { setVerifiedOnGoogle(false); setStatus("Google's response expired. Complete the checkbox again."); } },
          "error-callback": () => { if (!cancelled) { setVerifiedOnGoogle(false); setStatus("Google could not complete the challenge."); } },
        });
        setStatus("Complete the Google checkbox or image challenge.");
      } catch (error) {
        if (!cancelled) setStatus(error instanceof Error ? error.message : "Unable to initialize the verification test.");
      }
    }
    void initialize();
    return () => { cancelled = true; };
  }, []);

  async function verify() {
    const id = widgetId.current;
    const token = id == null ? "" : window.grecaptcha?.getResponse(id) || "";
    if (!token) { setStatus("Please complete the Google checkbox first."); return; }
    setRunning(true);
    setResult(null);
    try {
      const result = await api.post<Result>("/auth/recaptcha-test/verify", { token });
      setResult(result);
      setStatus(result.verified
        ? "Google verification accepted by NeuroOption. Production login enforcement remains unchanged."
        : "Google rejected the test token. See the diagnostic code below.");
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "The verification request failed.");
    } finally {
      if (id != null && typeof window.grecaptcha?.reset === "function") window.grecaptcha.reset(id);
      setVerifiedOnGoogle(false);
      setRunning(false);
    }
  }

  return <main style={{ maxWidth: 600, margin: "40px auto", padding: "28px", fontFamily: "Arial, sans-serif", color: "#17375e", background: "#fff", borderRadius: 18 }}>
    <Link to="/profile" style={{ color: "#0879ad" }}>← Back to account</Link>
    <h1>Security verification test</h1>
    <p>This isolated test checks the Google reCAPTCHA v2 key pair without affecting your account or enabling CAPTCHA on sign-in.</p>
    <p role="status">{status}</p>
    <div ref={host} style={{ margin: "22px 0", maxWidth: "100%", overflowX: "auto" }} />
    <button type="button" onClick={verify} disabled={!available || !verifiedOnGoogle || running}
      style={{ padding: "14px 20px", background: "#0879ad", color: "#fff", border: 0, borderRadius: 8, cursor: "pointer", opacity: !verifiedOnGoogle || running ? 0.55 : 1 }}>
      {running ? "Verifying…" : "Verify with NeuroOption"}
    </button>
    {result && <p role="status" style={{ marginTop: 20, fontWeight: 700, color: result.verified ? "#136a3b" : "#a32424" }}>
      {result.verified ? "Verified successfully" : "Not verified"} — {result.code}
    </p>}
    <p style={{ fontSize: 13, color: "#68798a", marginTop: 24 }}>Only safe diagnostic codes are shown. Your Google response and secret key are never displayed.</p>
  </main>;
}
