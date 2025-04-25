import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/autocomplete': process.env.VITE_API_URL,
      '/buscar': process.env.VITE_API_URL,
      '/tratados': process.env.VITE_API_URL
    }
  }
})
