import React from "react";
import { PageHeader, StatCard, StatusBadge, DataTable, EmptyState } from "../components/common";
import type { DataTableColumn } from "../components/common";
import { fetchTradeHistory, formatMoney, type BackendTrade } from "../components/trading/tradesApi";

type Filter = "All" | "Won" | "Lost" | "Buy" | "Sell";

const FILTERS: Filter[] = ["All", "Won", "Lost", "Buy", "Sell"];

export default function HistoryPage() {
  const [trades, setTrades] = React.useState<BackendTrade[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [filter, setFilter] = React.useState<Filter>("All");

  React.useEffect(() => {
    const controller = new AbortController();

    fetchTradeHistory(controller.signal)
      .then(setTrades)
      .catch(() => {})
      .finally(() => setLoading(false));

    return () => controller.abort();
  }, []);

  const filteredTrades = trades.filter((trade) => {
    if (filter === "All") return true;
    if (filter === "Won") return trade.status === "WON";
    if (filter === "Lost") return trade.status === "LOST";
    if (filter === "Buy") return trade.side === "BUY";
    if (filter === "Sell") return trade.side === "SELL";
    return true;
  });

  const wonCount = trades.filter((t) => t.status === "WON").length;
  const lostCount = trades.filter((t) => t.status === "LOST").length;
  const netProfit = trades.reduce((sum, t) => {
    if (t.status === "WON") return sum + Number(t.profitAmount ?? 0);
    if (t.status === "LOST") return sum - Number(t.stakeAmount);
    return sum;
  }, 0);

  const columns: Array<DataTableColumn<BackendTrade>> = [
    { key: "asset", header: "Asset", render: (t) => <strong>{t.asset}</strong> },
    {
      key: "side",
      header: "Direction",
      render: (t) => <StatusBadge tone={t.side === "BUY" ? "success" : "danger"}>{t.side}</StatusBadge>,
    },
    { key: "entry", header: "Entry", align: "right", render: (t) => t.entryPrice },
    { key: "close", header: "Close", align: "right", render: (t) => t.closePrice ?? "—" },
    { key: "investment", header: "Investment", align: "right", render: (t) => formatMoney(t.stakeAmount, t.currency) },
    { key: "payout", header: "Payout", align: "right", render: (t) => `+${t.payoutPercent}%` },
    {
      key: "pnl",
      header: "Profit / Loss",
      align: "right",
      render: (t) => {
        const won = t.status === "WON";
        const lost = t.status === "LOST";
        const amount = won ? Number(t.profitAmount ?? 0) : lost ? -Number(t.stakeAmount) : 0;
        return (
          <span className={won ? "np-text-success" : lost ? "np-text-danger" : "np-text-muted"}>
            {amount > 0 ? "+" : ""}
            {formatMoney(amount, t.currency)}
          </span>
        );
      },
    },
    {
      key: "status",
      header: "Status",
      render: (t) => (
        <StatusBadge tone={t.status === "WON" ? "success" : t.status === "LOST" ? "danger" : "neutral"}>
          {t.status}
        </StatusBadge>
      ),
    },
    {
      key: "closedAt",
      header: "Closed",
      render: (t) => (t.settledAt ? new Date(t.settledAt).toLocaleString() : "—"),
    },
  ];

  return (
    <main className="np-page">
      <div className="np-container np-container-wide">
        <PageHeader title="Trade History" subtitle="Every trade you've completed, with full results." />

        <section className="np-section np-grid np-grid-4">
          <StatCard label="Total Trades" value={String(trades.length)} />
          <StatCard label="Won" value={String(wonCount)} tone="success" />
          <StatCard label="Lost" value={String(lostCount)} tone="danger" />
          <StatCard
            label="Net Profit"
            value={formatMoney(netProfit, trades[0]?.currency ?? "USD")}
            tone={netProfit >= 0 ? "success" : "danger"}
          />
        </section>

        <div className="np-tabs">
          {FILTERS.map((item) => (
            <button
              key={item}
              type="button"
              className={`np-tab ${filter === item ? "active" : ""}`}
              onClick={() => setFilter(item)}
            >
              {item}
            </button>
          ))}
        </div>

        <section className="np-section">
          {loading ? (
            <p className="np-text-muted">Loading trade history...</p>
          ) : (
            <DataTable
              columns={columns}
              rows={filteredTrades}
              rowKey={(t) => t.id}
              emptyState={
                <EmptyState
                  icon="📜"
                  title="No closed trades yet"
                  description="Your completed trades will show up here once they settle."
                />
              }
            />
          )}
        </section>
      </div>
    </main>
  );
}
