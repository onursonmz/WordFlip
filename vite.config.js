import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: './', // Mobil cihazda (Capacitor/WebView) yerel dosya yolunun düzgün çalışması için eklendi.
})
