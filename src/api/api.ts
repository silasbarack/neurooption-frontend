import axios from "axios";

export const API_BASE_URL = (
  import.meta.env.VITE_API_URL || "https://neurooption-backend.onrender.com"
).replace(/\/$/, "");

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token =
    localStorage.getItem("accessToken") ||
    localStorage.getItem("neurooption_token");

  if (token) {
    config.headers = config.headers || {};
    (config.headers as Record<string, string>).Authorization = `Bearer ${token}`;
  }

  return config;
});

export function getApiErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as
      | { message?: string | string[]; error?: string }
      | undefined;

    if (Array.isArray(data?.message)) {
      return data.message.join(", ");
    }

    return data?.message || data?.error || error.message || "Request failed";
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Something went wrong";
}