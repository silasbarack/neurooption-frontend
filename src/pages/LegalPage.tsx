import { useEffect } from "react";
import { Link, Navigate, useLocation, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, ArrowRight, FileText, Printer } from "lucide-react";
import Logo from "../components/branding/Logo";
import { getToken } from "../utils/storage";
import { COMPANY, missingCompanyFields } from "../legal/company";
import { CATALOGUE } from "../legal/catalogue";
import { POLICIES, groupOf, policyBySlug } from "../legal/registry";
import type { Policy } from "../legal/types";
import "./LegalPage.css";

const GROUPS = [...new Set(CATALOGUE.map((entry) => entry.group))];

const formatDate = (iso: string) =>
  new Intl.DateTimeFormat("en-KE", { day: "numeric", month: "long", year: "numeric", timeZone: "Africa/Nairobi" }).format(new Date(`${iso}T12:00:00+03:00`));

function LegalHeader() {
  const signedIn = Boolean(getToken());
  return (
    <header className="lg-header">
      <div className="lg-container lg-header-inner">
        <Link to="/" className="lg-logo" aria-label="NeuroOption home"><Logo /></Link>
        <nav aria-label="Legal navigation" className="lg-header-nav">
          <Link to="/legal">All policies</Link>
          <Link to="/help">Help centre</Link>
          {signedIn ? <Link to="/trading" className="lg-btn">Open platform</Link> : <Link to="/login" className="lg-btn">Log in</Link>}
        </nav>
      </div>
    </header>
  );
}

function Notices() {
  return (
    <div className="lg-notices">
      {!COMPANY.realMoneyAvailable && (
        <p className="lg-notice is-demo">
          <strong>Demo mode only.</strong> NeuroOption currently offers demo accounts with virtual funds. Deposits, withdrawals and
          real-money trading are not available yet. Where a policy describes real-money services, it explains how they will work once
          they are switched on; we will update the policies before that happens.
        </p>
      )}
      {missingCompanyFields.length > 0 && (
        <p className="lg-notice is-draft">
          Some company details are still being finalised and are shown <mark className="lg-todo">[like this]</mark>. They will be
          completed before real-money services launch.
        </p>
      )}
    </div>
  );
}

function LegalFooter() {
  return (
    <footer className="lg-footer">
      <div className="lg-container lg-footer-inner">
        <p>Trading fixed-time options involves a high risk of losing the money you invest. Only trade with money you can afford to lose.</p>
        <p>© {new Date().getFullYear()} NeuroOption. All rights reserved.</p>
      </div>
    </footer>
  );
}

function PolicyIndex() {
  useEffect(() => { document.title = "Legal and policies | NeuroOption"; }, []);
  return (
    <>
      <section className="lg-hero">
        <div className="lg-container">
          <p className="lg-eyebrow">Legal</p>
          <h1>Policies and legal information</h1>
          <p className="lg-lead">
            The rules that apply when you use NeuroOption: how trading works, the risks involved, how money and identity checks are
            handled, and how we protect your personal data.
          </p>
          <Notices />
        </div>
      </section>
      <div className="lg-container lg-index">
        {GROUPS.map((group) => (
          <section key={group} aria-labelledby={`lg-group-${group}`}>
            <h2 id={`lg-group-${group}`} className="lg-group-title">{group}</h2>
            <div className="lg-cards">
              {POLICIES.filter((p) => groupOf(p.slug) === group).map((p) => (
                <Link key={p.slug} to={`/legal/${p.slug}`} className="lg-card">
                  <span className="lg-card-icon" aria-hidden="true"><FileText size={20} /></span>
                  <span className="lg-card-body">
                    <strong>{p.title}</strong>
                    <span>{p.summary}</span>
                    <small>Updated {formatDate(p.updated)}</small>
                  </span>
                  <ArrowRight size={18} className="lg-card-arrow" aria-hidden="true" />
                </Link>
              ))}
            </div>
          </section>
        ))}
      </div>
    </>
  );
}

function PolicyDocument({ policy }: { policy: Policy }) {
  const navigate = useNavigate();
  const { hash } = useLocation();
  const index = POLICIES.findIndex((p) => p.slug === policy.slug);
  const prev = POLICIES[index - 1];
  const next = POLICIES[index + 1];

  useEffect(() => { document.title = `${policy.title} | NeuroOption`; }, [policy]);
  useEffect(() => {
    const id = hash.slice(1);
    const target = id ? document.getElementById(id) : null;
    if (target) target.scrollIntoView();
    else window.scrollTo(0, 0);
  }, [policy, hash]);

  return (
    <>
      <section className="lg-hero is-doc">
        <div className="lg-container">
          <nav aria-label="Breadcrumb" className="lg-crumbs"><Link to="/legal">Legal</Link><span aria-hidden="true">/</span><span>{groupOf(policy.slug)}</span></nav>
          <h1>{policy.title}</h1>
          <p className="lg-lead">{policy.summary}</p>
          <div className="lg-meta">
            <span>Last updated {formatDate(policy.updated)}</span>
            <button type="button" className="lg-print" onClick={() => window.print()}><Printer size={15} aria-hidden="true" /> Print or save as PDF</button>
          </div>
          <Notices />
        </div>
      </section>

      <div className="lg-container lg-layout">
        <aside className="lg-side" aria-label="Policies">
          <label className="lg-switch">
            <span>Choose a policy</span>
            <select value={policy.slug} onChange={(e) => navigate(`/legal/${e.target.value}`)}>
              {POLICIES.map((p) => <option key={p.slug} value={p.slug}>{p.title}</option>)}
            </select>
          </label>
          <nav className="lg-side-nav">
            {GROUPS.map((group) => (
              <div key={group}>
                <p>{group}</p>
                {POLICIES.filter((p) => groupOf(p.slug) === group).map((p) => (
                  <Link key={p.slug} to={`/legal/${p.slug}`} aria-current={p.slug === policy.slug ? "page" : undefined}>{p.title}</Link>
                ))}
              </div>
            ))}
          </nav>
        </aside>

        <article className="lg-article">
          <nav className="lg-toc" aria-label="On this page">
            <p>On this page</p>
            <ol>
              {policy.sections.map((s) => <li key={s.id}><a href={`#${s.id}`}>{s.title}</a></li>)}
            </ol>
          </nav>
          {policy.sections.map((s) => (
            <section key={s.id} id={s.id} className="lg-section" aria-labelledby={`${s.id}-h`}>
              <h2 id={`${s.id}-h`}><a href={`#${s.id}`} className="lg-anchor">{s.title}</a></h2>
              {s.body}
            </section>
          ))}
          <div className="lg-pager">
            {prev ? <Link to={`/legal/${prev.slug}`}><ArrowLeft size={16} aria-hidden="true" /> <span><small>Previous</small>{prev.title}</span></Link> : <span />}
            {next ? <Link to={`/legal/${next.slug}`} className="is-next"><span><small>Next</small>{next.title}</span> <ArrowRight size={16} aria-hidden="true" /></Link> : <span />}
          </div>
        </article>
      </div>
    </>
  );
}

/** Public: /legal (index) and /legal/:slug (one policy). */
export default function LegalPage() {
  const { slug } = useParams();
  const policy = slug ? policyBySlug(slug) : undefined;
  if (slug && !policy) return <Navigate to="/legal" replace />;
  return (
    <div className="lg">
      <LegalHeader />
      <main id="main">{policy ? <PolicyDocument policy={policy} /> : <PolicyIndex />}</main>
      <LegalFooter />
    </div>
  );
}
