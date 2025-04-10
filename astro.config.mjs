// @ts-check
import { defineConfig } from "astro/config";

import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";
import node from "@astrojs/node";
import VitePWA from "@vite-pwa/astro";

// https://astro.build/config
export default defineConfig({
  output: "server",
  integrations: [
    react(),
    sitemap(),
    VitePWA({
      registerType: "autoUpdate",
      manifest: {
        name: "Trip Planner App",
        short_name: "Trip Planner",
        start_url: "/",
        display: "standalone",
        background_color: "#ffffff",
        theme_color: "#0f172a",
        icons: [
          {
            src: "/icons/icon-192x192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "/icons/icon-512x512.png",
            sizes: "512x512",
            type: "image/png",
          },
        ],
      },
    }),
  ],
  server: { port: 3000 },
  vite: {
    plugins: [tailwindcss()],
  },
  adapter: node({
    mode: "standalone",
  }),
});
