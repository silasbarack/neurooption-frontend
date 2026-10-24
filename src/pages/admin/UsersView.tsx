import { useState } from "react";
import { Ban, CircleCheck, Lock } from "lucide-react";
import { kenyaDate, kes, label, query, useAdminAction, useAdminQuery, useSession, usd } from "./api";
import type { Paged } from "./api";
import { Alert, Badge, Drawer, Empty, Field, Loading, PageHeader, Pager, Panel, Person, RefreshButton, SearchBox } from "./ui";

type UserRow = { id: string; fullName: string; email: string; phone: string | null; role: string; status: string; kycStatus: string; createdAt: string };
type UserDetail = {
  user: UserRow & { referralCode: string | null; updatedAt: string };
  wallets: { currency: string; balance: number; locked: number }[];
  tradingWallets: { accountType: string; currency: string; balance: number; locked: number }[];
  tradeTotals: { trades: number; volumeUsd: number; profitUsd: number; won: number; lost: number };
  trades: { id: string; asset: string; side: string; status: string; accountType: string; stakeUsd: number; profitUsd: number | null; entryTime: string }[];
  deposits: { id: string; amount: number; currency: string; status: string; createdAt: string }[];
  withdrawals: { id: string; amount: number; currency: string; status: string; createdAt: string }[];
  kyc: { id: string; documentType: string; status: string; rejectionReason: string | null; createdAt: string }[];
  tickets: { id: string; subject: string; status: string; updatedAt: string }[];
  audit: { id: string; action: string; description: string | null; adminName: string | null; createdAt: string }[];
};

const STATUSES = ["all", "ACTIVE", "PENDING_KYC", "SUSPENDED", "LOCKED", "DELETED"];
const KYC = ["all", "NOT_SUBMITTED", "PENDING", "APPROVED", "REJECTED"];

export default function UsersView() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [kyc, setKyc] = useState("all");
  const [page, setPage] = useState(1);
  const [openId, setOpenId] = useState<string | null>(null);
  const { data, error, loading, reload } = useAdminQuery<Paged<UserRow>>(`/admin/console/users?${query({ search, status, kyc, page, limit: 20 })}`);

  return (
    <>
      <PageHeader eyebrow="CLIENTS" title="Client accounts" subtitle="Search every registered client, review their activity and manage account access." actions={<RefreshButton onClick={reload} loading={loading} />} />
      <Panel>
        <div className="nx-toolbar">
          <SearchBox placeholder="Search name, email, phone or ID…" onSearch={(v) => { setSearch(v); setPage(1); }} />
          <select value={status} onChange={(e) => { setStatus(e.target.value); setPage(1); }} aria-label="Account status">
            {STATUSES.map((s) => <option key={s} value={s}>{s === "all" ? "All statuses" : label(s)}</option>)}
          </select>
          <select value={kyc} onChange={(e) => { setKyc(e.target.value); setPage(1); }} aria-label="KYC status">
            {KYC.map((s) => <option key={s} value={s}>{s === "all" ? "Any KYC" : `KYC: ${label(s)}`}</option>)}
          </select>
        </div>
        {error && <Alert onRetry={reload}>{error}</Alert>}
        <div className="nx-table-wrap">
          <table className="nx-table">
            <thead><tr><th>Client</th><th>Phone</th><th>Status</th><th>KYC</th><th>Joined (EAT)</th></tr></thead>
            <tbody>
              {data?.items.map((u) => (
                <tr key={u.id} className="is-clickable" onClick={() => setOpenId(u.id)} tabIndex={0} onKeyDown={(e) => { if (e.key === "Enter") setOpenId(u.id); }}>
                  <td><Person name={u.fullName} email={u.email} /></td>
                  <td>{u.phone ?? "—"}</td>
                  <td><Badge value={u.status} /></td>
                  <td><Badge value={u.kycStatus} /></td>
                  <td>{kenyaDate(u.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {data && data.items.length === 0 && <Empty>No clients match these filters.</Empty>}
          {!data && !error && <Loading>Loading clients…</Loading>}
        </div>
        {data && <Pager page={data.page} pages={data.pages} total={data.total} onPage={setPage} />}
      </Panel>
      {openId && <UserDrawer id={openId} onClose={() => setOpenId(null)} onChanged={reload} />}
    </>
  );
}

function UserDrawer({ id, onClose, onChanged }: { id: string; onClose: () => void; onChanged: () => void }) {
  const { permissions } = useSession();
  const act = useAdminAction();
  const { data, error, reload } = useAdminQuery<UserDetail>(`/admin/console/users/${id}`);
  const [pending, setPending] = useState<"SUSPENDED" | "LOCKED" | "ACTIVE" | null>(null);
  const [reason, setReason] = useState("");
  const [busy, setBusy] = useState(false);
  const [actionError, setActionError] = useState("");
  const canManage = permissions.includes("userStatus");

  async function apply() {
    if (!pending) return;
    setBusy(true);
    setActionError("");
    try {
      await act(`/admin/console/users/${id}/status`, "PATCH", { status: pending, reason });
      setPending(null);
      setReason("");
      reload();
      onChanged();
    } catch (err) {
      setActionError((err as Error).message);
    } finally {
      setBusy(false);
    }
  }

  const u = data?.user;
  const footer = canManage && u && u.status !== "DELETED" ? (
    pending ? (
      <div className="nx-confirm">
        <label htmlFor="nx-reason">{pending === "ACTIVE" ? "Note (optional)" : `Reason to ${pending === "LOCKED" ? "lock" : "suspend"} this account`}</label>
        <textarea id="nx-reason" rows={2} maxLength={500} value={reason} onChange={(e) => setReason(e.target.value)} placeholder="Recorded in the audit log" />
        {actionError && <p className="nx-error">{actionError}</p>}
        <div className="nx-row-end">
          <button type="button" className="nx-btn nx-btn-ghost" onClick={() => { setPending(null); setActionError(""); }}>Cancel</button>
          <button type="button" className={`nx-btn ${pending === "ACTIVE" ? "nx-btn-primary" : "nx-btn-danger"}`} disabled={busy || (pending !== "ACTIVE" && reason.trim().length < 3)} onClick={apply}>
            {busy ? "Saving…" : pending === "ACTIVE" ? "Reactivate account" : pending === "LOCKED" ? "Lock account" : "Suspend account"}
          </button>
        </div>
      </div>
    ) : (
      <div className="nx-row-end">
        {u.status !== "ACTIVE" && <button type="button" className="nx-btn nx-btn-primary" onClick={() => setPending("ACTIVE")}><CircleCheck size={16} /> Reactivate</button>}
        {u.status !== "SUSPENDED" && <button type="button" className="nx-btn nx-btn-ghost" onClick={() => setPending("SUSPENDED")}><Ban size={16} /> Suspend</button>}
        {u.status !== "LOCKED" && <button type="button" className="nx-btn nx-btn-danger" onClick={() => setPending("LOCKED")}><Lock size={16} /> Lock</button>}
      </div>
    )
  ) : undefined;

  return (
    <Drawer title="Client profile" onClose={onClose} footer={footer}>
      {error && <Alert onRetry={reload}>{error}</Alert>}
      {!data && !error && <Loading />}
      {data && u && (
        <>
          <div className="nx-profile-head">
            <Person name={u.fullName} email={u.email} />
            <div className="nx-badges"><Badge value={u.status} /><Badge value={u.kycStatus} /></div>
          </div>
          <dl className="nx-fields">
            <Field label="Phone">{u.phone ?? "—"}</Field>
            <Field label="Joined">{kenyaDate(u.createdAt)}</Field>
            <Field label="Referral code">{u.referralCode ?? "—"}</Field>
            <Field label="Client ID"><code>{u.id}</code></Field>
          </dl>

          <h3 className="nx-section">Balances</h3>
          <div className="nx-mini-cards">
            {data.tradingWallets.map((w) => (
              <div key={w.accountType + w.currency} className="nx-mini"><small>{w.accountType.replace("QT ", "")} · {w.currency}</small><strong>{w.currency === "USD" ? usd(w.balance) : `${w.balance.toLocaleString()} ${w.currency}`}</strong>{w.locked > 0 && <em>{w.locked.toLocaleString()} in open trades</em>}</div>
            ))}
            {data.wallets.map((w) => (
              <div key={w.currency} className="nx-mini"><small>Cash wallet · {w.currency}</small><strong>{w.currency === "KES" ? kes(w.balance) : `${w.balance} ${w.currency}`}</strong></div>
            ))}
            {data.tradingWallets.length + data.wallets.length === 0 && <p className="nx-muted">No wallets yet.</p>}
          </div>

          <h3 className="nx-section">Trading</h3>
          <div className="nx-mini-cards">
            <div className="nx-mini"><small>Trades</small><strong>{data.tradeTotals.trades}</strong><em>{data.tradeTotals.won} won · {data.tradeTotals.lost} lost</em></div>
            <div className="nx-mini"><small>Volume</small><strong>{usd(data.tradeTotals.volumeUsd)}</strong></div>
            <div className="nx-mini"><small>Client P&amp;L</small><strong className={data.tradeTotals.profitUsd >= 0 ? "up" : "down"}>{usd(data.tradeTotals.profitUsd)}</strong></div>
          </div>
          {data.trades.length > 0 && (
            <ul className="nx-list">
              {data.trades.map((t) => (
                <li key={t.id}><span><strong>{t.asset}</strong> {t.side} · {t.accountType.replace("QT ", "")}</span><span>{usd(t.stakeUsd)}</span><Badge value={t.status} /></li>
              ))}
            </ul>
          )}

          <h3 className="nx-section">Payments</h3>
          {data.deposits.length + data.withdrawals.length === 0 ? <p className="nx-muted">No deposits or withdrawals.</p> : (
            <ul className="nx-list">
              {data.deposits.map((d) => <li key={d.id}><span>Deposit · {kenyaDate(d.createdAt)}</span><span className="up">+{d.amount.toLocaleString()} {d.currency}</span><Badge value={d.status} /></li>)}
              {data.withdrawals.map((w) => <li key={w.id}><span>Withdrawal · {kenyaDate(w.createdAt)}</span><span className="down">−{w.amount.toLocaleString()} {w.currency}</span><Badge value={w.status} /></li>)}
            </ul>
          )}

          <h3 className="nx-section">Verification &amp; support</h3>
          <ul className="nx-list">
            {data.kyc.map((k) => <li key={k.id}><span>KYC · {label(k.documentType)}</span><span>{kenyaDate(k.createdAt)}</span><Badge value={k.status} /></li>)}
            {data.tickets.map((t) => <li key={t.id}><span>Ticket · {t.subject}</span><span>{kenyaDate(t.updatedAt)}</span><Badge value={t.status} /></li>)}
            {data.kyc.length + data.tickets.length === 0 && <li className="nx-muted">No KYC submissions or tickets.</li>}
          </ul>

          {data.audit.length > 0 && (
            <>
              <h3 className="nx-section">Admin history</h3>
              <ol className="nx-timeline">
                {data.audit.map((a) => <li key={a.id}><strong>{label(a.action)}</strong><span>{a.description}</span><small>{a.adminName ?? "System"} · {kenyaDate(a.createdAt)}</small></li>)}
              </ol>
            </>
          )}
        </>
      )}
    </Drawer>
  );
}
