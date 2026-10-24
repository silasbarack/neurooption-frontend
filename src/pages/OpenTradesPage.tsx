import React from "react";
import AssetIcon from "../components/markets/AssetIcon";
import { PageHeader, StatusBadge, DataTable, EmptyState } from "../components/common";
import type { DataTableColumn } from "../components/common";
import { fetchOpenTrades, formatMoney, type BackendTrade } from "../components/trading/tradesApi";
import TradeCountdown from "../components/trading/TradeCountdown";

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
    { key: "asset", header: "Asset", render: (t) => <span className="np-asset-cell"><AssetIcon symbol={t.asset} size={22} /><strong>{t.asset}</strong></span> },
    {
      key: "side",
      header: "Direction",
      render: (t) => <StatusBadge tone={t.side === "BUY" ? "success" : "danger"}>{t.side}</StatusBadge>,
    },
    { key: "investment", header: "Investment", align: "right", render: (t) => formatMoney(t.stakeAmount, t.currency) },
    { key: "entry", header: "Entry Price", align: "right", render: (t) => t.entryPrice },
    { key: "expiry", header: "Time Left", align: "right", render: (t) => <TradeCountdown expiryTime={t.expiryTime} showExpiry /> },
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
