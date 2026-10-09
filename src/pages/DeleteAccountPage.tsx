import { useEffect, useRef, useState } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, CircleAlert, LoaderCircle, ShieldAlert, TriangleAlert } from "lucide-react";
import { ApiError } from "../api/api";
import { accountApi, type DeletionBlocker, type DeletionCheck } from "../api";
import { logout } from "../utils/storage";
import "./DeleteAccountPage.css";

type Step = "intro" | "reason" | "confirm";

const STEPS: Step[] = ["intro", "reason", "confirm"];
const COMMENT_LIMIT = 500;

const WHAT_HAPPENS = [
  "You are signed out everywhere straight away and cannot sign in again.",
  "Your name, email address, phone number and password are removed from the active profile.",
  "This cannot be undone. Nobody, including Support, can bring the account back.",
  "Historical trading, payment, affiliate, KYC, support and security records may be retained. Contact Support about retention periods or further erasure requests.",
  "You can open a new account with the same email later. It starts fresh, without your old balances or history.",
];

type BlockedBody = { code?: string; blockers?: DeletionBlocker[] };

export default function DeleteAccountPage() {
  const navigate = useNavigate();
  const headingRef = useRef<HTMLHeadingElement>(null);

  const [check, setCheck] = useState<DeletionCheck | null>(null);
  const [loadError, setLoadError] = useState("");
  const [step, setStep] = useState<Step>("intro");
  const [reason, setReason] = useState("");
  const [comment, setComment] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let active = true;
    accountApi
      .deletionCheck()
      .then((data) => {
        if (active) setCheck(data);
      })
      .catch((err) => {
        if (active) setLoadError(err instanceof Error ? err.message : "Could not load the deletion options.");
      });
    return () => {
      active = false;
    };
  }, [attempt]);

  function retryLoad() {
    setLoadError("");
    setAttempt((count) => count + 1);
  }

  // Move focus to the new step's heading so keyboard and screen-reader users land on it.
  useEffect(() => {
    headingRef.current?.focus({ preventScroll: true });
  }, [step, check]);

  const word = check?.confirmationWord ?? "DELETE";
  const typedOk = confirmation === word;
  const stepIndex = STEPS.indexOf(step);
  const blocked = check ? !check.canDelete : false;

  async function handleDelete(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!typedOk || !password || submitting) return;

    setSubmitting(true);
    setError("");
    try {
      const result = await accountApi.deleteAccount({
        password,
        confirmation,
        reason: reason || undefined,
        comment: comment.trim() || undefined,
      });
      // The account is closed: drop the session, then show the result on a
      // public page (this one needs a signed-in user).
      setPassword("");
      logout();
      navigate("/account-deleted", {
        replace: true,
        state: { reference: result.reference, emailSent: result.emailSent, emailDelivery: result.emailDelivery, emailHint: result.emailHint, deletedAt: result.deletedAt },
      });
    } catch (err) {
      if (err instanceof ApiError && err.status === 409) {
        const body = err.body as BlockedBody | null;
        if (body?.code === "ACCOUNT_DELETION_BLOCKED" && body.blockers) {
          // Something changed since the page loaded (a deposit, a trade): show it.
          setCheck((current) => (current ? { ...current, canDelete: false, blockers: body.blockers! } : current));
          setStep("intro");
          setPassword("");
          setConfirmation("");
          return;
        }
      }
      setError(err instanceof Error ? err.message : "Could not delete the account. Please try again.");
      setPassword("");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="da">
      <Link to="/profile" className="da-back" aria-disabled={submitting} onClick={(event) => { if (submitting) event.preventDefault(); }}>
        <span className="da-back-icon"><ArrowLeft size={20} aria-hidden="true" /></span>
        Back to profile
      </Link>

      {!check && !loadError && (
        <p className="da-loading" role="status">
          <LoaderCircle size={18} className="da-spin" aria-hidden="true" /> Loading…
        </p>
      )}

      {loadError && (
        <div className="da-banner" role="alert">
          <CircleAlert size={18} aria-hidden="true" />
          <span>{loadError}</span>
          <button type="button" onClick={retryLoad}>Try again</button>
        </div>
      )}

      {check && (
        <>
          <ol className="da-steps" aria-label="Progress">
            {STEPS.map((item, index) => (
              <li key={item} className={index === stepIndex ? "is-current" : index < stepIndex ? "is-done" : ""} aria-current={index === stepIndex ? "step" : undefined}>
                <span>{index + 1}</span>
                {item === "intro" ? "Before you go" : item === "reason" ? "Your reason" : "Confirm"}
              </li>
            ))}
          </ol>

          {step === "intro" && (
            <section className="da-card">
              <h1 ref={headingRef} tabIndex={-1}>Delete your NeuroOption account</h1>
              <p className="da-lead">Please read this first. Deleting your account is permanent.</p>

              {blocked && (
                <div className="da-blockers" role="alert">
                  <h2><TriangleAlert size={18} aria-hidden="true" /> Sort these out first</h2>
                  <p>We can't delete the account while any of this is still open, so nothing is lost:</p>
                  <ul>
                    {check.blockers.map((blocker) => (
                      <li key={blocker.code}>
                        <span>{blocker.message}</span>
                        {blocker.action && <Link to={blocker.action.path}>{blocker.action.label}</Link>}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <h2 className="da-sub">What happens when you delete</h2>
              <ul className="da-list">
                {WHAT_HAPPENS.map((text) => <li key={text}>{text}</li>)}
              </ul>
              <p className="da-note">A detailed confirmation email will be queued to {check.emailHint}. Deletion does not transfer or withdraw funds.</p>

              <div className="da-actions">
                <Link to="/profile" className="da-btn da-btn-ghost">Keep my account</Link>
                <button type="button" className="da-btn da-btn-danger" disabled={blocked} onClick={() => setStep("reason")}>
                  Continue
                </button>
              </div>
            </section>
          )}

          {step === "reason" && (
            <section className="da-card">
              <h1 ref={headingRef} tabIndex={-1}>Why are you leaving?</h1>
              <p className="da-lead">Optional, but it helps us improve. Pick the closest match.</p>

              <fieldset className="da-reasons">
                <legend className="da-sr-only">Reason for leaving</legend>
                {check.reasons.map((item) => (
                  <label key={item.code} className={reason === item.code ? "is-selected" : ""}>
                    <input type="radio" name="reason" value={item.code} checked={reason === item.code} onChange={() => setReason(item.code)} />
                    <span>{item.label}</span>
                  </label>
                ))}
              </fieldset>

              <label className="da-label" htmlFor="da-comment">Anything you'd like to add? (optional)</label>
              <textarea
                id="da-comment"
                className="da-textarea"
                rows={3}
                maxLength={COMMENT_LIMIT}
                value={comment}
                onChange={(event) => setComment(event.target.value)}
              />
              <small className="da-count">{comment.length}/{COMMENT_LIMIT}</small>
              <p className="da-note">Do not include passwords, verification codes or payment details.</p>

              <div className="da-actions">
                <button type="button" className="da-btn da-btn-ghost" onClick={() => setStep("intro")}>Back</button>
                <button type="button" className="da-btn da-btn-danger" onClick={() => setStep("confirm")}>
                  {reason ? "Continue" : "Skip and continue"}
                </button>
              </div>
            </section>
          )}

          {step === "confirm" && (
            <form className="da-card" onSubmit={handleDelete} noValidate>
              <h1 ref={headingRef} tabIndex={-1}>Confirm deletion</h1>
              <p className="da-lead">
                <ShieldAlert size={18} aria-hidden="true" /> This permanently deletes the account for {check.emailHint}.
              </p>

              <label className="da-label" htmlFor="da-confirm">
                Type <strong>{word}</strong> to confirm
              </label>
              <input
                id="da-confirm"
                className="da-input"
                type="text"
                autoComplete="off"
                autoCapitalize="off"
                spellCheck={false}
                placeholder={word}
                disabled={submitting}
                value={confirmation}
                onChange={(event) => setConfirmation(event.target.value)}
                aria-invalid={confirmation.length > 0 && !typedOk}
              />

              <label className="da-label" htmlFor="da-password">Your password</label>
              <input
                id="da-password"
                className="da-input"
                type="password"
                autoComplete="current-password"
                maxLength={200}
                disabled={submitting}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
              />

              <p className="da-note">Forgot your password? <Link to="/forgot-password">Reset it</Link>, then sign in again before deleting.</p>

              {error && (
                <p className="da-error" role="alert">
                  <CircleAlert size={16} aria-hidden="true" /> {error}
                </p>
              )}

              <div className="da-actions">
                <button type="button" className="da-btn da-btn-ghost" onClick={() => setStep("reason")} disabled={submitting}>Back</button>
                <button type="submit" className="da-btn da-btn-danger" disabled={!typedOk || !password || submitting}>
                  {submitting ? (
                    <>
                      <LoaderCircle size={17} className="da-spin" aria-hidden="true" /> Deleting…
                    </>
                  ) : (
                    "Permanently delete my account"
                  )}
                </button>
              </div>
            </form>
          )}
        </>
      )}
    </div>
  );
}
