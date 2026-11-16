import { apiClient } from './apiClient';
import { createTodoSchema, updateTodoSchema } from '../utils/validation';
import type { ITodoItem, CreateTodo, UpdateTodo } from '../types';
export const todoService = {
  async list(signal?: AbortSignal): Promise<ITodoItem[]> { return (await apiClient.get<ITodoItem[]>('/todos', { signal })).data; },
  async create(input: CreateTodo): Promise<ITodoItem> { return (await apiClient.post<ITodoItem>('/todos', createTodoSchema.parse(input))).data; },
  async update(id: string, input: UpdateTodo): Promise<ITodoItem> { return (await apiClient.patch<ITodoItem>(`/todos/${encodeURIComponent(id)}`, updateTodoSchema.parse(input))).data; },
  async remove(id: string): Promise<void> { await apiClient.delete(`/todos/${encodeURIComponent(id)}`); },
};
