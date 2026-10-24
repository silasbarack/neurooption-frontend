import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { CircleAlert, CircleCheck, LoaderCircle } from "lucide-react";
import Logo from "../components/branding/Logo";
import { api } from "../api/api";
import "./DeleteAccountPage.css";

/** Public: the one-click unsubscribe link from newsletter emails lands here. */
export default function NewsletterUnsubscribePage() {
  const [params] = useSearchParams();
  const token = params.get("token") ?? "";
  const [state, setState] = useState<"busy" | "done" | "error">(token ? "busy" : "error");
  const [message, setMessage] = useState(token ? "" : "This unsubscribe link is missing its code.");

  useEffect(() => {
    if (!token) return;
    let active = true;
    api.post<{ message: string }>("/newsletter/unsubscribe", { token }, false)
      .then((r) => { if (active) { setState("done"); setMessage(r.message); } })
      .catch((err) => { if (active) { setState("error"); setMessage(err instanceof Error ? err.message : "Could not unsubscribe right now."); } });
    return () => { active = false; };
  }, [token]);

  return (
    <main className="da-done">
      <Link to="/" aria-label="NeuroOption home"><Logo className="da-logo" /></Link>
      {state === "busy" && <p role="status"><LoaderCircle size={18} className="da-spin" aria-hidden="true" /> Updating your preferences…</p>}
      {state === "done" && (
        <>
          <div className="da-done-icon"><CircleCheck size={34} aria-hidden="true" /></div>
          <h1>You're unsubscribed</h1>
          <p>{message} You can subscribe again any time from the bottom of our homepage.</p>
        </>
      )}
      {state === "error" && (
        <>
          <h1>We couldn't unsubscribe you</h1>
          <p className="da-warn" role="alert"><CircleAlert size={16} aria-hidden="true" /> {message}</p>
        </>
      )}
      <div className="da-done-actions"><Link to="/" className="da-btn da-btn-ghost">Go to the home page</Link></div>
    </main>
  );
}
