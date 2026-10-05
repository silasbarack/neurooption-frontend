import React from "react";
import { Link } from "react-router-dom";
import type { LucideIcon } from "lucide-react";
import {
  ArrowDownLeft,
  ArrowLeft,
  ArrowUpRight,
  Bitcoin,
  CircleAlert,
  CircleCheck,
  Clock,
  CreditCard,
  Gamepad2,
  Landmark,
  LoaderCircle,
  Plus,
  Receipt,
  RefreshCcw,
  ShieldCheck,
  Smartphone,
  Wallet,
} from "lucide-react";
import Logo from "../components/branding/Logo";
import MpesaLogo from "../components/finance/MpesaLogo";
import MpesaDepositDialog from "../components/finance/MpesaDepositDialog";
import { API_BASE_URL, USER_ID, fetchJson } from "../components/trading";
import { financeApi, type FinanceOverview, type FinanceStatus } from "../api";
import "./FinancePage.css";

type WalletResponse = {
  balance: number;
};

const STATUS_TONE: Record<FinanceStatus, "success" | "warning" | "danger" | "muted"> = {
  COMPLETED: "success",
  PENDING: "warning",
  PROCESSING: "warning",
  FAILED: "danger",
  REJECTED: "danger",
  CANCELLED: "muted",
};

const STATUS_LABEL: Record<FinanceStatus, string> = {
  COMPLETED: "Completed",
  PENDING: "Pending",
  PROCESSING: "Processing",
  FAILED: "Failed",
  REJECTED: "Rejected",
  CANCELLED: "Cancelled",
};

const OTHER_METHODS: Array<{ name: string; description: string; icon: LucideIcon }> = [
  { name: "Airtel Money", description: "Mobile money across Africa", icon: Smartphone },
  { name: "Bank Transfer", description: "1-3 business day settlement", icon: Landmark },
  { name: "Mastercard / Visa", description: "Card deposits", icon: CreditCard },
  { name: "Binance Pay", description: "Crypto deposits", icon: Bitcoin },
];

function formatKes(value: number): string {
  return `KES ${value.toLocaleString("en-KE", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function formatDate(value: string): string {
  const date = new Date(value);
  return date.toLocaleString("en-KE", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function FinancePage() {
  const [overview, setOverview] = React.useState<FinanceOverview | null>(null);
  const [loadError, setLoadError] = React.useState("");
  const [loading, setLoading] = React.useState(true);
  const [demoBalance, setDemoBalance] = React.useState<number | null>(null);
  const [depositOpen, setDepositOpen] = React.useState(false);

  const [withdrawPhone, setWithdrawPhone] = React.useState("");
  const [withdrawAmount, setWithdrawAmount] = React.useState("");
  const [withdrawing, setWithdrawing] = React.useState(false);
  const [withdrawResult, setWithdrawResult] = React.useState<{ ok: boolean; text: string } | null>(null);

  const withdrawRef = React.useRef<HTMLDivElement>(null);

  const loadOverview = React.useCallback(async () => {
    try {
      const data = await financeApi.overview();
      setOverview(data);
      setLoadError("");
    } catch (error) {
      setLoadError(error instanceof Error ? error.message : "Could not load your finance details.");
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    let active = true;
    financeApi
      .overview()
      .then((data) => {
        if (!active) return;
        setOverview(data);
        setLoadError("");
      })
      .catch((error) => {
        if (active) setLoadError(error instanceof Error ? error.message : "Could not load your finance details.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  React.useEffect(() => {
    const controller = new AbortController();
    fetchJson<WalletResponse>(
      `${API_BASE_URL}/trading-engine/wallet?userId=${encodeURIComponent(USER_ID)}&accountType=${encodeURIComponent("QT Demo")}&currency=USD`,
      controller.signal,
    )
      .then((demo) => setDemoBalance(Number(demo.balance)))
      .catch(() => {
        // Demo wallet unreachable: the card shows a placeholder.
      });
    return () => controller.abort();
  }, []);

  const transactions = React.useMemo(() => overview?.transactions ?? [], [overview]);
  const totalDeposits = transactions
    .filter((t) => t.type === "Deposit" && t.status === "COMPLETED")
    .reduce((sum, t) => sum + t.amount, 0);
  const totalWithdrawals = transactions
    .filter((t) => t.type === "Withdrawal" && t.status === "COMPLETED")
    .reduce((sum, t) => sum + t.amount, 0);
  const pendingCount = transactions.filter((t) => t.status === "PENDING" || t.status === "PROCESSING").length;

  const mpesa = overview?.mpesa;
  const mpesaReady = Boolean(mpesa?.configured);

  async function handleWithdraw(event: React.FormEvent) {
    event.preventDefault();
    const amount = Number(withdrawAmount);
    if (!amount || amount <= 0) return;

    setWithdrawing(true);
    setWithdrawResult(null);
    try {
      const result = await financeApi.requestWithdrawal(withdrawPhone, amount);
      setWithdrawResult({ ok: true, text: result.message });
      setWithdrawAmount("");
      await loadOverview();
    } catch (error) {
      setWithdrawResult({
        ok: false,
        text: error instanceof Error ? error.message : "Could not request the withdrawal.",
      });
    } finally {
      setWithdrawing(false);
    }
  }

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
            <p>Deposit with M-Pesa, request withdrawals and track every transaction.</p>
          </div>
          <div className="fin-actions">
            <button
              type="button"
              className="fin-btn fin-btn-green"
              onClick={() => setDepositOpen(true)}
              disabled={!mpesaReady}
              title={mpesaReady ? undefined : "M-Pesa deposits are not available yet"}
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

        {loadError && (
          <div className="fin-banner is-error" role="alert">
            <CircleAlert size={18} aria-hidden="true" />
            <span>{loadError}</span>
            <button type="button" onClick={() => { setLoading(true); void loadOverview(); }}>
              <RefreshCcw size={14} aria-hidden="true" /> Retry
            </button>
          </div>
        )}

        <section className="fin-balances">
          <article className="fin-balance is-real">
            <div className="fin-balance-head">
              <span className="fin-balance-icon"><Wallet size={20} aria-hidden="true" /></span>
              <span className="fin-badge">QT Real</span>
            </div>
            <small>Real account balance</small>
            <strong>{overview ? formatKes(overview.wallet.balance) : loading ? "…" : "—"}</strong>
            <p>
              {overview && overview.wallet.locked > 0
                ? `${formatKes(overview.wallet.locked)} held for pending withdrawals`
                : "Live funds available for trading and withdrawal"}
            </p>
          </article>
          <article className="fin-balance">
            <div className="fin-balance-head">
              <span className="fin-balance-icon"><Gamepad2 size={20} aria-hidden="true" /></span>
              <span className="fin-badge is-demo">QT Demo</span>
            </div>
            <small>Demo account balance</small>
            <strong>
              {demoBalance !== null
                ? `$${demoBalance.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                : "—"}
            </strong>
            <p>Practice funds, no real money at risk</p>
          </article>
        </section>

        <section className="fin-stats">
          <div className="fin-stat">
            <span className="fin-stat-icon is-green"><ArrowDownLeft size={18} aria-hidden="true" /></span>
            <div>
              <small>Total deposited</small>
              <strong>{formatKes(totalDeposits)}</strong>
            </div>
          </div>
          <div className="fin-stat">
            <span className="fin-stat-icon is-blue"><ArrowUpRight size={18} aria-hidden="true" /></span>
            <div>
              <small>Total withdrawn</small>
              <strong>{formatKes(totalWithdrawals)}</strong>
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
              <button type="button" className="fin-link-btn" onClick={() => void loadOverview()}>
                <RefreshCcw size={13} aria-hidden="true" /> Refresh
              </button>
            </div>

            {loading && !overview ? (
              <div className="fin-empty">
                <LoaderCircle size={26} className="fin-spin" aria-hidden="true" />
                <span>Loading your transactions…</span>
              </div>
            ) : transactions.length === 0 ? (
              <div className="fin-empty">
                <Receipt size={28} aria-hidden="true" />
                <strong>No transactions yet</strong>
                <span>Your M-Pesa deposits and withdrawals will show up here.</span>
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
                        <strong>{t.type} &middot; {t.method}</strong>
                        <small>
                          {formatDate(t.createdAt)}
                          {t.reference ? ` · ${t.reference}` : ""}
                        </small>
                      </div>
                      <div className="fin-tx-side">
                        <strong className={isDeposit ? "is-in" : "is-out"}>
                          {(isDeposit ? "+" : "-") + formatKes(t.amount)}
                        </strong>
                        <span className={`fin-status is-${STATUS_TONE[t.status]}`}>{STATUS_LABEL[t.status]}</span>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </section>

          <div className="fin-side">
            <section className="fin-card fin-mpesa-card">
              <div className="fin-mpesa-top">
                <span className="fin-mpesa-badge is-large"><MpesaLogo /></span>
                <span className={`fin-status ${mpesaReady ? "is-success" : "is-muted"}`}>
                  {mpesaReady ? "Instant" : "Unavailable"}
                </span>
              </div>
              <h2>Deposit with M-Pesa</h2>
              <p className="fin-card-sub">
                Get a payment prompt on your phone and confirm with your M-Pesa PIN. Funds arrive instantly.
              </p>
              <button
                type="button"
                className="fin-btn fin-btn-green fin-btn-block"
                onClick={() => setDepositOpen(true)}
                disabled={!mpesaReady}
              >
                <Plus size={17} aria-hidden="true" />
                Deposit now
              </button>
              {!mpesaReady && overview && (
                <p className="fin-note">
                  <CircleAlert size={14} aria-hidden="true" />
                  M-Pesa deposits are being set up and will be available soon.
                </p>
              )}
            </section>

            <section className="fin-card" ref={withdrawRef}>
              <div className="fin-card-head">
                <h2>Request a withdrawal</h2>
              </div>
              <p className="fin-card-sub">Withdrawals are reviewed and paid to your M-Pesa, typically within 24-48 hours.</p>

              <form className="fin-form" onSubmit={handleWithdraw}>
                <label htmlFor="withdraw-phone">M-Pesa phone number</label>
                <div className="fin-amount">
                  <span><Smartphone size={15} aria-hidden="true" /></span>
                  <input
                    id="withdraw-phone"
                    className="fin-input"
                    type="tel"
                    inputMode="tel"
                    placeholder="0712 345 678"
                    value={withdrawPhone}
                    onChange={(event) => setWithdrawPhone(event.target.value)}
                    required
                  />
                </div>

                <label htmlFor="withdraw-amount">Amount (KES)</label>
                <div className="fin-amount">
                  <span>KES</span>
                  <input
                    id="withdraw-amount"
                    className="fin-input fin-input-kes"
                    type="number"
                    min={1}
                    step="0.01"
                    placeholder="1000"
                    value={withdrawAmount}
                    onChange={(event) => setWithdrawAmount(event.target.value)}
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="fin-btn fin-btn-blue fin-btn-block"
                  disabled={withdrawing || !withdrawAmount || Number(withdrawAmount) <= 0}
                >
                  {withdrawing ? (
                    <>
                      <LoaderCircle size={17} className="fin-spin" aria-hidden="true" />
                      Submitting…
                    </>
                  ) : (
                    "Request withdrawal"
                  )}
                </button>

                {withdrawResult && (
                  <p className={withdrawResult.ok ? "fin-success" : "fin-error"} role="status">
                    {withdrawResult.ok ? <CircleCheck size={16} aria-hidden="true" /> : <CircleAlert size={16} aria-hidden="true" />}
                    {withdrawResult.text}
                  </p>
                )}
              </form>

              <p className="fin-note">
                <ShieldCheck size={15} aria-hidden="true" />
                Withdrawals are paid only to verified (KYC) account holders.
              </p>
            </section>

            <section className="fin-card">
              <div className="fin-card-head">
                <h2>Other payment methods</h2>
              </div>
              <ul className="fin-methods">
                {OTHER_METHODS.map(({ name, description, icon: Icon }) => (
                  <li key={name}>
                    <span className="fin-method-icon"><Icon size={18} aria-hidden="true" /></span>
                    <div>
                      <strong>{name}</strong>
                      <small>{description}</small>
                    </div>
                    <span className="fin-soon">Coming soon</span>
                  </li>
                ))}
              </ul>
            </section>
          </div>
        </div>
      </div>

      {depositOpen && mpesa && (
        <MpesaDepositDialog
          minAmount={mpesa.minAmount}
          maxAmount={mpesa.maxAmount}
          onClose={() => setDepositOpen(false)}
          onFinished={loadOverview}
        />
      )}
    </main>
  );
}
