export type AccountCurrency =
  | "USD"
  | "KES"
  | "UGX"
  | "TZS"
  | "NGN"
  | "XOF"
  | "EUR"
  | "CAD"
  | "JPY"
  | "CNY"
  | "AOA"
  | "ZAR"
  | "BRL";

export type MessageResponse = {
  message: string;
};

export type AuthUser = {
  id: string;
  email: string;
  fullName?: string;
  name?: string;
  role?: string;
  status?: string;
  kycStatus?: string;
  createdAt?: string;
  updatedAt?: string;
};

export type LoginPayload = {
  recaptchaToken?: string;
  email: string;
  password: string;
};

export type RegisterPayload = {
  recaptchaToken?: string;
  fullName?: string;
  name?: string;
  email: string;
  password: string;
};

export type ForgotPasswordPayload = {
  recaptchaToken?: string;
  email: string;
};

export type ResetPasswordPayload = {
  token: string;
  password: string;
};

export type AuthResponse = {
  welcomeEmailSent?: boolean;
  welcomeEmailHint?: string;
  accessToken?: string;
  token?: string;
  user?: AuthUser;
  message?: string;
};