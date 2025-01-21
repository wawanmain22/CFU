import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';

export default defineConfig({
    plugins: [
        laravel({
            input: 'resources/js/app.tsx',
            refresh: true,
        }),
        react(),
    ],
    server: {
        https: true,
    },

    build: {
        manifest: true,
        assetsDir: '',
        output: 'public/build',
        rollupOptions: {
            output: {
                assetFileNames: '[name]-[hash].[extname]',
                chunkFileNames: '[name]-[hash].js',
                entryFileNames: '[name]-[hash].js',
            },
        },
    },
});

