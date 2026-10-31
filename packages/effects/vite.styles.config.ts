import { fileURLToPath } from 'node:url';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [tailwindcss({ optimize: false })],
  build: {
    minify: false,
    cssMinify: false,
    emptyOutDir: false,
    outDir: 'dist',
    rolldownOptions: {
      input: fileURLToPath(new URL('./src/styles/compiled.css', import.meta.url)),
      output: { assetFileNames: 'styles.css' }
    }
  }
});
