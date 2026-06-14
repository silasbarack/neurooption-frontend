const API_BASE_URL =
  import.meta.env.VITE_API_URL || 'https://neurooption-backend.onrender.com';

type ApiOptions = RequestInit & {
  token?: string | null;
};

async function parseResponse(response: Response) {
  const text = await response.text();

  if (!text) return null;

  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

export async function apiRequest<T>(
  path: string,
  options: ApiOptions = {},
): Promise<T> {
  const token =
    options.token ||
    localStorage.getItem('neurooption_token') ||
    localStorage.getItem('token');

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
  });

  const data = await parseResponse(response);

  if (!response.ok) {
    const message =
      data?.message ||
      data?.error ||
      `Request failed with status ${response.status}`;

    throw new Error(Array.isArray(message) ? message.join(', ') : message);
  }

  return data as T;
}

export const api = {
  get: <T>(path: string, options?: ApiOptions) =>
    apiRequest<T>(path, {
      ...options,
      method: 'GET',
    }),

  post: <T>(path: string, body?: unknown, options?: ApiOptions) =>
    apiRequest<T>(path, {
      ...options,
      method: 'POST',
      body: JSON.stringify(body ?? {}),
    }),

  patch: <T>(path: string, body?: unknown, options?: ApiOptions) =>
    apiRequest<T>(path, {
      ...options,
      method: 'PATCH',
      body: JSON.stringify(body ?? {}),
    }),

  delete: <T>(path: string, options?: ApiOptions) =>
    apiRequest<T>(path, {
      ...options,
      method: 'DELETE',
    }),
};

export function getApiBaseUrl() {
  return API_BASE_URL;
}