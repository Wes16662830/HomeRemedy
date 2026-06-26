import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { viteSingleFile } from 'vite-plugin-singlefile';

// Builds the whole app — code, styles, and the full remedy dataset — into a
// single self-contained HTML file that runs offline from disk (file://).
// Output: dist-standalone/index.standalone.html
export default defineConfig({
  base: './',
  plugins: [react(), viteSingleFile()],
  build: {
    outDir: 'dist-standalone',
    rollupOptions: { input: 'index.standalone.html' },
  },
});
