import React from "react";
import { PageHeader, StatCard, StatusBadge, DataTable, EmptyState } from "../components/common";
import type { DataTableColumn } from "../components/common";
import { API_BASE_URL, USER_ID, fetchJson, formatMoney } from "../components/trading";
import { MOCK_TRANSACTIONS, PAYMENT_METHODS, type Transaction } from "../data/mockData";

type WalletResponse = {
  balance: number;
};

const TRANSACTION_STATUS_TONE: Record<Transaction["status"], "success" | "warning" | "danger"> = {
  Completed: "success",
  Pending: "warning",
  Failed: "danger",
};

export default function FinancePage() {
  const [demoBalance, setDemoBalance] = React.useState<number | null>(null);
  const [realBalance, setRealBalance] = React.useState<number | null>(null);
  const [transactions, setTransactions] = React.useState<Transaction[]>(MOCK_TRANSACTIONS);
  const [withdrawMethod, setWithdrawMethod] = React.useState(PAYMENT_METHODS[0].id);
  const [withdrawAmount, setWithdrawAmount] = React.useState("");
  const [withdrawSubmitted, setWithdrawSubmitted] = React.useState(false);
  const withdrawRef = React.useRef<HTMLDivElement>(null);
  const paymentMethodsRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const controller = new AbortController();

    Promise.all([
      fetchJson<WalletResponse>(
        `${API_BASE_URL}/trading-engine/wallet?userId=${encodeURIComponent(USER_ID)}&accountType=${encodeURIComponent("QT Demo")}&currency=USD`,
        controller.signal
      ),
      fetchJson<WalletResponse>(
        `${API_BASE_URL}/trading-engine/wallet?userId=${encodeURIComponent(USER_ID)}&accountType=${encodeURIComponent("QT Real")}&currency=USD`,
        controller.signal
      ),
    ])
      .then(([demo, real]) => {
        setDemoBalance(Number(demo.balance));
        setRealBalance(Number(real.balance));
      })
      .catch(() => {
        // Wallet service unreachable — leave balances unset so the cards show a placeholder.
      });

    return () => controller.abort();
  }, []);

  const totalDeposits = transactions.filter((t) => t.type === "Deposit" && t.status === "Completed").reduce(
    (sum, t) => sum + t.amount,
    0
  );
  const totalWithdrawals = transactions.filter(
    (t) => t.type === "Withdrawal" && t.status === "Completed"
  ).reduce((sum, t) => sum + t.amount, 0);
  const pendingCount = transactions.filter((t) => t.status === "Pending").length;

  function handleRequestWithdrawal(event: React.FormEvent) {
    event.preventDefault();

    const amount = Number(withdrawAmount);
    if (!amount || amount <= 0) return;

    const method = PAYMENT_METHODS.find((m) => m.id === withdrawMethod);

    const record: Transaction = {
      id: `tx-${Date.now()}`,
      type: "Withdrawal",
      method: method?.name ?? "Withdrawal",
      amount,
      status: "Pending",
      date: new Date().toISOString().slice(0, 10),
    };

    setTransactions((current) => [record, ...current]);
    setWithdrawAmount("");
    setWithdrawSubmitted(true);
    window.setTimeout(() => setWithdrawSubmitted(false), 3000);
  }

  const columns: Array<DataTableColumn<Transaction>> = [
    { key: "date", header: "Date", render: (t) => t.date },
    { key: "type", header: "Type", render: (t) => t.type },
    { key: "method", header: "Method", render: (t) => t.method },
    {
      key: "amount",
      header: "Amount",
      align: "right",
      render: (t) => (t.type === "Deposit" ? "+" : "-") + formatMoney(t.amount, "USD"),
    },
    {
      key: "status",
      header: "Status",
      render: (t) => <StatusBadge tone={TRANSACTION_STATUS_TONE[t.status]}>{t.status}</StatusBadge>,
    },
  ];

  return (
    <main className="np-page">
      <div className="np-container">
        <PageHeader
          title="Finance"
          subtitle="Manage deposits, withdrawals, and your transaction history."
          actions={
            <>
              <button type="button" className="np-btn np-btn-primary" onClick={() => paymentMethodsRef.current?.scrollIntoView({ behavior: "smooth" })}>
                + Deposit
              </button>
              <button type="button" className="np-btn" onClick={() => withdrawRef.current?.scrollIntoView({ behavior: "smooth" })}>
                Withdraw
              </button>
            </>
          }
        />

        <section className="np-section np-grid np-grid-2">
          <StatCard
            label="Demo Account"
            value={demoBalance !== null ? formatMoney(demoBalance, "USD") : "—"}
            hint="QT Demo · practice funds"
          />
          <StatCard
            label="Real Account"
            value={realBalance !== null ? formatMoney(realBalance, "USD") : "—"}
            hint="QT Real · live funds"
            tone="success"
          />
        </section>

        <section className="np-section np-grid np-grid-3">
          <StatCard label="Total Deposited" value={formatMoney(totalDeposits, "USD")} hint="All-time completed deposits" />
          <StatCard label="Total Withdrawn" value={formatMoney(totalWithdrawals, "USD")} hint="All-time completed withdrawals" />
          <StatCard label="Pending Transactions" value={String(pendingCount)} hint="Awaiting confirmation" tone={pendingCount > 0 ? "warning" : "default"} />
        </section>

        <section className="np-section">
          <div className="np-section-head">
            <h2>Recent Transactions</h2>
          </div>

          <DataTable
            columns={columns}
            rows={transactions}
            rowKey={(t) => t.id}
            emptyState={<EmptyState icon="🧾" title="No transactions yet" description="Your deposits and withdrawals will show up here." />}
          />
        </section>

        <section className="np-section" ref={paymentMethodsRef}>
          <div className="np-section-head">
            <h2>Payment Methods</h2>
          </div>

          <div className="np-grid np-grid-3">
            {PAYMENT_METHODS.map((method) => (
              <div key={method.id} className="np-card">
                <div style={{ fontSize: 28, marginBottom: 8 }}>{method.icon}</div>
                <div style={{ fontWeight: 800, marginBottom: 4 }}>{method.name}</div>
                <div className="np-text-muted" style={{ fontSize: 13 }}>
                  {method.description}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="np-section" ref={withdrawRef}>
          <div className="np-card">
            <h3 className="np-card-title">Request a Withdrawal</h3>
            <p className="np-card-subtitle">Withdrawals are reviewed and typically clear within 24-48 hours.</p>

            <form onSubmit={handleRequestWithdrawal}>
              <div className="np-field">
                <label htmlFor="withdraw-method">Method</label>
                <select
                  id="withdraw-method"
                  className="np-select"
                  value={withdrawMethod}
                  onChange={(event) => setWithdrawMethod(event.target.value)}
                >
                  {PAYMENT_METHODS.map((method) => (
                    <option key={method.id} value={method.id}>
                      {method.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="np-field">
                <label htmlFor="withdraw-amount">Amount (USD)</label>
                <input
                  id="withdraw-amount"
                  className="np-input"
                  type="number"
                  min={10}
                  placeholder="100"
                  value={withdrawAmount}
                  onChange={(event) => setWithdrawAmount(event.target.value)}
                />
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <button type="submit" className="np-btn np-btn-success" disabled={!withdrawAmount || Number(withdrawAmount) <= 0}>
                  Request Withdrawal
                </button>
                {withdrawSubmitted && (
                  <span className="np-text-success" style={{ fontSize: 13 }}>
                    Withdrawal request submitted!
                  </span>
                )}
              </div>
            </form>
          </div>
        </section>
      </div>
    </main>
  );
}
