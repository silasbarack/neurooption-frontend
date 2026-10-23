const BASE_URL = import.meta.env.VITE_API_URL || '/api/v1';

class ApiClient {
  private token: string | null = null;

  setToken(token: string | null) {
    this.token = token;
    if (token) localStorage.setItem('neurooption_token', token);
    else localStorage.removeItem('neurooption_token');
  }

  getToken(): string | null {
    if (!this.token) this.token = localStorage.getItem('neurooption_token');
    return this.token;
  }

  private async request<T>(method: string, path: string, body?: any): Promise<T> {
    const token = this.getToken();
    const res = await fetch(`${BASE_URL}${path}`, {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: body ? JSON.stringify(body) : undefined,
    });

    // An expired session logs the user out. Auth/credential endpoints also return 401 for
    // "wrong password", which must surface as a normal error instead.
    if (res.status === 401 && token && !path.startsWith('/auth/') && path !== '/users/me') {
      this.setToken(null);
      window.location.reload();
    }

    if (!res.ok) {
      const err = await res.json().catch(() => ({ message: 'Request failed' }));
      const msg = Array.isArray(err.message) ? err.message.join('. ') : err.message;
      throw new Error(msg || `HTTP ${res.status}`);
    }

    return res.json();
  }

  get = <T>(path: string) => this.request<T>('GET', path);
  post = <T>(path: string, body?: any) => this.request<T>('POST', path, body);
  put = <T>(path: string, body?: any) => this.request<T>('PUT', path, body);
  delete = <T>(path: string, body?: any) => this.request<T>('DELETE', path, body);

  // ─── Auth ────────────────────────────────────────────────────────────────
  auth = {
    register: async (data: { name: string; email: string; password: string }) => {
      const res = await this.post<{ accessToken: string; user: any }>('/auth/register', data);
      this.setToken(res.accessToken);
      return res;
    },
    login: async (email: string, password: string) => {
      const res = await this.post<{ accessToken: string; user: any }>('/auth/login', { email, password });
      this.setToken(res.accessToken);
      return res;
    },
    // Emails a 6-digit verification code (always succeeds, whether or not the account exists).
    forgotPassword: (email: string) => this.post<{ message: string }>('/auth/forgot-password', { email }),
    resetPassword: (email: string, code: string, password: string) =>
      this.post<{ message: string }>('/auth/reset-password', { email, code, password }),
    me: () => this.get<any>('/auth/me'),
    logout: () => this.setToken(null),
    // Permanently deletes the logged-in account after re-checking the password.
    deleteAccount: async (password: string) => {
      const res = await this.delete<{ message: string }>('/users/me', { password });
      this.setToken(null);
      return res;
    },
  };

  // ─── Markets ─────────────────────────────────────────────────────────────
  markets = {
    getAll: () => this.get<any[]>('/markets'),
    getOTC: () => this.get<any[]>('/markets/otc'),
    getLive: () => this.get<any[]>('/markets/live'),
    getTicks: () => this.get<any[]>('/markets/ticks'),
    getOne: (id: string) => this.get<any>(`/markets/${id}`),
    getPrice: (id: string) => this.get<any>(`/markets/${id}/price`),
  };

  // ─── Trading ─────────────────────────────────────────────────────────────
  trading = {
    place: (data: any) => this.post<any>('/trading/place', data),
    getActive: () => this.get<any[]>('/trading/active'),
    getHistory: (page = 1, limit = 20) => this.get<any>(`/trading/history?page=${page}&limit=${limit}`),
    getStats: () => this.get<any>('/trading/stats'),
  };

  // ─── Wallet ──────────────────────────────────────────────────────────────
  wallet = {
    getBalance: () => this.get<any>('/wallet/balance'),
    getHistory: (page = 1) => this.get<any>(`/wallet/history?page=${page}`),
    getStats: () => this.get<any>('/wallet/stats'),
    deposit: (data: any) => this.post<any>('/wallet/deposit', data),
    withdraw: (data: any) => this.post<any>('/wallet/withdraw', data),
  };

  // ─── Signals ─────────────────────────────────────────────────────────────
  signals = {
    getAll: (limit = 20) => this.get<any[]>(`/signals?limit=${limit}`),
    getTop: (minConfidence = 70) => this.get<any[]>(`/signals/top?minConfidence=${minConfidence}`),
    getForMarket: (marketId: string) => this.get<any[]>(`/signals/market/${marketId}`),
  };

  // ─── Social ──────────────────────────────────────────────────────────────
  social = {
    getLeaderboard: (sortBy = 'profit') => this.get<any[]>(`/social/leaderboard?sortBy=${sortBy}`),
    getFollowing: () => this.get<any[]>('/social/following'),
    follow: (traderId: string, amount: number) => this.post<any>(`/social/follow/${traderId}`, { amount }),
    unfollow: (traderId: string) => this.delete<any>(`/social/follow/${traderId}`),
    getTrader: (traderId: string) => this.get<any>(`/social/trader/${traderId}`),
    becomePublic: (bio: string) => this.post<any>('/social/become-public', { bio }),
  };

  // ─── Users ───────────────────────────────────────────────────────────────
  users = {
    getProfile: () => this.get<any>('/users/me'),
    getStats: () => this.get<any>('/users/stats'),
    updateProfile: (data: any) => this.put<any>('/users/profile', data),
    toggleDemo: () => this.put<any>('/users/demo-toggle'),
  };
}

export const api = new ApiClient();
