import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";

const base = "/almanacco";

export default defineConfig({
  site: "https://ikitaria.com",
  base,
  redirects: {
    "/": `${base}/ja/`,
    // The About/Contact pages were merged into Home as in-page sections;
    // keep old bookmarks/backlinks working instead of hard-404ing them.
    "/ja/about": `${base}/ja/#storia`,
    "/ja/contact": `${base}/ja/#access`,
    "/it/about": `${base}/it/#storia`,
    "/it/contact": `${base}/it/#access`,
    "/en/about": `${base}/en/#storia`,
    "/en/contact": `${base}/en/#access`,
  },
  vite: {
    plugins: [tailwindcss()],
  },
});
