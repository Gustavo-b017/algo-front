import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/autocomplete': process.env.VITE_API_URL,
      '/montadoras': process.env.VITE_API_URL,
      '/pesquisar': process.env.VITE_API_URL,
      '/produto_detalhes': process.env.VITE_API_URL,
      // '/autocomplete': 'http://127.0.0.1:5000/',
      // '/montadoras': 'http://127.0.0.1:5000/',
      // '/pesquisar': 'http://127.0.0.1:5000/',
      // '/produto_detalhes': 'http://127.0.0.1:5000/',
    }
  }
})