import { defineRouter } from '#q-app';
import { createRouter, createWebHashHistory } from 'vue-router';
import { routes } from './routes';
import { authGuard } from './guards';
declare module 'vue-router' { interface RouteMeta { title?: string; requiresAuth?: boolean } }
export default defineRouter(() => {
  const router = createRouter({ history: createWebHashHistory(import.meta.env.BASE_URL), routes, scrollBehavior: () => ({ top: 0 }) });
  router.beforeEach(authGuard);
  router.afterEach((to) => {
    document.title = `${to.meta.title ?? 'Мои задачи'} — учебный ToDo`;
    document.querySelector('meta[property="og:title"]')?.setAttribute('content', document.title);
    document.querySelector('meta[name="description"]')?.setAttribute('content', `${to.meta.title ?? 'Мои задачи'}. Учебное приложение на Vue 3 и Quasar.`);
  });
  return router;
});
