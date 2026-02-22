import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [react()],

  test: {
    // Browser-like environment so React components and DOM APIs work
    environment: 'jsdom',

    // Inject `describe`, `it`, `expect`, `vi` globally (no imports needed in test files)
    globals: true,

    // Run this file before every test suite
    setupFiles: ['__tests__/setup.ts'],

    // Only pick up files inside __tests__/
    include: ['__tests__/**/*.test.{ts,tsx}'],

    // Deterministic: clear mocks automatically between tests
    clearMocks: true,
    restoreMocks: true,

    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      include: [
        'lib/**',
        'hooks/**',
        'components/**',
        'app/actions/**',
        'app/api/**',
      ],
      exclude: ['**/*.d.ts', '**/__mocks__/**', '**/node_modules/**'],
    },
  },

  resolve: {
    alias: {
      // Mirror the @/* alias from tsconfig.json
      '@': path.resolve(__dirname, '.'),
      // `server-only` throws at import time outside Next.js server context.
      // Redirect to an empty stub so Vite can resolve it during tests without
      // a transform error (vi.mock alone is not enough because Vite's import
      // analysis runs before Vitest's module mocking intercepts it).
      'server-only': path.resolve(__dirname, '__tests__/mocks/server-only.ts'),
    },
  },
});
