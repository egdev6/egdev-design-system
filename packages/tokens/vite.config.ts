import { fileURLToPath } from 'node:url';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';

// Compile src/native.css from the manual theme.css source to dist/tokens.css.
// Disable Tailwind optimization to preserve exact alpha colors and var() aliases.
export default defineConfig({
  plugins: [tailwindcss({ optimize: false })],
  build: {
    minify: false,
    cssMinify: false,
    emptyOutDir: true,
    outDir: 'dist',
    rolldownOptions: {
      input: fileURLToPath(new URL('./src/native.css', import.meta.url)),
      output: { assetFileNames: 'tokens.css' }
    }
  }
});
