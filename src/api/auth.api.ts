import { API_BASE_URL, api } from "./api";
import type {
  AuthResponse,
  ForgotPasswordPayload,
  LoginPayload,
  MessageResponse,
  RegisterPayload,
  ResetPasswordPayload,
} from "../types/auth.types";

export type SocialProvider = "google" | "x" | "facebook";

export type SocialSignupPreview = {
  provider: SocialProvider;
  email: string | null;
  emailVerified: boolean;
  name: string | null;
};

/** Full-page address that starts Google, X or Facebook sign-in on the backend. */
export function socialStartUrl(provider: SocialProvider): string {
  return `${API_BASE_URL}/auth/oauth/${provider}/start?origin=${encodeURIComponent(window.location.origin)}`;
}

export const authApi = {
  socialProviders(): Promise<Record<SocialProvider, boolean>> {
    return api.get<Record<SocialProvider, boolean>>("/auth/oauth/providers", false);
  },

  socialSignupPreview(signupToken: string): Promise<SocialSignupPreview> {
    return api.post<SocialSignupPreview>("/auth/oauth/signup/preview", { signupToken }, false);
  },

  socialSignupComplete(payload: { signupToken: string; acceptTerms: boolean; email?: string; fullName?: string }): Promise<AuthResponse> {
    return api.post<AuthResponse>("/auth/oauth/signup/complete", payload, false);
  },

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