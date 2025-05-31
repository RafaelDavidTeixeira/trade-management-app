import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/trade-management-app/' // <--- ESTA LINHA É A CHAVE!
})