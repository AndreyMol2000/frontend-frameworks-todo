import { AxiosError, AxiosHeaders, type AxiosAdapter, type AxiosResponse } from 'axios';
import { createDatabase, handleRequest, type MockDatabase } from '../../mock/engine';
import { readStorage, writeStorage } from '../composables/useLocalStorage';

// На GitHub Pages нет Node.js. Этот adapter исполняет тот же mock API локально.
export const browserAdapter: AxiosAdapter = async (config) => {
  await new Promise<void>((resolve, reject) => {
    const timer = setTimeout(resolve, 250);
    config.signal?.addEventListener?.('abort', () => { clearTimeout(timer); reject(new AxiosError('Cancelled', 'ERR_CANCELED', config)); }, { once: true });
  });
  if (config.signal?.aborted) throw new AxiosError('Cancelled', 'ERR_CANCELED', config);
  const db = readStorage<MockDatabase>('todo-demo-db', createDatabase());
  const url = new URL(config.url ?? '/', 'http://mock.local');
  if (config.params) for (const [key, value] of Object.entries(config.params as Record<string, string>)) url.searchParams.set(key, value);
  const result = handleRequest(db, {
    method: config.method ?? 'GET', path: url.pathname + url.search,
    body: typeof config.data === 'string' ? JSON.parse(config.data) as unknown : config.data,
    token: String(config.headers.get('Authorization') ?? '').replace(/^Bearer /, ''),
  });
  writeStorage('todo-demo-db', db);
  const response: AxiosResponse = { data: structuredClone(result.data), status: result.status, statusText: String(result.status), config, headers: new AxiosHeaders() };
  if (result.status >= 400) throw new AxiosError('Mock API error', 'ERR_BAD_RESPONSE', config, undefined, response);
  return response;
};
