import { useEffect, useRef, useState } from "react";
type CaptchaConfig = { enabled: boolean; siteKey: string; version: string };
type WidgetAPI = { render(el: HTMLElement, options: { sitekey: string; callback: (token: string) => void; "expired-callback": () => void; "error-callback": () => void }): number; reset(id?: number): void };
declare global { interface Window { grecaptcha?: WidgetAPI } }
const API = import.meta.env.VITE_API_URL || "https://neurooption-backend.onrender.com";
let configPromise: Promise<CaptchaConfig> | undefined;
let scriptPromise: Promise<void> | undefined;
let token = "";
async function config(): Promise<CaptchaConfig> {
  if (!configPromise) configPromise = fetch(API.replace(/\/$/, "") + "/auth/recaptcha-config").then(async r => {
    if (!r.ok) throw new Error("Security settings could not load.");
    return r.json() as Promise<CaptchaConfig>;
  }).catch(e => { configPromise = undefined; throw e; });
  return configPromise;
}
function load(): Promise<void> {
  if (window.grecaptcha) return Promise.resolve();
  if (!scriptPromise) scriptPromise = new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = "https://www.google.com/recaptcha/api.js?render=explicit";
    script.async = true; script.defer = true;
    script.onload = () => resolve();
    script.onerror = () => { scriptPromise = undefined; reject(new Error("Google verification couldn't load.")); };
    document.head.append(script);
  });
  return scriptPromise;
}
export async function getRecaptchaToken(_action: string): Promise<string | undefined> {
  const c = await config();
  if (!c.enabled) return undefined;
  if (c.version !== "v2") throw new Error("Security configuration mismatch.");
  if (!token) throw new Error("Please complete the 'I'm not a robot' checkbox first.");
  const singleUse = token;
  token = "";
  return singleUse;
}
export function resetRecaptcha() {
  token = "";
  window.dispatchEvent(new Event("neurooption-recaptcha-reset"));
}
export default function RecaptchaCheckbox() {
  const ref = useRef<HTMLDivElement>(null);
  const widget = useRef<number | null>(null);
  const [settings, setSettings] = useState<CaptchaConfig | null>(null);
  const [error, setError] = useState("");
  useEffect(() => {
    let alive = true;
    config().then(v => { if (alive) setSettings(v); }).catch(e => { if (alive) setError(String(e)); });
    return () => { alive = false; token = ""; };
  }, []);
  useEffect(() => {
    if (!settings?.enabled || !ref.current) return;
    if (settings.version !== "v2" || !settings.siteKey) { setError("Visible verification isn't configured."); return; }
    let active = true;
    load().then(() => {
      if (!active || !ref.current || !window.grecaptcha) return;
      widget.current = window.grecaptcha.render(ref.current, {
        sitekey: settings.siteKey,
        callback: value => { token = value; setError(""); },
        "expired-callback": () => { token = ""; setError("Verification expired. Please try again."); },
        "error-callback": () => { token = ""; setError("Verification failed to load. Please refresh."); },
      });
    }).catch(e => { if(active) setError(e instanceof Error ? e.message : "Verification unavailable."); });
    const reset = () => { token = ""; if (widget.current !== null) window.grecaptcha?.reset(widget.current); };
    window.addEventListener("neurooption-recaptcha-reset", reset);
    return () => { active = false; window.removeEventListener("neurooption-recaptcha-reset", reset); };
  }, [settings]);
  if (!settings?.enabled && !error) return null;
  return <div style={{ padding: "12px 0", maxWidth: "100%" }} aria-label="Human verification">
    <div ref={ref} style={{ maxWidth: "100%", overflow: "hidden" }} />
    {error && <p role="alert" style={{ color: "#ae3131", fontSize: 13 }}>{error}</p>}
  </div>;
}
