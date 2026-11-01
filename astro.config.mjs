import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import tailwindcss from '@tailwindcss/vite';
import cloudflare from '@astrojs/cloudflare';

import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://pabitramohansingh.com',
  output: 'static',
  compressHTML: true,
  trailingSlash: 'never',
  integrations: [mdx(), sitemap()],

  vite: {
    plugins: [tailwindcss()],
  },

  build: {
    inlineStylesheets: 'always',
  },

  adapter: cloudflare(),
});