import { useState } from "react";
import type { FormEvent } from "react";
import { Eye, EyeOff, Plus, Trash2 } from "lucide-react";
import { kenyaDate, label, useAdminAction, useAdminQuery, useSession } from "./api";
import { Alert, Badge, Drawer, Empty, Loading, PageHeader, Panel, Person, RefreshButton } from "./ui";

type Member = { id: string; fullName: string; email: string; phone: string | null; role: string; isActive: boolean; createdAt: string };

const ROLES: { value: string; text: string; scope: string }[] = [
  { value: "SUPER_ADMIN", text: "Super Administrator", scope: "Everything, including the team" },
  { value: "COMPLIANCE_ADMIN", text: "Compliance", scope: "Clients, KYC, payments, trading, audit log" },
  { value: "RISK_ADMIN", text: "Risk", scope: "Clients (can suspend/lock), trading" },
  { value: "FINANCE_ADMIN", text: "Finance", scope: "Clients, payments, trading" },
  { value: "KYC_ADMIN", text: "KYC", scope: "Clients, identity verification" },
  { value: "SUPPORT_ADMIN", text: "Support", scope: "Clients, support tickets" },
];

export default function TeamView() {
  const { admin } = useSession();
  const act = useAdminAction();
  const { data, error, loading, reload } = useAdminQuery<Member[]>("/admin");
  const [adding, setAdding] = useState(false);
  const [editing, setEditing] = useState<Member | null>(null);

  return (
    <>
      <PageHeader
        eyebrow="ADMINISTRATION"
        title="Team & roles"
        subtitle="Invite administrators and give each the narrowest role they need. Every change is recorded in the audit log."
        actions={<><RefreshButton onClick={reload} loading={loading} /><button type="button" className="nx-btn nx-btn-primary" onClick={() => setAdding(true)}><Plus size={16} /> Add administrator</button></>}
      />
      {error && <Alert onRetry={reload}>{error}</Alert>}
      <Panel>
        <div className="nx-table-wrap">
          <table className="nx-table">
            <thead><tr><th>Administrator</th><th>Role</th><th>Access</th><th>Status</th><th>Added (EAT)</th></tr></thead>
            <tbody>
              {data?.map((m) => (
                <tr key={m.id} className="is-clickable" tabIndex={0} onClick={() => setEditing(m)} onKeyDown={(e) => { if (e.key === "Enter") setEditing(m); }}>
                  <td><Person name={m.fullName + (m.id === admin.id ? " (you)" : "")} email={m.email} /></td>
                  <td><strong>{ROLES.find((r) => r.value === m.role)?.text ?? label(m.role)}</strong></td>
                  <td className="nx-wrap nx-muted">{ROLES.find((r) => r.value === m.role)?.scope}</td>
                  <td><Badge value={m.isActive ? "ACTIVE" : "Disabled"} tone={m.isActive ? "good" : "muted"} /></td>
                  <td>{kenyaDate(m.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {data && data.length === 0 && <Empty>No administrators.</Empty>}
          {!data && !error && <Loading>Loading team…</Loading>}
        </div>
      </Panel>
      <Panel title="Role permissions" subtitle="What each role can open in this console">
        <ul className="nx-roles">
          {ROLES.map((r) => <li key={r.value}><strong>{r.text}</strong><span>{r.scope}</span></li>)}
        </ul>
      </Panel>
      {adding && <AddMember onClose={() => setAdding(false)} onDone={() => { setAdding(false); reload(); }} act={act} />}
      {editing && <EditMember member={editing} self={editing.id === admin.id} onClose={() => setEditing(null)} onDone={() => { setEditing(null); reload(); }} act={act} />}
    </>
  );
}

type Act = ReturnType<typeof useAdminAction>;

function AddMember({ onClose, onDone, act }: { onClose: () => void; onDone: () => void; act: Act }) {
  const [form, setForm] = useState({ fullName: "", email: "", password: "", role: "SUPPORT_ADMIN" });
  const [show, setShow] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const set = (key: keyof typeof form) => (e: { target: { value: string } }) => setForm((f) => ({ ...f, [key]: e.target.value }));

  async function submit(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError("");
    try {
      await act("/admin", "POST", { ...form, email: form.email.trim() });
      onDone();
    } catch (err) {
      setError((err as Error).message);
      setBusy(false);
    }
  }

  return (
    <Drawer title="Add administrator" onClose={onClose}>
      <form className="nx-form" onSubmit={submit}>
        <label>Full name<input required minLength={3} maxLength={100} value={form.fullName} onChange={set("fullName")} autoComplete="off" /></label>
        <label>Email<input type="email" required value={form.email} onChange={set("email")} autoComplete="off" /></label>
        <label>Temporary password
          <span className="nx-password"><input type={show ? "text" : "password"} required minLength={14} maxLength={128} value={form.password} onChange={set("password")} autoComplete="new-password" />
            <button type="button" onClick={() => setShow(!show)} aria-label={show ? "Hide password" : "Show password"}>{show ? <EyeOff size={16} /> : <Eye size={16} />}</button></span>
          <small>14+ characters with upper- and lowercase letters, a number and a symbol. Share it privately; they can't change it yet, so use a strong one.</small>
        </label>
        <label>Role
          <select value={form.role} onChange={set("role")}>{ROLES.map((r) => <option key={r.value} value={r.value}>{r.text}</option>)}</select>
          <small>{ROLES.find((r) => r.value === form.role)?.scope}</small>
        </label>
        {error && <p className="nx-error">{error}</p>}
        <div className="nx-row-end">
          <button type="button" className="nx-btn nx-btn-ghost" onClick={onClose}>Cancel</button>
          <button type="submit" className="nx-btn nx-btn-primary" disabled={busy}>{busy ? "Adding…" : "Add administrator"}</button>
        </div>
      </form>
    </Drawer>
  );
}

function EditMember({ member, self, onClose, onDone, act }: { member: Member; self: boolean; onClose: () => void; onDone: () => void; act: Act }) {
  const [role, setRole] = useState(member.role);
  const [confirmRemove, setConfirmRemove] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function run(path: string, method: "PATCH" | "DELETE", body?: unknown) {
    setBusy(true);
    setError("");
    try {
      await act(path, method, body);
      onDone();
    } catch (err) {
      setError((err as Error).message);
      setBusy(false);
    }
  }

  return (
    <Drawer title="Administrator" onClose={onClose}>
      <div className="nx-profile-head"><Person name={member.fullName} email={member.email} /><Badge value={member.isActive ? "ACTIVE" : "Disabled"} tone={member.isActive ? "good" : "muted"} /></div>
      {self && <p className="nx-muted">This is your own account. You can't change your own role, disable or remove yourself.</p>}
      <div className="nx-form">
        <label>Role
          <select value={role} disabled={self || busy} onChange={(e) => setRole(e.target.value)}>{ROLES.map((r) => <option key={r.value} value={r.value}>{r.text}</option>)}</select>
          <small>{ROLES.find((r) => r.value === role)?.scope}</small>
        </label>
        {error && <p className="nx-error">{error}</p>}
        {!self && (
          <div className="nx-row-end">
            {role !== member.role && <button type="button" className="nx-btn nx-btn-primary" disabled={busy} onClick={() => run(`/admin/${member.id}`, "PATCH", { role })}>Save role</button>}
            <button type="button" className="nx-btn nx-btn-ghost" disabled={busy} onClick={() => run(`/admin/${member.id}/${member.isActive ? "disable" : "enable"}`, "PATCH")}>{member.isActive ? "Disable access" : "Enable access"}</button>
          </div>
        )}
        {!self && (
          confirmRemove ? (
            <div className="nx-danger-zone">
              <p>Remove {member.fullName} permanently? Their past actions stay in the audit log.</p>
              <div className="nx-row-end">
                <button type="button" className="nx-btn nx-btn-ghost" onClick={() => setConfirmRemove(false)}>Keep</button>
                <button type="button" className="nx-btn nx-btn-danger" disabled={busy} onClick={() => run(`/admin/${member.id}`, "DELETE")}>Remove administrator</button>
              </div>
            </div>
          ) : (
            <button type="button" className="nx-btn nx-btn-text-danger" onClick={() => setConfirmRemove(true)}><Trash2 size={15} /> Remove administrator</button>
          )
        )}
      </div>
    </Drawer>
  );
}
