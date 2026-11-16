import type { RouteRecordRaw } from 'vue-router';
export const routes: RouteRecordRaw[] = [
  {
    path: '/', component: () => import('../layouts/MainLayout.vue'), meta: { requiresAuth: true },
    children: [
      { path: '', name: 'home', component: () => import('../pages/IndexPage.vue'), meta: { title: 'Мои задачи' } },
      { path: 'settings', name: 'settings', component: () => import('../pages/SettingsPage.vue'), meta: { title: 'Настройки' } },
    ],
  },
  { path: '/login', component: () => import('../layouts/AuthLayout.vue'), children: [{ path: '', name: 'login', component: () => import('../pages/LoginPage.vue'), meta: { title: 'Вход' } }] },
  { path: '/404', name: 'not-found', component: () => import('../pages/NotFoundPage.vue'), meta: { title: 'Страница не найдена' } },
  { path: '/:pathMatch(.*)*', redirect: '/404' },
];
