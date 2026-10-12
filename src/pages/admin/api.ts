import { createContext, useCallback, useContext, useEffect, useState } from "react";

export const API = (import.meta.env.VITE_API_URL || "https://neurooption-backend.onrender.com").replace(/\/$/, "");
export const SESSION_KEY = "neurooption_admin_session";

export type Area = "overview" | "users" | "userStatus" | "kyc" | "finance" | "trading" | "support" | "audit" | "team";
export type Admin = { id: string; fullName: string; email: string; role: string };
export type Paged<T> = { total: number; page: number; limit: number; pages: number; items: T[] };

export type ApiError = Error & { status?: number };

export async function adminRequest<T>(path: string, token: string, options?: RequestInit, signal?: AbortSignal): Promise<T> {
  const response = await fetch(API + path, {
    ...options,
    signal,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: "Bearer " + token } : {}),
      ...options?.headers,
    },
    cache: "no-store",
  });
  const data: unknown = await response.json().catch(() => null);
  if (!response.ok) {
    const msg = data && typeof data === "object" && "message" in data ? (data as { message: unknown }).message : null;
    const text = Array.isArray(msg) ? msg.join(" ") : typeof msg === "string" ? msg : "Unable to complete request.";
    const error: ApiError = new Error(text);
    error.status = response.status;
    throw error;
  }
  return data as T;
}

type Session = { token: string; admin: Admin; permissions: Area[]; onExpired: () => void };
export const SessionContext = createContext<Session | null>(null);

export function useSession(): Session {
  const session = useContext(SessionContext);
  if (!session) throw new Error("Admin session missing");
  return session;
}

/** Loads an admin endpoint; reloads when the path changes, every `refreshMs` (optional) or on reload(). */
export function useAdminQuery<T>(path: string | null, refreshMs?: number) {
  const { token, onExpired } = useSession();
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [tick, setTick] = useState(0);
  const reload = useCallback(() => setTick((n) => n + 1), []);

  useEffect(() => {
    if (!path) return;
    const controller = new AbortController();
    let active = true;
    const run = (silent: boolean) => {
      if (!silent) setLoading(true);
      adminRequest<T>(path, token, undefined, controller.signal)
        .then((result) => { if (active) { setData(result); setError(""); } })
        .catch((err: ApiError) => {
          if (!active || err.name === "AbortError") return;
          if (err.status === 401) onExpired();
          else setError(err.message);
        })
        .finally(() => { if (active && !silent) setLoading(false); });
    };
    run(false);
    const interval = refreshMs ? window.setInterval(() => run(true), refreshMs) : undefined;
    return () => { active = false; controller.abort(); if (interval) window.clearInterval(interval); };
  }, [path, token, onExpired, refreshMs, tick]);

  return { data, error, loading, reload };
}

/** Sends a change (PATCH/POST/DELETE) with the session token. */
export function useAdminAction() {
  const { token, onExpired } = useSession();
  return useCallback(async <T,>(path: string, method: "POST" | "PATCH" | "DELETE", body?: unknown): Promise<T> => {
    try {
      return await adminRequest<T>(path, token, { method, body: body === undefined ? undefined : JSON.stringify(body) });
    } catch (err) {
      if ((err as ApiError).status === 401) onExpired();
      throw err;
    }
  }, [token, onExpired]);
}

export const query = (params: Record<string, string | number | undefined>) => {
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) if (value !== undefined && value !== "") search.set(key, String(value));
  return search.toString();
};

export const usd = (value: number) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 2 }).format(value);
export const kes = (value: number) => "KES " + new Intl.NumberFormat("en-KE", { maximumFractionDigits: 0 }).format(value);
export const compact = (value: number) => new Intl.NumberFormat("en-US", { notation: "compact", maximumFractionDigits: 1 }).format(value);
export const kenyaDate = (value: string | Date) => new Intl.DateTimeFormat("en-KE", { dateStyle: "medium", timeStyle: "short", timeZone: "Africa/Nairobi" }).format(new Date(value));
export const kenyaDay = (value: string) => new Intl.DateTimeFormat("en-KE", { day: "numeric", month: "short", timeZone: "UTC" }).format(new Date(value));
export const kenyaClock = (value: string) => new Intl.DateTimeFormat("en-KE", { hour: "2-digit", minute: "2-digit", timeZone: "Africa/Nairobi" }).format(new Date(value));
export const label = (value: string) => value.replaceAll("_", " ").toLowerCase().replace(/^\w/, (c) => c.toUpperCase());
export const initials = (name: string) => name.split(/\s+/).filter(Boolean).slice(0, 2).map((p) => p[0]!.toUpperCase()).join("") || "A";
