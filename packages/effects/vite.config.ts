import { fileURLToPath } from 'node:url';
import react from '@vitejs/plugin-react-swc';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

export default defineConfig({
  plugins: [
    react(),
    dts({
      compilerOptions: { rootDir: fileURLToPath(new URL('./src', import.meta.url)) },
      include: ['src'],
      exclude: ['src/**/*.test.{ts,tsx}', 'src/**/*.stories.{ts,tsx}'],
      tsconfigPath: './tsconfig.json'
    })
  ],
  build: {
    emptyOutDir: false,
    lib: { entry: 'src/index.ts', formats: ['es'], fileName: 'index' },
    rolldownOptions: {
      external: [/^react($|\/)/, /^three($|\/)/, 'class-variance-authority', '@egdev/ui']
    },
    sourcemap: true
  }
});
