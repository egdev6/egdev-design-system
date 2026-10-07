import react from '@vitejs/plugin-react-swc';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

export default defineConfig({
  plugins: [
    react(),
    dts({ include: ['src'], exclude: ['src/**/*.test.tsx', 'src/**/*.stories.tsx'], tsconfigPath: './tsconfig.json' })
  ],
  resolve: { alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) } },
  build: {
    lib: { entry: 'src/index.ts', formats: ['es'], fileName: 'index' },
    rollupOptions: { external: [/^react($|\/)/, /^react-dom($|\/)/, /^radix-ui/, 'class-variance-authority', 'clsx'] },
    sourcemap: true
  }
});
