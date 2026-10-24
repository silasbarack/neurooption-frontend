import { useCallback, useEffect, useRef, useState, type FormEvent } from "react";
import { useSearchParams } from "react-router-dom";
import { ArrowLeft, CircleAlert, Headset, LoaderCircle, MessageSquarePlus, Send } from "lucide-react";
import { api } from "../api/api";
import "./SupportPage.css";

type Message = { id: string; senderRole: "USER" | "SUPPORT" | "ADMIN"; message: string; createdAt: string };
type TicketSummary = { id: string; subject: string; status: string; updatedAt: string; messages: number; lastMessage: Message | null };
type Ticket = { id: string; subject: string; status: string; createdAt: string; updatedAt: string; messages: Message[] };

const STATUS_TEXT: Record<string, string> = {
  OPEN: "Open",
  PENDING_SUPPORT: "Waiting for support",
  PENDING_USER: "Support replied",
  CLOSED: "Closed",
};

const when = (value: string) =>
  new Intl.DateTimeFormat("en-KE", { dateStyle: "medium", timeStyle: "short", timeZone: "Africa/Nairobi" }).format(new Date(value));

/** The signed-in client's support tickets: start one, read replies and answer. */
export default function SupportPage() {
  const [params, setParams] = useSearchParams();
  const openId = params.get("ticket");
  const [tickets, setTickets] = useState<TicketSummary[] | null>(null);
  const [listError, setListError] = useState("");
  const [creating, setCreating] = useState(false);

  const loadList = useCallback(() => {
    api.get<TicketSummary[]>("/support/tickets")
      .then((data) => { setTickets(data); setListError(""); })
      .catch((err) => setListError(err instanceof Error ? err.message : "Could not load your tickets."));
  }, []);

  useEffect(() => { loadList(); }, [loadList]);

  const open = (id: string | null) => {
    setCreating(false);
    setParams(id ? { ticket: id } : {}, { replace: false });
  };

  return (
    <main className="sp">
      <header className="sp-head">
        <div>
          <p className="sp-eyebrow">Help &amp; support</p>
          <h1>Support tickets</h1>
          <p>Ask a question or report a problem. Our team replies here and by email.</p>
        </div>
        <button type="button" className="sp-btn sp-btn-primary" onClick={() => { setCreating(true); setParams({}); }}>
          <MessageSquarePlus size={17} aria-hidden="true" /> New ticket
        </button>
      </header>

      <div className={`sp-layout ${openId || creating ? "has-detail" : ""}`}>
        <section className="sp-list" aria-label="Your tickets">
          {listError && <p className="sp-alert" role="alert"><CircleAlert size={16} /> {listError}</p>}
          {!tickets && !listError && <p className="sp-muted sp-pad"><LoaderCircle size={16} className="sp-spin" /> Loading…</p>}
          {tickets?.length === 0 && (
            <div className="sp-empty">
              <Headset size={30} aria-hidden="true" />
              <p>No tickets yet. Start one and we'll get back to you.</p>
            </div>
          )}
          {tickets?.map((t) => (
            <button key={t.id} type="button" className={`sp-item ${openId === t.id ? "is-active" : ""}`} onClick={() => open(t.id)}>
              <span className="sp-item-top"><b>{t.subject}</b><span className={`sp-status s-${t.status.toLowerCase()}`}>{STATUS_TEXT[t.status] ?? t.status}</span></span>
              {t.lastMessage && <span className="sp-item-preview">{t.lastMessage.senderRole === "USER" ? "You: " : "Support: "}{t.lastMessage.message}</span>}
              <small>{when(t.updatedAt)} · {t.messages} message{t.messages === 1 ? "" : "s"}</small>
            </button>
          ))}
        </section>

        <section className="sp-detail" aria-live="polite">
          {creating ? (
            <NewTicket onBack={() => setCreating(false)} onCreated={(id) => { loadList(); open(id); }} />
          ) : openId ? (
            <Conversation key={openId} id={openId} onBack={() => open(null)} onChanged={loadList} />
          ) : (
            <div className="sp-empty sp-placeholder"><Headset size={34} aria-hidden="true" /><p>Choose a ticket to read the conversation, or start a new one.</p></div>
          )}
        </section>
      </div>
    </main>
  );
}

function NewTicket({ onBack, onCreated }: { onBack: () => void; onCreated: (id: string) => void }) {
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function submit(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError("");
    try {
      const ticket = await api.post<Ticket>("/support/tickets", { subject: subject.trim(), message: message.trim() });
      onCreated(ticket.id);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not send your ticket.");
      setBusy(false);
    }
  }

  return (
    <form className="sp-form" onSubmit={submit}>
      <button type="button" className="sp-back" onClick={onBack}><ArrowLeft size={16} /> Back</button>
      <h2>New support ticket</h2>
      <label>Subject<input value={subject} onChange={(e) => setSubject(e.target.value)} maxLength={120} required minLength={3} placeholder="e.g. My deposit is not showing" /></label>
      <label>How can we help?<textarea value={message} onChange={(e) => setMessage(e.target.value)} maxLength={4000} rows={6} required placeholder="Describe what happened. Include any M-Pesa receipt or trade ID, but never your PIN or password." /></label>
      {error && <p className="sp-alert" role="alert"><CircleAlert size={16} /> {error}</p>}
      <button type="submit" className="sp-btn sp-btn-primary" disabled={busy || subject.trim().length < 3 || message.trim().length < 2}>
        {busy ? "Sending…" : <>Send ticket <Send size={16} aria-hidden="true" /></>}
      </button>
    </form>
  );
}

function Conversation({ id, onBack, onChanged }: { id: string; onBack: () => void; onChanged: () => void }) {
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [error, setError] = useState("");
  const [reply, setReply] = useState("");
  const [busy, setBusy] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let active = true;
    const load = () => api.get<Ticket>(`/support/tickets/${encodeURIComponent(id)}`)
      .then((data) => { if (active) { setTicket(data); setError(""); } })
      .catch((err) => { if (active) setError(err instanceof Error ? err.message : "Could not load this ticket."); });
    void load();
    const timer = window.setInterval(load, 20000);
    return () => { active = false; window.clearInterval(timer); };
  }, [id]);

  useEffect(() => { endRef.current?.scrollIntoView({ block: "end" }); }, [ticket?.messages.length]);

  async function send(event: FormEvent) {
    event.preventDefault();
    if (!reply.trim()) return;
    setBusy(true);
    setError("");
    try {
      setTicket(await api.post<Ticket>(`/support/tickets/${encodeURIComponent(id)}/messages`, { message: reply.trim() }));
      setReply("");
      onChanged();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not send your message.");
    } finally {
      setBusy(false);
    }
  }

  if (!ticket) {
    return error ? <p className="sp-alert" role="alert"><CircleAlert size={16} /> {error}</p> : <p className="sp-muted sp-pad"><LoaderCircle size={16} className="sp-spin" /> Loading…</p>;
  }

  return (
    <div className="sp-convo">
      <div className="sp-convo-head">
        <button type="button" className="sp-back" onClick={onBack}><ArrowLeft size={16} /> All tickets</button>
        <h2>{ticket.subject}</h2>
        <span className={`sp-status s-${ticket.status.toLowerCase()}`}>{STATUS_TEXT[ticket.status] ?? ticket.status}</span>
      </div>
      <div className="sp-thread">
        {ticket.messages.map((m) => (
          <div key={m.id} className={`sp-msg ${m.senderRole === "USER" ? "is-me" : "is-staff"}`}>
            <small>{m.senderRole === "USER" ? "You" : "NeuroOption Support"} · {when(m.createdAt)}</small>
            <p>{m.message}</p>
          </div>
        ))}
        <div ref={endRef} />
      </div>
      <form className="sp-reply" onSubmit={send}>
        <label htmlFor="sp-reply" className="sp-sr-only">Your reply</label>
        <textarea id="sp-reply" rows={2} maxLength={4000} value={reply} onChange={(e) => setReply(e.target.value)} placeholder={ticket.status === "CLOSED" ? "Write to reopen this ticket…" : "Write a reply…"} />
        <button type="submit" className="sp-btn sp-btn-primary" disabled={busy || !reply.trim()} aria-label="Send reply"><Send size={17} /></button>
      </form>
      {error && <p className="sp-alert" role="alert"><CircleAlert size={16} /> {error}</p>}
    </div>
  );
}
