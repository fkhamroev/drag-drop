import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  base: "https://fkhamroev.github.io/drag-drop/",
  plugins: [react()],
});
