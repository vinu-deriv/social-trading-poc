import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: [
            { find: '@', replacement: '/src' },
            { find: '@types', replacement: '/src/types' },
            { find: '@components', replacement: '/src/components' },
            { find: '@modules', replacement: '/src/modules' },
            { find: '@pages', replacement: '/src/pages' },
            { find: '@utils', replacement: '/src/utils' },
            { find: '@constants', replacement: '/src/constants' },
            { find: '@layouts', replacement: '/src/layouts' }
        ]
    }
});
