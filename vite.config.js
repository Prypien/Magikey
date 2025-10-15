import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import { fileURLToPath } from 'url'
import { dirname } from 'path'

async function loadPrerenderPlugin() {
  try {
    const module = await import('vite-plugin-prerender')
    return module.default ?? module
  } catch (error) {
    if (process.env.VITEST) return null

    console.warn(
      'vite-plugin-prerender is not available; skipping prerender configuration.'
    )
    return null
  }
}

const __dirname = dirname(fileURLToPath(import.meta.url))

export default defineConfig(async () => {
  const prerenderPlugin = await loadPrerenderPlugin()

  return {
    plugins: [
      vue({
        template: {
          compilerOptions: {
            isCustomElement: tag => tag === 'lottie-player',
          },
        },
      }),
      prerenderPlugin
        ? prerenderPlugin({
            staticDir: path.resolve(__dirname, 'dist'),
            routes: ['/', '/partner', '/blog', '/impressum', '/datenschutz'],
          })
        : null,
    ].filter(Boolean),
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
        '@blog-content': path.resolve(__dirname, './content/blog/posts'),
        'lucide-vue-next': path.resolve(
          __dirname,
          './src/ui/components/icons'
        ),
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
  }
})
