import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  // 1. Plugins
  plugins: [react(), tailwindcss()],

  // 2. Base: FIX IS HERE! 
  // Root deployment ke liye ise '/' hi rehna chahiye.
  base: '/', 

  build: {
    // 3. Output Directory
    outDir: 'dist',
    
    // 4. Assets: Vite handles this automatically
    assetsDir: 'assets',
    
    // 5. Clean
    emptyOutDir: true,

    // 6. Chunk size limit
    chunkSizeWarningLimit: 2000, 
  },

  server: {
    port: 5174, 
    strictPort: true,
  }
})