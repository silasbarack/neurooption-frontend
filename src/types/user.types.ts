import type { AccountCurrency } from "./auth.types";

export type UserProfile = {
  id: string;
  email: string;
  fullName: string;
  phone?: string | null;
  country?: string | null;
  currency?: AccountCurrency | null;
  createdAt?: string;
  updatedAt?: string;
};

export type UpdateUserPayload = {
  fullName?: string;
  name?: string;
  phone?: string;
  country?: string;
  currency?: AccountCurrency;
};

export type DeleteAccountResponse = {
  success: boolean;
  message: string;
};