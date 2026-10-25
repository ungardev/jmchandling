# Medios y assets — JMC Handling

## Estructura

```
media-raw/                       maestros (504 MB) — IGNORADO POR GIT
├── equipment/   11 fotos Canon R5 (5464×8192) → 6 equipos GSE
├── services/    40 fotos iPhone 17 Pro → rampa, carga, operación
├── allies/      logos raster de marca
└── _quarantine/ imágenes generadas por IA — NO USAR

public/assets/
├── photos/{hero,equipment,services,families}/   derivados WebP — VERSIONADOS
├── photos/manifest.json                          biblioteca completa (0 kB de JS)
├── photos/video/                                 pushback.webm/.mp4 + poster
├── allies/                                       logos SVG/WebP kebab-case
├── brand/                                        isotipo y wordmark
└── og/                                           jmc-og-{es,en}.png 1200×630
```

**Los maestros nunca se suben a git.** Solo los derivados WebP (~19 MB).

## Pipeline

```bash
npm run optimize:assets
```

- Entrada: `scripts/media-map.json` — **el mapa semántico maestro**. Se edita ahí.
- Salida: `public/assets/photos/**` + `public/assets/photos/manifest.json` +
  `src/data/media.generated.ts`.
- WebP calidad 78, esfuerzo 6, **sin upscale**, **sin recorte** (se conserva la
  proporción original; el recorte se hace con `object-fit` en CSS).
- Anchos 640 / 1280. Hero: 1280 / 1920.
- Vídeo: recorte 6 s–56 s del original, 626×360 nativo (no escalar), H.264 CRF 32
  + VP9 200 kbps 2-pass, poster WebP.

## Cómo consumir

```astro
---
import { equipmentCarrucha } from '../../data/media.generated';
---

<img
  src={equipmentCarrucha.src}
  srcset={equipmentCarrucha.srcset}
  sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
  alt={t(equipmentCarrucha.altKey)}
  width={equipmentCarrucha.width}
  height={equipmentCarrucha.height}
  loading="lazy"
  decoding="async"
/>
```

- Importa **exports individuales** (el módulo está diseñado para tree-shaking).
  No importes el objeto `media` completo salvo que uses casi todo.
- `sizes` debe reflejar el ancho real de renderizado.
- Hero: `loading="eager"` + `fetchpriority="high"`. Todo lo demás `lazy`.

## Regla de veracidad — importante

El archivo photographic cubre **rampa, carga y equipos GSE**. No hay fotos de
limpieza interior de aeronaves, ni de atención al pasajero, ni de taller.

Para esas tres familias existen fotos **heredadas** de baja resolución, ya
asignadas y con su `altKey`:

| Familia | Id del medio |
|---|---|
| Plataforma y GSE | `family-ramp-gse` |
| Cuidado de aeronaves | `family-aircraft-care` |
| OBF y operación | `family-fbo-operations` |
| Pasajeros y servicios especiales | `family-passenger-services` |
| Mantenimiento GSE | `family-gse-maintenance` |

**Nunca reutilices una foto de rampa para ilustrar limpieza, pasajeros o taller.**
Y nunca uses imágenes generadas por IA (`media-raw/_quarantine/`).

## Aliados

- Solo logotipos reales, con nombre de archivo en kebab-case.
- `src/data/allies.ts` es la lista; cada `logo` debe existir en `public/assets/allies/`.
- `wordmark: true` marca los que son tipográficos (Aerotur) para que se rendericen
  con menos contraste.
- Aerotur es hoy el único wordmark: su logotipo oficial sigue pendiente de negocio.

## Alt text

- Toda clave `media.alt.*` existe en `es.json` **y** `en.json`.
- El texto describe **lo que se ve**, no lo que debería estar pasando.
- Ejemplo correcto: "Operario de rampa cargando un contenedor en la bodega".
- Ejemplo incorrecto: "Limpieza profunda de la cabina" sobre una foto de rampa.

`npm run i18n:check` valida todas las `altKey` del mapa.
