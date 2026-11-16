import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import TodoItem from '../../src/components/TodoItem.vue';
import type { ITodoItem } from '../../src/types';
const todo: ITodoItem = { id: '1', userId: 'demo', title: 'Учёба', completed: false, createdAt: '2026-06-13T12:00:00Z', tags: [] };
describe('TodoItem', () => {
  it('показывает задачу и дату, передаёт toggle/delete/edit', async () => {
    const wrapper = mount(TodoItem, { props: { todo, busy: false } });
    expect(wrapper.text()).toContain('Учёба'); expect(wrapper.text()).toContain('13/06/2026');
    await wrapper.find('[role="checkbox"]').trigger('click'); expect(wrapper.emitted('toggle')?.[0]).toEqual(['1']);
    await wrapper.find('[aria-label="Удалить: Учёба"]').trigger('click'); expect(wrapper.emitted('delete')?.[0]).toEqual(['1']);
    await wrapper.find('[aria-label="Изменить: Учёба"]').trigger('click'); expect(wrapper.emitted('edit')?.[0]).toEqual(['1']);
    await wrapper.setProps({ todo: { ...todo, completed: true } }); expect(wrapper.find('.text-strike').exists()).toBe(true); wrapper.unmount();
  });
  it('блокирует действия при загрузке', () => { const wrapper = mount(TodoItem, { props: { todo, busy: true } }); expect(wrapper.find('button').attributes('disabled')).toBeDefined(); wrapper.unmount(); });
});
