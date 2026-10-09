import { useMemo, useState } from "react";
import { History, LayoutGrid, Search } from "lucide-react";
import PaymentLogo, { type PaymentBrand } from "./PaymentLogo";

export type DepositMethod = {
  id: string;
  name: string;
  brand: PaymentBrand;
  /** False until the provider is connected: shown, but not selectable. */
  available: boolean;
  /** Smallest deposit in KES, when the provider is live. */
  minKes?: number;
  /** Short processing-time text, when the provider is live. */
  time?: string;
};

type DepositMethodsProps = {
  methods: DepositMethod[];
  /** Ids of methods the user has already deposited with, newest first. */
  recentIds: string[];
  /** Shown on live methods while the finance details are still loading. */
  loading?: boolean;
  onSelect: (id: string) => void;
};

function MethodCard({ method, loading, onSelect }: { method: DepositMethod; loading: boolean; onSelect: (id: string) => void }) {
  const live = method.available;
  const min = method.minKes !== undefined ? `Min: ${method.minKes.toLocaleString("en-KE")} KES` : loading ? "Checking…" : "Unavailable";
  return (
    <button
      type="button"
      className={`fin-method${live ? "" : " is-soon"}`}
      disabled={!live}
      onClick={() => onSelect(method.id)}
      aria-label={live ? `Deposit with ${method.name}` : `${method.name}, coming soon`}
    >
      <span className="fin-method-main">
        <span className="fin-method-logo"><PaymentLogo brand={method.brand} label="" /></span>
        <span className="fin-method-name">{method.name}</span>
      </span>
      {live ? (
        <span className="fin-method-foot">
          <span>{min}</span>
          <span>{method.time ?? ""}</span>
        </span>
      ) : (
        <span className="fin-method-foot is-single">
          <span>{loading ? "Checking…" : "Coming soon"}</span>
        </span>
      )}
    </button>
  );
}

/** The deposit method picker: search, methods used before, then all methods. */
export default function DepositMethods({ methods, recentIds, loading = false, onSelect }: DepositMethodsProps) {
  const [query, setQuery] = useState("");
  const needle = query.trim().toLowerCase();

  const matches = useMemo(
    () => methods.filter((method) => !needle || method.name.toLowerCase().includes(needle)),
    [methods, needle],
  );
  const recent = useMemo(
    () =>
      recentIds
        .map((id) => matches.find((method) => method.id === id && method.available))
        .filter((method): method is DepositMethod => Boolean(method)),
    [recentIds, matches],
  );

  return (
    <div className="fin-topup">
      <h2 className="fin-topup-label" id="fin-method-label">Deposit method</h2>
      <label className="fin-search">
        <span className="fin-sr-only">Search deposit methods</span>
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search"
          autoComplete="off"
          aria-describedby="fin-method-label"
        />
        <Search size={20} aria-hidden="true" />
      </label>

      {recent.length > 0 && (
        <section aria-labelledby="fin-recent-title">
          <h3 className="fin-topup-heading" id="fin-recent-title"><History size={22} aria-hidden="true" />Recent</h3>
          <ul className="fin-method-list">
            {recent.map((method) => (
              <li key={method.id}><MethodCard method={method} loading={loading} onSelect={onSelect} /></li>
            ))}
          </ul>
        </section>
      )}

      <section aria-labelledby="fin-all-title">
        <h3 className="fin-topup-heading" id="fin-all-title"><LayoutGrid size={22} aria-hidden="true" />All methods</h3>
        {matches.length === 0 ? (
          <p className="fin-topup-empty" role="status">No deposit method matches “{query.trim()}”.</p>
        ) : (
          <ul className="fin-method-list">
            {matches.map((method) => (
              <li key={method.id}><MethodCard method={method} loading={loading} onSelect={onSelect} /></li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
