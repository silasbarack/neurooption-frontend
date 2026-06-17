export type AccountType = "QT Demo" | "QT Real";

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

export type AuthUser = {
  id: string;
  email: string;
  fullName: string;
  phone?: string | null;
  country?: string | null;
  currency?: AccountCurrency | null;
};

export type LoginPayload = {
  email: string;
  password: string;
};

export type RegisterPayload = {
  fullName: string;
  email: string;
  password: string;
  phone?: string;
  country?: string;
  currency?: AccountCurrency;
};

export type ForgotPasswordPayload = {
  email: string;
};

export type ResetPasswordPayload = {
  token: string;
  password: string;
};

export type AuthResponse = {
  success: boolean;
  message: string;
  token?: string;
  accessToken?: string;
  user?: AuthUser;
};

export type MessageResponse = {
  success: boolean;
  message: string;
};