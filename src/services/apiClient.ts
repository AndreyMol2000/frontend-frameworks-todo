import axios, { type InternalAxiosRequestConfig } from 'axios';
import type { AuthSession } from '../types';
import { readStorage, writeStorage } from '../composables/useLocalStorage';

type RetryConfig = InternalAxiosRequestConfig & { retriedAuth?: boolean; retries?: number };
export const sessionKey = 'todo-session';
export const apiClient = axios.create({ baseURL: import.meta.env.VITE_API_URL || '/api', timeout: 8000 });
if (import.meta.env.VITE_API_MODE !== 'server') {
  const { browserAdapter } = await import('./browserAdapter');
  apiClient.defaults.adapter = browserAdapter;
}
apiClient.interceptors.request.use((config) => {
  const session = readStorage<AuthSession | null>(sessionKey, null);
  if (session) config.headers.set('Authorization', `Bearer ${session.accessToken}`);
  return config;
});
let refreshInFlight: Promise<AuthSession> | null = null;
apiClient.interceptors.response.use((response) => response, async (error: unknown) => {
  if (!axios.isAxiosError(error) || !error.config) throw error;
  const config = error.config as RetryConfig;
  const authRequest = config.url?.startsWith('/auth/');
  if (error.response?.status === 401 && !config.retriedAuth && !authRequest) {
    const current = readStorage<AuthSession | null>(sessionKey, null);
    if (current) {
      config.retriedAuth = true;
      try {
        refreshInFlight ??= apiClient.post<AuthSession>('/auth/refresh', { refreshToken: current.refreshToken }).then((response) => response.data).finally(() => { refreshInFlight = null; });
        const session = await refreshInFlight;
        writeStorage(sessionKey, session);
        return apiClient.request(config);
      } catch { writeStorage(sessionKey, null); throw error; }
    }
  }
  // Повторяем только чтение: повтор POST мог бы создать дубликат задачи.
  if ((!error.response || error.response.status >= 500) && config.method === 'get' && (config.retries ?? 0) < 2 && !config.signal?.aborted) {
    config.retries = (config.retries ?? 0) + 1;
    await new Promise((resolve) => setTimeout(resolve, 200 * (config.retries ?? 1)));
    return apiClient.request(config);
  }
  throw error;
});
