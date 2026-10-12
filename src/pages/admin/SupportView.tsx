import { useState } from "react";
import { kenyaDate, label, query, useAdminAction, useAdminQuery } from "./api";
import type { Paged } from "./api";
import { Alert, Badge, Drawer, Empty, Loading, PageHeader, Pager, Panel, Person, RefreshButton, SearchBox, Segmented } from "./ui";

type Ticket = { id: string; subject: string; status: string; user: { id: string; fullName: string; email: string }; messages: number; createdAt: string; updatedAt: string };
type TicketDetail = Ticket & { messages: { id: string; senderRole: string; message: string; createdAt: string }[] };

const TABS = [["all", "All"], ["OPEN", "Open"], ["PENDING_SUPPORT", "Needs reply"], ["PENDING_USER", "Waiting on client"], ["CLOSED", "Closed"]] as const;
const STATUSES = ["OPEN", "PENDING_SUPPORT", "PENDING_USER", "CLOSED"] as const;

export default function SupportView() {
  const [status, setStatus] = useState<(typeof TABS)[number][0]>("all");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [openId, setOpenId] = useState<string | null>(null);
  const { data, error, loading, reload } = useAdminQuery<Paged<Ticket>>(`/admin/console/support?${query({ status, search, page, limit: 20 })}`, 30000);

  return (
    <>
      <PageHeader eyebrow="CLIENT CARE" title="Support tickets" subtitle="Read client conversations and keep each ticket's status up to date." actions={<RefreshButton onClick={reload} loading={loading} />} />
      <Panel>
        <div className="nx-toolbar">
          <Segmented value={status} options={TABS} onChange={(v) => { setStatus(v); setPage(1); }} ariaLabel="Ticket status" />
          <SearchBox placeholder="Search subject or client…" onSearch={(v) => { setSearch(v); setPage(1); }} />
        </div>
        {error && <Alert onRetry={reload}>{error}</Alert>}
        <div className="nx-table-wrap">
          <table className="nx-table">
            <thead><tr><th>Subject</th><th>Client</th><th>Messages</th><th>Status</th><th>Last update (EAT)</th></tr></thead>
            <tbody>
              {data?.items.map((t) => (
                <tr key={t.id} className="is-clickable" tabIndex={0} onClick={() => setOpenId(t.id)} onKeyDown={(e) => { if (e.key === "Enter") setOpenId(t.id); }}>
                  <td><strong>{t.subject}</strong></td>
                  <td><Person name={t.user.fullName} email={t.user.email} /></td>
                  <td>{t.messages}</td>
                  <td><Badge value={t.status} /></td>
                  <td>{kenyaDate(t.updatedAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {data && data.items.length === 0 && <Empty>No tickets here.</Empty>}
          {!data && !error && <Loading>Loading tickets…</Loading>}
        </div>
        {data && <Pager page={data.page} pages={data.pages} total={data.total} onPage={setPage} />}
      </Panel>
      {openId && <TicketDrawer id={openId} onClose={() => setOpenId(null)} onChanged={reload} />}
    </>
  );
}

function TicketDrawer({ id, onClose, onChanged }: { id: string; onClose: () => void; onChanged: () => void }) {
  const act = useAdminAction();
  const { data, error, reload } = useAdminQuery<TicketDetail>(`/admin/console/support/${id}`);
  const [busy, setBusy] = useState(false);
  const [actionError, setActionError] = useState("");

  async function setStatus(status: string) {
    setBusy(true);
    setActionError("");
    try {
      await act(`/admin/console/support/${id}/status`, "PATCH", { status });
      reload();
      onChanged();
    } catch (err) {
      setActionError((err as Error).message);
    } finally {
      setBusy(false);
    }
  }

  const footer = data ? (
    <div className="nx-confirm">
      {actionError && <p className="nx-error">{actionError}</p>}
      <div className="nx-row-end">
        <label className="nx-inline-label" htmlFor="nx-ticket-status">Status</label>
        <select id="nx-ticket-status" value={data.status} disabled={busy} onChange={(e) => setStatus(e.target.value)}>
          {STATUSES.map((s) => <option key={s} value={s}>{label(s)}</option>)}
        </select>
      </div>
    </div>
  ) : undefined;

  return (
    <Drawer title={data?.subject ?? "Ticket"} onClose={onClose} footer={footer}>
      {error && <Alert onRetry={reload}>{error}</Alert>}
      {!data && !error && <Loading />}
      {data && (
        <>
          <div className="nx-profile-head"><Person name={data.user.fullName} email={data.user.email} /><Badge value={data.status} /></div>
          <p className="nx-muted">Opened {kenyaDate(data.createdAt)} EAT</p>
          <div className="nx-thread">
            {data.messages.length === 0 && <p className="nx-muted">No messages yet.</p>}
            {data.messages.map((m) => (
              <div key={m.id} className={`nx-msg ${m.senderRole === "USER" ? "from-client" : "from-staff"}`}>
                <small>{m.senderRole === "USER" ? data.user.fullName : "NeuroOption support"} · {kenyaDate(m.createdAt)}</small>
                <p>{m.message}</p>
              </div>
            ))}
          </div>
        </>
      )}
    </Drawer>
  );
}
