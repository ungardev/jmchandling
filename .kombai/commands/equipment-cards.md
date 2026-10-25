# /equipment-cards — Reconstruir la retícula de equipos GSE

Rediseña la sección de equipos de apoyo terrestre. **No toques el ServicesGrid.**

## Contexto

- Componente objetivo: `src/components/home/EquipmentGrid.astro` (`id="equipment"`).
- 6 equipos con las 6 fotos **reales** del cliente, ya asignadas:

| Clave i18n | Id del medio |
|---|---|
| `equipment.carrucha` | `equipmentCarrucha` |
| `equipment.tractor` | `equipmentTractor` |
| `equipment.water` | `equipmentWaterCart` |
| `equipment.belt` | `equipmentBeltLoader` |
| `equipment.gpu` | `equipmentGpu` |
| `equipment.asu` | `equipmentAsu` |

- Las fotos son **verticales** (5464×8192 en origen). Formato natural de tarjeta
  `aspect-[4/5]`.
- Sección sobre `bg-cargo-white`.
- Alias legacy `#equipos` (span `sr-only`) a conservar.

## Contenido real de cada equipo (documento oficial de JMC)

- **Carrucha** — carro de equipaje sin motor; se enganchan en tren y son arrastradas
  entre terminal y aeronave.
- **Tractor remolcador** — vehículo motorizado de perfil bajo y gran tracción para
  arrastrar carruchas y equipos de apoyo.
- **Carro de aguas residuales** — drena los tanques de sanitarios y recarga agua
  limpia y desinfectante.
- **Cinta transportadora** — banda rodante de altura ajustable que sube y baja
  equipaje a la puerta de bodega; previene lesiones.
- **GPU** — unidad de energía en tierra: alimenta la avión con el motor apagado
  (iluminación, computadoras, aviónica) sin consumir combustible de la aeronave.
- **ASU** — unidad de arranque neumático: suministra aire comprimido para hacer
  girar las turbinas cuando la APU está inoperativa.

## Estructura esperada

- Cabecera: H2 + párrafo de apoyo, separados por `border-b`.
- Retícula **bento** de 6 tarjetas (3 + 2 + 1, o 2 filas de 3 con anchos variables).
- Cada tarjeta: imagen 4:5 con `object-cover`, título, descripción.
- Alternativa válida: lista horizontal por fila con imagen pequeña a la izquierda
  (`sm:grid-cols-[180px_1fr]`).
- CTA final a `${servicesPath}#ramp-gse`.

## Requisitos

- `srcset`/`sizes` coherentes con el ancho de tarjeta real.
- `loading="lazy"`, `decoding="async"`, `width`/`height`.
- El hover de imagen (`group-hover:scale-[1.03]`) debe anularse con
  `motion-reduce:transform-none motion-reduce:transition-none`.
- Textos de `t('equipment.<key>Title')` y `t('equipment.<key>Desc')`.
- Sin inventar capacidades técnicas que no estén en el documento de arriba.

## Entrega

Reporta: composición bento elegida, tratamiento de las fotos verticales, claves
i18n nuevas (si las hay) y `npm run check`.
