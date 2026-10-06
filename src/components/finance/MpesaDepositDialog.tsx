import { useEffect, useRef, useState } from "react";
import type { FormEvent } from "react";
import { createPortal } from "react-dom";
import {
  CircleAlert,
  CircleCheck,
  LoaderCircle,
  Lock,
  Smartphone,
  X,
} from "lucide-react";
import { financeApi, type StkDeposit } from "../../api";
import MpesaLogo from "./MpesaLogo";

type MpesaDepositDialogProps = {
  minAmount: number;
  maxAmount: number;
  onClose: () => void;
  onFinished: () => void;
};

type Stage = "form" | "waiting" | "success" | "failed";

const QUICK_AMOUNTS = [500, 1000, 2500, 5000];
const POLL_INTERVAL_MS = 4000;
const POLL_TIMEOUT_MS = 120_000;

export default function MpesaDepositDialog({
  minAmount,
  maxAmount,
  onClose,
  onFinished,
}: MpesaDepositDialogProps) {
  const [phone, setPhone] = useState("");
  const [amount, setAmount] = useState("1000");
  const [stage, setStage] = useState<Stage>("form");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [deposit, setDeposit] = useState<StkDeposit | null>(null);
  const [timedOut, setTimedOut] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const pollRef = useRef<number | null>(null);
  const startedAtRef = useRef(0);

  useEffect(() => {
    const previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const previousOverflow = document.body.style.overflow;
    const siblings = Array.from(document.body.children).filter(
      (node): node is HTMLElement => node instanceof HTMLElement && node !== modalRef.current,
    );
    const inertStates = siblings.map((node) => node.inert);
    siblings.forEach((node) => { node.inert = true; });
    document.body.style.overflow = "hidden";
    const frame = requestAnimationFrame(() => panelRef.current?.querySelector<HTMLButtonElement>("button")?.focus());
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") { event.preventDefault(); onClose(); return; }
      if (event.key !== "Tab") return;
      const items = Array.from(panelRef.current?.querySelectorAll<HTMLElement>(
        'button:not([disabled]), input:not([disabled]), select:not([disabled]), a[href], [tabindex="0"]',
      ) ?? []).filter((node) => node.getClientRects().length);
      const first = items[0], last = items[items.length - 1];
      if (!first || !last) return;
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      cancelAnimationFrame(frame);
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previousOverflow;
      siblings.forEach((node, index) => { node.inert = inertStates[index]; });
      if (previousFocus?.isConnected) previousFocus.focus();
    };
  }, [onClose]);

  // Poll the deposit until Safaricom confirms, fails or we give up waiting.
  const depositId = deposit?.depositId;

  useEffect(() => {
    if (stage !== "waiting" || !depositId) return;
    let cancelled = false;

    const tick = async () => {
      try {
        const next = await financeApi.mpesaDepositStatus(depositId);
        if (cancelled) return;
        setDeposit(next);
        if (next.status === "COMPLETED") {
          setStage("success");
          onFinished();
          return;
        }
        if (["FAILED", "CANCELLED", "REJECTED"].includes(next.status)) {
          setStage("failed");
          setError(next.message);
          onFinished();
          return;
        }
      } catch {
        // Network blip: keep waiting.
      }

      if (cancelled) return;
      if (Date.now() - startedAtRef.current > POLL_TIMEOUT_MS) {
        setTimedOut(true);
        return;
      }
      pollRef.current = window.setTimeout(tick, POLL_INTERVAL_MS);
    };

    pollRef.current = window.setTimeout(tick, POLL_INTERVAL_MS);
    return () => {
      cancelled = true;
      if (pollRef.current) window.clearTimeout(pollRef.current);
    };
  }, [stage, depositId, onFinished]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    const value = Math.round(Number(amount));
    if (!value || value < minAmount) {
      setError(`The minimum deposit is KES ${minAmount.toLocaleString("en-KE")}.`);
      return;
    }
    if (value > maxAmount) {
      setError(`The maximum deposit is KES ${maxAmount.toLocaleString("en-KE")}.`);
      return;
    }

    setSubmitting(true);
    try {
      const started = await financeApi.startMpesaDeposit(phone, value);
      startedAtRef.current = Date.now();
      setDeposit(started);
      setTimedOut(false);
      setStage("waiting");
      onFinished();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not start the M-Pesa payment.");
    } finally {
      setSubmitting(false);
    }
  }

  const amountText = deposit
    ? `KES ${deposit.amount.toLocaleString("en-KE")}`
    : `KES ${Number(amount || 0).toLocaleString("en-KE")}`;

  return createPortal(
    <div ref={modalRef} className="fin fin-modal" role="dialog" aria-modal="true" aria-label="Deposit with M-Pesa" onClick={onClose}>
      <div ref={panelRef} className="fin-modal-panel" onClick={(event) => event.stopPropagation()}>
        <div className="fin-modal-head">
          <div className="fin-modal-brand">
            <span className="fin-mpesa-badge"><MpesaLogo /></span>
            <div>
              <strong>Deposit with M-Pesa</strong>
              <small>Pay from your Safaricom line</small>
            </div>
          </div>
          <button type="button" className="fin-icon-btn" onClick={onClose} aria-label="Close">
            <X size={18} />
          </button>
        </div>

        {stage === "form" && (
          <form className="fin-form" onSubmit={handleSubmit}>
            <label htmlFor="mpesa-phone">M-Pesa phone number</label>
            <div className="fin-amount">
              <span><Smartphone size={15} aria-hidden="true" /></span>
              <input
                id="mpesa-phone"
                className="fin-input"
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                placeholder="0712 345 678"
                value={phone}
                onChange={(event) => setPhone(event.target.value)}
                required
              />
            </div>

            <label htmlFor="mpesa-amount">Amount (KES)</label>
            <div className="fin-amount">
              <span>KES</span>
              <input
                id="mpesa-amount"
                className="fin-input fin-input-kes"
                type="number"
                inputMode="numeric"
                min={minAmount}
                max={maxAmount}
                step={1}
                value={amount}
                onChange={(event) => setAmount(event.target.value)}
                required
              />
            </div>

            <div className="fin-quick">
              {QUICK_AMOUNTS.map((value) => (
                <button
                  key={value}
                  type="button"
                  className={Number(amount) === value ? "is-active" : ""}
                  onClick={() => setAmount(String(value))}
                >
                  {value.toLocaleString("en-KE")}
                </button>
              ))}
            </div>

            {error && (
              <p className="fin-error" role="alert">
                <CircleAlert size={16} aria-hidden="true" />
                {error}
              </p>
            )}

            <button type="submit" className="fin-btn fin-btn-green fin-btn-block" disabled={submitting}>
              {submitting ? (
                <>
                  <LoaderCircle size={17} className="fin-spin" aria-hidden="true" />
                  Sending request…
                </>
              ) : (
                <>Pay {amountText}</>
              )}
            </button>

            <p className="fin-note">
              <Lock size={14} aria-hidden="true" />
              You'll get a prompt on your phone. Enter your M-Pesa PIN to confirm. NeuroOption never asks for your PIN.
            </p>
          </form>
        )}

        {stage === "waiting" && (
          <div className="fin-stk-state">
            <span className="fin-stk-icon is-waiting">
              <Smartphone size={30} aria-hidden="true" />
            </span>
            <h3>Check your phone</h3>
            <p>
              We sent an M-Pesa request for <strong>{amountText}</strong> to{" "}
              <strong>{deposit?.phone ? `+${deposit.phone}` : "your phone"}</strong>. Enter your PIN to complete the deposit.
            </p>
            <div className="fin-stk-progress" aria-live="polite">
              <LoaderCircle size={16} className="fin-spin" aria-hidden="true" />
              {timedOut
                ? "Still waiting for confirmation. You can close this window; your balance updates automatically once M-Pesa confirms."
                : deposit?.message || "Waiting for confirmation…"}
            </div>
            <button type="button" className="fin-btn fin-btn-ghost fin-btn-block" onClick={onClose}>
              Close
            </button>
          </div>
        )}

        {stage === "success" && (
          <div className="fin-stk-state">
            <span className="fin-stk-icon is-success">
              <CircleCheck size={30} aria-hidden="true" />
            </span>
            <h3>Deposit received</h3>
            <p>
              <strong>{amountText}</strong> has been added to your real account.
              {deposit?.receipt && (
                <>
                  <br />
                  M-Pesa receipt: <strong>{deposit.receipt}</strong>
                </>
              )}
            </p>
            <button type="button" className="fin-btn fin-btn-blue fin-btn-block" onClick={onClose}>
              Done
            </button>
          </div>
        )}

        {stage === "failed" && (
          <div className="fin-stk-state">
            <span className="fin-stk-icon is-failed">
              <CircleAlert size={30} aria-hidden="true" />
            </span>
            <h3>Payment not completed</h3>
            <p>{error || "The M-Pesa payment was not completed. No money was taken."}</p>
            <button
              type="button"
              className="fin-btn fin-btn-green fin-btn-block"
              onClick={() => {
                setStage("form");
                setError("");
                setDeposit(null);
              }}
            >
              Try again
            </button>
          </div>
        )}
      </div>
    </div>,
    document.body,
  );
}
