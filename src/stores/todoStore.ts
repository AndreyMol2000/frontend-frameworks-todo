import { computed, ref } from 'vue';
import { defineStore } from 'pinia';
import { useLocalStorage } from '../composables/useLocalStorage';
import { useTodoFilter } from '../composables/useTodoFilter';
import { todoService } from '../services/todoService';
import { useUserStore } from './userStore';
import { useUiStore } from './uiStore';
import type { ITodoItem, TodoFilter, UpdateTodo } from '../types';

export const useTodoStore = defineStore('todos', () => {
  const todos = useLocalStorage<ITodoItem[]>('todo-cache', []);
  const filter = ref<TodoFilter>('all');
  const search = ref('');
  const busy = ref(false);
  const loadedFor = ref('');
  const loadedAt = ref(0);
  const ownTodos = computed(() => todos.value.filter((todo) => todo.userId === useUserStore().currentUser?.id));
  const filteredTodos = useTodoFilter(ownTodos, filter, search);
  const currentFilter = computed(() => filter.value);
  const searchQuery = computed(() => search.value);
  const isBusy = computed(() => busy.value);
  const stats = computed(() => ({ total: ownTodos.value.length, completed: ownTodos.value.filter((todo) => todo.completed).length }));
  async function run(operation: () => Promise<void>): Promise<boolean> {
    const ui = useUiStore(); ui.clearError(); busy.value = true;
    try { await operation(); return true; }
    catch (reason) { ui.handleError(reason); return false; }
    finally { busy.value = false; }
  }
  async function load(force = false, signal?: AbortSignal): Promise<boolean> {
    const userId = useUserStore().currentUser?.id ?? '';
    if (!force && loadedFor.value === userId && Date.now() - loadedAt.value < 30_000) return true;
    return run(async () => {
      const items = await todoService.list(signal);
      if (useUserStore().currentUser?.id !== userId) return;
      todos.value = items; loadedAt.value = Date.now(); loadedFor.value = userId;
    });
  }
  async function add(title: string): Promise<boolean> {
    return run(async () => { const todo = await todoService.create({ title }); todos.value = [...todos.value, todo]; useUiStore().notify('Задача добавлена'); });
  }
  async function update(id: string, input: UpdateTodo): Promise<boolean> {
    return run(async () => { const updated = await todoService.update(id, input); todos.value = todos.value.map((todo) => todo.id === id ? updated : todo); });
  }
  async function toggle(id: string): Promise<boolean> {
    const todo = ownTodos.value.find((item) => item.id === id);
    return todo ? update(id, { completed: !todo.completed }) : false;
  }
  async function remove(id: string): Promise<boolean> {
    return run(async () => { await todoService.remove(id); todos.value = todos.value.filter((todo) => todo.id !== id); });
  }
  function setFilter(value: TodoFilter): void { filter.value = value; }
  function setSearch(value: string): void { search.value = value; }
  function reset(): void { todos.value = []; loadedFor.value = ''; loadedAt.value = 0; filter.value = 'all'; search.value = ''; }
  return { todos, filter, search, busy, loadedFor, loadedAt, filteredTodos, currentFilter, searchQuery, isBusy, stats, load, add, update, toggle, remove, setFilter, setSearch, reset };
});
