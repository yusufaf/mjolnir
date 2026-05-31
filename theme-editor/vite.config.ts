import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// GitHub Pages serves from /<repo>/ ; base set for project pages deploy.
export default defineConfig({
  plugins: [react()],
  base: "./",
});
