import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { ragDevApiPlugin } from './src/rag/api/ragVitePlugin'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), ragDevApiPlugin()],
  server: {
    port: 5173,
    host: true,
    watch: {
      ignored: ['**/docs/**', '**/*.zip', '**/*.tar.gz', '**/*.crdownload', '**/*.tmp', '**/$RECYCLE.BIN/**']
    }
  }
})
