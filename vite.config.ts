import {defineConfig} from 'vite'
import react from '@vitejs/plugin-react';
import path from "node:path";
import process from "node:process";
import {analyzer} from 'vite-bundle-analyzer'

// https://vite.dev/config/
export default defineConfig({
    plugins: [
        react(),
        analyzer({analyzerMode: 'server'}),
    ],
    resolve: {
        alias: {
            '@/': path.resolve(process.cwd(), 'src'),
            "@/api": path.resolve(process.cwd(), 'src/api'),
            '@/app': path.resolve(process.cwd(), 'src/app'),
            '@/components': path.resolve(process.cwd(), 'src/components'),
            "@/ducks": path.resolve(process.cwd(), 'src/ducks'),
            "@/hooks": path.resolve(process.cwd(), 'src/hooks'),
            '@/reducers': path.resolve(process.cwd(), 'src/reducers'),
            '@/slices': path.resolve(process.cwd(), 'src/slices'),
            "@/src": path.resolve(process.cwd(), 'src'),
            "@/types": path.resolve(process.cwd(), 'src/types'),
            "@/utils": path.resolve(process.cwd(), 'src/utils'),
        }
    },
    base: "/apps/sage-tables/",
    build: {
        manifest: true,
        sourcemap: true,
        rollupOptions: {
            output: {
                codeSplitting: {
                    groups: [
                        {name: 'vendor-react', test: /node_modules\/(react|react-dom)\//, priority: 10},
                        {name: 'vendor', test: /node_modules/, priority: 5}
                    ]
                },
            }
        }
    },
    server: {
        port: 8080,
        host: 'localhost',
        proxy: {
            '/api': {
                target: 'http://localhost:8081',
                changeOrigin: true,
            },
            '/sage': {
                target: 'http://localhost:8081',
                changeOrigin: true,
            },
            '/node-sage': {
                target: 'http://localhost:8081',
                changeOrigin: true,
            },
            '/api/user/v2/cookie-consent.png': {
                target: 'https://intranet.chums.com/api/user/v2/cookie-consent.png',
                changeOrigin: true,
            },
            '/images': {
                target: 'https://intranet.chums.com/',
                changeOrigin: true,
            }
        }
    }
})
