import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // '/autocomplete': process.env.VITE_API_URL,
      // '/buscar': process.env.VITE_API_URL,
      // '/tratados': process.env.VITE_API_URL,
      // '/produto': process.env.VITE_API_URL,
      // '/item': process.env.VITE_API_URL,
      // '/similares': process.env.VITE_API_URL,
      // '/lojas': process.env.VITE_API_URL,
      // '/rota-entrega': process.env.VITE_API_URL
      '/autocomplete': 'http://127.0.0.1:5000/',
      '/buscar': 'http://127.0.0.1:5000/',
      '/tratados': 'http://127.0.0.1:5000/',
      '/produto': 'http://127.0.0.1:5000/',
      '/item': 'http://127.0.0.1:5000/',
      '/similares': 'http://127.0.0.1:5000/',
      '/lojas': 'http://127.0.0.1:5000/',
      '/rota-entrega': 'http://127.0.0.1:5000/',
    }
  }
})