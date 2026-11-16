// Проверка реального HTTP-сервера: сначала npm run mock.
const base = 'http://127.0.0.1:3001/api';
async function call(path, method = 'GET', body, token) {
  const response = await fetch(base + path, {
    method,
    headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
    ...(body ? { body: JSON.stringify(body) } : {}),
  });
  return { status: response.status, data: await response.json() };
}
function check(value, message) { if (!value) throw new Error(message); }
const guest = await call('/todos'); check(guest.status === 401, 'Guest protection');
const auth = await call('/auth/login', 'POST', { email: 'student@example.com', password: 'Demo1234!' });
check(auth.status === 200, 'Login');
const token = auth.data.accessToken;
const invalid = await call('/todos', 'POST', { title: ' ' }, token); check(invalid.status === 400, 'Validation');
const created = await call('/todos', 'POST', { title: 'HTTP smoke test' }, token); check(created.status === 201, 'Create');
const id = created.data.id;
try {
  const updated = await call(`/todos/${id}`, 'PATCH', { completed: true }, token); check(updated.data.completed === true, 'Update');
  const list = await call('/todos', 'GET', null, token); check(list.data.some((todo) => todo.id === id), 'List');
} finally { const removed = await call(`/todos/${id}`, 'DELETE', null, token); check(removed.status === 200, 'Delete'); }
process.stdout.write('HTTP mock: guest protection, login, validation, CRUD — PASS\n');
