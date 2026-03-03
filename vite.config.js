import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
    base: '/silicon-brainss/',
    plugins: [react()],
    build: {
        chunkSizeWarningLimit: 2000,
        rollupOptions: {
            output: {
                manualChunks(id) {
                    if (id.includes('node_modules')) {
                        if (id.includes('three')) return 'vendor-three';
                        if (id.includes('@react-three')) return 'vendor-r3f';
                        if (id.includes('reactflow') || id.includes('@reactflow')) return 'vendor-reactflow';
                        if (id.includes('jspdf') || id.includes('html2canvas')) return 'vendor-pdf';
                        if (id.includes('react')) return 'vendor-react';
                    }
                },
            },
        },
    },
})
