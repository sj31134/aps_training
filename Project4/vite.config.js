/**
 * Vite Configuration for APS Viewer Demo
 * Google JavaScript Style Guide 준수
 */

import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: 'https://aps-codepen.autodesk.io',
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path.replace(/^\/api/, '/api'),
      },
    },
  },
});

