# /gallery — Reconstruir la franja de galería

Crea la sección de galería fotográfica de la portada. Es una sección nueva.

## Contexto

- Componente nuevo: `src/components/home/GalleryStrip.astro`.
- Debe insertarse en `src/pages/es/index.astro` y `src/pages/en/index.astro`
  (y en las variantes `/en/index.astro`) en un punto coherente con el relato:
  después de la retícula de servicios o de equipos, antes del bloque "Sobre JMC".
- 14 imágenes curadas en `src/data/media.generated.ts`, todas con `altKey` en
  `media.alt.*`:
  `galleryCargoHold`, `galleryCargoHoldContainer`, `galleryConsolidation`,
  `galleryUldStore`, `galleryBaggageSorting`, `galleryNightOps`,
  `galleryNightAircraft`, `galleryBeltLoading`, `galleryCargoContainer`,
  `galleryLoadedCart`, `galleryRampTeam`, `galleryBeltLoaderOps`,
  `galleryUldRamp`, `galleryAircraftDay`, `galleryAircraftRamp`.
- La biblioteca completa (61 medios) está en `public/assets/photos/manifest.json`.

## Formato — vertical-first

- **La gran mayoría de las fotos son verticales.** La galería debe ser
  vertical-first: tarjetas `aspect-[4/5]` con `object-cover`.
- El hero (`heroGseRamp`, art-directed con `sets.wide` 16:9 y `sets.tall` 4:5)
  **no** va en la tira: está reservado como banda a sangre en la cabecera.
- `heroRampNight` (4:3, la otra horizontal) tampoco va en la tira.

## Interacción

- **CSS puro**: `overflow-x-auto` + `scroll-snap-type: x mandatory` +
  `scroll-snap-align: start` en cada tarjeta.
- Sin carrusel con JS, sin librerías, sin botones de flecha si requieren scripts.
- Si añades flechas, hazlas CSS-first (`scroll-snap` + `scroll-by` con
  `scrollIntoView`), nunca un framework.
- Contenedor con `scrollbar-hide` o barra fina; la tira debe ser navegable con
  teclado (el contenedor con `tabindex="0"` y `role="region"` + `aria-label`).

## Requisitos

- `srcset`/`sizes` coherentes: tarjetas de ~360–420 px de ancho.
- `loading="lazy"`, `decoding="async"`, `width`/`height`.
- `alt` desde `t(media.altKey)`.
- Cabecera de sección con el mismo patrón del resto del sitio:
  H2 + párrafo + filete `border-b border-cargo-deep/20`.
- Alternancia de fondo: la galería no puede repetir el fondo de la sección
  anterior ni del siguiente.
- Sin sombras difusas. Sin gradientes decorativos sobre las fotos.

## Copy

Añade las claves de la cabecera en **es.json y en.json** (`home.galleryTitle`,
`home.galleryIntro` o el namespace que corresponda). Texto en español venezolano
profesional, sin superlativos.

## Entrega

Reporta: componente creado, inserción en ambas páginas, claves i18n añadidas, método de
navegación y `npm run check`.
