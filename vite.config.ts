// Quasar CLI создает Vite config из quasar.config.js.
// Этот config используется только командой npm run preview.
import { defineConfig } from 'vite';
export default defineConfig({ preview: { port: 4173, host: '127.0.0.1' } });
