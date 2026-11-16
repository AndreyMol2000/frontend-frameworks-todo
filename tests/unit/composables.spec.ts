import { effectScope, ref } from 'vue';
import { describe, expect, it, vi } from 'vitest';
import { useTodoFilter } from '../../src/composables/useTodoFilter';
import { readStorage, writeStorage, useLocalStorage } from '../../src/composables/useLocalStorage';
import { useAsync } from '../../src/composables/useAsync';
import type { ITodoItem, TodoFilter } from '../../src/types';
describe('Composables', () => {
  it('фильтрует по статусу и ищет без учёта регистра', () => {
    const todos = ref<ITodoItem[]>([{ id: '1', userId: 'demo', title: 'Купить хлеб', completed: false, createdAt: '', tags: [] }, { id: '2', userId: 'demo', title: 'Учёба', completed: true, createdAt: '', tags: [] }]);
    const filter = ref<TodoFilter>('all'); const search = ref(''); const result = useTodoFilter(todos, filter, search);
    expect(result.value).toHaveLength(2);
    filter.value = 'active'; expect(result.value[0]?.id).toBe('1');
    filter.value = 'completed'; expect(result.value[0]?.id).toBe('2');
    filter.value = 'all'; search.value = ' УЧЁБА '; expect(result.value[0]?.id).toBe('2');
    search.value = 'нет совпадений'; expect(result.value).toHaveLength(0);
  });
  it('сохраняет состояние, переживает повреждённый JSON и недоступное хранилище', () => {
    const scope = effectScope();
    scope.run(() => { const value = useLocalStorage('test', ['a']); value.value.push('b'); expect(readStorage('test', [])).toEqual(['a', 'b']); }); scope.stop();
    localStorage.setItem('broken', '{'); expect(readStorage('broken', 12)).toBe(12);
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => { throw new Error('quota'); });
    expect(() => writeStorage('test', 3)).not.toThrow();
  });
  it('useAsync показывает загрузку, данные и ошибку', async () => {
    const operation = useAsync<string>(); const promise = operation.execute(async () => 'готово');
    expect(operation.loading.value).toBe(true); expect(await promise).toBe('готово'); expect(operation.loading.value).toBe(false);
    expect(await operation.execute(async () => { throw new Error('oops'); })).toBeNull(); expect(operation.error.value?.kind).toBe('business');
  });
});
