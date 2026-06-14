import { api } from "./api";

export type LoginPayload = {
  email: string;
  password: string;
};

export type RegisterPayload = {
  fullName?: string;
  fullname?: string;
  email: string;
  password: string;
  phone?: string;
};

export type ForgotPasswordPayload = {
  email: string;
};

export type ResetPasswordPayload = {
  token: string;
  password: string;
};

export type AuthUser = {
  id?: string;
  email?: string;
  fullName?: string;
  fullname?: string;
  phone?: string;
};

export type AuthResponse = {
  accessToken?: string;
  token?: string;
  user?: AuthUser;
  message?: string;
};

type RawAuthResponse = AuthResponse & {
  data?: AuthResponse;
};

export type MessageResponse = {
  message?: string;
  success?: boolean;
};

function normalizeAuthResponse(response: RawAuthResponse): AuthResponse {
  const nested = response.data || {};

  return {
    accessToken: nested.accessToken || response.accessToken,
    token: nested.token || response.token,
    user: nested.user || response.user,
    message: nested.message || response.message,
  };
}

function normalizeMessage(response: { message?: string; data?: { message?: string } }) {
  return {
    message: response.data?.message || response.message || "Request completed",
  };
}

export const authApi = {
  async login(payload: LoginPayload): Promise<AuthResponse> {
    const response = await api.post<RawAuthResponse>("/auth/login", payload);
    return normalizeAuthResponse(response.data);
  },

  async register(payload: RegisterPayload): Promise<AuthResponse> {
    const response = await api.post<RawAuthResponse>("/auth/register", payload);
    return normalizeAuthResponse(response.data);
  },

  async forgotPassword(
    payload: ForgotPasswordPayload
  ): Promise<MessageResponse> {
    const response = await api.post("/auth/forgot-password", payload);
    return normalizeMessage(response.data);
  },

  async resetPassword(payload: ResetPasswordPayload): Promise<MessageResponse> {
    const response = await api.post("/auth/reset-password", payload);
    return normalizeMessage(response.data);
  },
};