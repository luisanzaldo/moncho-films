import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
  base: '/moncho-films/',
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        criticas: resolve(__dirname, 'criticas.html'),
        article: resolve(__dirname, 'article.html'),
      },
    },
  },
})
