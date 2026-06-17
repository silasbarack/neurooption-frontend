export type MessageResponse = {
  message: string;
};

export type DeleteAccountResponse = {
  message: string;
  deleted?: boolean;
};

export type UserStatus = "ACTIVE" | "SUSPENDED" | "LOCKED" | "DELETED";

export type KycStatus = "PENDING" | "APPROVED" | "REJECTED";

export type UserProfile = {
  id: string;
  email: string;
  fullName?: string;
  name?: string;
  phone?: string;
  avatarUrl?: string;
  role?: string;
  status?: UserStatus | string;
  kycStatus?: KycStatus | string;
  createdAt?: string;
  updatedAt?: string;
};

export type User = UserProfile;

export type UpdateUserPayload = {
  fullName?: string;
  name?: string;
  phone?: string;
  email?: string;
  avatarUrl?: string;
};

export type UpdatePasswordPayload = {
  currentPassword: string;
  newPassword: string;
};