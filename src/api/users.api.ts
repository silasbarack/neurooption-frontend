import { api } from './api';

export type DeleteAccountPayload = {
  password: string;
};

export const usersApi = {
  deleteAccount: (data: DeleteAccountPayload) =>
    api.delete<{ message: string }>('/users/me', {
      body: JSON.stringify(data),
    }),
};