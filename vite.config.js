import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import { fileURLToPath } from 'url'
import { dirname } from 'path'
import vitePrerender from 'vite-plugin-prerender'

const __dirname = dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  plugins: [
    vue({
      template: {
        compilerOptions: {
          isCustomElement: tag => tag === 'lottie-player',
        },
      },
    }),
    vitePrerender({
      staticDir: path.resolve(__dirname, 'dist'),
      routes: ['/', '/partner', '/blog', '/impressum', '/datenschutz'],
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      'lucide-vue-next': path.resolve(__dirname, './src/ui/components/icons'),
    },
  },
  build: {
    // Split heavy dependencies into separate chunks to keep the main bundle small
    rollupOptions: {
      output: {
        manualChunks: {
          firebase: ['firebase/app', 'firebase/auth', 'firebase/firestore', 'firebase/storage'],
          formkit: ['@formkit/vue', '@formkit/core', '@formkit/themes'],
        },
      },
    },
    // Increase the limit to avoid warnings when chunks are still large
    chunkSizeWarningLimit: 1000,
  },
  test: {
    env: {
      MAGIKEY_USE_FUNCTIONS_STUB: 'true',
    },
  },
})
