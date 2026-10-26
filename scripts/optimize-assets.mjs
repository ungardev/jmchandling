/**
 * scripts/optimize-assets.mjs
 *
 * Pipeline de medios de JMC Handling.
 *
 * 1. Lee scripts/media-map.json (mapa semantico maestro).
 * 2. Convierte cada fuente a WebP responsive (varios anchos, sin upscale, sin recorte).
 * 2b. Aplica recortes art-dirigidos opcionales por item (`aspect` + `position`),
 *     y genera una variante vertical adicional (`portrait`) para movil.
 * 3. Emite public/assets/photos/manifest.json  -> biblioteca completa (publico, 0 kB de JS).
 * 4. Emite src/data/media.generated.ts        -> subconjunto curado y tipado.
 * 5. Convierte PNG de aliados a WebP.
 * 6. Rasteriza los OG SVG a PNG 1200x630.
 * 7. Transcodifica el video de plataforma a WebM + MP4 y extrae el poster.
 *
 * Uso: npm run optimize:assets
 *
 * Las fotos maestras viven en media-raw/ (504 MB, ignorado por git). Los
 * derivados WebP viven en public/assets/photos/ y SI se versionan.
 */

import { readFile, writeFile, mkdir, rm, stat, rename } from 'node:fs/promises';
import { existsSync, readdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const PHOTOS_OUT = join(ROOT, 'public', 'assets', 'photos');

const WEBP_QUALITY = 78;
const WEBP_EFFORT = 6;

/* ------------------------------------------------------------------ *
 * sharp con autoreparacion (WSL / /mnt/c no resuelve libvips anidado)
 * ------------------------------------------------------------------ */

function findLibvipsLibDirs() {
  const candidates = [];
  const nm = join(ROOT, 'node_modules', '@img');
  if (!existsSync(nm)) return candidates;
  const scan = (dir, depth = 0) => {
    if (depth > 3 || !existsSync(dir)) return;
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      if (!entry.isDirectory()) continue;
      const full = join(dir, entry.name);
      if (entry.name.startsWith('sharp-libvips-')) {
        const lib = join(full, 'lib');
        if (existsSync(lib)) candidates.push(lib);
      } else if (entry.name.startsWith('sharp-')) {
        scan(join(full, 'node_modules', '@img'), depth + 1);
      }
    }
  };
  scan(nm);
  return candidates;
}

async function loadSharp() {
  try {
    const mod = await import('sharp');
    return mod.default;
  } catch (err) {
    if (process.env.JMC_SHARP_RETRY === '1') throw err;
    const libs = findLibvipsLibDirs();
    if (libs.length === 0) throw err;
    console.log('  ! sharp no cargo; reintentando con LD_LIBRARY_PATH');
    const result = spawnSync(process.execPath, [fileURLToPath(import.meta.url)], {
      env: {
        ...process.env,
        LD_LIBRARY_PATH: [...libs, process.env.LD_LIBRARY_PATH].filter(Boolean).join(':'),
        JMC_SHARP_RETRY: '1',
      },
      stdio: 'inherit',
      cwd: ROOT,
    });
    process.exit(result.status ?? 1);
  }
}

/* ------------------------------------------------------------------ *
 * helpers
 * ------------------------------------------------------------------ */

async function ensureDir(path) {
  await mkdir(path, { recursive: true });
}

async function dirSize(dir) {
  let total = 0;
  const walk = async (d) => {
    for (const entry of readdirSync(d, { withFileTypes: true })) {
      const full = join(d, entry.name);
      if (entry.isDirectory()) await walk(full);
      else total += (await stat(full)).size;
    }
  };
  if (existsSync(dir)) await walk(dir);
  return total;
}

function human(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
}

/**
 * Resuelve la posicion de recorte de sharp a partir del mapa semantico.
 * - "attention" / "entropy": sharp elige la region mas informada de la foto.
 * - "top" | "centre" | "bottom" | "left" | "right": gravedad explicita.
 * - { top, left }: desplazamiento en pixeles sobre el recorte por defecto.
 */
function resolvePosition(position, sharp) {
  if (position === undefined || position === null) return undefined;
  if (typeof position === 'object') return position;
  if (position === 'attention') return sharp.strategy.attention;
  if (position === 'entropy') return sharp.strategy.entropy;
  return position;
}

/** "16:9" -> 1.777… */
function aspectRatio(aspect) {
  if (!aspect) return null;
  const [w, h] = String(aspect).split(':').map(Number);
  if (!w || !h) return null;
  return w / h;
}

/** "Copa Airlines" -> "copa-airlines" */
function kebab(name) {
  return name
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .toLowerCase();
}

/* ------------------------------------------------------------------ *
 * Aliados raster con caja de color horneada ("knockout")
 * ------------------------------------------------------------------ */

/**
 * Logotipos que llegan como tinta clara sobre una caja de color opaca
 * grabada en el raster (sin canal alfa). Renderizar eso sobre una pagina
 * clara produce un bloque de color que compite con el texto.
 *
 * El knockout proyecta cada pixel sobre el eje fondo -> tinta: el color de
 * fondo se vuelve transparente y la tinta conserva su antialias. Al final
 * la tinta se retonifica al color de marca para que el logotipo sobreviva
 * sobre fondo blanco.
 *
 * `bg` e `ink` se declaran de forma explicita: un detector automatico es
 * fragil con logotipos multicolores (Laser, Copa, Iberia) y con fuentes que
 * cambian de exportacion.
 */
const ALLY_KNOCKOUTS = {
  // Estelar: wordmark blanco sobre caja navy (#001E54) horneada en el PNG,
  // con un marco blanco de 1px alrededor. Se retonifica a cargo-deep.
  estelar: { bg: [0, 36, 94], ink: [254, 254, 254], tone: [0x0f, 0x3e, 0x51] },
};

/**
 * Convierte un logo con fondo solido en tinta sobre alfa transparente.
 * Devuelve { data, info } con el recorte ajustado al ink real.
 */
async function knockoutAlly(inputPath, spec, sharp) {
  const { data, info } = await sharp(inputPath)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const { width: w, height: h, channels: ch } = info;

  const [br, bgc, bb] = spec.bg;
  const d = [spec.ink[0] - br, spec.ink[1] - bgc, spec.ink[2] - bb];
  const dd = d[0] * d[0] + d[1] * d[1] + d[2] * d[2];

  // 1) Caja del fondo solido (la mancha de color uniforme).
  let nx0 = w, ny0 = h, nx1 = -1, ny1 = -1;
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const i = y * w + x;
      const r = data[i * ch], g = data[i * ch + 1], b = data[i * ch + 2];
      if (Math.abs(r - br) < 14 && Math.abs(g - bgc) < 14 && Math.abs(b - bb) < 14) {
        if (x < nx0) nx0 = x;
        if (x > nx1) nx1 = x;
        if (y < ny0) ny0 = y;
        if (y > ny1) ny1 = y;
      }
    }
  }
  // Erosionar 2px: descarta los blends del borde caja/fondo exterior.
  nx0 += 2; ny0 += 2; nx1 -= 2; ny1 -= 2;

  const out = Buffer.alloc(w * h * 4);
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const i = y * w + x;
      const o = i * 4;
      if (x < nx0 || x > nx1 || y < ny0 || y > ny1) {
        out[o + 3] = 0; // marco exterior
        continue;
      }
      const p = [
        data[i * ch] - br,
        data[i * ch + 1] - bgc,
        data[i * ch + 2] - bb,
      ];
      let a = (p[0] * d[0] + p[1] * d[1] + p[2] * d[2]) / dd;
      if (a < 0) a = 0;
      if (a > 1) a = 1;
      out[o] = spec.tone[0];
      out[o + 1] = spec.tone[1];
      out[o + 2] = spec.tone[2];
      out[o + 3] = Math.round(a * 255);
    }
  }

  // 2) Recorte al ink real (sharp.trim no mira el canal alfa).
  let bx0 = w, by0 = h, bx1 = -1, by1 = -1;
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      if (out[(y * w + x) * 4 + 3] > 32) {
        if (x < bx0) bx0 = x;
        if (x > bx1) bx1 = x;
        if (y < by0) by0 = y;
        if (y > by1) by1 = y;
      }
    }
  }

  const cw = bx1 - bx0 + 1;
  const chh = by1 - by0 + 1;
  const cropped = await sharp(out, { raw: { width: w, height: h, channels: 4 } })
    .extract({ left: bx0, top: by0, width: cw, height: chh })
    .raw()
    .toBuffer({ resolveWithObject: true });

  return { data: cropped.data, info: { width: cropped.info.width, height: cropped.info.height, channels: 4 } };
}

/**
 * Renombrado seguro en sistemas de archivos case-insensitive (WSL /mnt/c).
 * Un rm() previo del destino borraria el propio origen cuando el cambio es
 * solo de caja.
 */
async function safeRename(src, dest) {
  if (src === dest) return;
  if (src.toLowerCase() === dest.toLowerCase()) {
    const tmp = `${dest}.tmp-rename`;
    await rm(tmp, { force: true });
    await rename(src, tmp);
    await rename(tmp, dest);
    return;
  }
  await rm(dest, { force: true });
  await rename(src, dest);
}

/**
 * Sustituye <img src="/assets/..."> por <image href="data:image/png;base64,...">.
 * Sin esto, librsvg descarta en silencio las imagenes externas y el OG
 * sale sin logo.
 */
async function inlineSvgImages(svg, sharp) {
  const matches = [...svg.matchAll(/<img\b[^>]*\bsrc="([^"]+)"[^>]*\/?>/g)];
  if (matches.length === 0) return svg;

  let out = svg;
  for (const match of matches) {
    const ref = match[1];
    const abs = join(ROOT, 'public', ref.replace(/^\/+/, ''));
    if (!existsSync(abs)) {
      console.warn(`  ! og: imagen no encontrada ${ref}`);
      continue;
    }
    const png = await sharp(abs, { failOn: 'none' })
      .trim({ background: '#ffffff' })
      .png()
      .toBuffer();
    const tag = match[0]
      .replace(/\bsrc="[^"]+"/, `href="data:image/png;base64,${png.toString('base64')}"`)
      .replace(/^<img/, '<image')
      .replace(/\/>$/, '/>');
    out = out.replace(match[0], tag);
  }
  return out;
}

/* ------------------------------------------------------------------ *
 * pipeline principal
 * ------------------------------------------------------------------ */

async function main() {
  const sharp = await loadSharp();

  console.log('\nJMC Asset Pipeline');
  console.log('==================\n');

  const map = JSON.parse(await readFile(join(__dirname, 'media-map.json'), 'utf8'));
  const roots = {
    raw: join(ROOT, map.roots.raw),
    legacy: join(ROOT, map.roots.legacy),
  };
  const groups = Object.fromEntries(
    Object.entries(map.groups).map(([k, v]) => [k, join(ROOT, v)])
  );

  // Limpieza previa del arbol de salida para evitar restos de versiones previas.
  for (const dir of Object.values(groups)) {
    if (existsSync(dir)) await rm(dir, { recursive: true, force: true });
  }
  await ensureDir(PHOTOS_OUT);

  const manifest = [];
  let processed = 0;
  let skipped = 0;

  for (const item of map.items) {
    const src = join(roots[item.root], item.src);
    if (!existsSync(src)) {
      console.warn(`  ! fuente ausente: ${item.src}`);
      skipped += 1;
      continue;
    }

    const outDir = groups[item.group];
    await ensureDir(outDir);

    /* --- modo A: recortes art-dirigidos (conjuntos nombrados) --------- */
    if (Array.isArray(item.sets) && item.sets.length > 0) {
      const sets = {};

      for (const set of item.sets) {
        const ratio = aspectRatio(set.aspect);
        const position = resolvePosition(set.position, sharp);
        const variants = [];

        for (const width of set.widths) {
          const height = ratio ? Math.round(width / ratio) : null;
          const outPath = join(outDir, `${item.id}-${set.name}-${width}.webp`);

          let pipeline = sharp(src, { failOn: 'none' }).rotate();
          if (height) {
            pipeline = pipeline.resize({
              width,
              height,
              fit: 'cover',
              position,
              withoutEnlargement: false,
            });
          } else {
            pipeline = pipeline.resize({ width, fit: 'inside', withoutEnlargement: true });
          }

          await pipeline
            .webp({ quality: set.quality ?? WEBP_QUALITY, effort: WEBP_EFFORT })
            .toFile(outPath);

          const outMeta = await sharp(outPath).metadata();
          variants.push({
            width: outMeta.width,
            height: outMeta.height,
            src: `/assets/photos/${item.group}/${item.id}-${set.name}-${width}.webp`,
          });
        }

        const largest = variants[variants.length - 1];
        sets[set.name] = {
          src: largest.src,
          width: largest.width,
          height: largest.height,
          srcset: variants.map((v) => `${v.src} ${v.width}w`).join(', '),
          variants,
        };
      }

      manifest.push({
        id: item.id,
        group: item.group,
        altKey: item.altKey,
        curated: item.curated === true,
        sets,
      });
      processed += 1;
      continue;
    }

    /* --- modo B: derivacion estandar (conserva la proporcion) --------- */
    const variants = [];
    for (const width of item.widths) {
      const outPath = join(outDir, `${item.id}-${width}.webp`);
      await sharp(src, { failOn: 'none' })
        .rotate()
        .resize({ width, fit: 'inside', withoutEnlargement: true })
        .webp({ quality: WEBP_QUALITY, effort: WEBP_EFFORT })
        .toFile(outPath);
      const outMeta = await sharp(outPath).metadata();
      variants.push({
        width: outMeta.width,
        height: outMeta.height,
        src: `/assets/photos/${item.group}/${item.id}-${width}.webp`,
      });
    }

    // La variante mas ancha es el src por defecto.
    const largest = variants[variants.length - 1];
    manifest.push({
      id: item.id,
      group: item.group,
      altKey: item.altKey,
      curated: item.curated === true,
      src: largest.src,
      width: largest.width,
      height: largest.height,
      srcset: variants.map((v) => `${v.src} ${v.width}w`).join(', '),
      variants,
    });
    processed += 1;
  }

  /* -------------------------------------------------------------- *
   * manifest publico (biblioteca completa, 0 kB de JS)
   * -------------------------------------------------------------- */
  await writeFile(
    join(PHOTOS_OUT, 'manifest.json'),
    JSON.stringify({ generated: null, items: manifest }, null, 2) + '\n'
  );

  /* -------------------------------------------------------------- *
   * modulo TS curado (lo que consumen los componentes)
   * -------------------------------------------------------------- */
  const curated = manifest.filter((m) => m.curated);
  const camel = (id) => id.replace(/-([a-z0-9])/g, (_, c) => c.toUpperCase());

  const entries = curated
    .map((m) => {
      // Activos con recortes art-dirigidos: una variante por breakpoint.
      if (m.sets) {
        const sets = Object.entries(m.sets)
          .map(
            ([name, set]) => `  ${JSON.stringify(name)}: {
    src: ${JSON.stringify(set.src)},
    width: ${set.width},
    height: ${set.height},
    srcset: ${JSON.stringify(set.srcset)},
  },`
          )
          .join('\n');
        return `export const ${camel(m.id)}: ArtDirectedAsset = {
  id: ${JSON.stringify(m.id)},
  altKey: ${JSON.stringify(m.altKey)},
  sets: {
${sets}
  },
};`;
      }

      return `export const ${camel(m.id)}: MediaAsset = {
  src: ${JSON.stringify(m.src)},
  width: ${m.width},
  height: ${m.height},
  altKey: ${JSON.stringify(m.altKey)},
  srcset: ${JSON.stringify(m.srcset)},
};`;
    })
    .join('\n\n');

  const ts = `/**
 * src/data/media.generated.ts
 *
 * GENERADO AUTOMATICAMENTE por scripts/optimize-assets.mjs — no editar a mano.
 * Fuente: scripts/media-map.json
 *
 * Cada activo se exporta por separado para que el bundler pueda eliminar
 * (tree-shake) los que una pagina no usa. La biblioteca completa vive en
 * public/assets/photos/manifest.json (publica, sin coste de JS).
 */

export interface MediaAsset {
  src: string;
  width: number;
  height: number;
  altKey: string;
  srcset: string;
}

/** Variante de un activo con recortes art-dirigidos (un set por breakpoint). */
export interface MediaVariant {
  src: string;
  width: number;
  height: number;
  srcset: string;
}

export interface ArtDirectedAsset {
  id: string;
  altKey: string;
  sets: Record<string, MediaVariant>;
}

${entries}

export const media = {
${curated.filter((m) => !m.sets).map((m) => `  ${JSON.stringify(m.id)}: ${camel(m.id)},`).join('\n')}
} as const satisfies Record<string, MediaAsset>;

/** Slides del hero en orden de rotacion. */
export const heroSlides: ArtDirectedAsset[] = [
${curated
  .filter((m) => m.sets)
  .map((m) => `  ${camel(m.id)},`)
  .join('\n')}
];

export type MediaId = keyof typeof media;

export function getMedia(id: MediaId): MediaAsset {
  return media[id];
}
`;
  await writeFile(join(ROOT, 'src', 'data', 'media.generated.ts'), ts);

/* -------------------------------------------------------------- *
 * aliados: fuentes -> kebab-case, PNG -> WebP
 * -------------------------------------------------------------- */
  const alliesDir = join(ROOT, 'public', 'assets', 'allies');
  const alliesSrc = join(ROOT, 'media-raw', 'allies');
  await ensureDir(alliesDir);

  // 1) Fuentes raster en media-raw/allies/ -> WebP en public/assets/allies/.
  if (existsSync(alliesSrc)) {
    for (const file of readdirSync(alliesSrc)) {
      if (!/\.(png|jpe?g)$/i.test(file)) continue;
      const id = kebab(file.replace(/\.(png|jpe?g)$/i, ''));
      const out = join(alliesDir, `${id}.webp`);

      const ko = ALLY_KNOCKOUTS[id];
      if (ko) {
        // Logotipo con caja de color horneada: se hace "knockout" para que
        // la tinta quede sobre fondo transparente (ver knockoutAlly).
        const knockout = await knockoutAlly(join(alliesSrc, file), ko, sharp);
        await sharp(knockout.data, { raw: knockout.info })
          .webp({ quality: 92, alphaQuality: 100, effort: 6 })
          .toFile(out);
        console.log(
          `  ✓ aliados: ${file} -> ${id}.webp (knockout ${knockout.info.width}x${knockout.info.height}, alfa)`
        );
        continue;
      }

      await sharp(join(alliesSrc, file), { failOn: 'none' })
        .trim({ background: '#ffffff' })
        .webp({ quality: 92, alphaQuality: 100 })
        .toFile(out);
      console.log(`  ✓ aliados: ${file} -> ${id}.webp`);
    }
  }

  // 2) SVG en public/assets/allies/ -> nombre canonico kebab-case.
  if (existsSync(alliesDir)) {
    for (const file of readdirSync(alliesDir)) {
      if (!file.toLowerCase().endsWith('.svg')) continue;
      const id = kebab(file.replace(/\.svg$/i, ''));
      if (id === file) continue;
      await safeRename(join(alliesDir, file), join(alliesDir, `${id}.svg`));
      console.log(`  ✓ aliados: ${file} -> ${id}.svg`);
    }
  }

  /* -------------------------------------------------------------- *
   * OG: SVG -> PNG 1200x630
   * -------------------------------------------------------------- */
  const ogDir = join(ROOT, 'public', 'assets', 'og');
  if (existsSync(ogDir)) {
    for (const file of readdirSync(ogDir)) {
      if (!file.toLowerCase().endsWith('.svg')) continue;
      const src = join(ogDir, file);
      const out = join(ogDir, file.replace(/\.svg$/i, '.png'));
      try {
        // librsvg no resuelve rutas relativas a filesystem: las <img href="/...">
        // se silentian. Se inlinean como data URI (PNG, soportado por librsvg).
        let svg = await readFile(src, 'utf8');
        svg = await inlineSvgImages(svg, sharp);
        const tmp = join(ogDir, `.${file}.inline.svg`);
        await writeFile(tmp, svg);

        await sharp(tmp, { density: 144 })
          .resize(1200, 630, { fit: 'cover' })
          .png({ compressionLevel: 9, quality: 90 })
          .toFile(out);
        await rm(tmp, { force: true });
        console.log(`  ✓ og: ${file} -> ${out.split('/').pop()}`);
      } catch (err) {
        console.warn(`  ! no se pudo rasterizar ${file}: ${err.message.split('\n')[0]}`);
      }
    }
  }

  /* -------------------------------------------------------------- *
   * video: WebM + MP4 + poster
   * -------------------------------------------------------------- */
  const videoSrc = join(roots.legacy, 'PUSHBACK.mp4');
  const videoOut = join(PHOTOS_OUT, 'video');
  if (existsSync(videoSrc)) {
    await ensureDir(videoOut);
    const ffmpeg = join(ROOT, 'node_modules', '@ffmpeg-installer', 'linux-x64', 'ffmpeg');
    const hasFfmpeg = existsSync(ffmpeg);

    if (!hasFfmpeg) {
      console.warn('  ! ffmpeg no disponible; se conserva el MP4 original');
      await writeFile(join(videoOut, 'pushback.mp4'), await readFile(videoSrc));
    } else {
      const run = (args) =>
        spawnSync(ffmpeg, ['-y', ...args], { stdio: ['ignore', 'ignore', 'pipe'] });

      // La fuente es 626x360 y 1:47 con un arranque oscuro de ~6 s. Se recorta
      // el segmento con acción visible y se respeta la resolución nativa
      // (escalar hacia arriba solo genera peso y artefactos).
      const scale = "scale='min(640,iw)':-2";
      const TRIM_START = '6';
      const TRIM_LEN = '50';

      // MP4 / H.264 — compatibilidad universal.
      run([
        '-ss', TRIM_START,
        '-t', TRIM_LEN,
        '-i', videoSrc,
        '-vf', scale,
        '-c:v', 'libx264',
        '-preset', 'veryslow',
        '-crf', '32',
        '-profile:v', 'main',
        '-pix_fmt', 'yuv420p',
        '-movflags', '+faststart',
        '-an',
        join(videoOut, 'pushback.mp4'),
      ]);

      // WebM / VP9 — 2 passes a bitrate fijo, menor peso en Chrome/Firefox.
      run([
        '-ss', TRIM_START,
        '-t', TRIM_LEN,
        '-i', videoSrc,
        '-vf', scale,
        '-c:v', 'libvpx-vp9',
        '-b:v', '200k',
        '-pass', '1',
        '-an',
        '-f', 'webm',
        join(videoOut, 'pushback.pass1.webm'),
      ]);
      run([
        '-ss', TRIM_START,
        '-t', TRIM_LEN,
        '-i', videoSrc,
        '-vf', scale,
        '-c:v', 'libvpx-vp9',
        '-b:v', '200k',
        '-pass', '2',
        '-an',
        join(videoOut, 'pushback.webm'),
      ]);
      await rm(join(videoOut, 'pushback.pass1.webm'), { force: true });

      // Poster: frame con contenido util (evita el arranque oscuro).
      run([
        '-ss', '10',
        '-i', videoSrc,
        '-frames:v', '1',
        '-vf', scale,
        join(videoOut, 'poster.png'),
      ]);
      const poster = join(videoOut, 'poster.png');
      if (existsSync(poster)) {
        await sharp(poster).webp({ quality: 82 }).toFile(join(videoOut, 'pushback-poster.webp'));
        await rm(poster);
      }
      console.log('  ✓ video: pushback.webm + pushback.mp4 + pushback-poster.webp');
    }
  }

  /* -------------------------------------------------------------- *
   * resumen
   * -------------------------------------------------------------- */
  const outSize = await dirSize(PHOTOS_OUT);
  console.log('\nPipeline completo');
  console.log(`  ${processed} imagenes procesadas (${skipped} omitidas)`);
  console.log(`  ${curated.length} entradas curadas -> src/data/media.generated.ts`);
  console.log(`  biblioteca completa -> public/assets/photos/manifest.json`);
  console.log(`  peso de public/assets/photos: ${human(outSize)}\n`);
}

main().catch((err) => {
  console.error('\nPipeline fallido:', err);
  process.exit(1);
});
