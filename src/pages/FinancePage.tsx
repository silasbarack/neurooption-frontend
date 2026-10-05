import React from "react";
import { Link } from "react-router-dom";
import type { LucideIcon } from "lucide-react";
import {
  ArrowDownLeft,
  ArrowLeft,
  ArrowUpRight,
  Bitcoin,
  CircleCheck,
  Clock,
  CreditCard,
  Gamepad2,
  Landmark,
  Plus,
  Receipt,
  ShieldCheck,
  Smartphone,
  Wallet,
} from "lucide-react";
import Logo from "../components/branding/Logo";
import "./FinancePage.css";
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

const METHOD_ICONS: Record<string, LucideIcon> = {
  mpesa: Smartphone,
  airtel: Smartphone,
  bank: Landmark,
  card: CreditCard,
  binance: Bitcoin,
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

  const selectedMethod = PAYMENT_METHODS.find((m) => m.id === withdrawMethod);

  return (
    <main className="fin">
      <header className="fin-header">
        <div className="fin-header-inner">
          <Link to="/" className="fin-brand" aria-label="NeuroOption home">
            <Logo className="fin-logo" />
          </Link>
          <Link to="/trading" className="fin-back">
            <ArrowLeft size={16} aria-hidden="true" />
            Back to trading
          </Link>
        </div>
      </header>

      <div className="fin-container">
        <section className="fin-titlebar">
          <div>
            <span className="fin-kicker">Wallet</span>
            <h1>Finance</h1>
            <p>Manage deposits, withdrawals and your transaction history.</p>
          </div>
          <div className="fin-actions">
            <button
              type="button"
              className="fin-btn fin-btn-green"
              onClick={() => paymentMethodsRef.current?.scrollIntoView({ behavior: "smooth" })}
            >
              <Plus size={17} aria-hidden="true" />
              Deposit
            </button>
            <button
              type="button"
              className="fin-btn fin-btn-ghost"
              onClick={() => withdrawRef.current?.scrollIntoView({ behavior: "smooth" })}
            >
              <ArrowUpRight size={17} aria-hidden="true" />
              Withdraw
            </button>
          </div>
        </section>

        <section className="fin-balances">
          <article className="fin-balance is-real">
            <div className="fin-balance-head">
              <span className="fin-balance-icon"><Wallet size={20} aria-hidden="true" /></span>
              <span className="fin-badge">QT Real</span>
            </div>
            <small>Real account balance</small>
            <strong>{realBalance !== null ? formatMoney(realBalance, "USD") : "—"}</strong>
            <p>Live funds available for trading and withdrawal</p>
          </article>
          <article className="fin-balance">
            <div className="fin-balance-head">
              <span className="fin-balance-icon"><Gamepad2 size={20} aria-hidden="true" /></span>
              <span className="fin-badge is-demo">QT Demo</span>
            </div>
            <small>Demo account balance</small>
            <strong>{demoBalance !== null ? formatMoney(demoBalance, "USD") : "—"}</strong>
            <p>Practice funds, no real money at risk</p>
          </article>
        </section>

        <section className="fin-stats">
          <div className="fin-stat">
            <span className="fin-stat-icon is-green"><ArrowDownLeft size={18} aria-hidden="true" /></span>
            <div>
              <small>Total deposited</small>
              <strong>{formatMoney(totalDeposits, "USD")}</strong>
            </div>
          </div>
          <div className="fin-stat">
            <span className="fin-stat-icon is-blue"><ArrowUpRight size={18} aria-hidden="true" /></span>
            <div>
              <small>Total withdrawn</small>
              <strong>{formatMoney(totalWithdrawals, "USD")}</strong>
            </div>
          </div>
          <div className="fin-stat">
            <span className={`fin-stat-icon ${pendingCount > 0 ? "is-amber" : "is-muted"}`}><Clock size={18} aria-hidden="true" /></span>
            <div>
              <small>Pending transactions</small>
              <strong>{pendingCount}</strong>
            </div>
          </div>
        </section>

        <div className="fin-columns">
          <section className="fin-card fin-transactions">
            <div className="fin-card-head">
              <h2>Recent transactions</h2>
              <span>{transactions.length} total</span>
            </div>

            {transactions.length === 0 ? (
              <div className="fin-empty">
                <Receipt size={28} aria-hidden="true" />
                <strong>No transactions yet</strong>
                <span>Your deposits and withdrawals will show up here.</span>
              </div>
            ) : (
              <ul className="fin-tx-list">
                {transactions.map((t) => {
                  const isDeposit = t.type === "Deposit";
                  return (
                    <li key={t.id}>
                      <span className={`fin-tx-icon ${isDeposit ? "is-in" : "is-out"}`}>
                        {isDeposit ? <ArrowDownLeft size={17} aria-hidden="true" /> : <ArrowUpRight size={17} aria-hidden="true" />}
                      </span>
                      <div className="fin-tx-main">
                        <strong>{t.type}</strong>
                        <small>{t.method} &middot; {t.date}</small>
                      </div>
                      <div className="fin-tx-side">
                        <strong className={isDeposit ? "is-in" : "is-out"}>
                          {(isDeposit ? "+" : "-") + formatMoney(t.amount, "USD")}
                        </strong>
                        <span className={`fin-status is-${TRANSACTION_STATUS_TONE[t.status]}`}>{t.status}</span>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </section>

          <div className="fin-side">
            <section className="fin-card" ref={withdrawRef}>
              <div className="fin-card-head">
                <h2>Request a withdrawal</h2>
              </div>
              <p className="fin-card-sub">Withdrawals are reviewed and typically clear within 24-48 hours.</p>

              <form className="fin-form" onSubmit={handleRequestWithdrawal}>
                <label htmlFor="withdraw-method">Method</label>
                <select
                  id="withdraw-method"
                  className="fin-input"
                  value={withdrawMethod}
                  onChange={(event) => setWithdrawMethod(event.target.value)}
                >
                  {PAYMENT_METHODS.map((method) => (
                    <option key={method.id} value={method.id}>
                      {method.name}
                    </option>
                  ))}
                </select>

                <label htmlFor="withdraw-amount">Amount (USD)</label>
                <div className="fin-amount">
                  <span>$</span>
                  <input
                    id="withdraw-amount"
                    className="fin-input"
                    type="number"
                    min={10}
                    placeholder="100"
                    value={withdrawAmount}
                    onChange={(event) => setWithdrawAmount(event.target.value)}
                  />
                </div>

                <button
                  type="submit"
                  className="fin-btn fin-btn-blue fin-btn-block"
                  disabled={!withdrawAmount || Number(withdrawAmount) <= 0}
                >
                  Request withdrawal{selectedMethod ? ` via ${selectedMethod.name}` : ""}
                </button>

                {withdrawSubmitted && (
                  <p className="fin-success" role="status">
                    <CircleCheck size={16} aria-hidden="true" />
                    Withdrawal request submitted!
                  </p>
                )}
              </form>

              <p className="fin-note">
                <ShieldCheck size={15} aria-hidden="true" />
                Withdrawals are paid only to verified (KYC) account holders.
              </p>
            </section>

            <section className="fin-card" ref={paymentMethodsRef}>
              <div className="fin-card-head">
                <h2>Payment methods</h2>
              </div>
              <ul className="fin-methods">
                {PAYMENT_METHODS.map((method) => {
                  const Icon = METHOD_ICONS[method.id] ?? CreditCard;
                  return (
                    <li key={method.id}>
                      <span className="fin-method-icon"><Icon size={18} aria-hidden="true" /></span>
                      <div>
                        <strong>{method.name}</strong>
                        <small>{method.description}</small>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}
