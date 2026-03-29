import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5175, // Cambia a otro puerto
    strictPort: false, // Permite que Vite busque otro puerto si este está ocupado
    host: "localhost",
    proxy: {
      "/api": {
        target: "http://localhost:3000",
        changeOrigin: true,
      },
    },
  },
});
