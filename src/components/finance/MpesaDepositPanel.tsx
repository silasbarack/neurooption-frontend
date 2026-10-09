import { useEffect, useRef, useState } from "react";
import type { FormEvent } from "react";
import { ArrowLeft, CircleAlert, CircleCheck, LoaderCircle, Lock, Smartphone } from "lucide-react";
import { financeApi, type StkDeposit } from "../../api";
import PaymentLogo from "./PaymentLogo";

type MpesaDepositPanelProps = {
  minAmount: number;
  maxAmount: number;
  /** The phone saved on the account, offered as the starting value. */
  defaultPhone?: string | null;
  onBack: () => void;
  /** Called whenever the deposit state changes so balances can refresh. */
  onFinished: () => void;
};

type Stage = "form" | "waiting" | "success" | "failed";

const QUICK_CANDIDATES = [500, 1000, 2500, 5000, 10000, 20000];
const POLL_INTERVAL_MS = 4000;
const POLL_TIMEOUT_MS = 120_000;

const kes = (value: number) => value.toLocaleString("en-KE");

/** Quick-pick amounts that fit the allowed range (at most four). */
function quickAmounts(min: number, max: number) {
  const fits = QUICK_CANDIDATES.filter((value) => value >= min && value <= max).slice(0, 4);
  return fits.length ? fits : [min];
}

/** M-Pesa (STK Push) deposit, shown in the page rather than in a dialog. */
export default function MpesaDepositPanel({ minAmount, maxAmount, defaultPhone, onBack, onFinished }: MpesaDepositPanelProps) {
  const quick = quickAmounts(minAmount, maxAmount);
  const [phone, setPhone] = useState(defaultPhone ?? "");
  const [amount, setAmount] = useState(String(quick.includes(1000) ? 1000 : quick[0]));
  const [stage, setStage] = useState<Stage>("form");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [deposit, setDeposit] = useState<StkDeposit | null>(null);
  const [timedOut, setTimedOut] = useState(false);
  const pollRef = useRef<number | null>(null);
  const startedAtRef = useRef(0);
  const phoneTouchedRef = useRef(false);
  const backRef = useRef<HTMLButtonElement>(null);

  // The account may finish loading after this opens; fill the phone in only
  // if the person has not started typing one.
  useEffect(() => {
    if (defaultPhone && !phoneTouchedRef.current) setPhone(defaultPhone);
  }, [defaultPhone]);

  useEffect(() => {
    backRef.current?.focus({ preventScroll: true });
  }, []);

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
      setError(`The minimum deposit is KES ${kes(minAmount)}.`);
      return;
    }
    if (value > maxAmount) {
      setError(`The maximum deposit is KES ${kes(maxAmount)}.`);
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

  const amountText = deposit ? `KES ${kes(deposit.amount)}` : `KES ${kes(Number(amount || 0))}`;

  return (
    <div className="fin-topup fin-detail">
      <button ref={backRef} type="button" className="fin-back" onClick={onBack}>
        <span className="fin-back-icon"><ArrowLeft size={22} aria-hidden="true" /></span>
        Back
      </button>

      <div className="fin-detail-head">
        <span className="fin-detail-logo"><PaymentLogo brand="mpesa" label="M-Pesa" /></span>
        <div className="fin-detail-info">
          <h2>M-Pesa</h2>
          <p>Commission: 0%</p>
          <p>Minimum deposit amount: {kes(minAmount)} KES</p>
          <p>Max. amount per transaction: {kes(maxAmount)} KES</p>
          <p>Processing time: instant, once you confirm on your phone</p>
        </div>
      </div>

      {stage === "form" && (
        <form className="fin-detail-form" onSubmit={handleSubmit}>
          <label htmlFor="mpesa-amount">Amount:</label>
          <div className="fin-field">
            <input
              id="mpesa-amount"
              type="number"
              inputMode="numeric"
              min={minAmount}
              max={maxAmount}
              step={1}
              value={amount}
              onChange={(event) => setAmount(event.target.value)}
              required
            />
            <span className="fin-field-suffix" aria-hidden="true">KES</span>
          </div>

          <div className="fin-chips" role="group" aria-label="Quick amounts">
            {quick.map((value) => (
              <button
                key={value}
                type="button"
                className={Number(amount) === value ? "is-active" : ""}
                aria-pressed={Number(amount) === value}
                onClick={() => setAmount(String(value))}
              >
                {kes(value)} KES
              </button>
            ))}
          </div>

          <label htmlFor="mpesa-phone">Phone:</label>
          <div className="fin-field">
            <input
              id="mpesa-phone"
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              placeholder="0712 345 678"
              value={phone}
              onChange={(event) => {
                phoneTouchedRef.current = true;
                setPhone(event.target.value);
              }}
              required
            />
          </div>

          {error && (
            <p className="fin-error" role="alert">
              <CircleAlert size={16} aria-hidden="true" />
              {error}
            </p>
          )}

          <button type="submit" className="fin-pay-btn" disabled={submitting}>
            {submitting ? (
              <>
                <LoaderCircle size={18} className="fin-spin" aria-hidden="true" />
                Sending request…
              </>
            ) : (
              <>Deposit {amountText}</>
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
              ? "Still waiting for confirmation. You can go back; your balance updates automatically once M-Pesa confirms."
              : deposit?.message || "Waiting for confirmation…"}
          </div>
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
          <button type="button" className="fin-pay-btn" onClick={onBack}>
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
            className="fin-pay-btn"
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
  );
}
