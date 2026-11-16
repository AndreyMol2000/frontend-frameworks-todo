import { describe, expect, it } from 'vitest';
import { createDatabase, handleRequest, type MockDatabase } from '../../mock/engine';
import type { AuthSession, ITodoItem } from '../../src/types';
const request = (db: MockDatabase, path: string, method = 'GET', body: unknown = null, token = '') => handleRequest(db, { path: `/api${path}`, method, body, token });
function login(db: MockDatabase): AuthSession { return request(db, '/auth/login', 'POST', { email: 'student@example.com', password: 'Demo1234!' }).data as AuthSession; }
describe('Mock API', () => {
  it('защищает маршруты и проверяет вход', () => {
    const db = createDatabase();
    expect(request(db, '/todos').status).toBe(401);
    expect(request(db, '/todos', 'GET', null, 'invalid').status).toBe(401);
    expect(request(db, '/todos', 'GET', null, 'mock.bad.demo-only').status).toBe(401);
    expect(request(db, '/auth/login', 'POST', {}).status).toBe(400);
    expect(request(db, '/auth/login', 'POST', { email: 'student@example.com', password: 'wrong1234' }).status).toBe(401);
  });
  it('поддерживает CRUD, валидацию и изоляцию пользователей', () => {
    const db = createDatabase(); const token = login(db).accessToken;
    expect(request(db, '/todos', 'POST', { title: '' }, token).status).toBe(400);
    const todo = request(db, '/todos', 'POST', { title: 'Задача' }, token).data as ITodoItem;
    expect(request(db, '/todos', 'GET', null, token).data).toEqual([todo]);
    expect(request(db, `/todos/${todo.id}`, 'GET', null, token).data).toEqual(todo);
    expect(request(db, `/todos/${todo.id}`, 'PATCH', { completed: 'bad' }, token).status).toBe(400);
    expect((request(db, `/todos/${todo.id}`, 'PATCH', { completed: true, title: 'Новое' }, token).data as ITodoItem).completed).toBe(true);
    const other = request(db, '/auth/register', 'POST', { email: 'other@example.com', password: 'Demo1234!' }).data as AuthSession;
    expect(request(db, '/todos', 'GET', null, other.accessToken).data).toEqual([]);
    expect(request(db, `/todos/${todo.id}`, 'DELETE', null, other.accessToken).status).toBe(404);
    expect(request(db, `/todos/${todo.id}`, 'PUT', {}, token).status).toBe(404);
    expect(request(db, `/todos/${todo.id}`, 'DELETE', null, token).status).toBe(200);
    expect(request(db, '/todos', 'GET', null, token).data).toEqual([]);
  });
  it('регистрирует, проверяет уникальность и обновляет токены', () => {
    const db = createDatabase(); const session = login(db);
    expect(request(db, '/auth/register', 'POST', { email: 'student@example.com', password: 'Demo1234!' }).status).toBe(409);
    expect(request(db, '/auth/email-available?email=student@example.com').data).toEqual({ available: false });
    expect(request(db, '/auth/email-available?email=new@example.com').data).toEqual({ available: true });
    expect(request(db, '/auth/refresh', 'POST', { refreshToken: session.refreshToken }).status).toBe(200);
    expect(request(db, '/auth/refresh', 'POST', {}).status).toBe(401);
    expect(request(db, '/auth/refresh', 'POST', { refreshToken: session.accessToken }).status).toBe(401);
    expect(request(db, '/users/me', 'GET', null, session.accessToken).data).toEqual(session.user);
    expect(request(db, '/users/settings', 'PATCH', { dark: 'bad' }, session.accessToken).status).toBe(400);
    expect(request(db, '/users/settings', 'PATCH', { dark: true, displayName: 'Тест' }, session.accessToken).status).toBe(200);
    expect(request(db, '/tags', 'GET', null, session.accessToken).status).toBe(200);
    expect(request(db, '/missing', 'GET', null, session.accessToken).status).toBe(404);
    const expired = `mock.${btoa(JSON.stringify({ sub: 'demo', kind: 'access', exp: 1 }))}.demo-only`;
    expect(request(db, '/todos', 'GET', null, expired).status).toBe(401);
  });
});
