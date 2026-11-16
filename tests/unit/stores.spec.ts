import { createPinia, setActivePinia } from 'pinia';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { AxiosError } from 'axios';
import { useTodoStore } from '../../src/stores/todoStore';
import { useUserStore } from '../../src/stores/userStore';
import { useUiStore } from '../../src/stores/uiStore';
import { useErrorHandler } from '../../src/composables/useErrorHandler';
import { todoService } from '../../src/services/todoService';
import { authService } from '../../src/services/authService';
import type { AuthSession, ITodoItem } from '../../src/types';
vi.mock('../../src/services/todoService', () => ({ todoService: { list: vi.fn(), create: vi.fn(), update: vi.fn(), remove: vi.fn() } }));
vi.mock('../../src/services/authService', () => ({ authService: { login: vi.fn(), register: vi.fn(), emailAvailable: vi.fn(), settings: vi.fn() } }));
const session: AuthSession = { user: { id: 'demo', email: 'a@example.com', settings: { displayName: 'Студент', dark: false } }, accessToken: 'mock-token', refreshToken: 'mock-refresh' };
const todo: ITodoItem = { id: '1', userId: 'demo', title: 'Учёба', completed: false, createdAt: '2026-01-01', tags: [] };
beforeEach(() => { setActivePinia(createPinia()); vi.clearAllMocks(); vi.spyOn(useUiStore(), 'notify').mockImplementation(() => undefined); });
async function signIn(): Promise<void> { vi.mocked(authService.login).mockResolvedValue(structuredClone(session)); await useUserStore().signIn({ email: 'a@example.com', password: '12345678' }); }
describe('TodoStore', () => {
  it('загружает, кэширует, фильтрует и выполняет CRUD', async () => {
    await signIn(); const store = useTodoStore();
    vi.mocked(todoService.list).mockResolvedValue([todo]);
    expect(await store.load()).toBe(true); await store.load(); expect(todoService.list).toHaveBeenCalledTimes(1);
    await store.load(true); expect(todoService.list).toHaveBeenCalledTimes(2);
    expect(store.stats).toEqual({ total: 1, completed: 0 });
    store.setSearch('не найдено'); expect(store.filteredTodos).toEqual([]); store.setSearch('');
    store.setFilter('completed'); expect(store.filteredTodos).toEqual([]); store.setFilter('all');
    vi.mocked(todoService.create).mockResolvedValue({ ...todo, id: '2' }); expect(await store.add('Учёба')).toBe(true); expect(store.stats.total).toBe(2);
    vi.mocked(todoService.update).mockResolvedValue({ ...todo, completed: true }); await store.toggle('1'); expect(store.stats.completed).toBe(1);
    expect(await store.toggle('missing')).toBe(false);
    vi.mocked(todoService.remove).mockResolvedValue(); expect(await store.remove('1')).toBe(true); expect(store.stats.total).toBe(1);
    store.reset(); expect(store.stats.total).toBe(0); expect(store.currentFilter).toBe('all'); expect(store.searchQuery).toBe(''); expect(store.isBusy).toBe(false);
  });
  it('не меняет список при ошибке и показывает понятное сообщение', async () => {
    await signIn(); const store = useTodoStore();
    vi.mocked(todoService.create).mockRejectedValue(new AxiosError('offline'));
    expect(await store.add('Задача')).toBe(false); expect(store.stats.total).toBe(0); expect(useUiStore().currentError?.retryable).toBe(true);
    vi.mocked(todoService.list).mockRejectedValue(new Error('server'));
    expect(await store.load(true)).toBe(false); expect(store.isBusy).toBe(false);
  });
  it('не показывает данные другого пользователя после выхода во время запроса', async () => {
    await signIn(); let resolve: (value: ITodoItem[]) => void = () => undefined;
    vi.mocked(todoService.list).mockImplementation(() => new Promise((done) => { resolve = done; }));
    const store = useTodoStore(); const loading = store.load(); useUserStore().logout(); resolve([todo]); await loading;
    expect(store.filteredTodos).toEqual([]);
  });
});
describe('UserStore и UIStore', () => {
  it('входит, сохраняет настройки и выходит', async () => {
    await signIn(); const user = useUserStore(); expect(user.isAuthenticated).toBe(true);
    vi.mocked(authService.settings).mockResolvedValue({ ...session.user, settings: { displayName: 'Тест', dark: true } });
    expect(await user.saveSettings({ displayName: 'Тест', dark: true })).toBe(true); expect(user.currentUser?.settings.displayName).toBe('Тест'); expect(useUiStore().isDark).toBe(true);
    user.logout(); expect(user.isAuthenticated).toBe(false); expect(user.currentUser).toBeNull();
  });
  it('проверяет email при регистрации и обрабатывает ошибки', async () => {
    const user = useUserStore(); const credentials = { email: 'a@example.com', password: '12345678' };
    vi.mocked(authService.emailAvailable).mockResolvedValue(false); expect(await user.signIn(credentials, true)).toBe(false); expect(useUiStore().currentError?.message).toContain('занят');
    vi.mocked(authService.emailAvailable).mockResolvedValue(true); vi.mocked(authService.register).mockResolvedValue(structuredClone(session));
    expect(await user.signIn(credentials, true)).toBe(true);
    vi.mocked(authService.login).mockRejectedValue(new Error('private')); expect(await user.signIn(credentials)).toBe(false); expect(user.isBusy).toBe(false);
    vi.mocked(authService.settings).mockRejectedValue(new Error('private')); expect(await user.saveSettings({ displayName: 'Тест', dark: false })).toBe(false);
  });
  it('управляет панелью и централизованной ошибкой', () => {
    const ui = useUiStore(); ui.setDrawer(true); expect(ui.drawerOpen).toBe(true); ui.setDrawer(false); expect(ui.drawerOpen).toBe(false);
    useErrorHandler().handleError(new Error('oops')); expect(ui.currentError?.kind).toBe('business'); ui.clearError(); expect(ui.currentError).toBeNull();
  });
});
