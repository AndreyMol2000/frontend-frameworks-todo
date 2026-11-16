import { defineConfig } from 'vitest/config';
import vue from '@vitejs/plugin-vue';
export default defineConfig({
  plugins: [vue()],
  resolve: { alias: { quasar: 'quasar/dist/quasar.client.js' } },
  test: {
    environment: 'jsdom',
    setupFiles: ['tests/setup.ts'],
    include: ['tests/**/*.spec.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'json-summary'],
      include: ['src/composables/**/*.ts', 'src/stores/**/*.ts', 'src/utils/**/*.ts', 'src/services/**/*.ts', 'mock/engine.ts'],
      exclude: ['src/stores/index.ts', 'src/services/types.ts'],
      thresholds: { lines: 80, statements: 80, functions: 80, branches: 80 },
    },
  },
});
