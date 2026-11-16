import { defineConfig } from '#q-app';

export default defineConfig((ctx) => ({
  boot: ['init'],
  css: [],
  extras: ['material-icons'],
  animations: ['fadeIn', 'fadeOut'],
  framework: { lang: 'ru', plugins: ['Notify', 'Dialog', 'Meta'] },
  build: {
    env: { clientPrefix: 'VITE_', file: [ctx.dev ? '.env.development' : '.env.production', '.env.local'] },
    vueRouterMode: 'hash',
    publicPath: process.env.PUBLIC_PATH || '/',
    sourcemap: false,
    target: { browser: ['es2022'], node: 'node24' },
    extendViteConf(config) {
      config.build ??= {};
      config.build.reportCompressedSize = true;
      config.build.emptyOutDir = true;
    },
  },
  devServer: {
    host: '127.0.0.1',
    port: 9000,
    open: false,
    proxy: { '/api': { target: 'http://127.0.0.1:3001', changeOrigin: true } },
  },
}));
