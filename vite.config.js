import { defineConfig } from "vite";
import haxe from "./dist/index";

/** @type {import('vite').UserConfig} */
export default defineConfig({
  plugins: [haxe()],
  build: {
    outDir: "demodist",
  },
});
