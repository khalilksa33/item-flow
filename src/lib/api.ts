/**
 * api.ts — Axios-based API client for item-flow backend.
 *
 * The JWT token is stored in sessionStorage so it's cleared on
 * browser close (more secure than localStorage).
 */
import axios, { AxiosInstance, AxiosError } from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || '/api';

// ── Token helpers ─────────────────────────────────────────────
const TOKEN_KEY = 'itemflow_token';

export const tokenStore = {
  get: (): string | null => sessionStorage.getItem(TOKEN_KEY),
  set: (token: string) => sessionStorage.setItem(TOKEN_KEY, token),
  clear: () => sessionStorage.removeItem(TOKEN_KEY),
};

// ── Axios instance ────────────────────────────────────────────
const api: AxiosInstance = axios.create({
  baseURL: API_BASE,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

// Attach Bearer token to every request
api.interceptors.request.use(config => {
  const token = tokenStore.get();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 globally — redirect to login
api.interceptors.response.use(
  response => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      tokenStore.clear();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// ── Generic CRUD helpers ──────────────────────────────────────
export async function apiGet<T>(path: string): Promise<T> {
  const { data } = await api.get<T>(path);
  return data;
}

export async function apiPost<T>(path: string, body: unknown): Promise<T> {
  const { data } = await api.post<T>(path, body);
  return data;
}

export async function apiPut<T>(path: string, body: unknown): Promise<T> {
  const { data } = await api.put<T>(path, body);
  return data;
}

export async function apiDelete(path: string): Promise<void> {
  await api.delete(path);
}

// ── Auth endpoints ────────────────────────────────────────────
export const authApi = {
  login: (username: string, password: string) =>
    apiPost<{ token: string; user: { id: string; username: string; role: string; lastLogin?: string } }>(
      '/auth/login', { username, password }
    ),
  logout: () => apiPost('/auth/logout', {}),
};

// ── Resource endpoints ────────────────────────────────────────
export const inventoryApi = {
  getAll: () => apiGet('/inventory'),
  getById: (id: string) => apiGet(`/inventory/${id}`),
  create: (body: unknown) => apiPost('/inventory', body),
  update: (id: string, body: unknown) => apiPut(`/inventory/${id}`, body),
  delete: (id: string) => apiDelete(`/inventory/${id}`),
};

export const customersApi = {
  getAll: () => apiGet('/customers'),
  create: (body: unknown) => apiPost('/customers', body),
  update: (id: string, body: unknown) => apiPut(`/customers/${id}`, body),
  delete: (id: string) => apiDelete(`/customers/${id}`),
};

export const vendorsApi = {
  getAll: () => apiGet('/vendors'),
  create: (body: unknown) => apiPost('/vendors', body),
  update: (id: string, body: unknown) => apiPut(`/vendors/${id}`, body),
  delete: (id: string) => apiDelete(`/vendors/${id}`),
};

export const salesApi = {
  getAll: () => apiGet('/sales'),
  create: (body: unknown) => apiPost('/sales', body),
  update: (id: string, body: unknown) => apiPut(`/sales/${id}`, body),
  delete: (id: string) => apiDelete(`/sales/${id}`),
};

export const quotationsApi = {
  getAll: () => apiGet('/quotations'),
  create: (body: unknown) => apiPost('/quotations', body),
  update: (id: string, body: unknown) => apiPut(`/quotations/${id}`, body),
  delete: (id: string) => apiDelete(`/quotations/${id}`),
};

export const invoicesApi = {
  getAll: () => apiGet('/invoices'),
  create: (body: unknown) => apiPost('/invoices', body),
  update: (id: string, body: unknown) => apiPut(`/invoices/${id}`, body),
  delete: (id: string) => apiDelete(`/invoices/${id}`),
};

export const usersApi = {
  getAll: () => apiGet('/users'),
  create: (body: unknown) => apiPost('/users', body),
  update: (id: string, body: unknown) => apiPut(`/users/${id}`, body),
  delete: (id: string) => apiDelete(`/users/${id}`),
};

export const categoriesApi = {
  getAll: () => apiGet('/categories'),
  create: (body: unknown) => apiPost('/categories', body),
  delete: (id: string) => apiDelete(`/categories/${id}`),
};

export const suppliersApi = {
  getAll: () => apiGet('/suppliers'),
  create: (body: unknown) => apiPost('/suppliers', body),
  update: (id: string, body: unknown) => apiPut(`/suppliers/${id}`, body),
  delete: (id: string) => apiDelete(`/suppliers/${id}`),
};

export const auditLogsApi = {
  getAll: () => apiGet('/audit-logs'),
  create: (body: unknown) => apiPost('/audit-logs', body),
};

export const settingsApi = {
  getAll: () => apiGet<Record<string, string>>('/settings'),
  update: (body: Record<string, string>) => apiPut<Record<string, string>>('/settings', body),
};

export const assetsApi = {
  getAll: () => apiGet('/assets'),
  getAnalytics: () => apiGet('/assets/analytics'),
  getById: (id: string) => apiGet(`/assets/${id}`),
  create: (body: unknown) => apiPost('/assets', body),
  update: (id: string, body: unknown) => apiPut(`/assets/${id}`, body),
  delete: (id: string) => apiDelete(`/assets/${id}`),
};

export default api;
