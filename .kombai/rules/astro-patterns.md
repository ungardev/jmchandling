# Patrones Astro — JMC Handling

Astro 5 · `output: 'static'` · Tailwind CSS v3.4 · TypeScript 5.7.

## Estructura de componentes

```astro
---
import type { Locale } from '../../i18n/utils';
import { useTranslations } from '../../i18n/utils';

export interface Props {
  locale: Locale;
  variant?: 'primary' | 'secondary';
  class?: string;
}

const { locale, variant = 'primary', class: className = '' } = Astro.props;
const t = useTranslations(locale);
---

<section class="bg-cargo-white py-16">
  <div class="container-max">
    <h2 class="text-3xl font-semibold tracking-[-0.04em] text-cargo-deep">
      {t('home.sectionHeading')}
    </h2>
  </div>
</section>
```

- **Todo componente Astro exporta `interface Props`** y desestructura de `Astro.props`.
- Nombres de archivo: `PascalCase.astro` en `src/components/{global,home,services,contact,ui}/`.
- `locale` se pasa siempre como prop; `Layout.astro` fija `<html lang={locale}>`.

## Rutas

```
src/
├── components/{global,home,services,contact,ui}/   PascalCase.astro
├── data/                                          siteContent.ts · allies.ts · media.generated.ts
├── i18n/                                          es.json · en.json · utils.ts
├── layouts/                                       Layout.astro
├── pages/{es,en}/                                 un archivo por ruta, ES y EN emparejados
└── styles/                                        global.css
```

## Páginas

- Cada página nueva se crea **en pares ES + EN**: `src/pages/es/carreras.astro` y
  `src/pages/en/careers.astro`.
- Pasa `locale` a `<Layout>`.
- Añade las claves `meta.*` correspondientes en **ambos** diccionarios.
- El sitemap se genera automáticamente desde `src/pages/` (plugin `@astrojs/sitemap`).
- Rutas ES con prefijo: `/es/servicios` → `/en/services`. Naming: mismo concepto,
  palabra traducida (`servicios`/`services`, `contacto`/`contact`, `cotizacion`/`quote`).

## Redirecciones

- Las rutas antiguas se resuelven en `vercel.json` (edge, 301) **y** con páginas
  Astro de redirect (`return Astro.redirect('/es/#services', 301);`).
- La raíz `/` → `/es/` con 302 en `vercel.json`; `src/pages/index.astro` es el
  fallback para otros hostings, con detección de `Accept-Language`.

## Estilos

- Todo con clases de utilidad de Tailwind. **Sin `@apply` en estilos scoped**
  de componente. Sin `<style>` en `.astro` salvo casos muy justificados.
- Las utilidades reutilizables viven en `src/styles/global.css` (`@layer components`).
- Sin hex hardcodeado. Sin `bg-[#...]`. Sin `!important` salvo override de a11y.

## Datos

- `src/data/media.generated.ts` es **generado** por `scripts/optimize-assets.mjs`.
  No lo edites a mano; edita `scripts/media-map.json` y regenera.
- `src/data/siteContent.ts` — familias de servicio, con `titleKey` /
  `descriptionKey` / `mediaAltKey` apuntando a claves i18n (nunca texto directo).
- `src/data/allies.ts` — aliados, con `logo` en kebab-case bajo `/assets/allies/`.
