import { computed, ref } from 'vue';
import type { z } from 'zod';
export function useValidation<T>(schema: z.ZodType<T>) {
  const errors = ref<string[]>([]);
  const valid = computed(() => errors.value.length === 0);
  function validate(value: unknown): T | null {
    const result = schema.safeParse(value);
    errors.value = result.success ? [] : result.error.issues.map((issue) => issue.message);
    return result.success ? result.data : null;
  }
  return { errors, valid, validate };
}
