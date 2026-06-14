import { ApiError, api } from "./api";

export type MessageResponse = {
  success?: boolean;
  message: string;
};

export type LoginPayload = {
  email: string;
  password: string;
};

export type RegisterPayload = {
  fullName: string;
  email: string;
  password: string;
};

export type ForgotPasswordPayload = {
  email: string;
};

export type ResetPasswordPayload = {
  token?: string;
  email?: string;
  password: string;
};

export type AuthUser = {
  id?: string;
  email?: string;
  fullName?: string;
  name?: string;
};

export type AuthData = {
  token?: string;
  accessToken?: string;
  user?: AuthUser | null;
  message?: string;
};

export type AuthResponse = AuthData & {
  success?: boolean;
  data: AuthData;
};

function normalizeAuthResponse(input: unknown): AuthResponse {
  const body = (input as any)?.data || input || {};
  const value = body as any;

  const token =
    value.token ||
    value.accessToken ||
    value.access_token ||
    value.jwt ||
    value?.data?.token ||
    value?.data?.accessToken ||
    "";

  const user =
    value.user ||
    value?.data?.user ||
    null;

  const message =
    value.message ||
    value?.data?.message ||
    "Success";

  return {
    ...value,
    token,
    accessToken: token,
    user,
    message,
    success: value.success ?? true,
    data: {
      ...value,
      token,
      accessToken: token,
      user,
      message,
    },
  };
}

function saveAuthSession(response: AuthResponse) {
  const token = response.token || response.accessToken || response.data?.token;

  if (token) {
    localStorage.setItem("accessToken", token);
    localStorage.setItem("token", token);
    localStorage.setItem("neurooption_token", token);
  }

  if (response.user) {
    localStorage.setItem("neurooption_user", JSON.stringify(response.user));
  }
}

function normalizeMessageResponse(input: unknown, fallback: string): MessageResponse {
  const body = (input as any)?.data || input || {};
  const value = body as any;

  return {
    success: value.success ?? true,
    message: value.message || fallback,
  };
}

async function postFirst<T>(
  paths: string[],
  body: unknown,
  fallbackMessage: string,
): Promise<T> {
  let lastError: unknown = null;

  for (const path of paths) {
    try {
      const response = await api.post<unknown>(path, body);
      return normalizeMessageResponse(response.data, fallbackMessage) as T;
    } catch (error) {
      lastError = error;

      if (error instanceof ApiError) {
        if (error.status === 404 || error.status === 405) {
          continue;
        }
      }

      throw error;
    }
  }

  throw lastError;
}

export const authApi = {
  async login(payload: LoginPayload): Promise<AuthResponse> {
    const response = await api.post<unknown>("/auth/login", payload);
    const authResponse = normalizeAuthResponse(response.data);
    saveAuthSession(authResponse);
    return authResponse;
  },

  async register(payload: RegisterPayload): Promise<AuthResponse> {
    const response = await api.post<unknown>("/auth/register", payload);
    const authResponse = normalizeAuthResponse(response.data);
    saveAuthSession(authResponse);
    return authResponse;
  },

  async forgotPassword(payload: ForgotPasswordPayload): Promise<MessageResponse> {
    return postFirst<MessageResponse>(
      [
        "/auth/forgot-password",
        "/auth/password/forgot",
        "/auth/request-password-reset",
      ],
      payload,
      "Password reset email sent successfully.",
    );
  },

  async resetPassword(payload: ResetPasswordPayload): Promise<MessageResponse> {
    return postFirst<MessageResponse>(
      [
        "/auth/reset-password",
        "/auth/password/reset",
        "/auth/confirm-password-reset",
      ],
      payload,
      "Password reset successfully.",
    );
  },

  logout() {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("token");
    localStorage.removeItem("neurooption_token");
    localStorage.removeItem("neurooption_user");
  },
};