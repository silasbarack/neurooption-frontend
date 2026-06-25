import React from "react";
import { Link } from "react-router-dom";
import {
  fetchTradeHistory,
  formatMoney,
  type BackendTrade,
} from "../components/trading/tradesApi";

export default function HistoryPage() {
  const [trades, setTrades] = React.useState<BackendTrade[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const controller = new AbortController();

    fetchTradeHistory(controller.signal)
      .then(setTrades)
      .catch(() => {})
      .finally(() => setLoading(false));

    return () => controller.abort();
  }, []);

  return (
    <main style={styles.page}>
      <section style={styles.card}>
        <h1 style={styles.heading}>Trades history</h1>

        {loading && <p>Loading...</p>}

        {!loading && trades.length === 0 && <p>No closed trades yet.</p>}

        {!loading && trades.length > 0 && (
          <div style={styles.list}>
            {trades.slice(0, 30).map((trade) => (
              <div key={trade.id} style={styles.row}>
                <strong>
                  {trade.status} • {trade.side} {trade.asset}
                </strong>
                <span style={styles.rowMeta}>
                  Entry {trade.entryPrice} → Close {trade.closePrice ?? "-"} • Profit{" "}
                  {formatMoney(trade.profitAmount ?? 0, trade.currency)}
                </span>
              </div>
            ))}
          </div>
        )}

        <Link style={styles.link} to="/trading">
          Back to Trading
        </Link>
      </section>
    </main>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: "100vh",
    background: "#070b14",
    color: "#fff",
    fontFamily: "Roboto, sans-serif",
    display: "grid",
    placeItems: "center",
    padding: "24px",
  },
  card: {
    background: "#111827",
    padding: "28px",
    borderRadius: "20px",
    maxWidth: "620px",
    width: "100%",
  },
  heading: {
    color: "#fff",
  },
  list: {
    display: "grid",
    gap: "10px",
    margin: "16px 0",
    maxHeight: "60vh",
    overflowY: "auto",
  },
  row: {
    display: "grid",
    gap: "4px",
    padding: "12px 14px",
    borderRadius: "12px",
    background: "#1a2233",
  },
  rowMeta: {
    color: "#9aa4b8",
    fontSize: "13px",
  },
  link: {
    color: "#74f2a7",
  },
};
