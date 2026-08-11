import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
    base: '/stranger-portfolio/', // Change this if your GitHub repo name is different
    plugins: [react()],
    server: {
        host: true,
        allowedHosts: true
    }
})
