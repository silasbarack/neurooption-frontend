import type { ReactNode } from "react";
import { Link } from "react-router-dom";

type PageHeaderProps = {
  title: string;
  subtitle?: string;
  backTo?: string;
  backLabel?: string;
  actions?: ReactNode;
};

export default function PageHeader({
  title,
  subtitle,
  backTo = "/trading",
  backLabel = "Back to Trading",
  actions,
}: PageHeaderProps) {
  return (
    <header className="np-page-header">
      <div className="np-page-header-text">
        <Link className="np-back-link" to={backTo}>
          ← {backLabel}
        </Link>
        <h1>{title}</h1>
        {subtitle && <p>{subtitle}</p>}
      </div>

      {actions && <div className="np-page-header-actions">{actions}</div>}
    </header>
  );
}
