import { api } from "./api";
import type { MessageResponse } from "./auth.api";

export type UserProfile = {
  id?: string;
  email?: string;
  fullName?: string;
  name?: string;
  phone?: string;
  country?: string;
  currency?: string;
  createdAt?: string;
  updatedAt?: string;
};

export type UpdateUserPayload = Partial<{
  fullName: string;
  name: string;
  phone: string;
  country: string;
  currency: string;
}>;

export const usersApi = {
  async getProfile(): Promise<UserProfile> {
    const response = await api.get<UserProfile>("/users/me");
    return response.data;
  },

  async getMe(): Promise<UserProfile> {
    const response = await api.get<UserProfile>("/users/me");
    return response.data;
  },

  async updateProfile(payload: UpdateUserPayload): Promise<UserProfile> {
    const response = await api.patch<UserProfile>("/users/me", payload);
    return response.data;
  },

  async updateMe(payload: UpdateUserPayload): Promise<UserProfile> {
    const response = await api.patch<UserProfile>("/users/me", payload);
    return response.data;
  },

  async deleteAccount(): Promise<MessageResponse> {
    const response = await api.delete<MessageResponse>("/users/me");

    return {
      success: response.data?.success ?? true,
      message: response.data?.message || "Account deleted successfully.",
    };
  },
};