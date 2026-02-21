import { defineConfig } from "vite";
import react from "@vitejs/plugin-react"; // Cambiado de react-swc a react

export default defineConfig({
  plugins: [react()], // Cambiado aquí también
  server: {
    port: 5173,
    proxy: {
      "/api": {
        target: "http://localhost:3000",
        changeOrigin: true,
      },
    },
  },
});
