import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  // 1. Plugins: React for logic, Tailwind for styling
  plugins: [react(), tailwindcss()],

  // 2. Base: CRITICAL for sub-directory deployment
  // This ensures <script src="/assets/..."> becomes <script src="/admin/assets/...">
  base: '/admin/', 

  build: {
    // 3. Output Directory: Where the finished files go
    outDir: 'dist',
    
    // 4. Asset Handling: Ensures small images are inlined and 
    // large ones are organized in an assets folder
    assetsDir: 'assets',
    
    // 5. Clean: Always wipe the old folder before a new build
    emptyOutDir: true,
  },

  server: {
    // Optional: useful for local testing
    port: 5174, 
    strictPort: true,
  }
})