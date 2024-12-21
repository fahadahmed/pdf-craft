/// <reference types="vitest" />

import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './tests/setup.ts',
    include: ['**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
    coverage: {
      provider: 'v8', // or 'istanbul'
      reporter: ['text', 'json', 'html', 'lcov'],
      reportsDirectory: './coverage',
      exclude: [
        'node_modules/',
        'tests/setup.ts',
        'cypress/',
        '.astro/',
        '**/*.mjs',
        'cypress.config.js',
        'vitest.config.ts',
        'functions/',
        '**/*.js',
        '**/index.ts',
      ],
    },
  },
});
