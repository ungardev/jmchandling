import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://jmchandling.vercel.app',
  output: 'static',
  i18n: {
    defaultLocale: 'es',
    locales: ['es', 'en'],
    routing: {
      prefixDefaultLocale: true,
      redirectToDefaultLocale: false,
    },
  },
  integrations: [
    tailwind({ applyBaseStyles: false }),
    sitemap({
      i18n: {
        defaultLocale: 'es',
        locales: { 'es': 'es-ES', 'en': 'en-US' },
      },
    }),
  ],
  build: {
    inlineStylesheets: 'auto',
    assets: '_assets',
  },
  vite: {
    build: { cssCodeSplit: true },
  },
});
