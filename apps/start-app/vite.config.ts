import { tanstackStart } from '@tanstack/react-start/plugin/vite';
import viteReact from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [
    // BUG: This should be conditional on process.env.VITEST !== 'true'
    // Without the fix, this causes "Cannot read properties of null (reading 'useState')" in tests
    tanstackStart(),
    viteReact(),
  ],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/setupTests.ts'],
  },
});
