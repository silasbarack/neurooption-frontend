import React from "react";
import { useSearchParams } from "react-router-dom";
import {
  ArrowDownLeft,
  ArrowUpRight,
  CircleAlert,
  CircleCheck,
  LoaderCircle,
  Receipt,
  RefreshCcw,
  ShieldCheck,
  Smartphone,
} from "lucide-react";
import AppShell from "../components/shell/AppShell";
import { refreshAccount, useAccount } from "../components/shell/useAccount";
import DepositMethods, { type DepositMethod } from "../components/finance/DepositMethods";
import MpesaDepositPanel from "../components/finance/MpesaDepositPanel";
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

// Shown as "Coming soon" until each provider is connected. M-Pesa is added
// at render time from the live finance details.
const COMING_SOON_METHODS: DepositMethod[] = [
  { id: "airtel", name: "Airtel Money", brand: "airtel", available: false },
  { id: "equitel", name: "Equitel", brand: "equitel", available: false },
  { id: "binance", name: "Binance Pay", brand: "binance", available: false },
  { id: "mastercard", name: "Mastercard", brand: "mastercard", available: false },
  { id: "visa", name: "Visa", brand: "visa", available: false },
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
  const { account } = useAccount();
  // Which deposit method's screen is open; null shows the method list.
  const [depositMethod, setDepositMethod] = React.useState<string | null>(null);
  const closeDeposit = React.useCallback(() => setDepositMethod(null), []);

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

  const depositMethods = React.useMemo<DepositMethod[]>(
    () => [
      {
        id: "mpesa",
        name: "M-Pesa",
        brand: "mpesa",
        available: mpesaReady,
        minKes: mpesaReady ? overview?.mpesa.minAmount : undefined,
        time: mpesaReady ? "Instant" : undefined,
      },
      ...COMING_SOON_METHODS,
    ],
    [mpesaReady, overview],
  );

  // Methods already used for a deposit, from the user's real history.
  const recentDepositIds = React.useMemo(() => {
    const ids: string[] = [];
    for (const t of transactions) {
      if (t.type !== "Deposit") continue;
      const id = /pesa/i.test(t.method) ? "mpesa" : null;
      if (id && !ids.includes(id)) ids.push(id);
    }
    return ids;
  }, [transactions]);

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

  const title = tab === "withdraw" ? "Withdraw" : tab === "history" ? "Transactions" : "Account top-up";

  return (
    <AppShell title={title}>
      <div className="fin">
        <div className="fin-page-head">
          <div>
            <h1>{title}</h1>
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
              depositMethod === "mpesa" && overview ? (
                <MpesaDepositPanel
                  minAmount={overview.mpesa.minAmount}
                  maxAmount={overview.mpesa.maxAmount}
                  defaultPhone={account?.phone}
                  onBack={closeDeposit}
                  onFinished={loadOverview}
                />
              ) : (
                <DepositMethods
                  methods={depositMethods}
                  recentIds={recentDepositIds}
                  loading={loading && !loadError}
                  onSelect={setDepositMethod}
                />
              )
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

      </div>
    </AppShell>
  );
}
