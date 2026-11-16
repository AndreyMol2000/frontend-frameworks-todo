import { apiClient } from './apiClient';
import { credentialsSchema, settingsSchema } from '../utils/validation';
import type { AuthSession, Credentials, IUser, UserSettings } from '../types';
export const authService = {
  async login(input: Credentials): Promise<AuthSession> { return (await apiClient.post<AuthSession>('/auth/login', credentialsSchema.parse(input))).data; },
  async register(input: Credentials): Promise<AuthSession> { return (await apiClient.post<AuthSession>('/auth/register', credentialsSchema.parse(input))).data; },
  async emailAvailable(email: string): Promise<boolean> { return (await apiClient.get<{ available: boolean }>('/auth/email-available', { params: { email } })).data.available; },
  async profile(): Promise<IUser> { return (await apiClient.get<IUser>('/users/me')).data; },
  async settings(input: UserSettings): Promise<IUser> { return (await apiClient.patch<IUser>('/users/settings', settingsSchema.parse(input))).data; },
};
