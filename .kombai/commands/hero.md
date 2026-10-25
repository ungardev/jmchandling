# /hero — Reconstruir la portada principal (Hero)

Rediseña el bloque de cabecera de la portada. **No toques el resto de la página.**

## Contexto

- Componente objetivo: `src/components/home/Hero.astro`.
- Se renderiza en `/es/` y `/en/`. El texto sale de i18n (`home.*`).
- Fondo `cargo-deep`, texto `cargo-white`.
- Fotografía disponible: `heroRampNight` (1920×1440, aeropuerto de Maiquetía al
  anochecer con aeronaves y equipos en plataforma). Es **la única horizontal** del
  archivo — trátala como banda, no como recorte de fondo.

## Estructura esperada

- Grid de 2 columnas: texto 0.92fr / imagen 1.08fr. En móvil, texto primero.
- Columna de texto: eyebrow mono, H1 con `text-balance`, lead, CTA primario
  (`.btn-primary`) + CTA secundario (enlace con subrayado de acento), línea de
  contexto operativo con borde superior.
- Columna de imagen: `figure` con `aspect-[4/3]`, gradiente inferior
  `from-cargo-ink/70`, y `figcaption` con pie de foto + ubicación en mono.

## Requisitos

- Todo el texto vía `t()`. Ningún literal.
- Imagen con `srcset` + `sizes`, `width`/`height`, `loading="eager"`,
  `fetchpriority="high"`, `decoding="async"`.
- `alt` desde `t(heroRampNight.altKey)`.
- Tokens `cargo-*` únicamente. Sin hex.
- WCAG AA: contraste del texto sobre la imagen ≥ 4.5:1 → el gradiente
  `from-cargo-ink/70` es obligatorio, no decorativo.
- Funciona a 360 px sin scroll horizontal.

## Entrega

Reporta: estructura resultante, clases de Tailwind usadas, texto nuevo (clave i18n
propuesta) y el resultado de `npm run check`.
