import React from "react";
import { useSearchParams } from "react-router-dom";
import {
  ArrowDownLeft,
  ArrowUpRight,
  ChevronRight,
  CircleAlert,
  CircleCheck,
  LoaderCircle,
  Receipt,
  RefreshCcw,
  ShieldCheck,
  Smartphone,
} from "lucide-react";
import AppShell from "../components/shell/AppShell";
import { refreshAccount } from "../components/shell/useAccount";
import MpesaLogo from "../components/finance/MpesaLogo";
import MpesaDepositDialog from "../components/finance/MpesaDepositDialog";
import { financeApi, type FinanceOverview, type FinanceStatus } from "../api";
import "./FinancePage.css";

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

type Tab = "deposit" | "withdraw" | "history";

const TABS: Array<{ key: Tab; label: string }> = [
  { key: "deposit", label: "Deposit" },
  { key: "withdraw", label: "Withdraw" },
  { key: "history", label: "History" },
];

// Shown as "Coming soon" until each provider is connected.
const OTHER_METHODS = [
  { name: "Airtel Money", detail: "Instant deposit", currencies: "KES", tile: "tile-airtel", mark: "airtel" },
  { name: "Equitel", detail: "Instant deposit", currencies: "KES", tile: "tile-equitel", mark: "equitel" },
  { name: "Binance Pay", detail: "Crypto deposit", currencies: "USDT, BTC, BNB", tile: "tile-binance", mark: "◆" },
  { name: "Mastercard", detail: "Card payment", currencies: "KES, USD, EUR", tile: "tile-mastercard", mark: "" },
  { name: "Visa", detail: "Card payment", currencies: "KES, USD, EUR", tile: "tile-visa", mark: "VISA" },
];

function formatKes(value: number): string {
  return `KES ${value.toLocaleString("en-KE", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function formatDate(value: string): string {
  return new Date(value).toLocaleString("en-KE", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function FinancePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const requested = searchParams.get("tab");
  const tab: Tab = requested === "withdraw" || requested === "history" ? requested : "deposit";

  const [overview, setOverview] = React.useState<FinanceOverview | null>(null);
  const [loadError, setLoadError] = React.useState("");
  const [loading, setLoading] = React.useState(true);
  const [depositOpen, setDepositOpen] = React.useState(false);

  const [withdrawPhone, setWithdrawPhone] = React.useState("");
  const [withdrawAmount, setWithdrawAmount] = React.useState("");
  const [withdrawing, setWithdrawing] = React.useState(false);
  const [withdrawResult, setWithdrawResult] = React.useState<{ ok: boolean; text: string } | null>(null);

  const loadOverview = React.useCallback(async () => {
    try {
      const data = await financeApi.overview();
      setOverview(data);
      setLoadError("");
      refreshAccount().catch(() => undefined);
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

  const transactions = React.useMemo(() => overview?.transactions ?? [], [overview]);
  const mpesaReady = Boolean(overview?.mpesa?.configured);

  function selectTab(next: Tab) {
    setSearchParams(next === "deposit" ? {} : { tab: next }, { replace: true });
  }

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

  const title = tab === "withdraw" ? "Withdraw" : tab === "history" ? "Transactions" : "Deposit";

  return (
    <AppShell title={title}>
      <div className="fin">
        <div className="fin-page-head">
          <div>
            <h1>Finance</h1>
            <p>Deposit with M-Pesa, request withdrawals and track every transaction.</p>
          </div>
          <div className="fin-real">
            <small>Real account balance</small>
            <strong>{overview ? formatKes(overview.wallet.balance) : "—"}</strong>
            {overview && overview.wallet.locked > 0 && <span>{formatKes(overview.wallet.locked)} reserved for withdrawals</span>}
          </div>
        </div>

        {loadError && (
          <div className="fin-banner is-error" role="alert">
            <CircleAlert size={16} aria-hidden="true" />
            <span>{loadError}</span>
            <button type="button" onClick={() => void loadOverview()}>
              Try again
            </button>
          </div>
        )}

        <div className="neo-tabs fin-tabs" role="tablist">
          {TABS.map((item) => (
            <button
              key={item.key}
              type="button"
              role="tab"
              aria-selected={tab === item.key}
              className={`${tab === item.key ? "is-active" : ""} ${item.key === "history" ? "fin-tab-history" : ""}`}
              onClick={() => selectTab(item.key)}
            >
              {item.label}
            </button>
          ))}
        </div>

        <div className="fin-grid" data-tab={tab}>
          <div className="fin-main">
            {tab !== "withdraw" ? (
              <section>
                <h2 className="fin-section-title">Choose Payment Method</h2>
                <ul className="fin-paylist">
                  <li>
                    <button
                      type="button"
                      className="fin-pay"
                      onClick={() => setDepositOpen(true)}
                      disabled={!mpesaReady}
                    >
                      <span className="fin-pay-tile tile-mpesa">
                        <MpesaLogo />
                      </span>
                      <span className="fin-pay-text">
                        <b>M-Pesa</b>
                        <small>Instant deposit</small>
                        <small>KES</small>
                      </span>
                      {mpesaReady ? (
                        <ChevronRight size={18} className="fin-pay-chev" aria-hidden="true" />
                      ) : (
                        <span className="neo-badge neo-badge-muted">{overview ? "Setting up" : "…"}</span>
                      )}
                    </button>
                  </li>
                  {OTHER_METHODS.map((method) => (
                    <li key={method.name}>
                      <button type="button" className="fin-pay" disabled>
                        <span className={`fin-pay-tile ${method.tile}`} aria-hidden="true">
                          {method.mark || <i />}
                        </span>
                        <span className="fin-pay-text">
                          <b>{method.name}</b>
                          <small>{method.detail}</small>
                          <small>{method.currencies}</small>
                        </span>
                        <span className="neo-badge neo-badge-accent">Coming soon</span>
                      </button>
                    </li>
                  ))}
                </ul>
                <p className="fin-note">
                  <ShieldCheck size={15} aria-hidden="true" />
                  M-Pesa sends a prompt to your phone. Enter your PIN to confirm; NeuroOption never asks for your PIN.
                </p>
              </section>
            ) : (
              <section className="fin-card is-plain">
                <div className="fin-card-head">
                  <h2>Withdraw to M-Pesa</h2>
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
            )}
          </div>

            <section className="fin-card fin-transactions fin-history">
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
        </div>

        {depositOpen && overview && (
          <MpesaDepositDialog
            minAmount={overview.mpesa.minAmount}
            maxAmount={overview.mpesa.maxAmount}
            onClose={() => setDepositOpen(false)}
            onFinished={loadOverview}
          />
        )}
      </div>
    </AppShell>
  );
}
