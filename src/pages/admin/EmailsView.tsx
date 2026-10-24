import { useState } from "react";
import type { FormEvent } from "react";
import { CircleAlert, CircleCheck, MailCheck, MailWarning, MailX, Send } from "lucide-react";
import { kenyaDate, label, query, useAdminAction, useAdminQuery, useSession } from "./api";
import type { Paged } from "./api";
import { Alert, Badge, Empty, Kpi, Loading, PageHeader, Pager, Panel, RefreshButton, SearchBox, Segmented } from "./ui";

type EmailRow = {
  id: string;
  kind: string;
  recipient: string;
  subject: string;
  status: string;
  provider: string | null;
  attempts: number;
  lastError: string | null;
  lastEvent: string | null;
  acceptedAt: string | null;
  deliveredAt: string | null;
  nextAttemptAt: string | null;
  createdAt: string;
};
type EmailLog = Paged<EmailRow> & { last24h: Record<string, number> };
type Health = {
  provider: string;
  sender: string;
  linksPointTo: string;
  warnings: string[];
  brevo: { keyValid: boolean; domain: string; authenticated: boolean | null } | null;
  webhookConfigured: boolean;
};

const TABS = [["all", "All"], ["ACCEPTED", "Accepted"], ["DELIVERED", "Delivered"], ["QUEUED", "Retrying"], ["FAILED", "Failed"], ["BOUNCED", "Bounced"]] as const;

/** "Accepted" only means the provider took the message; "Delivered" needs a provider delivery event. */
const STATUS_TEXT: Record<string, [string, string]> = {
  SENDING: ["Sending", "info"],
  QUEUED: ["Retrying", "warn"],
  ACCEPTED: ["Accepted by provider", "info"],
  DELIVERED: ["Delivered", "good"],
  FAILED: ["Failed", "bad"],
  BOUNCED: ["Bounced", "bad"],
  COMPLAINED: ["Marked as spam", "bad"],
};

export default function EmailsView() {
  const { admin } = useSession();
  const [status, setStatus] = useState<(typeof TABS)[number][0]>("all");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const log = useAdminQuery<EmailLog>(`/admin/console/emails?${query({ status, search, page, limit: 25 })}`, 30000);
  const health = useAdminQuery<Health>("/admin/console/emails/health");
  const counts = log.data?.last24h ?? {};
  const failed24 = (counts.FAILED ?? 0) + (counts.BOUNCED ?? 0) + (counts.COMPLAINED ?? 0);

  return (
    <>
      <PageHeader
        eyebrow="DELIVERABILITY"
        title="Email delivery"
        subtitle="Every email the platform sends, its provider status and any delivery events."
        actions={<RefreshButton onClick={() => { log.reload(); health.reload(); }} loading={log.loading || health.loading} />}
      />

      <div className="nx-kpis">
        <Kpi title="Accepted · 24h" value={(counts.ACCEPTED ?? 0) + (counts.DELIVERED ?? 0)} hint="Taken by the provider" icon={<MailCheck size={18} />} />
        <Kpi title="Delivered · 24h" value={counts.DELIVERED ?? 0} hint={health.data?.webhookConfigured ? "Confirmed by delivery events" : "Needs the delivery webhook"} icon={<CircleCheck size={18} />} tone="teal" />
        <Kpi title="Retrying" value={counts.QUEUED ?? 0} hint="Temporary provider errors" icon={<MailWarning size={18} />} tone="amber" />
        <Kpi title="Failed · 24h" value={failed24} hint="Rejected, bounced or spam" icon={<MailX size={18} />} tone="rose" />
      </div>

      <div className="nx-grid-2">
        <Panel title="Provider health" subtitle="Live configuration check (nothing is sent)">
          {health.error && <Alert onRetry={health.reload}>{health.error}</Alert>}
          {!health.data && !health.error && <Loading>Checking the email provider…</Loading>}
          {health.data && <HealthPanel health={health.data} />}
        </Panel>
        {admin.role === "SUPER_ADMIN" ? (
          <Panel title="Send a test email" subtitle="Super Administrator only · recorded in the audit log">
            <TestSend onSent={log.reload} />
          </Panel>
        ) : (
          <Panel title="Send a test email"><p className="nx-muted">Only a Super Administrator can send test emails.</p></Panel>
        )}
      </div>

      <Panel title="Email log" subtitle="Newest first · message content is never shown here">
        <div className="nx-toolbar">
          <Segmented value={status} options={TABS} onChange={(v) => { setStatus(v); setPage(1); }} ariaLabel="Email status" />
          <SearchBox placeholder="Search recipient or subject…" onSearch={(v) => { setSearch(v); setPage(1); }} />
        </div>
        {log.error && <Alert onRetry={log.reload}>{log.error}</Alert>}
        <div className="nx-table-wrap">
          <table className="nx-table">
            <thead><tr><th>Email</th><th>Recipient</th><th>Status</th><th>Attempts</th><th>Created (EAT)</th></tr></thead>
            <tbody>
              {log.data?.items.map((m) => {
                const [text, tone] = STATUS_TEXT[m.status] ?? [label(m.status), "muted"];
                return (
                  <tr key={m.id}>
                    <td><strong>{m.subject}</strong><small className="nx-muted" style={{ display: "block" }}>{label(m.kind)}{m.provider ? ` · ${m.provider}` : ""}</small></td>
                    <td>{m.recipient}</td>
                    <td>
                      <Badge value={text} tone={tone} />
                      {m.lastError && m.status !== "ACCEPTED" && m.status !== "DELIVERED" && <small className="nx-muted" style={{ display: "block", maxWidth: 320 }}>{m.lastError}</small>}
                      {m.status === "QUEUED" && m.nextAttemptAt && <small className="nx-muted" style={{ display: "block" }}>Next try {kenyaDate(m.nextAttemptAt)}</small>}
                    </td>
                    <td>{m.attempts}</td>
                    <td>{kenyaDate(m.createdAt)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {log.data && log.data.items.length === 0 && <Empty>No emails recorded yet.</Empty>}
          {!log.data && !log.error && <Loading>Loading email log…</Loading>}
        </div>
        {log.data && <Pager page={log.data.page} pages={log.data.pages} total={log.data.total} onPage={setPage} />}
      </Panel>
    </>
  );
}

function HealthPanel({ health }: { health: Health }) {
  const rows: [string, string, "good" | "warn" | "bad" | "muted"][] = [
    ["Provider", health.provider === "none" ? "Not configured" : health.provider.toUpperCase() === "SMTP" ? "SMTP" : health.provider[0]!.toUpperCase() + health.provider.slice(1), health.provider === "none" ? "bad" : "good"],
    ["Sender", health.sender || "Not set", health.sender ? "muted" : "bad"],
    ["Links in emails", health.linksPointTo, "muted"],
  ];
  if (health.brevo) {
    rows.push(["Brevo API key", health.brevo.keyValid ? "Valid" : "Not working", health.brevo.keyValid ? "good" : "bad"]);
    rows.push([
      `Domain ${health.brevo.domain}`,
      health.brevo.authenticated ? "Authenticated in Brevo" : health.brevo.authenticated === false ? "Not authenticated yet" : "Could not check",
      health.brevo.authenticated ? "good" : "warn",
    ]);
  }
  rows.push(["Delivery events", health.webhookConfigured ? "Webhook secret set" : "Not configured", health.webhookConfigured ? "good" : "warn"]);

  return (
    <>
      <dl className="nx-metrics">
        {rows.map(([name, value, tone]) => (
          <div key={name}><dt>{name}</dt><dd>{tone === "muted" ? <span style={{ fontSize: 13, wordBreak: "break-all" }}>{value}</span> : <span className={`nx-badge tone-${tone}`}>{value}</span>}</dd></div>
        ))}
      </dl>
      {health.warnings.length > 0 && (
        <ul style={{ margin: "14px 0 0", paddingLeft: 18, display: "grid", gap: 6 }}>
          {health.warnings.map((w) => <li key={w} className="nx-muted"><CircleAlert size={13} aria-hidden="true" /> {w}</li>)}
        </ul>
      )}
    </>
  );
}

function TestSend({ onSent }: { onSent: () => void }) {
  const act = useAdminAction();
  const [to, setTo] = useState("");
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<{ ok: boolean; text: string } | null>(null);

  async function submit(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    setResult(null);
    try {
      const r = await act<{ accepted: boolean; message: string }>("/admin/console/emails/test", "POST", { to: to.trim() });
      setResult({ ok: r.accepted, text: r.message });
      onSent();
    } catch (err) {
      setResult({ ok: false, text: (err as Error).message });
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={submit} className="nx-confirm">
      <label htmlFor="nx-test-to">Send to (use your own inbox, never a client's)</label>
      <input id="nx-test-to" type="email" required maxLength={254} value={to} onChange={(e) => setTo(e.target.value)} placeholder="you@neurooption.com" />
      <div className="nx-row-end">
        <button type="submit" className="nx-btn nx-btn-primary" disabled={busy || !to.trim()}><Send size={15} /> {busy ? "Sending…" : "Send test email"}</button>
      </div>
      {result && <p className={result.ok ? "nx-muted" : "nx-error"} role="status">{result.text}</p>}
    </form>
  );
}
