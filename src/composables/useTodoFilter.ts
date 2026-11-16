import { computed, type Ref, type ComputedRef } from 'vue';
import type { ITodoItem, TodoFilter } from '../types';
export function useTodoFilter(todos: Ref<ITodoItem[]>, filter: Ref<TodoFilter>, search: Ref<string>): ComputedRef<ITodoItem[]> {
  return computed(() => todos.value.filter((todo) =>
    (filter.value === 'all' || (filter.value === 'completed' ? todo.completed : !todo.completed)) &&
    todo.title.toLocaleLowerCase('ru').includes(search.value.trim().toLocaleLowerCase('ru')),
  ));
}
