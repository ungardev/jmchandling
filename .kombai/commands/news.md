# /news — Bloque de noticias o Comunicados

Crea o rediseña un bloque de noticias / comunicados operativos. **Solo si existe
contenido real.** Sin contenido no se inventa.

## Contexto

- No existe hoy una sección de noticias en el sitio.
- Si se crea, el componente sería `src/components/home/NewsStrip.astro` o
  `src/components/services/NewsFeed.astro`.
- No hay backend ni CMS: `output: 'static'`. El contenido tiene que vivir en
  el repositorio como datos (`src/data/news.ts`) o en i18n.

## Regla de contenido

> **No inventes noticias, fechas, cifras, certificaciones ni comunicados.**
> Sin un archivo o un backing real, esta sección no se crea.

Si el usuario pide la sección y no hay contenido, entrégale:
1. La estructura del componente leyendo de `src/data/news.ts`.
2. Un `news.ts` con la forma del tipo y **2–3 entradas de ejemplo marcadas
   claramente como `status: 'draft'`**, listas para que el negocio las sustituya.
3. La nota de que las entradas de ejemplo deben reemplazarse antes de publicar.

## Modelo de datos

```ts
export interface NewsItem {
  slug: string;
  date: string;            // ISO 8601
  titleKey: string;        // clave i18n
  excerptKey: string;      // clave i18n
  mediaId?: string;        // id de src/data/media.generated.ts
  status: 'published' | 'draft';
}
```

Los textos van en i18n (`news.<slug>.title`), nunca en el archivo de datos.

## Requisitos de interfaz

- Retícula de 1 columna (destacado) + 2 columnas, o 3 columnas iguales.
- La imagen es opcional: si no hay `mediaId`, la tarjeta es tipográfica.
- La fecha en `font-mono text-xs uppercase tracking-[0.12em]`.
- `loading="lazy"` en todas las imágenes de la lista.
- Enlace a la entrada completa con `aria-label` descriptivo.
- Si creas páginas de detalle, recuerda: una por idioma (`/es/noticias/<slug>` y
  `/en/news/<slug>`) y las dos deben existir.

## SEO

Si hay detalle de noticia, añade `NewsArticle` en el JSON-LD de `Layout.astro`
(`datePublished`, `dateModified`, `headline`, `image`).

## Entrega

Reporta: archivos creados, si el contenido es real o de ejemplo, claves i18n
añadidas en ambos idiomas y `npm run check`.
