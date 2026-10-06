import { useEffect, useState, useSyncExternalStore } from "react";
import { accountApi, type AccountSummary } from "../../api";
import { getToken, getUser } from "../../utils/storage";

// Scope cached state to its authenticated session and notify all consumers after a refresh.
let cached: { token: string; account: AccountSummary } | null = null;
let inflight: { token: string; promise: Promise<AccountSummary> } | null = null;
const listeners = new Set<() => void>();
function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => { listeners.delete(listener); };
}
function loadAccount(token: string) {
  if (inflight?.token === token) return inflight.promise;
  const promise = accountApi.me().then((account) => {
    if (getToken() === token) {
      cached = { token, account };
      listeners.forEach((listener) => listener());
    }
    return account;
  }).finally(() => {
    if (inflight?.promise === promise) inflight = null;
  });
  inflight = { token, promise };
  return promise;
}
export function refreshAccount() {
  const token = getToken();
  if (!token) return Promise.reject(new Error("Please sign in to load your account."));
  return loadAccount(token);
}
export function initialsOf(name?: string | null) {
  const parts = (name || "").trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return "N";
  return (parts[0][0] + (parts.length > 1 ? parts[parts.length - 1][0] : "")).toUpperCase();
}
export function useAccount() {
  const token = getToken();
  const account = useSyncExternalStore(subscribe, () => cached?.token === token ? cached.account : null, () => null);
  const [error, setError] = useState("");
  const storedUser = getUser();
  useEffect(() => {
    if (!token) return;
    let active = true;
    loadAccount(token)
      .then(() => { if (active) setError(""); })
      .catch((err: unknown) => { if (active) setError(err instanceof Error ? err.message : "Could not load your account."); });
    return () => { active = false; };
  }, [token]);
  return {
    account,
    error,
    signedIn: Boolean(token),
    displayName: account?.fullName || storedUser?.fullName || storedUser?.name || "Trader",
    reload: () => refreshAccount().then(() => setError("")).catch((err: unknown) => {
      setError(err instanceof Error ? err.message : "Could not load your account.");
    }),
  };
}
