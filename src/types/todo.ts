export type TodoFilter = 'all' | 'active' | 'completed';
export interface ITodoItem {
  id: string;
  userId: string;
  title: string;
  completed: boolean;
  createdAt: string;
  tags: string[];
}
export type CreateTodo = Pick<ITodoItem, 'title'> & Partial<Pick<ITodoItem, 'tags'>>;
export type UpdateTodo = Partial<Pick<ITodoItem, 'title' | 'completed' | 'tags'>>;
