/** Fresh single-use reCAPTCHA v3 tokens for security-sensitive actions. */
type Config = { enabled: boolean; siteKey: string };
type GoogleCaptcha = { ready(callback: () => void): void; execute(siteKey: string, options: { action: string }): Promise<string> };
declare global { interface Window { grecaptcha?: GoogleCaptcha } }
const API = import.meta.env.VITE_API_URL || "https://neurooption-backend.onrender.com";
// Google reCAPTCHA v3 site key is public and safe to store in GitHub.
const PUBLIC_SITE_KEY = "6LfsHOktAAAAAGIU04FNETNix458zKFL3qGfyVQq";
let configPromise: Promise<Config> | undefined;
let scriptPromise: Promise<void> | undefined;

async function configuration(): Promise<Config> {
  if (!configPromise) {
    configPromise = fetch(API.replace(/\/$/, "") + "/auth/recaptcha-config")
      .then(async response => {
        if (!response.ok) throw new Error("Could not load the account security configuration.");
        const config = await response.json() as Config;
        return { ...config, siteKey: config.enabled ? (config.siteKey || PUBLIC_SITE_KEY) : "" };
      }).catch(error => { configPromise = undefined; throw error; });
  }
  return configPromise;
}
function load(siteKey: string): Promise<void> {
  if (!scriptPromise) {
    scriptPromise = new Promise<void>((resolve, reject) => {
      if (window.grecaptcha) { resolve(); return; }
      const script = document.createElement("script");
      script.src = "https://www.google.com/recaptcha/api.js?render=" + encodeURIComponent(siteKey);
      script.async = true;
      script.defer = true;
      script.onload = () => resolve();
      script.onerror = () => { scriptPromise = undefined; reject(new Error("Security verification could not load. Please retry.")); };
      document.head.appendChild(script);
    });
  }
  return scriptPromise;
}

export async function getRecaptchaToken(action: "register" | "login" | "forgot_password" | "reset_password" | "delete_account"): Promise<string | undefined> {
  const config = await configuration();
  if (!config.enabled) return undefined;
  if (!config.siteKey) throw new Error("Security verification is not configured. Contact Support.");
  await load(config.siteKey);
  if (!window.grecaptcha) throw new Error("Security verification is unavailable.");
  await new Promise<void>(resolve => window.grecaptcha!.ready(resolve));
  return window.grecaptcha.execute(config.siteKey, { action });
}
