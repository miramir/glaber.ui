/// <reference types="vitest" />
import { defineConfig } from 'vite';
import * as path from 'path';
import copy from 'rollup-plugin-copy';

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    manifest: true,
    rollupOptions: {
      // external: /^lit/,
      plugins: [
        copy({
          targets: [
            {
              src: path.resolve(__dirname, 'node_modules/@shoelace-style/shoelace/dist/assets/icons'),
              dest: path.resolve(__dirname, 'dist/assets'),
            },
          ],
          // https://github.com/vitejs/vite/issues/1231
          hook: 'writeBundle',
        }),
      ],
    },
  },
  test: {
    globals: true,
    environment: 'happy-dom',
    coverage: {
      provider: 'c8',
      reporter: ['text', 'cobertura'],
    },
  },
});
