import { ref, shallowRef } from 'vue';
import type { AppError } from '../types';
import { normalizeError } from '../utils/errorHandling';
export function useAsync<T>() {
  const loading = ref(false);
  const data = shallowRef<T | null>(null);
  const error = ref<AppError | null>(null);
  async function execute(operation: () => Promise<T>): Promise<T | null> {
    loading.value = true; error.value = null;
    try { data.value = await operation(); return data.value; }
    catch (reason) { error.value = normalizeError(reason); return null; }
    finally { loading.value = false; }
  }
  return { loading, data, error, execute };
}
