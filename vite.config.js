import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    optimizeDeps: {
        esbuildOptions: {
            loader: {
                ".js": "jsx",
            },
        },
    },
    esbuild: {
        loader: "tsx",
        include: /src\/.*\.[tj]sx?$/,
        exclude: [],
    },
    define: {
        "process.env.NODE_ENV": JSON.stringify("development"),
    },
    server: {
        port: 3000,
    },
});
