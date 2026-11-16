import { computed, ref } from 'vue';
import { defineStore } from 'pinia';
import { Dark, Notify } from 'quasar';
import { useLocalStorage } from '../composables/useLocalStorage';
import { normalizeError, mockSentry } from '../utils/errorHandling';
import type { AppError } from '../types';

export const useUiStore = defineStore('ui', () => {
  const dark = useLocalStorage('todo-dark', false);
  const drawer = ref(false);
  const error = ref<AppError | null>(null);
  const isDark = computed(() => dark.value);
  const drawerOpen = computed(() => drawer.value);
  const currentError = computed(() => error.value);
  function setDark(value: boolean): void { dark.value = value; Dark.set(value); }
  function setDrawer(value: boolean): void { drawer.value = value; }
  function clearError(): void { error.value = null; }
  function handleError(reason: unknown): void { error.value = normalizeError(reason); mockSentry.capture(error.value); }
  function notify(message: string): void { Notify.create({ message, type: 'positive', timeout: 1500 }); }
  return { dark, drawer, error, isDark, drawerOpen, currentError, setDark, setDrawer, clearError, handleError, notify };
});
