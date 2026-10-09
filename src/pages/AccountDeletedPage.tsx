import { Link, useLocation } from "react-router-dom";
import { CircleCheck } from "lucide-react";
import Logo from "../components/branding/Logo";
import "./DeleteAccountPage.css";

type DeletedState = { reference?: string; emailSent?: boolean; emailDelivery?: "queued"; emailHint?: string; deletedAt?: string } | null;

/** Public (the person is signed out by now): confirms the deletion and what happens next. */
export default function AccountDeletedPage() {
  const state = useLocation().state as DeletedState;
  const emailSent = state?.emailSent === true;

  return (
    <main className="da-done">
      <Logo className="da-logo" />
      <div className="da-done-icon"><CircleCheck size={34} aria-hidden="true" /></div>
      <h1>Your account has been deleted</h1>
      <p>You have been signed out and can no longer sign in with this account.</p>

      {state?.reference && (
        <p>
          Your reference<br />
          <strong className="da-ref">{state.reference}</strong>
        </p>
      )}

      {state?.emailDelivery === "queued" ? (
        <p role="status">
          Your confirmation email is queued{state.emailHint ? <> to <strong>{state.emailHint}</strong></> : ""}.
          It includes your reference, deletion date, selected reason, access changes, retained records and Support details.
          Check your spam folder if it does not arrive.
        </p>
      ) : emailSent ? (
        <p>
          We've emailed the details of the deletion{state?.emailHint ? <> to <strong>{state.emailHint}</strong></> : ""}: what was removed,
          what we keep and why, and how to reach us if this wasn't you.
        </p>
      ) : state ? (
        <p className="da-warn" role="status">
          Your account is deleted, but we couldn't send the confirmation email just now.
          Please keep your reference{state.reference ? ` (${state.reference})` : ""} and contact Support if you need the details.
        </p>
      ) : null}

      {state?.deletedAt && <p>Deleted on {new Date(state.deletedAt).toLocaleString()}.</p>}
      <p>Historical records may be retained separately. Contact Support about retention periods or further erasure requests.</p>
      <p>If you didn't ask for this, contact Support straight away and quote your reference.</p>

      <div className="da-done-actions">
        <Link to="/" className="da-btn da-btn-ghost">Go to the home page</Link>
        <Link to="/help" className="da-btn da-btn-ghost">Contact Support</Link>
      </div>
    </main>
  );
}
