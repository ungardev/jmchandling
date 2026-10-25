# /new-page — Crear una página nueva (par ES + EN)

Crea una página nueva. **Siempre en pareja**: español e inglés.

## Procedimiento

1. **Confirma el par de rutas.** Mismo concepto, palabra traducida:

   | Concepto | ES | EN |
   |---|---|---|
   | Inicio | `/es/` | `/en/` |
   | Contacto | `/es/contacto` | `/en/contact` |
   | Sobre la empresa | `/es/sobre-jmc` | `/en/about-jmc` |
   | Carreras | `/es/carreras` | `/en/careers` |
   | Preguntas frecuentes | `/es/faq` | `/en/faq` |
   | Legal | `/es/legal` | `/en/legal` |

   ⚠️ `/es/servicios`, `/en/services`, `/es/cotizacion` y `/en/quote` son
   **stubs de redirect 301** hacia la home (`#services`) y la página de
   contacto. **No son páginas reales.** Si necesitas una página de servicios
   de verdad, crea `/es/servicios` **como página real** (no stub) y actualiza
   `vercel.json`, `ROUTE_SLUGS` en `src/i18n/utils.ts` y el sitemap.

2. **Crea los dos archivos** en `src/pages/es/` y `src/pages/en/`.

3. **Añade las claves i18n** en `es.json` **y** `en.json`. Mismo árbol.
   Para una página nueva, un namespace propio (`careers.*`, `faq.*`, `legal.*`).

4. **Añade las claves `meta.*`** (`meta.<slug>Title`, `meta.<slug>Desc`) en ambos.

5. **Añade el enlace** en `Header.astro` y/o `Footer.astro`, en ambos idiomas.

6. **Verifica** con `npm run verify`.

## Estructura de página

```astro
---
import Layout from '../../layouts/Layout.astro';
import type { Locale } from '../../i18n/utils';
import { useTranslations } from '../../i18n/utils';

export interface Props {
  locale: Locale;
}

const { locale } = Astro.props;
const t = useTranslations(locale);
---

<Layout
  locale={locale}
  title={t('meta.<slug>Title')}
  description={t('meta.<slug>Desc')}
>
  <main id="main-content">
    <!-- contenido -->
  </main>
</Layout>
```

- `<main id="main-content">` una sola vez por página.
- Un solo `<h1>`.
- Fondo de sección alternando según el ritmo del sitio.
- Navegación por migas si la página es profunda: el enlace "volver" usa
  `t('common.backHome')` o la ruta equivalente.

## Requisitos por tipo de página

- **FAQ** — `<details>`/`<summary>` nativo, sin JS. Añade JSON-LD `FAQPage` en
  `Layout.astro` con las mismas preguntas y respuestas.
- **Legal** — privacidad y términos. Contenido placeholder **marcado como
  pendiente de revisión legal**, nunca inventado como si fuera definitivo.
- **Carreras** — список de vacantes; si no hay vacantes reales, muestra el
  proceso de solicitud sin inventar puestos.

## Reglas

- Ningún literal de texto en el marcado.
- Tokens `cargo-*`, sin hex.
- WCAG AA, foco visible, `alt` en todas las imágenes.
- Cero JS de framework.

## Entrega

Reporta: rutas creadas, claves i18n añadidas (es/en), enlaces de navegación
actualizados y el resultado de `npm run verify`.
