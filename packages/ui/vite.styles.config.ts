import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';

// Bundle CSS separately so the JavaScript entry remains usable in Node SSR.
export default defineConfig({
  build: {
    minify: false,
    cssMinify: false,
    // The library build already emitted JavaScript and declarations into dist.
    emptyOutDir: false,
    outDir: 'dist',
    rolldownOptions: {
      input: fileURLToPath(new URL('./src/styles/compiled.css', import.meta.url)),
      output: { assetFileNames: 'styles.css' }
    }
  }
});
