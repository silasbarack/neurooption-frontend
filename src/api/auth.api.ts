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
  resendWelcomeEmail(): Promise<{ success: boolean; emailSent: boolean; emailHint?: string; message: string }> {
    return api.post<{ success: boolean; emailSent: boolean; emailHint?: string; message: string }>("/auth/resend-welcome", {});
  },

  verifyEmail(token: string): Promise<{ success: boolean; alreadyVerified: boolean; message: string }> {
    return api.post<{ success: boolean; alreadyVerified: boolean; message: string }>("/auth/verify-email", { token }, false);
  },

  resendVerification(): Promise<{ success: boolean; emailSent: boolean; alreadyVerified?: boolean; emailHint?: string; message: string }> {
    return api.post<{ success: boolean; emailSent: boolean; alreadyVerified?: boolean; emailHint?: string; message: string }>("/auth/resend-verification", {});
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