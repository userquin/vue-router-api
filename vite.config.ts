import vue from '@vitejs/plugin-vue'
import router from 'unplugin-vue-router/vite'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [router(), vue()],
})
