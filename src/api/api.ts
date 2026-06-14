export const API_BASE_URL = (
  import.meta.env.VITE_API_URL || "http://localhost:10000"
).replace(/\/+$/, "");

export type ApiResponse<T> = {
  data: T;
  status: number;
  ok: boolean;
};

export class ApiError extends Error {
  status: number;
  data: unknown;

  constructor(message: string, status: number, data: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.data = data;
  }
}

function getStoredToken(): string | null {
  return (
    localStorage.getItem("accessToken") ||
    localStorage.getItem("token") ||
    localStorage.getItem("neurooption_token")
  );
}

async function request<T>(
  path: string,
  options: {
    method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
    body?: unknown;
    token?: string | null;
  } = {},
): Promise<ApiResponse<T>> {
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  const token = options.token ?? getStoredToken();

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${cleanPath}`, {
    method: options.method || "GET",
    headers,
    body: options.body === undefined ? undefined : JSON.stringify(options.body),
  });

  const contentType = response.headers.get("content-type") || "";

  let data: unknown = null;

  if (contentType.includes("application/json")) {
    data = await response.json().catch(() => null);
  } else {
    data = await response.text().catch(() => null);
  }

  if (!response.ok) {
    const body = data as any;

    const message =
      Array.isArray(body?.message)
        ? body.message.join(", ")
        : body?.message || body?.error || `Request failed with status ${response.status}`;

    throw new ApiError(message, response.status, data);
  }

  return {
    data: data as T,
    status: response.status,
    ok: response.ok,
  };
}

export const api = {
  get: <T>(path: string, token?: string | null) =>
    request<T>(path, { method: "GET", token }),

  post: <T>(path: string, body?: unknown, token?: string | null) =>
    request<T>(path, { method: "POST", body, token }),

  put: <T>(path: string, body?: unknown, token?: string | null) =>
    request<T>(path, { method: "PUT", body, token }),

  patch: <T>(path: string, body?: unknown, token?: string | null) =>
    request<T>(path, { method: "PATCH", body, token }),

  delete: <T>(path: string, body?: unknown, token?: string | null) =>
    request<T>(path, { method: "DELETE", body, token }),
};

export async function apiRequest<T>(
  path: string,
  options: {
    method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
    body?: unknown;
    token?: string | null;
  } = {},
): Promise<T> {
  const response = await request<T>(path, options);
  return response.data;
}