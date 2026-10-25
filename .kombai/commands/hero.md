# /hero — Refinar el Hero (una sola foto, sin carrusel)

Refina el bloque de cabecera de la portada. **No toques el resto de la página.**

> Prefiere el prompt maestro: `.kombai/PROMPT-MAESTRO.md` → `/improve-ui`.

## Contexto

- Componente objetivo: `src/components/home/Hero.astro`.
- Se renderiza en `/es/` y `/en/`. Todo el texto sale de i18n (`home.*`, `hero.*`).
- **Una sola foto, sin carrusel.** La fotografía ES el fondo de la sección.
- Asset: `heroGseRamp` — art-directed, exportado como `ArtDirectedAsset` con
  `sets.wide` (16:9, hasta 2400 px) y `sets.tall` (4:5, hasta 1080 px).
  Se consume con `<picture>` + dos `<source media=...>`.
- La foto muestra el tractor remolcador JMC "13" arrastrando un tren de carruchas
  junto a la cola de una aeronave al atardecer. El texto va sobre el **tercio
  izquierdo** (cola de la aeronave), no sobre el tractor.

## Estructura vigente (no rehacer)

- `<section class="relative isolate overflow-hidden bg-cargo-ink">`.
- `<figure class="absolute inset-0 -z-10">` con `<picture>` + dos gradientes:
  - vertical: `bg-gradient-to-t from-cargo-ink/70 via-cargo-ink/10 to-cargo-ink/35`
  - horizontal: `bg-gradient-to-r from-cargo-ink/92 via-cargo-ink/45 to-transparent`
- Contenido en `.container-max` con `pt-[7rem]` (despeja el header fijo de 4.5rem)
  y `pb-14 sm:pt-[8rem] md:pb-20 lg:pb-24`.
- Bloque de texto `max-w-2xl`: eyebrow mono, H1 `text-balance`, lead, cita en
  itálica, CTA primario `.btn-primary` + secundario con subrayado de acento,
  línea de ubicación con borde superior.
- `<figcaption>` como banda inferior con `border-t border-cargo-white/15`.

## Requisitos

- **No** convertir a grid de 2 columnas. **No** añadir carrusel ni slide.
- Todo el texto vía `t()`. Ningún literal.
- Imagen con `srcset` + `sizes="100vw"` + `width`/`height`, `loading="eager"`,
  `fetchpriority="high"`, `decoding="async"`.
- `alt` desde `t(heroGseRamp.altKey)`.
- Tokens `cargo-*` únicamente. Sin hex, sin `@apply`, sin `!important`.
- WCAG AA: el texto sobre la foto debe mantener ≥ 4.5:1. El gradiente horizontal
  es **obligatorio**, no decorativo. Contraste medido actual: ~18:1.
- 360 px sin scroll horizontal. El bloque de texto nunca debe desbordar.
- Respeta `prefers-reduced-motion`.

## Entrega

Reporta: estructura resultante, clases de Tailwind usadas, si tocaste los
gradientes (y el contraste resultante), y la salida de `npm run check`.
