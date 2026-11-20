import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // Host dev only: mirrors the nginx /api proxy used in the container.
    proxy: {
      '/api': 'http://localhost:3000',
    },
  },
})
