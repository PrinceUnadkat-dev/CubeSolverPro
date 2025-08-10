import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// Configuration for GitHub Pages deployment
export default defineConfig({
  plugins: [react()],
  base: '/', // Change this to your repository name if not using custom domain
  build: {
    outDir: 'dist',
    sourcemap: false,
    rollupOptions: {
      input: './index.html',
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          ui: ['@radix-ui/react-toast', '@radix-ui/react-tooltip', 'lucide-react'],
        },
      },
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './client/src'),
      '@/components': path.resolve(__dirname, './client/src/components'),
      '@/hooks': path.resolve(__dirname, './client/src/hooks'),
      '@/lib': path.resolve(__dirname, './client/src/lib'),
      '@/pages': path.resolve(__dirname, './client/src/pages'),
    },
  },
  root: './',
  publicDir: './client/public',
});