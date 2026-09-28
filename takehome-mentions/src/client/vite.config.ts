import path from "node:path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@server": path.resolve(__dirname, "../server/src"),
    },
  },
  server: {
    port: 5173,
    // Forward /api/* to the local API server so the client can use relative URLs.
    proxy: {
      "/api": "http://localhost:8787",
    },
  },
});
