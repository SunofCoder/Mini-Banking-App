import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173, // Frontend'inizin çalıştığı port
    proxy: {
      // '/api' ile başlayan tüm istekleri backend'e yönlendir
      '/api': {
        target: 'http://localhost:8080', // Backend'inizin adresi
        changeOrigin: true, // Host başlığını değiştirmeyi sağlar
        rewrite: (path) => path.replace(/^\/api/, '/api'), // '/api' kısmını korur
      },
    },
  },
});
    