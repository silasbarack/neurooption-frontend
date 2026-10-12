import { Activity, BadgeCheck, Banknote, Clock3, LifeBuoy, TrendingUp, UserPlus, Users } from "lucide-react";
import { compact, kenyaDate, kenyaDay, kes, label, useAdminQuery, useSession, usd } from "./api";
import type { Area } from "./api";
import { Alert, Bars, Empty, Kpi, Loading, PageHeader, Panel, RefreshButton } from "./ui";

type Overview = {
  generatedAt: string;
  users: { total: number; new24h: number; new7d: number; byStatus: Record<string, number> };
  queues: { kycPending: number; ticketsOpen: number; newsletterSubscribers?: number; depositsPending: { count: number; amount: number }; withdrawalsPending: { count: number; amount: number } };
  money7d: { deposits: { count: number; amount: number }; withdrawals: { count: number; amount: number }; currency: string };
  trading24h: { trades: number; openTrades: number; volumeUsd: number; winRate: number | null };
  signups14d: { day: string; signups: number }[];
  recentActivity: { id: string; action: string; description: string | null; adminName: string | null; createdAt: string }[];
};

const STATUS_ORDER = ["ACTIVE", "PENDING_KYC", "SUSPENDED", "LOCKED", "DELETED"];

export default function OverviewView({ go }: { go: (area: Area) => void }) {
  const { admin, permissions } = useSession();
  const { data, error, loading, reload } = useAdminQuery<Overview>("/admin/console/overview", 30000);
  const can = (area: Area) => permissions.includes(area);
  const hour = Number(new Intl.DateTimeFormat("en-KE", { hour: "numeric", hourCycle: "h23", timeZone: "Africa/Nairobi" }).format(new Date()));
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
  const statusTotal = data ? Math.max(1, Object.values(data.users.byStatus).reduce((a, b) => a + b, 0)) : 1;

  return (
    <>
      <PageHeader
        eyebrow="COMMAND CENTER"
        title={`${greeting}, ${admin.fullName.split(" ")[0]}`}
        subtitle={data ? `Platform snapshot · updated ${kenyaDate(data.generatedAt)} EAT` : "Platform snapshot"}
        actions={<RefreshButton onClick={reload} loading={loading} />}
      />
      {error && <Alert onRetry={reload}>{error}</Alert>}
      {!data && !error && <Loading>Loading platform snapshot…</Loading>}
      {data && (
        <>
          <div className="nx-kpis">
            <Kpi title="Registered clients" value={compact(data.users.total)} hint={<><b className="up">+{data.users.new24h}</b> today · +{data.users.new7d} this week</>} icon={<Users size={18} />} onClick={can("users") ? () => go("users") : undefined} />
            <Kpi title="KYC awaiting review" value={data.queues.kycPending} hint="Oldest first in the queue" icon={<BadgeCheck size={18} />} tone="amber" onClick={can("kyc") ? () => go("kyc") : undefined} />
            <Kpi title="Open support tickets" value={data.queues.ticketsOpen} hint="Not yet closed" icon={<LifeBuoy size={18} />} tone="violet" onClick={can("support") ? () => go("support") : undefined} />
            <Kpi title="Pending withdrawals" value={data.queues.withdrawalsPending.count} hint={kes(data.queues.withdrawalsPending.amount)} icon={<Banknote size={18} />} tone="rose" onClick={can("finance") ? () => go("finance") : undefined} />
          </div>

          <div className="nx-grid-2">
            <Panel title="New registrations" subtitle="Sign-ups per day · last 14 days (UTC)">
              <Bars
                values={data.signups14d.map((d) => d.signups)}
                labels={data.signups14d.map((d) => kenyaDay(d.day))}
                ariaLabel="Daily sign-ups over the last 14 days"
              />
            </Panel>
            <Panel title="Client base" subtitle="Accounts by status">
              <div className="nx-stack-bar" aria-hidden="true">
                {STATUS_ORDER.filter((s) => data.users.byStatus[s]).map((s) => (
                  <span key={s} className={`seg s-${s.toLowerCase()}`} style={{ width: `${(data.users.byStatus[s]! / statusTotal) * 100}%` }} />
                ))}
              </div>
              <ul className="nx-legend">
                {STATUS_ORDER.map((s) => (
                  <li key={s}><span className={`dot s-${s.toLowerCase()}`} />{label(s)}<b>{(data.users.byStatus[s] ?? 0).toLocaleString()}</b></li>
                ))}
              </ul>
              <p className="nx-muted" style={{ marginTop: 14 }}>Newsletter subscribers: <b>{(data.queues.newsletterSubscribers ?? 0).toLocaleString()}</b></p>
            </Panel>
          </div>

          <div className="nx-grid-3">
            <Panel title="Trading · 24h" subtitle="All account types">
              <dl className="nx-metrics">
                <div><dt><Activity size={15} /> Trades placed</dt><dd>{compact(data.trading24h.trades)}</dd></div>
                <div><dt><Clock3 size={15} /> Open positions</dt><dd>{compact(data.trading24h.openTrades)}</dd></div>
                <div><dt><TrendingUp size={15} /> Staked volume</dt><dd>{usd(data.trading24h.volumeUsd)}</dd></div>
                <div><dt><BadgeCheck size={15} /> Client win rate</dt><dd>{data.trading24h.winRate == null ? "—" : `${data.trading24h.winRate}%`}</dd></div>
              </dl>
              {can("trading") && <button type="button" className="nx-link" onClick={() => go("trading")}>Open trading monitor →</button>}
            </Panel>
            <Panel title="Money movement · 7 days" subtitle="Completed transactions">
              <dl className="nx-metrics">
                <div><dt>Deposits</dt><dd className="up">{kes(data.money7d.deposits.amount)}<small>{data.money7d.deposits.count} payments</small></dd></div>
                <div><dt>Withdrawals</dt><dd className="down">{kes(data.money7d.withdrawals.amount)}<small>{data.money7d.withdrawals.count} payouts</small></dd></div>
                <div><dt>Pending deposits</dt><dd>{data.queues.depositsPending.count}<small>{kes(data.queues.depositsPending.amount)}</small></dd></div>
              </dl>
              {can("finance") && <button type="button" className="nx-link" onClick={() => go("finance")}>Open payments →</button>}
            </Panel>
            <Panel title="Recent admin activity" subtitle="Latest audited actions">
              {data.recentActivity.length === 0 ? <Empty>No admin actions recorded yet.</Empty> : (
                <ol className="nx-timeline">
                  {data.recentActivity.map((item) => (
                    <li key={item.id}>
                      <strong>{label(item.action)}</strong>
                      <span>{item.description}</span>
                      <small>{item.adminName ?? "System"} · {kenyaDate(item.createdAt)}</small>
                    </li>
                  ))}
                </ol>
              )}
              {can("audit") && <button type="button" className="nx-link" onClick={() => go("audit")}>Full audit log →</button>}
            </Panel>
          </div>
          {data.users.new24h > 0 && can("users") && (
            <button type="button" className="nx-callout" onClick={() => go("users")}>
              <UserPlus size={18} aria-hidden="true" /> {data.users.new24h} new client{data.users.new24h === 1 ? "" : "s"} joined in the last 24 hours. Review them in Clients.
            </button>
          )}
        </>
      )}
    </>
  );
}
