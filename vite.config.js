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
    }
  }
})