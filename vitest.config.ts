import react from '@vitejs/plugin-react-swc';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: { '@': fileURLToPath(new URL('./packages/ui/src', import.meta.url)) }
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./vitest.setup.ts'],
    include: ['packages/*/src/**/*.test.{ts,tsx}'],
    css: false
  }
});
