import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig({
    plugins: [react()],
    build: {
        rollupOptions: {
            input: {
                main: resolve(__dirname, 'index.html'),
                admin: resolve(__dirname, 'admin.html'),
                aluno: resolve(__dirname, 'aluno.html'),
            }
        }
    },
    server: {
        port: 3000,
        open: true,
        proxy: {
            '/api': 'http://localhost:3001'
        }
    }
})
