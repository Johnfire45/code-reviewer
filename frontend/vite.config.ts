import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/code-reviewer/',
  build: {
    outDir: 'dist'
  },
  server: {
    port: 8000,
    strictPort: true,
    open: true
  }
})
