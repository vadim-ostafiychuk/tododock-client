import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // const env = loadEnv(mode, process.cwd());

  // const API_URL = `${env.VITE_API_URL ?? "http://localhost:3000"}`;
  // const PORT = `${env.VITE_PORT ?? "3000"}`;

  return {
    base: "/",
    plugins: [react()],
    preview: {
      port: 3000,
      strictPort: true,
    },
  };
});
