import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import router from 'unplugin-vue-router/vite'

// https://vite.dev/config/
export default defineConfig({
    plugins: [router(), vue()],
})
