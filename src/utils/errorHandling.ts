import axios from 'axios';
import { ZodError } from 'zod';
import type { AppError } from '../types';

export function normalizeError(error: unknown): AppError {
  if (error instanceof ZodError) return { kind: 'validation', message: error.issues[0]?.message ?? 'Проверьте данные', retryable: false };
  if (axios.isAxiosError<{ message?: string }>(error)) {
    if (!error.response) return { kind: 'network', message: 'Нет связи с сервером. Попробуйте ещё раз.', retryable: true };
    const status = error.response.status;
    if (status === 401) return { kind: 'auth', message: 'Проверьте данные входа или войдите заново.', retryable: false };
    if (status === 400 || status === 409) return { kind: 'validation', message: error.response.data.message ?? 'Проверьте введённые данные', retryable: false };
    if (status >= 500) return { kind: 'network', message: 'Сервер временно недоступен. Повторите попытку.', retryable: true };
  }
  return { kind: 'business', message: 'Не удалось выполнить действие. Попробуйте ещё раз.', retryable: false };
}

// Учебная замена Sentry: только тип ошибки и время, без паролей и личных данных.
const events: { kind: AppError['kind']; time: string }[] = [];
export const mockSentry = {
  capture(error: AppError): void { events.push({ kind: error.kind, time: new Date().toISOString() }); if (events.length > 50) events.shift(); },
  getEvents(): ReadonlyArray<{ kind: AppError['kind']; time: string }> { return [...events]; },
};
