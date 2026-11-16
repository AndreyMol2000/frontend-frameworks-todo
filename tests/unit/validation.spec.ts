import { describe, expect, it } from 'vitest';
import { createTodoSchema, titleSchema, credentialsSchema, settingsSchema, rule } from '../../src/utils/validation';
import { useValidation } from '../../src/composables/useValidation';
describe('Валидация', () => {
  it('принимает название и убирает пробелы', () => { expect(createTodoSchema.parse({ title: '  Учёба ' })).toEqual({ title: 'Учёба', tags: [] }); });
  it.each(['', '   ', 'a'.repeat(121)])('отклоняет некорректное название %s', (title) => { expect(titleSchema.safeParse(title).success).toBe(false); });
  it('проверяет email и пароль', () => {
    expect(credentialsSchema.safeParse({ email: 'bad', password: '123' }).success).toBe(false);
    expect(credentialsSchema.safeParse({ email: 'a@example.com', password: '12345678' }).success).toBe(true);
    expect(settingsSchema.safeParse({ dark: false, displayName: ' ' }).success).toBe(false);
  });
  it('создаёт правила Quasar', () => { expect(rule(titleSchema)('Задача')).toBe(true); expect(rule(titleSchema)('')).toBe('Введите название задачи'); });
  it('useValidation обновляет ошибки и очищает их после исправления', () => {
    const form = useValidation(titleSchema);
    expect(form.validate('')).toBeNull(); expect(form.valid.value).toBe(false); expect(form.errors.value).toContain('Введите название задачи');
    expect(form.validate('Тест')).toBe('Тест'); expect(form.valid.value).toBe(true);
  });
});
