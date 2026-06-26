// @ts-check
import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import tailwindcss from "@tailwindcss/vite";

import compress from "astro-compress";
import compressor from "astro-compressor";

// https://astro.build/config
export default defineConfig({
  integrations: [
    react(),
    compress(),
    compressor({
      gzip: true,
      brotli: true,
    }),
  ],

  vite: {
    plugins: [tailwindcss()],

    server: {
      proxy: {
        "/api": {
          target: "http://localhost:50501",
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ""),
        },
      },
    },
  },
});
