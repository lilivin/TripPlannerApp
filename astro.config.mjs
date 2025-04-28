// @ts-check
import { defineConfig } from "astro/config";
import { fileURLToPath } from "url";
import path from "path";

import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import tailwind from "@astrojs/tailwind";
import node from "@astrojs/node";
import VitePWA from "@vite-pwa/astro";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// https://astro.build/config
export default defineConfig({
  output: "server",
  experimental: {
    session: true,
  },
  vite: {
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
  },
  integrations: [
    react(),
    sitemap(),
    tailwind({
      // Optionally provide a config file path
      configFile: "./tailwind.config.mjs",
      // Tailor Tailwind CSS to optimize production build sizes
      applyBaseStyles: false,
    }),
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
      workbox: {
        navigateFallback: undefined,
        globPatterns: ["**/*.{js,css,html,svg,png,ico,webp}"],
        runtimeCaching: [
          {
            urlPattern: ({ url }) => {
              return url.pathname.startsWith("/api/plans/") && url.pathname.split("/").length === 4;
            },
            handler: "CacheFirst",
            options: {
              cacheName: "api-plans-cache",
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 60 * 60 * 24 * 7, // 7 days
              },
              cacheableResponse: {
                statuses: [0, 200],
              },
              matchOptions: {
                ignoreSearch: false,
              },
            },
          },
        ],
      },
    }),
  ],
  server: { port: 3000 },
  adapter: node({
    mode: "standalone",
  }),
});
