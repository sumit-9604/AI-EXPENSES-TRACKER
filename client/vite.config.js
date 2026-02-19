import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";  // For aliases if needed

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),  // Add if using @/ imports
    },
  },
  server: {
    proxy: {
      "/api": {
        target: "https://ai-expenses-tracker.onrender.com",
        changeOrigin: true,
        secure: false
      }
    }
  },
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["./src/vitest.setup.ts"],  // Or ./vitest.setup.ts
  },
});
