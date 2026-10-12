import { useState } from "react";
import { CircleCheck, CircleX, ExternalLink, FileText } from "lucide-react";
import { kenyaDate, label, query, useAdminAction, useAdminQuery } from "./api";
import type { Paged } from "./api";
import { Alert, Badge, Drawer, Empty, Field, Loading, PageHeader, Pager, Panel, Person, RefreshButton, Segmented } from "./ui";

type KycItem = {
  id: string;
  user: { id: string; fullName: string; email: string };
  documentType: string;
  documentNumber: string | null;
  images: { front: string | null; back: string | null; selfie: string | null; addressProof: string | null };
  status: string;
  rejectionReason: string | null;
  reviewedBy: string | null;
  reviewedAt: string | null;
  createdAt: string;
};

const TABS = [["PENDING", "Awaiting review"], ["APPROVED", "Approved"], ["REJECTED", "Rejected"], ["all", "All"]] as const;
const IMAGE_LABELS: Record<keyof KycItem["images"], string> = { front: "ID front", back: "ID back", selfie: "Selfie", addressProof: "Proof of address" };

export default function KycView() {
  const [status, setStatus] = useState<(typeof TABS)[number][0]>("PENDING");
  const [page, setPage] = useState(1);
  const [open, setOpen] = useState<KycItem | null>(null);
  const { data, error, loading, reload } = useAdminQuery<Paged<KycItem>>(`/admin/console/kyc?${query({ status, page, limit: 20 })}`);

  return (
    <>
      <PageHeader eyebrow="COMPLIANCE" title="Identity verification" subtitle="Review submitted documents. Approving marks the client as verified; rejections are explained to the client." actions={<RefreshButton onClick={reload} loading={loading} />} />
      <Panel>
        <div className="nx-toolbar">
          <Segmented value={status} options={TABS} onChange={(v) => { setStatus(v); setPage(1); }} ariaLabel="KYC status" />
        </div>
        {error && <Alert onRetry={reload}>{error}</Alert>}
        <div className="nx-table-wrap">
          <table className="nx-table">
            <thead><tr><th>Client</th><th>Document</th><th>Files</th><th>Status</th><th>Submitted (EAT)</th></tr></thead>
            <tbody>
              {data?.items.map((k) => (
                <tr key={k.id} className="is-clickable" tabIndex={0} onClick={() => setOpen(k)} onKeyDown={(e) => { if (e.key === "Enter") setOpen(k); }}>
                  <td><Person name={k.user.fullName} email={k.user.email} /></td>
                  <td><strong>{label(k.documentType)}</strong>{k.documentNumber && <small className="nx-sub">No. {k.documentNumber}</small>}</td>
                  <td>{Object.values(k.images).filter(Boolean).length} of 4</td>
                  <td><Badge value={k.status} /></td>
                  <td>{kenyaDate(k.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {data && data.items.length === 0 && <Empty>{status === "PENDING" ? "The review queue is clear." : "No submissions here."}</Empty>}
          {!data && !error && <Loading>Loading submissions…</Loading>}
        </div>
        {data && <Pager page={data.page} pages={data.pages} total={data.total} onPage={setPage} />}
      </Panel>
      {open && <KycDrawer item={open} onClose={() => setOpen(null)} onDone={() => { setOpen(null); reload(); }} />}
    </>
  );
}

function KycDrawer({ item, onClose, onDone }: { item: KycItem; onClose: () => void; onDone: () => void }) {
  const act = useAdminAction();
  const [rejecting, setRejecting] = useState(false);
  const [reason, setReason] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function decide(decision: "APPROVE" | "REJECT") {
    setBusy(true);
    setError("");
    try {
      await act(`/admin/console/kyc/${item.id}`, "PATCH", { decision, reason: decision === "REJECT" ? reason : undefined });
      onDone();
    } catch (err) {
      setError((err as Error).message);
      setBusy(false);
    }
  }

  const footer = item.status === "PENDING" ? (
    rejecting ? (
      <div className="nx-confirm">
        <label htmlFor="nx-kyc-reason">Reason shown to the client</label>
        <textarea id="nx-kyc-reason" rows={2} maxLength={500} value={reason} onChange={(e) => setReason(e.target.value)} placeholder="e.g. The photo of the ID is blurred. Please upload a clear image." />
        {error && <p className="nx-error">{error}</p>}
        <div className="nx-row-end">
          <button type="button" className="nx-btn nx-btn-ghost" onClick={() => setRejecting(false)}>Back</button>
          <button type="button" className="nx-btn nx-btn-danger" disabled={busy || reason.trim().length < 3} onClick={() => decide("REJECT")}>{busy ? "Saving…" : "Reject submission"}</button>
        </div>
      </div>
    ) : (
      <div className="nx-confirm">
        {error && <p className="nx-error">{error}</p>}
        <div className="nx-row-end">
          <button type="button" className="nx-btn nx-btn-ghost" onClick={() => setRejecting(true)}><CircleX size={16} /> Reject</button>
          <button type="button" className="nx-btn nx-btn-primary" disabled={busy} onClick={() => decide("APPROVE")}><CircleCheck size={16} /> {busy ? "Saving…" : "Approve identity"}</button>
        </div>
      </div>
    )
  ) : undefined;

  return (
    <Drawer title="Verification review" onClose={onClose} footer={footer}>
      <div className="nx-profile-head"><Person name={item.user.fullName} email={item.user.email} /><Badge value={item.status} /></div>
      <dl className="nx-fields">
        <Field label="Document">{label(item.documentType)}</Field>
        <Field label="Number">{item.documentNumber ?? "—"}</Field>
        <Field label="Submitted">{kenyaDate(item.createdAt)}</Field>
        {item.reviewedAt && <Field label="Reviewed">{kenyaDate(item.reviewedAt)}{item.reviewedBy ? ` by ${item.reviewedBy}` : ""}</Field>}
        {item.rejectionReason && <Field label="Rejection reason">{item.rejectionReason}</Field>}
      </dl>
      <h3 className="nx-section">Documents</h3>
      <div className="nx-docs">
        {(Object.keys(IMAGE_LABELS) as (keyof KycItem["images"])[]).map((key) => {
          const url = item.images[key];
          return url ? (
            <a key={key} className="nx-doc" href={url} target="_blank" rel="noreferrer noopener">
              {/^https?:|^data:image\//.test(url) ? <img src={url} alt={IMAGE_LABELS[key]} loading="lazy" /> : <FileText size={28} aria-hidden="true" />}
              <span>{IMAGE_LABELS[key]} <ExternalLink size={13} aria-hidden="true" /></span>
            </a>
          ) : (
            <div key={key} className="nx-doc is-missing"><FileText size={24} aria-hidden="true" /><span>{IMAGE_LABELS[key]} · not provided</span></div>
          );
        })}
      </div>
    </Drawer>
  );
}
