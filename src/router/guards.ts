import type { RouteLocationNormalized, NavigationGuardReturn } from 'vue-router';
import { useUserStore } from '../stores/userStore';
export function authGuard(to: RouteLocationNormalized): NavigationGuardReturn {
  const user = useUserStore();
  if (to.meta.requiresAuth && !user.isAuthenticated) return { name: 'login', query: { redirect: to.fullPath } };
  if (to.name === 'login' && user.isAuthenticated) return { name: 'home' };
  return true;
}
export function safeRedirect(value: unknown): string {
  return typeof value === 'string' && (value === '/' || value === '/settings') ? value : '/';
}
