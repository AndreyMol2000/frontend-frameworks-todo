import { AxiosError } from 'axios';
import { describe, expect, it } from 'vitest';
import { normalizeError, mockSentry } from '../../src/utils/errorHandling';
import { titleSchema } from '../../src/utils/validation';
describe('Ошибки', () => {
  it('распознаёт Zod и неизвестные ошибки', () => {
    const result = titleSchema.safeParse('');
    if (!result.success) expect(normalizeError(result.error).kind).toBe('validation');
    expect(normalizeError(new Error('private detail')).message).not.toContain('private detail');
  });
  it('распознаёт сеть и HTTP статусы', () => {
    expect(normalizeError(new AxiosError('offline')).retryable).toBe(true);
    for (const [status, kind] of [[401, 'auth'], [400, 'validation'], [409, 'validation'], [503, 'network'], [404, 'business']] as const) {
      const error = new AxiosError('error'); error.response = { status, data: {}, statusText: '', headers: {}, config: { headers: {} } } as never;
      expect(normalizeError(error).kind).toBe(kind);
    }
  });
  it('ограничивает локальный журнал и не записывает содержимое ошибок', () => {
    for (let i = 0; i < 55; i++) mockSentry.capture({ kind: 'network', message: 'secret', retryable: true });
    expect(mockSentry.getEvents()).toHaveLength(50); expect(JSON.stringify(mockSentry.getEvents())).not.toContain('secret');
  });
});
