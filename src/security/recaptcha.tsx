/* eslint-disable react-refresh/only-export-components -- shared widget control API */
import { useEffect, useRef, useState } from "react";

export type RecaptchaAction = "register" | "login" | "forgot_password" | "reset_password" | "delete_account";
type Config = { enabled: boolean; siteKey: string; version: "v2" };
type Widget = { render(container: HTMLElement, options: { sitekey: string; callback: (token: string) => void; "expired-callback": () => void; "error-callback": () => void }): number; reset(id: number): void };
declare global { interface Window { grecaptcha?: Widget } }

const API = import.meta.env.VITE_API_URL || "https://neurooption-backend.onrender.com";
const tokens = new Map<RecaptchaAction, string>();
const widgets = new Map<RecaptchaAction, number>();
let configPromise: Promise<Config> | undefined;
let loadPromise: Promise<void> | undefined;

function config(): Promise<Config> {
  if (!configPromise) configPromise = fetch(API.replace(/\/$/, "") + "/auth/recaptcha-config")
    .then(async response => {
      if (!response.ok) throw new Error("Security configuration unavailable");
      return response.json() as Promise<Config>;
    }).catch(error => { configPromise = undefined; throw error; });
  return configPromise;
}
function loadScript(): Promise<void> {
  if (!loadPromise) loadPromise = new Promise<void>((resolve, reject) => {
    if (window.grecaptcha) { resolve(); return; }
    const script = document.createElement("script");
    script.src = "https://www.google.com/recaptcha/api.js?render=explicit";
    script.async = true; script.defer = true;
    script.onload = () => resolve();
    script.onerror = () => { loadPromise = undefined; reject(new Error("Google security check could not load.")); };
    document.head.appendChild(script);
  });
  return loadPromise;
}
export function resetRecaptcha(action: RecaptchaAction): void {
  tokens.delete(action);
  const id = widgets.get(action);
  if (id !== undefined) window.grecaptcha?.reset(id);
}
export async function getRecaptchaToken(action: RecaptchaAction): Promise<string | undefined> {
  const settings = await config();
  if (!settings.enabled) return undefined;
  if (settings.version !== "v2") throw new Error("Security check is not configured for a checkbox.");
  const token = tokens.get(action);
  if (!token) throw new Error("Please complete the I'm not a robot checkbox.");
  return token;
}
export function RecaptchaCheckbox({ action }: { action: RecaptchaAction }) {
  const host = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);
  const [error, setError] = useState("");
  useEffect(() => {
    let active = true;
    config().then(async settings => {
      if (!active || !settings.enabled) return;
      setEnabled(true);
      if (settings.version !== "v2" || !settings.siteKey) throw new Error("Checkbox security check is not configured.");
      await loadScript();
      if (!active || !host.current || !window.grecaptcha) return;
      const id = window.grecaptcha.render(host.current, {
        sitekey: settings.siteKey,
        callback: token => tokens.set(action, token),
        "expired-callback": () => tokens.delete(action),
        "error-callback": () => { tokens.delete(action); setError("Verification failed. Please retry."); },
      });
      widgets.set(action, id);
    }).catch(e => { if (active) setError(e instanceof Error ? e.message : "Security verification unavailable."); });
    return () => {
      active = false;
      tokens.delete(action);
      widgets.delete(action);
    };
  }, [action]);
  return (
    <div className="neo-recaptcha" style={{ display: enabled || error ? "block" : "none", margin: "16px 0", maxWidth: "100%", overflow: "auto" }}>
      <div ref={host} aria-label="I'm not a robot verification" />
      {error && <p role="alert" style={{ color: "#b42318", fontSize: 13 }}>{error}</p>}
    </div>
  );
}
