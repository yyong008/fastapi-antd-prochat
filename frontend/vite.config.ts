import { tanstackRouter } from "@tanstack/router-plugin/vite";
import { defineConfig } from "vite-plus";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tanstackRouter(), tailwindcss()],
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:8000", // 你的后端服务器地址
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, "/api"), // 重写路径
      },
    },
  },
});
