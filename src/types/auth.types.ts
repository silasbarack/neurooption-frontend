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
  createdAt?: string;
  updatedAt?: string;
};

export type LoginPayload = {
  email: string;
  password: string;
};

export type RegisterPayload = {
  fullName?: string;
  name?: string;
  email: string;
  password: string;
};

export type ForgotPasswordPayload = {
  email: string;
};

export type ResetPasswordPayload = {
  token: string;
  password: string;
};

export type AuthResponse = {
  accessToken?: string;
  token?: string;
  user?: AuthUser;
  message?: string;
};