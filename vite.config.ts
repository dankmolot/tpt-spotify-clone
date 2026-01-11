import { tanstackRouter } from "@tanstack/router-plugin/vite"
import basicSsl from "@vitejs/plugin-basic-ssl"
import viteReact from "@vitejs/plugin-react"
import { defineConfig } from "vite"
import tsconfigPaths from "vite-tsconfig-paths"

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        tanstackRouter({
            target: "react",
            autoCodeSplitting: true,
        }),
        tsconfigPaths(),
        viteReact(),
        basicSsl(),
    ],
    build: {
        cssMinify: "lightningcss",
    },
    css: {
        transformer: "lightningcss",
        lightningcss: {
            cssModules: true,
        },
    },
})
