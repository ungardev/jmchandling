# /service-cards — Reconstruir el acordeón de servicios

Rediseña la sección de familias de servicio. **No toques el Hero ni el EquipmentGrid.**

## Contexto

- Componente objetivo: `src/components/home/ServiceAccordion.astro` (`id="services"`).
- Datos: `src/data/siteContent.ts` → 5 familias con `titleKey`, `descriptionKey`,
  `media`, `mediaAltKey`, `serviceKeys`.
- Imágenes asignadas y verificadas (`family-ramp-gse`, `family-aircraft-care`,
  `family-fbo-operations`, `family-passenger-services`, `family-gse-maintenance`).
- Sección sobre `bg-cargo-mist`, texto `cargo-ink`.
- El alias legacy `#capacidades` (span `sr-only`) debe conservarse dentro de la
  sección.

## Estructura esperada

- Cabecera de sección en 2 columnas: H2 a la izquierda, párrafo de apoyo a la
  derecha, separadas por `border-b border-cargo-deep/20`.
- Cuerpo: 5 bloques `<details>` nativos (sin JS de toggle). El primero abre por
  defecto (`open`); el resto cerrado.
- Cada `<details>`:
  - `<summary>` = fila editorial con `IndexLabel` (01–05), título de la familia
    y el indicator de apertura (SVG inline, `aria-hidden`).
  - El `id={family.key}` va en el `<details>` para que los deep-links
    (`#ramp-gse`, `#aircraft-care`, `#fbo-operations`, `#passenger-services`,
    `#gse-maintenance`) abran la familia correcta.
  - Contenido: descripción + lista de capacidades de la familia + foto real
    (`family-*`) con marco `.parallax`.
- Los 12 servicios especiales se muestran como lista compacta dentro de
  `passenger-services` (o como bloque final si el copy lo permite).

## Requisitos

- Las claves de texto salen de `t()`; los `titleKey` / `descriptionKey` /
  `mediaAltKey` se resuelven con `t(family.titleKey)` etc.
- Imágenes con `srcset`/`sizes` coherentes con el ancho real, `width`/`height`,
  `loading="lazy"`, `decoding="async"`.
- `alt` desde `t(family.mediaAltKey)`.
- Sin sombras difusas. Bordes de 1 px y cambios de superficie.
- El texto alternativo describe lo que se ve. No afirmar que la foto de
  `family-aircraft-care` muestra "limpieza de cabina" si no la muestra.
- Si hay script, debe ser `is:inline` y mínimo (solo abrir por hash); el
  presupuesto de JS por página es ≤ 10 kB gzip y la web actual shippa 0 kB.

## Entrega

Reporta: jerarquía visual resultante, tratamiento de la 5.ª familia, claves i18n
nuevas (si las hay) y `npm run check`.
