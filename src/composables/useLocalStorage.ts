import { ref, watch, type Ref } from 'vue';

export function readStorage<T>(key: string, fallback: T): T {
  try { const value = localStorage.getItem(key); return value ? JSON.parse(value) as T : fallback; }
  catch { return fallback; }
}
export function writeStorage<T>(key: string, value: T): void {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch { /* Приложение остаётся доступным без хранилища. */ }
}
export function useLocalStorage<T>(key: string, fallback: T): Ref<T> {
  const value = ref(readStorage(key, fallback)) as Ref<T>;
  watch(value, (next) => writeStorage(key, next), { deep: true, flush: 'sync' });
  return value;
}
