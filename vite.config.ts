import { defineConfig } from 'vite';
import path from 'path';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      devOptions: {
        enabled: true, 
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
            src: 'APP_ICON_1_192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'APP_ICON_1_512x512.png',
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
