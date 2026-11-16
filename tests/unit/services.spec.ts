import { describe, expect, it, vi } from 'vitest';
import { AxiosError, AxiosHeaders, type AxiosAdapter } from 'axios';
import { apiClient, sessionKey } from '../../src/services/apiClient';
import { authService } from '../../src/services/authService';
import { todoService } from '../../src/services/todoService';
import { browserAdapter } from '../../src/services/browserAdapter';
import { useApi } from '../../src/composables/useApi';
import { readStorage, writeStorage } from '../../src/composables/useLocalStorage';
import type { AuthSession } from '../../src/types';
async function login(): Promise<AuthSession> {
  const session = await authService.login({ email: 'student@example.com', password: 'Demo1234!' }); writeStorage(sessionKey, session); return session;
}
describe('Сервисы и общий API клиент', () => {
  it('входит, выполняет CRUD и сохраняет настройки через mock adapter', async () => {
    await login();
    expect((await authService.profile()).email).toBe('student@example.com');
    expect((await authService.settings({ dark: true, displayName: 'Тест' })).settings.dark).toBe(true);
    expect(await todoService.list()).toEqual([]);
    const todo = await todoService.create({ title: 'Задача' }); expect(todo.title).toBe('Задача');
    expect((await todoService.update(todo.id, { completed: true })).completed).toBe(true);
    expect(await todoService.list()).toHaveLength(1); await todoService.remove(todo.id); expect(await todoService.list()).toEqual([]);
    const result = useApi<number>(); expect(await result.execute(async () => 1)).toBe(1);
  }, 10000);
  it('проверяет email, регистрацию и ошибки ввода', async () => {
    expect(await authService.emailAvailable('student@example.com')).toBe(false);
    expect(await authService.emailAvailable('new@example.com')).toBe(true);
    expect((await authService.register({ email: 'new@example.com', password: 'Demo1234!' })).user.email).toBe('new@example.com');
    await expect(authService.login({ email: 'bad', password: '' })).rejects.toThrow();
    await expect(authService.login({ email: 'none@example.com', password: 'wrong1234' })).rejects.toMatchObject({ response: { status: 401 } });
    await expect(todoService.create({ title: ' ' })).rejects.toThrow();
  });
  it('автоматически обновляет истёкший access token и повторяет исходное чтение', async () => {
    const session = await login();
    session.accessToken = `mock.${btoa(JSON.stringify({ sub: 'demo', kind: 'access', exp: 1 }))}.demo-only`;
    writeStorage(sessionKey, session);
    await Promise.all([todoService.list(), authService.profile()]);
    expect(readStorage<AuthSession | null>(sessionKey, null)?.accessToken).not.toBe(session.accessToken);
  });
  it('очищает недействительную сессию после отказа refresh', async () => {
    writeStorage(sessionKey, { user: { id: 'demo' }, accessToken: 'invalid', refreshToken: 'invalid' });
    await expect(todoService.list()).rejects.toMatchObject({ response: { status: 401 } }); expect(readStorage(sessionKey, null)).toBeNull();
  });
  it('возвращает ошибку 401 без сессии', async () => { await expect(todoService.list()).rejects.toMatchObject({ response: { status: 401 } }); });
  it('повторяет только сетевые GET, а не POST', async () => {
    const previous = apiClient.defaults.adapter;
    const adapter = vi.fn<AxiosAdapter>().mockImplementation(async (config) => {
      if (adapter.mock.calls.length <= 2) throw new AxiosError('offline', 'ERR_NETWORK', config);
      return { data: [], status: 200, statusText: 'OK', headers: new AxiosHeaders(), config };
    });
    apiClient.defaults.adapter = adapter;
    try {
      expect(await todoService.list()).toEqual([]); expect(adapter).toHaveBeenCalledTimes(3);
      adapter.mockReset().mockImplementation(async (config) => { throw new AxiosError('offline', 'ERR_NETWORK', config); });
      await expect(todoService.create({ title: 'Задача' })).rejects.toThrow(); expect(adapter).toHaveBeenCalledTimes(1);
      adapter.mockClear(); await expect(todoService.list()).rejects.toThrow(); expect(adapter).toHaveBeenCalledTimes(3);
    } finally { apiClient.defaults.adapter = previous; }
  });
  it('поддерживает отмену запросов без изменения данных', async () => {
    const controller = new AbortController();
    const request = browserAdapter({ method: 'get', url: '/todos', headers: new AxiosHeaders(), signal: controller.signal });
    controller.abort(); await expect(request).rejects.toMatchObject({ code: 'ERR_CANCELED' });
  });
});
