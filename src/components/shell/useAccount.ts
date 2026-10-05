import { useEffect, useState } from "react";
import { accountApi, type AccountSummary } from "../../api";
import { getToken, getUser } from "../../utils/storage";

// One request per page load, shared by every component that asks.
let cached: AccountSummary | null = null;
let inflight: Promise<AccountSummary> | null = null;

function loadAccount() {
  inflight ??= accountApi
    .me()
    .then((account) => {
      cached = account;
      return account;
    })
    .finally(() => {
      inflight = null;
    });
  return inflight;
}

/** Forget the cached account (e.g. after a deposit) and fetch it again. */
export function refreshAccount() {
  cached = null;
  return loadAccount();
}

export function initialsOf(name?: string | null) {
  const parts = (name || "").trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return "N";
  return (parts[0][0] + (parts.length > 1 ? parts[parts.length - 1][0] : "")).toUpperCase();
}

export function useAccount() {
  const [account, setAccount] = useState<AccountSummary | null>(cached);
  const [error, setError] = useState("");
  const signedIn = Boolean(getToken());
  const storedUser = getUser();

  useEffect(() => {
    if (!signedIn) return;
    let active = true;
    loadAccount()
      .then((next) => active && setAccount(next))
      .catch((err: unknown) => active && setError(err instanceof Error ? err.message : "Could not load your account."));
    return () => {
      active = false;
    };
  }, [signedIn]);

  return {
    account,
    error,
    signedIn,
    displayName: account?.fullName || storedUser?.fullName || storedUser?.name || "Trader",
    reload: () =>
      refreshAccount()
        .then(setAccount)
        .catch(() => undefined),
  };
}
