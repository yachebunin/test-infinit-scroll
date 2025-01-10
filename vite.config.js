import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

/**
 * Конфигурация Vite.
 */
export default defineConfig({
  plugins: [vue()],
  server: {
    port: 5173
  }
});
