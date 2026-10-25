# /service-cards — Reconstruir la retícula de servicios

Rediseña la sección de familias de servicio. **No toques el Hero ni el EquipmentGrid.**

## Contexto

- Componente objetivo: `src/components/home/ServicesGrid.astro` (`id="services"`).
- Datos: `src/data/siteContent.ts` → 5 familias con `titleKey`, `descriptionKey`,
  `media`, `mediaAltKey`, `serviceKeys`.
- Imágenes asignadas y verificadas (`family-ramp-gse`, `family-aircraft-care`,
  `family-fbo-operations`, `family-passenger-services`, `family-gse-maintenance`).
- Sección sobre `bg-cargo-mist`, texto `cargo-ink`.
- El alias legacy `#capacidades` (span `sr-only`) debe conservarse dentro de la
  sección.

## Estructura esperada

- Cabecera de sección en 2 columnas (`0.72fr` / `1.28fr`): H2 a la izquierda,
  párrafo de apoyo a la derecha, ambas alineadas abajo y separadas por
  `border-b border-cargo-deep/20`.
- Cuerpo: 5 tarjetas. Opciones válidas:
  - retícula 3+2 con la primera tarjeta destacada, o
  - lista editorial densa con filete `divide-y` y una miniatura 4:5 por fila.
- Cada tarjeta: título (`text-xl font-semibold tracking-[-0.025em]`), descripción
  (`text-sm leading-relaxed text-cargo-ink/75`), y la lista de capacidades de la
  familia como micro-etiquetas o viñetas.
- Añade una 6.ª entrada "Servicios especiales" solo si el copy existe en i18n
  (`services.specialTitle` / `services.specialDesc`).

## Requisitos

- Las claves de texto salen de `t()`; los `titleKey` / `descriptionKey` /
  `mediaAltKey` se resuelven con `t(family.titleKey)` etc.
- Imágenes con `srcset`/`sizes` coherentes con el ancho real de tarjeta, `width`/
  `height`, `loading="lazy"`, `decoding="async"`.
- `alt` desde `t(family.mediaAltKey)`.
- Sin sombras difusas. Bordes de 1 px y cambios de superficie.
- El texto alternativo describe lo que se ve. No afirmar que la foto de
  `family-aircraft-care` muestra "limpieza de cabina" si no la muestra.

## Entrega

Reporta: jerarquía visual resultante, tratamiento de la 5.ª familia, claves i18n
nuevas (si las hay) y `npm run check`.
