import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { Globe } from "lucide-react";
import Logo from "../branding/Logo";
import { languages, type LanguageCode } from "../../i18n/authI18n";
import "./AuthLayout.css";

type AuthLayoutProps = {
  children: ReactNode;
  /** Intro content stacked above the card, or a single centred card. */
  variant?: "stacked" | "single";
  language?: LanguageCode;
  onLanguageChange?: (language: LanguageCode) => void;
  privacyLabel?: string;
  contactsLabel?: string;
};

export default function AuthLayout({
  children,
  variant = "stacked",
  language,
  onLanguageChange,
  privacyLabel = "Privacy policy",
  contactsLabel = "Contacts",
}: AuthLayoutProps) {
  return (
    <main className="au">
      <header className="au-header">
        <Link to="/" className="au-brand" aria-label="NeuroOption home">
          <Logo className="au-logo" />
        </Link>

        <nav className="au-nav" aria-label="Primary navigation">
          <Link to="/">Home</Link>
          <Link to="/#features">Features</Link>
          <Link to="/#markets">Markets</Link>
          <Link to="/#security">Security</Link>
        </nav>

        {language && onLanguageChange ? (
          <label className="au-language">
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
          <span className="au-header-spacer" aria-hidden="true" />
        )}
      </header>

      <section className={`au-main ${variant === "single" ? "is-single" : "is-stacked"}`}>
        {children}
      </section>

      <footer className="au-footer">
        <span>&copy; 2026 NeuroOption</span>
        <nav aria-label="Legal">
          <a href="#terms">Terms</a>
          <a href="#privacy">{privacyLabel}</a>
          <a href="#contacts">{contactsLabel}</a>
        </nav>
        <span className="au-age">21+</span>
      </footer>
    </main>
  );
}
