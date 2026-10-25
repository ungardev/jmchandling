# /equipment-cards — Refinar la retícula de equipos GSE

Refina la sección de equipos de apoyo terrestre. **No toques el ServicesGrid.**

> Prefiere el prompt maestro: `.kombai/PROMPT-MAESTRO.md` → `/improve-ui`.

## Contexto

- Componente objetivo: `src/components/home/EquipmentGrid.astro` (`id="equipment"`).
- Retícula actual: **6 tarjetas fotográficas + 1 card CTA** para ASU,
  en `sm:grid-cols-2 lg:grid-cols-4`.

| Clave i18n | Id del medio | Qué muestra realmente la foto |
|---|---|---|
| `equipment.carrucha` | `equipmentCarrucha` | Carrucha azul "07 JMC", plataforma con cortina lateral |
| `equipment.tractor` | `equipmentTractor` | Tractor remolcador azul "05 JMC" con plataforma trasera |
| `equipment.tractorService` | `equipmentTractorService` | Tractor de plataforma con asiento, volante y livery JMC |
| `equipment.water` | `equipmentWaterCart` | Carro de aguas residuales: tanque, equipo de bombeo, barra amarilla |
| `equipment.belt` | `equipmentBeltLoader` | Cinta transportadora con banda elevada sobre rams hidráulicos |
| `equipment.gpu` | `equipmentGpu` | GPU con escape, panel de control y mangueras de aire ("08 JMC") |
| *(CTA, sin foto)* | — | **ASU**: no existe fotografía. Card con `equipment.asuCtaTitle` / `equipment.asuCtaText` |

- Las fotos son **verticales** (5464×8192 en origen). Formato de tarjeta
  `aspect-[4/5]`.
- Sección sobre `bg-cargo-white`.
- Alias legacy `#equipos` (span `sr-only`) a conservar.
- Cada `<li>` lleva `id="equipment-<key>"` estable (deep links).

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

## Requisitos

- **No** inventes una foto de ASU. La card CTA es la solución.
- **No** re-etiquetes una foto como un equipo que no muestra.
- `srcset`/`sizes` coherentes con el ancho de tarjeta real.
- `loading="lazy"`, `decoding="async"`, `width`/`height`.
- El hover de imagen (`group-hover:scale-[1.03]`) debe anularse con
  `motion-reduce:transform-none motion-reduce:transition-none`.
- Textos de `t('equipment.<key>Title')` y `t('equipment.<key>Desc')`.
- Sin inventar capacidades técnicas que no estén en el documento de arriba.
- El CTA final apunta a `#services` (no a `/es/servicios#ramp-gse`, que ya no
  existe como ruta).

## Entrega

Reporta: composición elegida, tratamiento de las fotos verticales, claves
i18n nuevas (si las hay) y `npm run check`.
