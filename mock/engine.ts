// Один контракт mock API для json-server и автономного демо в браузере.
import { credentialsSchema, createTodoSchema, updateTodoSchema, settingsSchema } from '../src/utils/validation.ts';
import type { ITodoItem, IUser, AuthSession } from '../src/types/index.ts';
interface MockUser extends IUser { password: string }
export interface MockDatabase { users: MockUser[]; todos: ITodoItem[]; tags: { id: string; name: string }[] }
export interface MockRequest { method: string; path: string; body: unknown; token: string }
export interface MockReply { status: number; data: unknown }
const initial: MockDatabase = {
  users: [{ id: 'demo', email: 'student@example.com', password: 'Demo1234!', settings: { dark: false, displayName: 'Студент' } }],
  todos: [], tags: [{ id: 'study', name: 'Учёба' }, { id: 'personal', name: 'Личное' }],
};
export function createDatabase(): MockDatabase { return structuredClone(initial); }
export function publicUser(user: MockUser): IUser { return { id: user.id, email: user.email, settings: { ...user.settings } }; }
function token(id: string, kind: 'access' | 'refresh'): string {
  return `mock.${btoa(JSON.stringify({ sub: id, exp: Date.now() + (kind === 'access' ? 300_000 : 86_400_000), kind }))}.demo-only`;
}
function userFromToken(db: MockDatabase, value: string, kind: 'access' | 'refresh'): MockUser | undefined {
  try {
    const [prefix, payload, signature] = value.split('.');
    if (prefix !== 'mock' || !payload || signature !== 'demo-only') return;
    const claims = JSON.parse(atob(payload)) as { sub?: string; exp?: number; kind?: string };
    if (claims.kind !== kind || typeof claims.exp !== 'number' || claims.exp <= Date.now()) return;
    return db.users.find((user) => user.id === claims.sub);
  } catch { return; }
}
function session(user: MockUser): AuthSession { return { user: publicUser(user), accessToken: token(user.id, 'access'), refreshToken: token(user.id, 'refresh') }; }
const reply = (status: number, data: unknown): MockReply => ({ status, data });

export function handleRequest(db: MockDatabase, request: MockRequest): MockReply {
  const url = new URL(request.path, 'http://mock.local');
  const path = url.pathname.replace(/^\/api/, '');
  const method = request.method.toUpperCase();
  if (path === '/auth/email-available' && method === 'GET') return reply(200, { available: !db.users.some((u) => u.email === url.searchParams.get('email')?.toLowerCase()) });
  if ((path === '/auth/login' || path === '/auth/register') && method === 'POST') {
    const parsed = credentialsSchema.safeParse(request.body);
    if (!parsed.success) return reply(400, { message: parsed.error.issues[0]?.message });
    const { password } = parsed.data;
    const email = parsed.data.email.toLowerCase();
    let user = db.users.find((item) => item.email === email);
    if (path.endsWith('register')) {
      if (user) return reply(409, { message: 'Этот email уже занят' });
      user = { id: crypto.randomUUID(), email, password, settings: { dark: false, displayName: 'Студент' } };
      db.users.push(user);
    } else if (!user || user.password !== password) return reply(401, { message: 'Неверный email или пароль' });
    return reply(200, session(user));
  }
  if (path === '/auth/refresh' && method === 'POST') {
    const body = request.body as { refreshToken?: string } | null;
    const user = userFromToken(db, body?.refreshToken ?? '', 'refresh');
    return user ? reply(200, session(user)) : reply(401, { message: 'Войдите заново' });
  }
  const user = userFromToken(db, request.token, 'access');
  if (!user) return reply(401, { message: 'Необходим вход' });
  if (path === '/users/me' && method === 'GET') return reply(200, publicUser(user));
  if (path === '/users/settings' && method === 'PATCH') {
    const parsed = settingsSchema.safeParse(request.body);
    if (!parsed.success) return reply(400, { message: parsed.error.issues[0]?.message });
    user.settings = parsed.data; return reply(200, publicUser(user));
  }
  if (path === '/tags' && method === 'GET') return reply(200, db.tags);
  if (path === '/todos' && method === 'GET') return reply(200, db.todos.filter((todo) => todo.userId === user.id));
  if (path === '/todos' && method === 'POST') {
    const parsed = createTodoSchema.safeParse(request.body);
    if (!parsed.success) return reply(400, { message: parsed.error.issues[0]?.message });
    const todo: ITodoItem = { id: crypto.randomUUID(), userId: user.id, ...parsed.data, completed: false, createdAt: new Date().toISOString() };
    db.todos.push(todo); return reply(201, todo);
  }
  const id = path.match(/^\/todos\/([^/]+)$/)?.[1];
  const todo = db.todos.find((item) => item.id === id && item.userId === user.id);
  if (!todo) return reply(404, { message: 'Задача не найдена' });
  if (method === 'GET') return reply(200, todo);
  if (method === 'PATCH') {
    const parsed = updateTodoSchema.safeParse(request.body);
    if (!parsed.success) return reply(400, { message: parsed.error.issues[0]?.message });
    Object.assign(todo, parsed.data); return reply(200, todo);
  }
  if (method === 'DELETE') { db.todos = db.todos.filter((item) => item.id !== todo.id); return reply(200, {}); }
  return reply(404, { message: 'Маршрут не найден' });
}
