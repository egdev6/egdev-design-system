import { fileURLToPath } from 'node:url';
import react from '@vitejs/plugin-react-swc';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

export default defineConfig({
  plugins: [
    react(),
    dts({
      // Align TypeScript 6's emit root with the plugin's source root and public exports.
      compilerOptions: { rootDir: fileURLToPath(new URL('./src', import.meta.url)) },
      include: ['src'],
      exclude: ['src/**/*.test.{ts,tsx}', 'src/**/*.stories.{ts,tsx}'],
      tsconfigPath: './tsconfig.json'
    })
  ],
  resolve: { alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) } },
  build: {
    lib: { entry: 'src/index.ts', formats: ['es'], fileName: 'index' },
    rolldownOptions: {
      external: [
        /^react($|\/)/,
        /^react-dom($|\/)/,
        /^@radix-ui\//,
        'class-variance-authority',
        'clsx',
        'tailwind-merge'
      ]
    },
    sourcemap: true
  }
});
