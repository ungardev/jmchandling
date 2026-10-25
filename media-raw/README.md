# media-raw — Photo masters

**Esta carpeta NO se versiona en git.** Contiene los archivos maestros de
fotografía (~504 MB) que alimentan el pipeline de medios.

## Qué hay aquí

| Carpeta | Contenido | Origen |
|---|---|---|
| `equipment/` | 11 fotos de equipos GSE (Canon EOS R5, 5464×8192) | Sesión de fotografía propia |
| `services/` | 40 fotos de operación de rampa y carga (iPhone 17 Pro) | Sesión de fotografía propia |
| `allies/` | Logotipos raster de marca (PNG) | Material recibido del cliente |
| `_quarantine/` | Imágenes generadas por IA | **NO USAR** |

## Cómo se usa

```bash
npm run optimize:assets
```

El pipeline lee `scripts/media-map.json` (el mapa semántico maestro), procesa cada
fuente y escribe:

- `public/assets/photos/{hero,equipment,services,families}/*.webp` — derivados
  responsive (640 / 1280; hero 1280 / 1920), **versionados en git**.
- `public/assets/photos/manifest.json` — biblioteca completa.
- `src/data/media.generated.ts` — subconjunto curado, tipado.
- `public/assets/photos/video/` — `pushback.webm` / `pushback.mp4` + poster.
- `public/assets/og/jmc-og-{es,en}.png` — 1200×630.

## Reglas

1. **Para añadir una foto nueva**, colócala en `media-raw/` y da de alta su
   entrada en `scripts/media-map.json` con `id`, `src`, `group`, `altKey` y
   `widths`. Luego ejecuta el pipeline.
2. **Los `altKey` deben existir en `es.json` y `en.json`.** `npm run i18n:check`
   lo valida y falla si no.
3. **El texto alternativo describe lo que se ve**, no lo que debería estar
   pasando. La librería cubre rampa, carga y GSE: no hay fotos de limpieza
   interior, atención al pasajero ni taller. Esas familias usan los medios
   heredados asignados en el mapa.
4. **Nunca** subas imágenes generadas por IA.
5. **Nunca** subas estas maestras a git. Solo los derivados WebP.

## Añadir un logo de aliado

1. Coloca el archivo en `media-raw/allies/`.
2. El pipeline lo convierte a `public/assets/allies/<nombre-kebab>.webp`.
3. Añade la entrada en `src/data/allies.ts`.

Los SVG que ya están en `public/assets/allies/` se renombran a kebab-case de
forma automática. Aerotur es hoy el único *wordmark* (tipográfico) pendiente de
recibir su logotipo oficial.
