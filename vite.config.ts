import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig, type Plugin} from 'vite';

// Content-Security-Policy for the published site (GitHub Pages cannot send headers, so it goes in a
// <meta> tag). Only production builds get it: the dev server injects inline scripts for hot reload.
// Allowed: our own files, Google Fonts, images over https, and the FormSubmit contact endpoint.
const CSP = [
  "default-src 'self'",
  "script-src 'self'",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "font-src 'self' https://fonts.gstatic.com",
  "img-src 'self' data: blob: https:",
  "connect-src 'self' https://formsubmit.co",
  "form-action 'self' https://formsubmit.co",
  "frame-src 'none'",
  "object-src 'none'",
  "base-uri 'self'",
  'upgrade-insecure-requests',
].join('; ');

const securityHeaders = (): Plugin => ({
  name: 'security-meta',
  apply: 'build',
  transformIndexHtml: (html) =>
    html.replace(
      '<meta charset="UTF-8" />',
      `<meta charset="UTF-8" />\n    <meta http-equiv="Content-Security-Policy" content="${CSP}" />`,
    ),
});

export default defineConfig(() => {
  return {
    base: './',
    plugins: [react(), tailwindcss(), securityHeaders()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    build: {
      chunkSizeWarningLimit: 700,
      rollupOptions: {
        output: {
          manualChunks: {
            motion: ['motion', 'framer-motion'],
            charts: ['recharts'],
            pdf: ['jspdf', 'html2canvas'],
            icons: ['lucide-react'],
          },
        },
      },
    },
    preview: {
      headers: {
        'X-Content-Type-Options': 'nosniff',
        'Referrer-Policy': 'strict-origin-when-cross-origin',
        'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
        'X-Frame-Options': 'DENY',
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
