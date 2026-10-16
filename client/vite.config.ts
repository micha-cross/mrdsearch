import { svelte } from '@sveltejs/vite-plugin-svelte'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [tailwindcss(), svelte()],
  server: {
    // Forward /api requests to the Express server during development
    proxy: {
      '/api': 'http://localhost:3000',
    },
  },
})
