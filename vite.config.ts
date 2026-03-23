import { defineConfig } from 'vite';
import path from 'path';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(), // This prevents the "Giant Mo" issue
    VitePWA({
      registerType: 'autoUpdate',
      devOptions: {
        enabled: true, // This is the fix! It forces the manifest to generate on localhost
      },
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'mask-icon.svg'],
      manifest: {
        name: 'Moodify - Mood Tracker',
        short_name: 'Moodify',
        description:
          'Track your daily emotions and get personalized suggestions',
        theme_color: '#F0FBFA',
        background_color: '#F0FBFA',
        display: 'standalone',
        icons: [
          {
            src: 'moodify-192x192.png', // I saw these names in your sidebar!
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'moodify-512x512.png',
            sizes: '512x512',
            type: 'image/png',
          },
        ],
      },
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
