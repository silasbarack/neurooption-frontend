import { useState } from "react";
import { Activity, ArrowDownRight, ArrowUpRight, BarChart3, Clock3, ShieldCheck, Users, Wallet } from "lucide-react";
import { compact, kenyaClock, kenyaDate, query, useAdminQuery, usd } from "./api";
import { Alert, Badge, Bars, Empty, Kpi, Loading, PageHeader, Pager, Panel, Person, RefreshButton, SearchBox, Segmented } from "./ui";

type Trade = {
  id: string; userId: string; clientName: string; clientEmail: string | null;
  asset: string; side: string; status: string; accountType: string;
  currency: string; stakeAmount: number; stakeUsd: number; payoutPercent: number;
  profitUsd: number | null; entryTime: string; expiryTime: string;
};
type Data = {
  generatedAt: string;
  stats: { trades24: number; openTrades: number; volumeUsd24: number; wins24: number; losses24: number; winRate24: number | null; activeClients24: number };
  activity: { hour: string; trades: number; volumeUsd: number }[];
  activitySampled: boolean;
  trades: { total: number; page: number; limit: number; pages: number; items: Trade[] };
};

const ACCOUNTS = [["all", "All accounts"], ["demo", "Demo"], ["real", "Real"]] as const;

export default function TradingView() {
  const [account, setAccount] = useState<"all" | "demo" | "real">("all");
  const [status, setStatus] = useState("all");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const { data, error, loading, reload } = useAdminQuery<Data>(`/admin/trading-monitor?${query({ account, status, search, page, limit: 20 })}`, 15000);

  return (
    <>
      <PageHeader
        eyebrow="RISK & SURVEILLANCE"
        title="Trading monitor"
        subtitle={data ? `Live positions and settlements · refreshed every 15 s · ${kenyaDate(data.generatedAt)} EAT` : "Live positions and settlements"}
        actions={<><Segmented value={account} options={ACCOUNTS} onChange={(v) => { setAccount(v); setPage(1); }} ariaLabel="Account type" /><RefreshButton onClick={reload} loading={loading} /></>}
      />
      {error && <Alert onRetry={reload}>{error}</Alert>}
      <div className="nx-kpis">
        <Kpi title="Trades · 24h" value={data ? compact(data.stats.trades24) : "—"} hint="Orders recorded" icon={<Activity size={18} />} />
        <Kpi title="Open positions" value={data ? compact(data.stats.openTrades) : "—"} hint="Awaiting settlement" icon={<Clock3 size={18} />} tone="amber" />
        <Kpi title="Staked volume · 24h" value={data ? usd(data.stats.volumeUsd24) : "—"} hint="USD equivalent, not revenue" icon={<Wallet size={18} />} tone="teal" />
        <Kpi title="Client win rate · 24h" value={data?.stats.winRate24 == null ? "—" : `${data.stats.winRate24}%`} hint={data ? `${data.stats.wins24} won · ${data.stats.losses24} lost · ${data.stats.activeClients24} traders` : ""} icon={<BarChart3 size={18} />} tone="violet" />
      </div>

      <div className="nx-grid-2">
        <Panel title="Activity" subtitle="Trades per 2-hour window · rolling 24 h (EAT)">
          {data ? <Bars values={data.activity.map((a) => a.trades)} labels={data.activity.map((a) => kenyaClock(a.hour))} ariaLabel="Trades in two-hour windows over the last 24 hours" /> : <Loading />}
          {data?.activitySampled && <p className="nx-muted">Chart sampled from the 2,500 most recent trades; the cards use full counts.</p>}
        </Panel>
        <Panel title="Outcomes" subtitle="Settled in the last 24 h">
          <dl className="nx-metrics">
            <div><dt><ArrowUpRight size={15} /> Client wins</dt><dd className="up">{data ? compact(data.stats.wins24) : "—"}</dd></div>
            <div><dt><ArrowDownRight size={15} /> Client losses</dt><dd className="down">{data ? compact(data.stats.losses24) : "—"}</dd></div>
            <div><dt><Users size={15} /> Active traders</dt><dd>{data ? compact(data.stats.activeClients24) : "—"}</dd></div>
          </dl>
        </Panel>
      </div>

      <Panel title="Trade ledger" subtitle={data ? `${data.trades.total.toLocaleString()} matching trades` : undefined}>
        <div className="nx-toolbar">
          <SearchBox placeholder="Search trade ID, asset or client…" onSearch={(v) => { setSearch(v); setPage(1); }} />
          <select value={status} onChange={(e) => { setStatus(e.target.value); setPage(1); }} aria-label="Trade status">
            <option value="all">All statuses</option><option value="PENDING">Open</option><option value="WON">Won</option><option value="LOST">Lost</option><option value="DRAW">Draw</option>
          </select>
        </div>
        <div className="nx-table-wrap">
          <table className="nx-table">
            <thead><tr><th>Client</th><th>Asset</th><th>Direction</th><th>Account</th><th>Stake</th><th>Payout</th><th>Client P&amp;L</th><th>Status</th><th>Opened (EAT)</th></tr></thead>
            <tbody>
              {data?.trades.items.map((t) => (
                <tr key={t.id}>
                  <td><Person name={t.clientName} email={t.clientEmail} /></td>
                  <td><strong>{t.asset}</strong><small className="nx-sub" title={t.id}>{t.id.slice(0, 10)}…</small></td>
                  <td><span className={`nx-side ${t.side === "BUY" ? "buy" : "sell"}`}>{t.side === "BUY" ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}{t.side}</span></td>
                  <td><Badge value={t.accountType === "QT Demo" ? "Demo" : "Real"} tone={t.accountType === "QT Demo" ? "info" : "warn"} /></td>
                  <td><strong>{t.stakeAmount.toLocaleString(undefined, { maximumFractionDigits: 2 })} {t.currency}</strong><small className="nx-sub">{usd(t.stakeUsd)}</small></td>
                  <td>{t.payoutPercent}%</td>
                  <td className={t.profitUsd == null ? "" : t.profitUsd >= 0 ? "up" : "down"}>{t.profitUsd == null ? "—" : usd(t.profitUsd)}</td>
                  <td><Badge value={t.status} /></td>
                  <td>{kenyaDate(t.entryTime)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {data && data.trades.items.length === 0 && <Empty>No trades match these filters.</Empty>}
          {!data && !error && <Loading>Loading trades…</Loading>}
        </div>
        {data && <Pager page={data.trades.page} pages={data.trades.pages} total={data.trades.total} onPage={setPage} />}
      </Panel>
      <p className="nx-footnote"><ShieldCheck size={15} aria-hidden="true" /> Read-only surveillance. Trade outcomes and balances cannot be altered here.</p>
    </>
  );
}
