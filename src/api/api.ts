import { getToken } from "../utils/storage";

export type ApiErrorResponse = {
  success: false;
  message: string;
  statusCode?: number;
};

const API_BASE_URL =
  import.meta.env.VITE_API_URL?.replace(/\/$/, "") ||
  "https://neurooption-backend.onrender.com";

type RequestOptions = {
  method?: "GET" | "POST" | "PATCH" | "PUT" | "DELETE";
  body?: unknown;
  auth?: boolean;
};

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const url = `${API_BASE_URL}${path.startsWith("/") ? path : `/${path}`}`;

  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };

  if (options.auth !== false) {
    const token = getToken();
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
  }

  const response = await fetch(url, {
    method: options.method ?? "GET",
    headers,
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  let data: unknown = null;

  try {
    data = await response.json();
  } catch {
    data = null;
  }

  if (!response.ok) {
    const message =
      typeof data === "object" &&
      data !== null &&
      "message" in data &&
      typeof (data as { message?: unknown }).message === "string"
        ? (data as { message: string }).message
        : "Request failed. Please try again.";

    throw new Error(message);
  }

  return data as T;
}

export const api = {
  baseUrl: API_BASE_URL,

  get<T>(path: string, auth = true): Promise<T> {
    return request<T>(path, {
      method: "GET",
      auth,
    });
  },

  post<T>(path: string, body?: unknown, auth = true): Promise<T> {
    return request<T>(path, {
      method: "POST",
      body,
      auth,
    });
  },

  patch<T>(path: string, body?: unknown, auth = true): Promise<T> {
    return request<T>(path, {
      method: "PATCH",
      body,
      auth,
    });
  },

  put<T>(path: string, body?: unknown, auth = true): Promise<T> {
    return request<T>(path, {
      method: "PUT",
      body,
      auth,
    });
  },

  delete<T>(path: string, auth = true): Promise<T> {
    return request<T>(path, {
      method: "DELETE",
      auth,
    });
  },
};