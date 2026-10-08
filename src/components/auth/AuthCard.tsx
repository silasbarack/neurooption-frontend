import type { ReactNode } from "react";
import Logo from "../branding/Logo";
import "./AuthForms.css";

type AuthCardProps = {
  title: string;
  subtitle?: ReactNode;
  children: ReactNode;
};

export default function AuthCard({ title, subtitle, children }: AuthCardProps) {
  return (
    <main className="auth-page">
      <section className="auth-card">
        <div className="auth-logo-row">
          <Logo className="auth-logo-image" />
        </div>

        <h2>{title}</h2>

        {subtitle && <div className="auth-subtitle">{subtitle}</div>}

        {children}
      </section>
    </main>
  );
}