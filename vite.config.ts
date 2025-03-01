import { defineConfig } from 'vite';
import { reactRouter } from "@react-router/dev/vite"

export default defineConfig({
  plugins: [reactRouter()],
  logLevel: 'info',
  server: {
    port: 5173,
    host: true
  }
});