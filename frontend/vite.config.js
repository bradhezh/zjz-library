import {defineConfig} from 'vite'
import commonjs from 'vite-plugin-commonjs'
// handling jsx transformation and other react-specific optimisations, still
// using babel as the transpiler
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    commonjs(),
    react(),
  ],
  server: {
    // for REST requests handled by the backend instead of the development
    // server
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
    },
  },
})
