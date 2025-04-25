import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/autocomplete': 'http://127.0.0.1:5000',
      '/buscar': 'http://127.0.0.1:5000',
      '/tratados': 'http://127.0.0.1:5000'
    }
  }
})