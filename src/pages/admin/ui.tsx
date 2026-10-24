import { useEffect, useRef, useState } from "react";
import type { FormEvent, ReactNode } from "react";
import { ArrowLeft, ArrowRight, CircleAlert, Inbox, LoaderCircle, RefreshCw, Search, X } from "lucide-react";
import { label } from "./api";

export function PageHeader({ eyebrow, title, subtitle, actions }: { eyebrow: string; title: string; subtitle: string; actions?: ReactNode }) {
  return (
    <header className="nx-page-head">
      <div>
        <p className="nx-eyebrow">{eyebrow}</p>
        <h1>{title}</h1>
        <p className="nx-subtitle">{subtitle}</p>
      </div>
      {actions && <div className="nx-page-actions">{actions}</div>}
    </header>
  );
}

export function RefreshButton({ onClick, loading }: { onClick: () => void; loading?: boolean }) {
  return (
    <button type="button" className="nx-btn nx-btn-ghost" onClick={onClick} aria-label="Refresh">
      <RefreshCw size={16} className={loading ? "nx-spin" : ""} aria-hidden="true" /> Refresh
    </button>
  );
}

export function Kpi({ title, value, hint, icon, tone = "blue", onClick }: { title: string; value: ReactNode; hint?: ReactNode; icon: ReactNode; tone?: "blue" | "teal" | "amber" | "rose" | "violet"; onClick?: () => void }) {
  const body = (
    <>
      <div className="nx-kpi-top"><span>{title}</span><span className={`nx-kpi-icon tone-${tone}`}>{icon}</span></div>
      <strong className="nx-kpi-value">{value}</strong>
      {hint && <small className="nx-kpi-hint">{hint}</small>}
    </>
  );
  return onClick
    ? <button type="button" className={`nx-kpi tone-${tone} is-link`} onClick={onClick}>{body}</button>
    : <div className={`nx-kpi tone-${tone}`}>{body}</div>;
}

export function Panel({ title, subtitle, actions, children, className = "" }: { title?: string; subtitle?: string; actions?: ReactNode; children: ReactNode; className?: string }) {
  return (
    <section className={`nx-panel ${className}`}>
      {(title || actions) && (
        <div className="nx-panel-head">
          <div>{title && <h2>{title}</h2>}{subtitle && <p>{subtitle}</p>}</div>
          {actions}
        </div>
      )}
      {children}
    </section>
  );
}

const TONES: Record<string, string> = {
  ACTIVE: "good", APPROVED: "good", COMPLETED: "good", WON: "good", CLOSED: "muted",
  PENDING: "warn", PENDING_KYC: "warn", PROCESSING: "warn", OPEN: "info", PENDING_SUPPORT: "warn", PENDING_USER: "info",
  SUSPENDED: "bad", LOCKED: "bad", REJECTED: "bad", FAILED: "bad", LOST: "bad", CANCELLED: "muted",
  DELETED: "muted", NOT_SUBMITTED: "muted", DRAW: "muted",
};

export function Badge({ value, tone }: { value: string; tone?: string }) {
  return <span className={`nx-badge tone-${tone ?? TONES[value] ?? "muted"}`}>{label(value)}</span>;
}

export function Alert({ children, onRetry }: { children: ReactNode; onRetry?: () => void }) {
  return (
    <div className="nx-alert" role="alert">
      <CircleAlert size={17} aria-hidden="true" /><span>{children}</span>
      {onRetry && <button type="button" onClick={onRetry}>Retry</button>}
    </div>
  );
}

export function Empty({ children }: { children: ReactNode }) {
  return <div className="nx-empty"><Inbox size={26} aria-hidden="true" /><p>{children}</p></div>;
}

export function Loading({ children = "Loading…" }: { children?: ReactNode }) {
  return <div className="nx-loading" role="status"><LoaderCircle size={18} className="nx-spin" aria-hidden="true" /> {children}</div>;
}

export function SearchBox({ placeholder, onSearch, initial = "" }: { placeholder: string; onSearch: (value: string) => void; initial?: string }) {
  const [value, setValue] = useState(initial);
  return (
    <form className="nx-search" role="search" onSubmit={(event: FormEvent) => { event.preventDefault(); onSearch(value.trim()); }}>
      <Search size={16} aria-hidden="true" />
      <input value={value} onChange={(event) => setValue(event.target.value)} placeholder={placeholder} aria-label={placeholder} />
      {value && <button type="button" className="nx-search-clear" aria-label="Clear search" onClick={() => { setValue(""); onSearch(""); }}><X size={14} /></button>}
    </form>
  );
}

export function Segmented<T extends string>({ value, options, onChange, ariaLabel }: { value: T; options: readonly (readonly [T, string])[]; onChange: (value: T) => void; ariaLabel: string }) {
  return (
    <div className="nx-segmented" role="group" aria-label={ariaLabel}>
      {options.map(([key, text]) => (
        <button key={key} type="button" className={value === key ? "is-active" : ""} aria-pressed={value === key} onClick={() => onChange(key)}>{text}</button>
      ))}
    </div>
  );
}

export function Pager({ page, pages, total, onPage }: { page: number; pages: number; total: number; onPage: (page: number) => void }) {
  return (
    <div className="nx-pager">
      <span>Page {page} of {Math.max(1, pages)} · {total.toLocaleString()} results</span>
      <div>
        <button type="button" disabled={page <= 1} onClick={() => onPage(page - 1)}><ArrowLeft size={14} aria-hidden="true" /> Previous</button>
        <button type="button" disabled={page >= pages} onClick={() => onPage(page + 1)}>Next <ArrowRight size={14} aria-hidden="true" /></button>
      </div>
    </div>
  );
}

export function Person({ name, email }: { name: string; email?: string | null }) {
  return (
    <span className="nx-person">
      <span className="nx-avatar" aria-hidden="true">{name.split(/\s+/).filter(Boolean).slice(0, 2).map((p) => p[0]!.toUpperCase()).join("")}</span>
      <span><strong>{name}</strong>{email && <small>{email}</small>}</span>
    </span>
  );
}

/** Slide-over panel for details; closes on Escape or backdrop click and returns focus. */
export function Drawer({ title, onClose, children, footer }: { title: string; onClose: () => void; children: ReactNode; footer?: ReactNode }) {
  const panelRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null;
    panelRef.current?.focus();
    const onKey = (event: KeyboardEvent) => { if (event.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    return () => { document.removeEventListener("keydown", onKey); previous?.focus(); };
  }, [onClose]);
  return (
    <div className="nx-drawer-root">
      <div className="nx-drawer-backdrop" onClick={onClose} />
      <div className="nx-drawer" role="dialog" aria-modal="true" aria-label={title} tabIndex={-1} ref={panelRef}>
        <div className="nx-drawer-head">
          <h2>{title}</h2>
          <button type="button" className="nx-icon-btn" onClick={onClose} aria-label="Close"><X size={18} /></button>
        </div>
        <div className="nx-drawer-body">{children}</div>
        {footer && <div className="nx-drawer-foot">{footer}</div>}
      </div>
    </div>
  );
}

export function Field({ label: text, children }: { label: string; children: ReactNode }) {
  return <div className="nx-field"><dt>{text}</dt><dd>{children}</dd></div>;
}

/** A small bar chart drawn with CSS; `values` are plotted against the largest one. */
export function Bars({ values, labels, ariaLabel, highlightLast = true }: { values: number[]; labels: string[]; ariaLabel: string; highlightLast?: boolean }) {
  const max = Math.max(1, ...values);
  return (
    <div className="nx-bars" role="img" aria-label={ariaLabel}>
      {values.map((value, index) => (
        <div className="nx-bar-col" key={labels[index] + index}>
          <span className="nx-bar-value">{value || ""}</span>
          <div className="nx-bar-track"><div className={`nx-bar ${highlightLast && index === values.length - 1 ? "is-last" : ""}`} style={{ height: `${(value / max) * 100}%` }} /></div>
          <span className="nx-bar-label">{labels[index]}</span>
        </div>
      ))}
    </div>
  );
}
