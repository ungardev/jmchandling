import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://jmc-handling.com',
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
      // Los stubs de redirect (servicios/services/cotizacion/quote) no son
      // paginas reales: no deben indexarse ni aparecer en el sitemap.
      filter: (page) => !/\/(es|en)\/(servicios|services|cotizacion|quote)\/?$/.test(page),
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
