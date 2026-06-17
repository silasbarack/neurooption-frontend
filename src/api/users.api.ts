import type {
  DeleteAccountResponse,
  MessageResponse,
  UpdatePasswordPayload,
  UpdateUserPayload,
  UserProfile,
} from "../types/user.types";

const API_URL = import.meta.env.VITE_API_URL || "https://neurooption-backend.onrender.com";

function getToken() {
  return localStorage.getItem("token") || localStorage.getItem("accessToken") || "";
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
  });

  if (!response.ok) {
    let message = `Request failed with status ${response.status}`;

    try {
      const errorBody = await response.json();
      message = errorBody.message || message;
    } catch {
      // Keep default message.
    }

    throw new Error(message);
  }

  return response.json() as Promise<T>;
}

export async function getProfile(): Promise<UserProfile> {
  return request<UserProfile>("/users/profile");
}

export async function updateProfile(payload: UpdateUserPayload): Promise<UserProfile> {
  return request<UserProfile>("/users/profile", {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}

export async function updatePassword(payload: UpdatePasswordPayload): Promise<MessageResponse> {
  return request<MessageResponse>("/users/password", {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}

export async function deleteAccount(): Promise<DeleteAccountResponse> {
  return request<DeleteAccountResponse>("/users/account", {
    method: "DELETE",
  });
}

export const usersApi = {
  getProfile,
  updateProfile,
  updatePassword,
  deleteAccount,
};

export default usersApi;