import { z } from 'zod';

export const titleSchema = z.string().trim().min(1, 'Введите название задачи').max(120, 'Не больше 120 символов');
export const emailSchema = z.email('Введите корректный email');
export const passwordSchema = z.string().min(8, 'Минимум 8 символов').max(100, 'Не больше 100 символов');
export const credentialsSchema = z.object({ email: emailSchema, password: passwordSchema });
export const createTodoSchema = z.object({ title: titleSchema, tags: z.array(z.string().max(30)).max(10).default([]) });
export const updateTodoSchema = z.object({ title: titleSchema.optional(), completed: z.boolean().optional(), tags: z.array(z.string().max(30)).max(10).optional() });
export const settingsSchema = z.object({ dark: z.boolean(), displayName: z.string().trim().min(1, 'Введите имя').max(40, 'Не больше 40 символов') });

export function rule(schema: z.ZodType): (value: string) => true | string {
  return (value: string): true | string => {
    const result = schema.safeParse(value);
    return result.success ? true : (result.error.issues[0]?.message ?? 'Проверьте значение');
  };
}
