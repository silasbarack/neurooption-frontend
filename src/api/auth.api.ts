import { api } from "./api";
import type {
  AuthResponse,
  ForgotPasswordPayload,
  LoginPayload,
  MessageResponse,
  RegisterPayload,
  ResetPasswordPayload,
} from "../types/auth.types";

export const authApi = {
  resendWelcomeEmail(): Promise<{ success: boolean; emailSent: boolean; message: string }> {
    return api.post<{ success: boolean; emailSent: boolean; message: string }>("/auth/resend-welcome", {});
  },

  login(payload: LoginPayload): Promise<AuthResponse> {
    return api.post<AuthResponse>("/auth/login", payload, false);
  },

  register(payload: RegisterPayload): Promise<AuthResponse> {
    return api.post<AuthResponse>("/auth/register", payload, false);
  },

  forgotPassword(payload: ForgotPasswordPayload): Promise<MessageResponse> {
    return api.post<MessageResponse>("/auth/forgot-password", payload, false);
  },

  resetPassword(payload: ResetPasswordPayload): Promise<MessageResponse> {
    return api.post<MessageResponse>("/auth/reset-password", payload, false);
  },
};