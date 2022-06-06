import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { resolve } from 'path';

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [vue()],
    server: {
        proxy: {
            // '/api': 'http://120.77.26.105:3039',
            '/api': 'https://testnet.amaxscan.io',
            // "/api": "https://www.amaxscan.io",
            // '/api': 'https://dev-exp.ambt.art',
            // "/api": "https://expnode.amaxscan.io",
            // "/api": "http://prod-exp-proxy.ambt.art",
            // "/api": "http://expnode.mgps.me",
            '/socket.io': {
                // target: 'https://www.amaxscan.io',
                // target: 'https://expnode.amaxscan.io',
                // target: 'http://prod-exp-proxy.ambt.art',
                // target: 'http://expnode.mgps.me',
                // target: 'https://dev-exp.ambt.art',
                target: 'https://testnet.amaxscan.io',
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
