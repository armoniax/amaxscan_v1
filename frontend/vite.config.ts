import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { resolve } from 'path';

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [vue()],
    server: {
        proxy: {
            // '/api': 'http://120.77.26.105', //"http://www.amaxscan.io",
            // "/api": "https://exp.mgpchain.io", //"http://www.amaxscan.io",
            "/api": "https://www.amaxscan.io", //"http://www.amaxscan.io",
            '/socket.io': {
                target: 'https://www.amaxscan.io',
                // secure: true,
                changeOrigin: true,
                // secure: false,
                // ws: true,

                // logLevel: 'debug',
                // ws: true,
            },
        },
    },
    resolve: {
        alias: {
            'xmlhttprequest-ssl': './node_modules/engine.io-client/lib/xmlhttprequest.js',
            '@': resolve('./src'),
        },
    },
});
