import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import TodoList from '../../src/components/TodoList.vue';
import type { ITodoItem } from '../../src/types';
describe('TodoList', () => {
  it('показывает пустой результат, обновляет список после фильтра и передаёт события', async () => {
    const wrapper = mount(TodoList, { props: { todos: [], busy: false } }); expect(wrapper.text()).toContain('Задач пока нет');
    const todo: ITodoItem = { id: '1', userId: 'demo', title: 'Задача', completed: false, createdAt: '', tags: [] };
    await wrapper.setProps({ todos: [todo] }); expect(wrapper.text()).toContain('Задача'); expect(wrapper.text()).not.toContain('Задач пока нет');
    await wrapper.find('[role="checkbox"]').trigger('click'); expect(wrapper.emitted('toggle')?.[0]).toEqual(['1']);
    await wrapper.find('[aria-label="Удалить: Задача"]').trigger('click'); expect(wrapper.emitted('delete')?.[0]).toEqual(['1']);
    await wrapper.find('[aria-label="Изменить: Задача"]').trigger('click'); expect(wrapper.emitted('edit')?.[0]).toEqual(['1']); wrapper.unmount();
  });
});
