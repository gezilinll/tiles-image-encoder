// vite.config.js
import { resolve } from 'path'
import ts from '@rollup/plugin-typescript';
import { defineConfig } from 'vite'

export default defineConfig({
    build: {
        lib: {
            entry: resolve(__dirname, "src/index.ts"), // 打包的入口文件
            name: "tiles-image-encoder", // 包名
            formats: ['es', 'umd'],
            fileName: (format) => `tiles-image-encoder.${format}.js`,
        },
    },
})