import { copyFileSync, existsSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Base path. On a GitHub Pages *project* site the app is served from
// /<repo>/, so the deploy workflow passes VITE_BASE="/<repo>/". Locally and on
// root-domain hosts it stays "/". A trailing slash is required by Vite.
const base = process.env.VITE_BASE || '/';

// https://vitejs.dev/config/
export default defineConfig({
  base,
  plugins: [
    react(),
    // GitHub Pages serves 404.html for unknown paths. For a client-routed SPA,
    // copying the built index.html to 404.html makes first-load deep links
    // (e.g. /browse, /remedy/:id) resolve to the app instead of a 404.
    {
      name: 'spa-404-fallback',
      apply: 'build',
      closeBundle() {
        const out = resolve(__dirname, 'dist');
        const index = resolve(out, 'index.html');
        if (existsSync(index)) copyFileSync(index, resolve(out, '404.html'));
      },
    },
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['icons/apple-touch-icon.png', 'favicon.svg'],
      manifest: {
        name: 'The Home Apothecary Archive',
        short_name: 'Apothecary',
        description:
          'A searchable archive of home remedies from public-domain historical texts. A historical reference tool, not medical advice.',
        theme_color: '#6b4f2a',
        background_color: '#f6f1e7',
        display: 'standalone',
        orientation: 'portrait-primary',
        categories: ['reference', 'education', 'books'],
        icons: [
          { src: 'icons/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
          { src: 'icons/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
          { src: 'icons/icon-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
      workbox: {
        // Precache the built app shell + assets so it works fully offline. The
        // 178-entry dataset is bundled into the JS, so it is precached too.
        globPatterns: ['**/*.{js,css,html,svg,png,ico,woff2}'],
        // SPA fallback: any in-app navigation resolves to index.html offline.
        navigateFallback: `${base}index.html`,
      },
    }),
  ],
  test: {
    environment: 'node',
    include: ['src/**/*.test.{js,jsx}'],
  },
});
