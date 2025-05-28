import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // Commenting out base path for local development
  // base: '/secure-code-reviewer/',
  build: {
    outDir: 'dist'
  },
  server: {
    port: 8080,
    strictPort: true,
    open: true
  }
})
