import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { viteSingleFile } from "vite-plugin-singlefile";

// `npm run build` produces ONE self-contained dist/index.html
// (JS + CSS inlined) so the prototype can be opened or shared as a single file.
export default defineConfig({
  plugins: [react(), viteSingleFile()],
});
