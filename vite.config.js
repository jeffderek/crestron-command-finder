import { fileURLToPath, URL } from 'node:url';

import { defineConfig, loadEnv } from 'vite';
import vue from '@vitejs/plugin-vue';

export default ({ mode }) => {
    process.env = Object.assign(process.env, loadEnv(mode, process.cwd(), ''));

    return defineConfig({
        plugins: [vue()],
        resolve: {
            alias: {
                '@': fileURLToPath(new URL('./src', import.meta.url)),
            },
        },
        server: {
            open: true,
            port: 5142,
        },
        css: {
            preprocessorOptions: {
                scss: {
                    additionalData: `@import "./src/styles/imports/_colors.scss";`,
                },
            },
        },
    });
};
