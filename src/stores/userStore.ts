import { computed, ref } from 'vue';
import { defineStore } from 'pinia';
import { useLocalStorage, readStorage, writeStorage } from '../composables/useLocalStorage';
import { authService } from '../services/authService';
import { sessionKey } from '../services/apiClient';
import { useUiStore } from './uiStore';
import type { AuthSession, Credentials, UserSettings } from '../types';

export const useUserStore = defineStore('user', () => {
  const session = useLocalStorage<AuthSession | null>(sessionKey, null);
  const busy = ref(false);
  const isAuthenticated = computed(() => session.value !== null && Boolean(readStorage<AuthSession | null>(sessionKey, null)));
  const currentUser = computed(() => session.value?.user ?? null);
  const isBusy = computed(() => busy.value);
  async function signIn(credentials: Credentials, register = false): Promise<boolean> {
    const ui = useUiStore(); ui.clearError(); busy.value = true;
    try {
      if (register && !(await authService.emailAvailable(credentials.email))) {
        ui.handleError(new Error('Email already exists'));
        ui.error = { kind: 'validation', message: 'Этот email уже занят', retryable: false };
        return false;
      }
      session.value = await (register ? authService.register(credentials) : authService.login(credentials));
      ui.setDark(session.value.user.settings.dark);
      return true;
    } catch (reason) { ui.handleError(reason); return false; }
    finally { busy.value = false; }
  }
  async function saveSettings(settings: UserSettings): Promise<boolean> {
    const ui = useUiStore(); ui.clearError(); busy.value = true;
    try {
      const user = await authService.settings(settings);
      const updated = readStorage<AuthSession | null>(sessionKey, null);
      if (updated) session.value = { ...updated, user };
      ui.setDark(settings.dark); ui.notify('Настройки сохранены'); return true;
    } catch (reason) { ui.handleError(reason); return false; }
    finally { busy.value = false; }
  }
  function logout(): void { session.value = null; writeStorage(sessionKey, null); useUiStore().clearError(); }
  return { session, busy, isAuthenticated, currentUser, isBusy, signIn, saveSettings, logout };
});
