import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { COMPANY, COMPANY_FIELD_LABELS, type CompanyField } from "./company";

/** A company detail from company.ts, or a clearly marked placeholder while it is unconfirmed. */
export function Co({ field }: { field: CompanyField }) {
  const value = COMPANY[field];
  if (value) return <>{value}</>;
  return (
    <mark className="lg-todo" title="To be completed by NeuroOption">
      [{COMPANY_FIELD_LABELS[field]}]
    </mark>
  );
}

/** Link to another policy page (optionally to a section anchor). */
export function PolicyLink({ slug, section, children }: { slug: string; section?: string; children: ReactNode }) {
  return <Link to={`/legal/${slug}${section ? `#${section}` : ""}`}>{children}</Link>;
}

/** Highlighted box for key points, warnings and examples. */
export function Callout({ tone = "info", title, children }: { tone?: "info" | "warn" | "risk"; title?: string; children: ReactNode }) {
  return (
    <aside className={`lg-callout is-${tone}`} role="note">
      {title && <strong className="lg-callout-title">{title}</strong>}
      <div>{children}</div>
    </aside>
  );
}

/** Two-column definitions table: [term, meaning][]. */
export function Definitions({ items }: { items: [string, ReactNode][] }) {
  return (
    <dl className="lg-defs">
      {items.map(([term, meaning]) => (
        <div key={term}>
          <dt>{term}</dt>
          <dd>{meaning}</dd>
        </div>
      ))}
    </dl>
  );
}

/** Simple data table: head row + body rows. */
export function Table({ head, rows }: { head: ReactNode[]; rows: ReactNode[][] }) {
  return (
    <div className="lg-table-wrap">
      <table className="lg-table">
        <thead>
          <tr>{head.map((cell, i) => <th key={i} scope="col">{cell}</th>)}</tr>
        </thead>
        <tbody>
          {rows.map((row, r) => (
            <tr key={r}>{row.map((cell, c) => (c === 0 ? <th key={c} scope="row">{cell}</th> : <td key={c}>{cell}</td>))}</tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
