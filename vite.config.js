import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
  server: {
    port: 3000,
    strictPort: false,
  },
  build: {
    target: 'esnext',
    minify: 'terser',
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        products: resolve(__dirname, 'products.html'),
        about: resolve(__dirname, 'about.html'),
        contact: resolve(__dirname, 'contact.html'),
        returns: resolve(__dirname, 'returns.html'),
        trackorder: resolve(__dirname, 'track-order.html'),
      },
      output: {
        manualChunks: undefined,
      }
    },
  },
})