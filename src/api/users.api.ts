import { api } from "./api";
import type { MessageResponse } from "./auth.api";

export type UpdateProfilePayload = {
  fullName?: string;
  fullname?: string;
  phone?: string;
  country?: string;
  currency?: string;
};

export const usersApi = {
  async getProfile() {
    const response = await api.get("/users/profile");
    return response.data;
  },

  async updateProfile(payload: UpdateProfilePayload) {
    const response = await api.patch("/users/profile", payload);
    return response.data;
  },

  async deleteAccount(): Promise<MessageResponse> {
    const response = await api.delete("/users/me");
    return {
      message: response.data?.message || "Account deleted successfully.",
    };
  },
};