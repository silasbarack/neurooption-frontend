import { useEffect, useState } from "react";
import { authApi, socialStartUrl, type SocialProvider } from "../../api/auth.api";

const LABELS: Record<SocialProvider, string> = { google: "Google", x: "X", facebook: "Facebook" };

export function ProviderIcon({ provider }: { provider: SocialProvider }) {
  if (provider === "google") {
    return (
      <svg viewBox="0 0 48 48" width="20" height="20" aria-hidden="true">
        <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z" />
        <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z" />
        <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-8l-6.5 5C9.5 39.6 16.2 44 24 44z" />
        <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.3-.1-2.4-.4-3.5z" />
      </svg>
    );
  }
  if (provider === "x") {
    return (
      <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
        <path fill="currentColor" d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
      <path fill="currentColor" d="M24 12.07C24 5.41 18.63 0 12 0S0 5.4 0 12.07C0 18.1 4.39 23.1 10.13 24v-8.44H7.08v-3.49h3.04V9.41c0-3.02 1.8-4.7 4.54-4.7 1.31 0 2.68.24 2.68.24v2.97h-1.5c-1.5 0-1.96.93-1.96 1.89v2.26h3.32l-.53 3.5h-2.8V24C19.62 23.1 24 18.1 24 12.07z" />
    </svg>
  );
}

/**
 * "Continue with Google / X / Facebook". Only providers the backend has
 * credentials for are shown, so no button leads to a dead end.
 */
export default function SocialSignIn({ dividerLabel = "or use your email" }: { dividerLabel?: string }) {
  const [available, setAvailable] = useState<SocialProvider[]>([]);

  useEffect(() => {
    let active = true;
    authApi
      .socialProviders()
      .then((flags) => {
        if (active) setAvailable((["google", "x", "facebook"] as SocialProvider[]).filter((p) => flags?.[p]));
      })
      .catch(() => undefined);
    return () => {
      active = false;
    };
  }, []);

  if (!available.length) return null;

  return (
    <div className="au-social">
      <div className="au-social-buttons">
        {available.map((provider) => (
          <a key={provider} className={`au-social-btn is-${provider}`} href={socialStartUrl(provider)}>
            <ProviderIcon provider={provider} />
            <span>Continue with {LABELS[provider]}</span>
          </a>
        ))}
      </div>
      <div className="au-social-divider" role="separator"><span>{dividerLabel}</span></div>
    </div>
  );
}
