import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { Globe } from "lucide-react";
import Logo from "../branding/Logo";
import { languages, type LanguageCode } from "../../i18n/authI18n";
import "./AuthLayout.css";

type AuthLayoutProps = {
  children: ReactNode;
  /** Two columns (brand panel + card) or a single centred card. */
  variant?: "split" | "single";
  language?: LanguageCode;
  onLanguageChange?: (language: LanguageCode) => void;
  privacyLabel?: string;
  contactsLabel?: string;
};

export default function AuthLayout({
  children,
  variant = "split",
  language,
  onLanguageChange,
  privacyLabel = "Privacy policy",
  contactsLabel = "Contacts",
}: AuthLayoutProps) {
  return (
    <main className="lp">
      <header className="lp-header">
        <Link to="/" className="lp-brand" aria-label="NeuroOption home">
          <Logo className="lp-logo" />
        </Link>

        <nav className="lp-nav" aria-label="Primary navigation">
          <Link to="/">Home</Link>
          <Link to="/#features">Features</Link>
          <Link to="/#markets">Markets</Link>
          <Link to="/#security">Security</Link>
        </nav>

        {language && onLanguageChange ? (
          <label className="lp-language">
            <Globe size={16} aria-hidden="true" />
            <select
              value={language}
              onChange={(event) => onLanguageChange(event.target.value as LanguageCode)}
              aria-label="Language"
            >
              {languages.map((item) => (
                <option key={item.code} value={item.code}>
                  {item.label}
                </option>
              ))}
            </select>
          </label>
        ) : (
          <span className="lp-header-spacer" aria-hidden="true" />
        )}
      </header>

      <section className={`lp-main${variant === "single" ? " is-single" : ""}`}>
        {children}
      </section>

      <footer className="lp-footer">
        <span>&copy; 2026 NeuroOption</span>
        <nav aria-label="Legal">
          <a href="#terms">Terms</a>
          <a href="#privacy">{privacyLabel}</a>
          <a href="#contacts">{contactsLabel}</a>
        </nav>
        <span className="lp-age">21+</span>
      </footer>
    </main>
  );
}
