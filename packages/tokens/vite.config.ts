import { fileURLToPath } from 'node:url';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';

// Compile the native CSS and the dependency-free accent JavaScript entry together.
// Disable Tailwind optimization to preserve exact alpha colors and var() aliases.
export default defineConfig({
  plugins: [tailwindcss({ optimize: false })],
  build: {
    minify: false,
    cssMinify: false,
    emptyOutDir: true,
    outDir: 'dist',
    rolldownOptions: {
      // Keep the accent entry's named exports; an app-mode build would otherwise drop them.
      preserveEntrySignatures: 'strict',
      input: {
        tokens: fileURLToPath(new URL('./src/native.css', import.meta.url)),
        accent: fileURLToPath(new URL('./src/accent.ts', import.meta.url))
      },
      output: { assetFileNames: 'tokens.css', entryFileNames: '[name].js' }
    }
  }
});
