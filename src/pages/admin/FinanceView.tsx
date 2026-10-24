import { useState } from "react";
import { ShieldCheck } from "lucide-react";
import { kenyaDate, label, query, useAdminQuery } from "./api";
import type { Paged } from "./api";
import { Alert, Badge, Empty, Loading, PageHeader, Pager, Panel, Person, RefreshButton, SearchBox, Segmented } from "./ui";

type Row = {
  id: string;
  user: { id: string; fullName: string; email: string };
  gateway: string;
  amount: number;
  currency: string;
  phone: string | null;
  reference: string | null;
  status: string;
  note: string | null;
  createdAt: string;
};

const KINDS = [["deposits", "Deposits"], ["withdrawals", "Withdrawals"]] as const;
const STATUSES = ["all", "PENDING", "PROCESSING", "COMPLETED", "FAILED", "REJECTED", "CANCELLED"];

export default function FinanceView() {
  const [kind, setKind] = useState<"deposits" | "withdrawals">("deposits");
  const [status, setStatus] = useState("all");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const { data, error, loading, reload } = useAdminQuery<Paged<Row> & { sum: number }>(`/admin/console/finance?${query({ kind, status, search, page, limit: 20 })}`, 30000);

  return (
    <>
      <PageHeader eyebrow="FINANCE" title="Payments" subtitle="Every M-Pesa and gateway deposit and withdrawal, with status and references." actions={<RefreshButton onClick={reload} loading={loading} />} />
      <Panel>
        <div className="nx-toolbar">
          <Segmented value={kind} options={KINDS} onChange={(v) => { setKind(v); setPage(1); }} ariaLabel="Payment type" />
          <SearchBox placeholder="Search client name or email…" onSearch={(v) => { setSearch(v); setPage(1); }} />
          <select value={status} onChange={(e) => { setStatus(e.target.value); setPage(1); }} aria-label="Payment status">
            {STATUSES.map((s) => <option key={s} value={s}>{s === "all" ? "All statuses" : label(s)}</option>)}
          </select>
          {data && <span className="nx-total">Total shown: <b>{data.sum.toLocaleString()} KES</b></span>}
        </div>
        {error && <Alert onRetry={reload}>{error}</Alert>}
        <div className="nx-table-wrap">
          <table className="nx-table">
            <thead><tr><th>Client</th><th>Amount</th><th>Method</th><th>Phone / reference</th><th>Status</th><th>Date (EAT)</th></tr></thead>
            <tbody>
              {data?.items.map((r) => (
                <tr key={r.id}>
                  <td><Person name={r.user.fullName} email={r.user.email} /></td>
                  <td className={kind === "deposits" ? "up" : "down"}><strong>{kind === "deposits" ? "+" : "−"}{r.amount.toLocaleString()} {r.currency}</strong></td>
                  <td>{r.gateway}</td>
                  <td>{r.phone ?? "—"}{r.reference && <small className="nx-sub">{r.reference}</small>}</td>
                  <td><Badge value={r.status} />{r.note && <small className="nx-sub">{r.note}</small>}</td>
                  <td>{kenyaDate(r.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {data && data.items.length === 0 && <Empty>No {kind} match these filters.</Empty>}
          {!data && !error && <Loading>Loading payments…</Loading>}
        </div>
        {data && <Pager page={data.page} pages={data.pages} total={data.total} onPage={setPage} />}
      </Panel>
      <p className="nx-footnote"><ShieldCheck size={15} aria-hidden="true" /> Read-only. Withdrawals are paid manually after review; balances cannot be changed from the console.</p>
    </>
  );
}
