/// <reference types="vitest" />
import { defineConfig } from 'vite';
import { resolve } from 'path';

const isDocTarget = (typeof process.env.FOR_DOCS !== 'undefined');

// const configOutput = isDocTarget ? {
//   entryFileNames: '[name].js',
//   chunkFileNames: '[name].js',
//   assetFileNames: '[name].[ext]',
// } : {
//   entryFileNames: '[name]-[hash].js',
//   chunkFileNames: '[name]-[hash].js',
//   assetFileNames: '[name]-[hash].[ext]',
// };

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    outDir: isDocTarget ? 'docs/dist' : 'dist',
    manifest: true,
    dynamicImportVarsOptions: {
      exclude: ['./src/glaber.ui.ts'],
    },
    lib: {
      entry: {
        'glaber.ui': resolve(__dirname, 'src/glaber.ui.ts'),
        'utilities/icon-library': resolve(__dirname, 'src/utilities/icon-library.ts'),
      },
      formats: ['es'],
    },
    rollupOptions: {
      // external: /^lit/,
      plugins: [],
      // input: {
      //   'glaber.ui': resolve(__dirname, 'index.html'),
      //   'utilities/icon-library': resolve(__dirname, 'src/utilities/icon-library.ts'),
      // },
      // output: configOutput,
    },
  },
  test: {
    globals: true,
    environment: 'happy-dom',
    coverage: {
      provider: 'c8',
      reporter: ['text', 'json-summary', 'json'],
    },
  },
});
