import { api } from "./api";
import type { DeleteAccountResponse, UpdateUserPayload, UserProfile } from "../types/user.types";

export const usersApi = {
  getMe(): Promise<UserProfile> {
    return api.get<UserProfile>("/users/me");
  },

  updateMe(payload: UpdateUserPayload): Promise<UserProfile> {
    return api.patch<UserProfile>("/users/me", payload);
  },

  deleteMe(): Promise<DeleteAccountResponse> {
    return api.delete<DeleteAccountResponse>("/users/me");
  },
};