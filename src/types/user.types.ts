export type MessageResponse = {
  message: string;
};

export type UserStatus = "ACTIVE" | "SUSPENDED" | "LOCKED" | "DELETED";

export type KycStatus = "PENDING" | "APPROVED" | "REJECTED";

export type User = {
  id: string;
  email: string;
  fullName?: string;
  name?: string;
  phone?: string;
  role?: string;
  status?: UserStatus | string;
  kycStatus?: KycStatus | string;
  createdAt?: string;
  updatedAt?: string;
};

export type UpdateUserPayload = {
  fullName?: string;
  name?: string;
  phone?: string;
  email?: string;
};

export type UpdatePasswordPayload = {
  currentPassword: string;
  newPassword: string;
};