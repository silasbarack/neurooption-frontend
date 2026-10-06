import type { AuthUser } from "../types/auth.types";

const TOKEN_KEY = "neurooption_token";
const USER_KEY = "neurooption_user";

export function saveToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
}

// Sign-in stores the token in localStorage ("remember me") or sessionStorage.
export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY) || sessionStorage.getItem(TOKEN_KEY);
}

export function clearToken(): void {
  localStorage.removeItem(TOKEN_KEY);
  sessionStorage.removeItem(TOKEN_KEY);
}

export function saveUser(user: AuthUser): void {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function getUser(): AuthUser | null {
  const raw = localStorage.getItem(USER_KEY) || sessionStorage.getItem(USER_KEY);

  if (!raw) return null;

  try {
    return JSON.parse(raw) as AuthUser;
  } catch {
    localStorage.removeItem(USER_KEY);
    sessionStorage.removeItem(USER_KEY);
    return null;
  }
}

export function clearUser(): void {
  localStorage.removeItem(USER_KEY);
  sessionStorage.removeItem(USER_KEY);
}

export function logout(): void {
  clearToken();
  clearUser();
}