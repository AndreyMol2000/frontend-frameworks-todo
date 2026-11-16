import { mount, flushPromises } from '@vue/test-utils';
import { describe, expect, it, vi } from 'vitest';
import TodoForm from '../../src/components/TodoForm.vue';
describe('TodoForm', () => {
  it('не отправляет пустое название и очищает поле после успеха', async () => {
    const submit = vi.fn().mockResolvedValue(true); const wrapper = mount(TodoForm, { props: { submit, busy: false } });
    await wrapper.find('form').trigger('submit'); await flushPromises(); expect(submit).not.toHaveBeenCalled();
    await wrapper.find('input').setValue('Подготовить работу'); await wrapper.find('form').trigger('submit'); await flushPromises();
    expect(submit).toHaveBeenCalledWith('Подготовить работу'); expect(wrapper.find('input').element.value).toBe(''); wrapper.unmount();
  });
  it('сохраняет ввод при неудачной отправке', async () => {
    const wrapper = mount(TodoForm, { props: { submit: vi.fn().mockResolvedValue(false), busy: false } });
    await wrapper.find('input').setValue('Задача'); await wrapper.find('form').trigger('submit'); await flushPromises(); expect(wrapper.find('input').element.value).toBe('Задача'); wrapper.unmount();
  });
});
