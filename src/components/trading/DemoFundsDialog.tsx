import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { CircleCheck, CirclePlus, Info, LoaderCircle, Wallet, X } from "lucide-react";
import type { Currency } from "./trading.types";
import { EXCHANGE_RATES } from "./trading.constants";
import "./DemoFundsDialog.css";

/** Virtual amounts (USD) offered; the server accepts only these. */
const DEMO_TOP_UP_AMOUNTS_USD = [20_000, 50_000, 60_000, 100_000];
/** Demo funds can be added only while the balance is below this (USD). */
const DEMO_TOP_UP_THRESHOLD_USD = 10_000;

type DemoFundsDialogProps = {
  currency: Currency;
  /** Demo balance in USD, as reported by the server; null while loading. */
  balanceUsd: number | null;
  onClose: () => void;
  /** Adds the amount (USD) and resolves once the new balance is shown. */
  onAddFunds: (amountUsd: number) => Promise<void>;
};

function formatAmount(value: number, currency: Currency) {
  const digits = value >= 1000 || currency === "JPY" ? 0 : 2;
  return value.toLocaleString("en-US", { minimumFractionDigits: digits, maximumFractionDigits: digits });
}

export default function DemoFundsDialog({ currency, balanceUsd, onClose, onAddFunds }: DemoFundsDialogProps) {
  const [selected, setSelected] = useState(50_000);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [addedUsd, setAddedUsd] = useState<number | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const rate = EXCHANGE_RATES[currency] ?? 1;
  const eligible = balanceUsd !== null && balanceUsd < DEMO_TOP_UP_THRESHOLD_USD;
  const equivalent =
    currency === "USD" ? "" : ` (about ${formatAmount(DEMO_TOP_UP_THRESHOLD_USD * rate, currency)} ${currency})`;

  useEffect(() => {
    const previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const previousOverflow = document.body.style.overflow;
    const siblings = Array.from(document.body.children).filter(
      (node): node is HTMLElement => node instanceof HTMLElement && node !== modalRef.current,
    );
    const inertStates = siblings.map((node) => node.inert);
    siblings.forEach((node) => { node.inert = true; });
    document.body.style.overflow = "hidden";
    const frame = requestAnimationFrame(() => panelRef.current?.querySelector<HTMLButtonElement>("button")?.focus({ preventScroll: true }));
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") { event.preventDefault(); onClose(); return; }
      if (event.key !== "Tab") return;
      const items = Array.from(panelRef.current?.querySelectorAll<HTMLElement>("button:not([disabled])") ?? [])
        .filter((node) => node.getClientRects().length);
      const first = items[0], last = items[items.length - 1];
      if (!first || !last) return;
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus({ preventScroll: true }); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus({ preventScroll: true }); }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      cancelAnimationFrame(frame);
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previousOverflow;
      siblings.forEach((node, index) => { node.inert = inertStates[index]; });
      if (previousFocus?.isConnected) previousFocus.focus({ preventScroll: true });
    };
  }, [onClose]);

  async function submit() {
    if (!eligible || submitting) return;
    setSubmitting(true);
    setError("");
    try {
      await onAddFunds(selected);
      setAddedUsd(selected);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Could not add demo funds.");
    } finally {
      setSubmitting(false);
    }
  }

  return createPortal(
    <div className="dfd-backdrop" ref={modalRef} onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <div className="dfd-panel" ref={panelRef} role="dialog" aria-modal="true" aria-labelledby="dfd-title">
        <div className="dfd-head">
          <Wallet size={20} aria-hidden="true" />
          <span>NeuroOption | Demo Account</span>
          <em>Demo</em>
          <button type="button" className="dfd-close" onClick={onClose} aria-label="Close">
            <X size={18} aria-hidden="true" />
          </button>
        </div>

        {addedUsd !== null ? (
          <div className="dfd-done">
            <CircleCheck size={40} aria-hidden="true" />
            <h2 id="dfd-title">Demo funds added</h2>
            <p>
              {formatAmount(addedUsd * rate, currency)} {currency} in virtual funds has been added to your demo
              account.
            </p>
            <button type="button" className="dfd-primary" onClick={onClose}>Continue trading</button>
          </div>
        ) : (
          <>
            <h2 id="dfd-title" className="dfd-title">
              <CirclePlus size={22} aria-hidden="true" />
              Add Demo Funds
            </h2>

            {balanceUsd === null ? (
              <p className="dfd-lead">Loading your demo balance…</p>
            ) : eligible ? (
              <p className="dfd-lead">
                Your demo account balance is below $10,000 USD or its equivalent in your selected currency{equivalent}.
              </p>
            ) : (
              <p className="dfd-lead">
                Demo funds can be added when your demo balance falls below $10,000 USD{equivalent}. Your balance is{" "}
                {formatAmount(balanceUsd * rate, currency)} {currency}.
              </p>
            )}

            <p className="dfd-sub">
              Continue practicing your trading strategies without financial risk. Choose one of the following amounts
              to add virtual funds to your demo account.
            </p>

            <h3 className="dfd-label">Select an amount to add</h3>
            <div className="dfd-grid" role="radiogroup" aria-label="Amount to add">
              {DEMO_TOP_UP_AMOUNTS_USD.map((amount) => {
                const active = amount === selected;
                return (
                  <button
                    key={amount}
                    type="button"
                    role="radio"
                    aria-checked={active}
                    disabled={!eligible || submitting}
                    className={active ? "dfd-option is-active" : "dfd-option"}
                    onClick={() => setSelected(amount)}
                  >
                    <strong>{formatAmount(amount * rate, currency)}</strong>
                    {active ? (
                      <span className="dfd-selected"><CircleCheck size={15} aria-hidden="true" /> Selected</span>
                    ) : (
                      <span>Virtual funds</span>
                    )}
                  </button>
                );
              })}
            </div>

            <div className="dfd-note">
              <h4><Info size={16} aria-hidden="true" /> Important</h4>
              <p>
                All demo funds are virtual and have no monetary value. They cannot be withdrawn or transferred to a
                real account. Amounts will be converted into your selected account currency using the applicable
                exchange rate.
              </p>
            </div>

            {error && <p className="dfd-error" role="alert">{error}</p>}

            <div className="dfd-actions">
              <button type="button" className="dfd-secondary" onClick={onClose}>Cancel</button>
              <button type="button" className="dfd-primary" onClick={submit} disabled={!eligible || submitting}>
                {submitting && <LoaderCircle size={16} className="dfd-spin" aria-hidden="true" />}
                Add {formatAmount(selected * rate, currency)} {currency}
              </button>
            </div>
          </>
        )}
      </div>
    </div>,
    document.body,
  );
}
