import type { App } from 'vue';
import { normalizeError, mockSentry } from './utils/errorHandling';
export function installErrorHandlers(app: App): void {
  app.config.errorHandler = (reason): void => { mockSentry.capture(normalizeError(reason)); };
  window.addEventListener('unhandledrejection', (event: PromiseRejectionEvent): void => { mockSentry.capture(normalizeError(event.reason)); });
  // Метрика хранится локально; внешней аналитики и передачи данных нет.
  if ('PerformanceObserver' in window) {
    const observer = new PerformanceObserver((list) => {
      const last = list.getEntries().at(-1);
      if (last) sessionStorage.setItem('todo-lcp-ms', String(Math.round(last.startTime)));
    });
    try { observer.observe({ type: 'largest-contentful-paint', buffered: true }); } catch { observer.disconnect(); }
    window.addEventListener('pagehide', () => observer.disconnect(), { once: true });
  }
}
