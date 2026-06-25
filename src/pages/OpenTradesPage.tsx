import React from "react";
import { PageHeader, StatusBadge, DataTable, EmptyState } from "../components/common";
import type { DataTableColumn } from "../components/common";
import { fetchOpenTrades, formatMoney, type BackendTrade } from "../components/trading/tradesApi";

// Live "time left until expiry" — ticks every second from the trade's
// real expiryTime, no fake price data involved.
function Countdown({ expiryTime }: { expiryTime: number }) {
  const [now, setNow] = React.useState(Date.now());

  React.useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, []);

  const remainingMs = Math.max(0, expiryTime - now);
  const seconds = Math.floor(remainingMs / 1000);
  const mm = String(Math.floor(seconds / 60)).padStart(2, "0");
  const ss = String(seconds % 60).padStart(2, "0");

  return <span className={remainingMs === 0 ? "np-text-muted" : ""}>{mm}:{ss}</span>;
}

export default function OpenTradesPage() {
  const [trades, setTrades] = React.useState<BackendTrade[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const controller = new AbortController();

    fetchOpenTrades(controller.signal)
      .then(setTrades)
      .catch(() => {})
      .finally(() => setLoading(false));

    return () => controller.abort();
  }, []);

  const totalAtRisk = trades.reduce((sum, t) => sum + Number(t.stakeAmount), 0);

  const columns: Array<DataTableColumn<BackendTrade>> = [
    { key: "asset", header: "Asset", render: (t) => <strong>{t.asset}</strong> },
    {
      key: "side",
      header: "Direction",
      render: (t) => <StatusBadge tone={t.side === "BUY" ? "success" : "danger"}>{t.side}</StatusBadge>,
    },
    { key: "investment", header: "Investment", align: "right", render: (t) => formatMoney(t.stakeAmount, t.currency) },
    { key: "entry", header: "Entry Price", align: "right", render: (t) => t.entryPrice },
    { key: "expiry", header: "Time Left", align: "right", render: (t) => <Countdown expiryTime={t.expiryTime} /> },
    { key: "payout", header: "Payout", align: "right", render: (t) => `+${t.payoutPercent}%` },
    {
      key: "profit",
      header: "Potential Profit",
      align: "right",
      render: (t) => <span className="np-text-success">{formatMoney(t.expectedProfitAmount, t.currency)}</span>,
    },
    { key: "status", header: "Status", render: () => <StatusBadge tone="info">Pending</StatusBadge> },
  ];

  return (
    <main className="np-page">
      <div className="np-container np-container-wide">
        <PageHeader title="Open Trades" subtitle="All of your currently active positions." />

        {!loading && trades.length > 0 && (
          <section className="np-section np-grid np-grid-3">
            <div className="np-stat-card">
              <div className="np-stat-card-label">Open Positions</div>
              <div className="np-stat-card-value">{trades.length}</div>
            </div>
            <div className="np-stat-card np-tone-warning">
              <div className="np-stat-card-label">Total At Risk</div>
              <div className="np-stat-card-value">{formatMoney(totalAtRisk, trades[0]?.currency ?? "USD")}</div>
            </div>
          </section>
        )}

        <section className="np-section">
          {loading ? (
            <p className="np-text-muted">Loading open trades...</p>
          ) : (
            <DataTable
              columns={columns}
              rows={trades}
              rowKey={(t) => t.id}
              emptyState={
                <EmptyState
                  icon="📭"
                  title="No open trades yet"
                  description="Trades you place on the Trading screen will appear here while they're active."
                />
              }
            />
          )}
        </section>
      </div>
    </main>
  );
}
