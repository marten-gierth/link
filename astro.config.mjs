import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import markdoc from '@astrojs/markdoc';
import keystatic from '@keystatic/astro';

export default defineConfig({
    site: "https://martengierth.de/",
    build: {
        target: 'static',
    },
    integrations: [
        react(),
        sitemap(),
        markdoc(),
        keystatic(),
    ],
});