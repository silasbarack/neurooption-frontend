import { api } from './api';

export type AuthUser = {
  id: string;
  email: string;
  fullName?: string;
  phone?: string;
};

export type AuthResponse = {
  accessToken?: string;
  token?: string;
  user?: AuthUser;
  message?: string;
};

export type RegisterPayload = {
  fullName: string;
  email: string;
  phone?: string;
  password: string;
  promoCode?: string;
  acceptedAgreement: boolean;
};

export type LoginPayload = {
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

export const authApi = {
  register: (data: RegisterPayload) =>
    api.post<AuthResponse>('/auth/register', data),

  login: (data: LoginPayload) => api.post<AuthResponse>('/auth/login', data),

  forgotPassword: (data: ForgotPasswordPayload) =>
    api.post<{ message: string }>('/auth/forgot-password', data),

  resetPassword: (data: ResetPasswordPayload) =>
    api.post<{ message: string }>('/auth/reset-password', data),

  me: () => api.get<AuthUser>('/auth/me'),
};