import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import markdoc from '@astrojs/markdoc';
import keystatic from '@keystatic/astro';

import partytown from '@astrojs/partytown';

export default defineConfig({
    site: "https://martengierth.de/",
    build: {
        target: 'static',
    },
    output: "static",
    adapter: cloudflare(),
    image: {
        service: {
            entrypoint: "astro/assets/services/compile"
        }
    },
    integrations: [
      react(),
      sitemap(),
      markdoc(),
      keystatic(),
      partytown(),
    ],
});