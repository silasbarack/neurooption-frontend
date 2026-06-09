import { api } from './api';

export type RegisterPayload = {
  fullname: string;
  email: string;
  phone?: string;
  password: string;
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
  register: (data: RegisterPayload) => api.post('/auth/register', data),

  login: (data: LoginPayload) => api.post('/auth/login', data),

  forgotPassword: (data: ForgotPasswordPayload) =>
    api.post('/auth/forgot-password', data),

  resetPassword: (data: ResetPasswordPayload) =>
    api.post('/auth/reset-password', data),
};