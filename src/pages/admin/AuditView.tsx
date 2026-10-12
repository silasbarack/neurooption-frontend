import { useState } from "react";
import { kenyaDate, label, query, useAdminQuery } from "./api";
import type { Paged } from "./api";
import { Alert, Empty, Loading, PageHeader, Pager, Panel, RefreshButton, SearchBox } from "./ui";

type Log = {
  id: string;
  action: string;
  targetType: string;
  targetId: string | null;
  description: string | null;
  admin: { fullName: string; role: string } | null;
  user: { fullName: string; email: string } | null;
  createdAt: string;
};

export default function AuditView() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const { data, error, loading, reload } = useAdminQuery<Paged<Log>>(`/admin/console/audit?${query({ search, page, limit: 30 })}`);

  return (
    <>
      <PageHeader eyebrow="GOVERNANCE" title="Audit log" subtitle="A permanent record of sensitive actions: account changes, KYC decisions, team changes and client account deletions." actions={<RefreshButton onClick={reload} loading={loading} />} />
      <Panel>
        <div className="nx-toolbar">
          <SearchBox placeholder="Search action, description or ID…" onSearch={(v) => { setSearch(v); setPage(1); }} />
        </div>
        {error && <Alert onRetry={reload}>{error}</Alert>}
        <div className="nx-table-wrap">
          <table className="nx-table">
            <thead><tr><th>When (EAT)</th><th>Action</th><th>Details</th><th>By</th><th>Client</th></tr></thead>
            <tbody>
              {data?.items.map((log) => (
                <tr key={log.id}>
                  <td className="nx-nowrap">{kenyaDate(log.createdAt)}</td>
                  <td><strong>{label(log.action)}</strong><small className="nx-sub">{label(log.targetType)}</small></td>
                  <td className="nx-wrap">{log.description ?? "—"}</td>
                  <td>{log.admin ? <><strong>{log.admin.fullName}</strong><small className="nx-sub">{label(log.admin.role)}</small></> : <span className="nx-muted">Client / system</span>}</td>
                  <td>{log.user ? <><strong>{log.user.fullName}</strong><small className="nx-sub">{log.user.email}</small></> : "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {data && data.items.length === 0 && <Empty>No audit entries match.</Empty>}
          {!data && !error && <Loading>Loading audit log…</Loading>}
        </div>
        {data && <Pager page={data.page} pages={data.pages} total={data.total} onPage={setPage} />}
      </Panel>
    </>
  );
}
