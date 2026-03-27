import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import vuetify from "vite-plugin-vuetify";
import { fileURLToPath, URL } from "node:url";
// --- ใช้บรรทัดข้างล่าง เพื่อเปิด vueDevTool --- //
// import vueDevTools from "vite-plugin-vue-devtools";

export default defineConfig({
  plugins: [vue(), vuetify({ autoImport: true })],
  // --- เปิดบรรทัดข้างล่าง และ comment บรรทัดข้างบน เพื่อเปิด vueDevTool --- //
  // plugins: [vue(), vuetify({ autoImport: true }), vueDevTools()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
});
