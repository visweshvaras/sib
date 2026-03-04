import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    build: {
        // explicit chunking to keep deploy bundle sizes sane and cacheable
        rollupOptions: {
            output: {
                manualChunks: {
                    'vendor-react': ['react', 'react-dom'],
                    'vendor-three': ['three'],
                    'vendor-r3f': ['@react-three/fiber', '@react-three/drei', '@react-three/postprocessing'],
                    'vendor-reactflow': ['reactflow'],
                    'vendor-pdf': ['jspdf', 'html2canvas'],
                },
            },
        },
        commonjsOptions: {
            // three-mesh-bvh ships in CommonJS – ensure it's processed
            include: [/three-mesh-bvh/, /node_modules/],
        },
    },
    optimizeDeps: {
        // pre-bundle troublesome dependencies for faster dev start and
        // to avoid issues with three-mesh-bvh on Vercel's builder environment
        include: ['three-mesh-bvh'],
    },
})
