/**
 * scripts/optimize-assets.mjs
 *
 * Converts legacy JPG/PNG logos and jmcground images into optimized WebP assets
 * for the JMC Handling Astro site.
 *
 * Usage: npm run optimize:assets
 * Requires: npm install sharp (included in dependencies)
 *
 * Outputs to: public/assets/brand/  and  public/assets/images/
 */

import sharp from 'sharp';
import { mkdir, writeFile, copyFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const BRAND_SRC = join(ROOT, 'LOGOS');
const IMAGE_SRC = join(ROOT, 'jmcground', 'image');
const BRAND_OUT = join(ROOT, 'public', 'assets', 'brand');
const IMAGE_OUT = join(ROOT, 'public', 'assets', 'images');

const SIZES = [256, 512, 1024];

async function ensureDir(path) {
  if (!existsSync(path)) await mkdir(path, { recursive: true });
}

async function toWebP(inputPath, outputPath, width) {
  await ensureDir(dirname(outputPath));
  await sharp(inputPath)
    .resize(width, width, { fit: 'inside', withoutEnlargement: true })
    .webp({ quality: 82 })
    .toFile(outputPath);
  console.log(`  ✓ ${width}px → ${outputPath.replace(ROOT, '')}`);
}

async function generateFavicon(inputPath, outputDir) {
  await ensureDir(outputDir);
  // 32px favicon in brand folder
  const ico32 = join(outputDir, 'favicon-32.webp');
  await sharp(inputPath)
    .resize(32, 32, { fit: 'cover', position: 'center' })
    .webp({ quality: 90 })
    .toFile(ico32);
  console.log(`  ✓ favicon-32.webp`);

  // Write ICO to public/ (one level up from outputDir/../.. = project root)
  const icoPath = join(ROOT, 'public', 'favicon.ico');
  await ensureDir(dirname(icoPath));
  await sharp(inputPath)
    .resize(32, 32, { fit: 'cover', position: 'center' })
    .toFile(icoPath);
  console.log(`  ✓ favicon.ico`);
}

async function generateImageWebP(srcPath, destPath, width, height) {
  await ensureDir(dirname(destPath));
  const pipeline = sharp(srcPath).resize(width, height ? height : undefined, {
    fit: 'cover',
    withoutEnlargement: true,
  });
  if (destPath.endsWith('.webp')) {
    await pipeline.webp({ quality: 82 }).toFile(destPath);
  } else {
    await pipeline.toFile(destPath);
  }
  console.log(`  ✓ ${destPath.replace(ROOT, '')}`);
}

async function main() {
  console.log('\n🎨 JMC Asset Optimizer');
  console.log('====================\n');

  // --- Brand logos ---
  console.log('Processing brand logos...');
  const logoMap = {
    'Logo-blanco.jpg':   { prefix: 'logo-white',   color: '#FFFFFF' },
    'Logo-claro.jpg':    { prefix: 'logo-light',   color: '#F5F8FA' },
    'Logo-oscuro.jpg':   { prefix: 'logo-deep',     color: '#0F3E51' },
    'Logo-negro.jpg':    { prefix: 'logo-ink',      color: '#0A1F2B' },
    'Isotipo-blanco.jpg': { prefix: 'isotipo-white', color: '#FFFFFF' },
    'Isotipo-claro.jpg':  { prefix: 'isotipo-light', color: '#F5F8FA' },
    'Isotipo-oscuro.jpg': { prefix: 'isotipo-deep',  color: '#0F3E51' },
    'Isotipo-negro.jpg':  { prefix: 'isotipo-ink',   color: '#0A1F2B' },
  };

  for (const [filename, config] of Object.entries(logoMap)) {
    const src = join(BRAND_SRC, filename);
    if (!existsSync(src)) {
      console.warn(`  ⚠ Source not found: ${src}`);
      continue;
    }
    for (const size of SIZES) {
      const out = join(BRAND_OUT, `${config.prefix}-${size}.webp`);
      await toWebP(src, out, size);
    }
  }

  // Generate favicon from isotipo-blanco
  const isotipoSrc = join(BRAND_SRC, 'Isotipo-blanco.jpg');
  if (existsSync(isotipoSrc)) {
    await generateFavicon(isotipoSrc, BRAND_OUT);
  }

  // --- Operations images ---
  console.log('\nProcessing operations images...');
  const imageMap = [
    { src: 'EQUIPOS.jpeg',                dest: 'gse-fleet.webp',        w: 1280, h: 720 },
    { src: 'LIMPIENZA A LOS EQUIPOS.jpeg', dest: 'equipment-cleaning.webp', w: 1280, h: 720 },
    { src: 'CAMBIO DE ACEITE.jpeg',       dest: 'gse-maintenance.webp',   w: 1280, h: 720 },
    { src: 'Capacitacion para garantizar la seguridad operacional de nuestros clientes.jpeg', dest: 'sms-training.webp', w: 1280, h: 720 },
    { src: 'Entrenamiento continuo.jpeg',  dest: 'continuous-training.webp', w: 1280, h: 720 },
    { src: 'sms.jpg',                    dest: 'sms-culture.webp',       w: 1280, h: 720 },
    { src: 'CESEA.jpg',                  dest: 'cesea-cert.webp',        w: 800,  h: 600  },
  ];

  for (const { src, dest, w, h } of imageMap) {
    const srcPath = join(IMAGE_SRC, src);
    if (!existsSync(srcPath)) {
      console.warn(`  ⚠ Source not found: ${srcPath}`);
      continue;
    }
    const outPath = join(IMAGE_OUT, dest);
    await generateImageWebP(srcPath, outPath, w, h);
  }

  // --- Pushback video poster ---
  const pushbackVideo = join(IMAGE_SRC, 'PUSHBACK.mp4');
  if (existsSync(pushbackVideo)) {
    // Generate poster from first frame of video using sharp
    // Since sharp can't extract video frames natively, create a dark placeholder
    // with the JMC branding colors
    const posterPath = join(IMAGE_OUT, 'pushback-poster.webp');
    await ensureDir(IMAGE_OUT);
    // Create a branded poster placeholder (dark gradient)
    await sharp({
      create: {
        width: 1920,
        height: 1080,
        channels: 3,
        background: { r: 15, g: 62, b: 81 },
      },
    })
      .jpeg({ quality: 85 })
      .toFile(posterPath.replace('.webp', '.jpg'));
    await sharp(posterPath.replace('.webp', '.jpg'))
      .webp({ quality: 82 })
      .toFile(posterPath);
    console.log(`  ✓ pushback-poster.webp (branded placeholder)`);
    await writeFile(posterPath.replace('.webp', '.jpg'), '').catch(() => {});

    // Copy original MP4 (ffmpeg not available, ship as-is)
    const mp4Out = join(IMAGE_OUT, 'pushback.mp4');
    await ensureDir(dirname(mp4Out));
    await copyFile(pushbackVideo, mp4Out);
    console.log(`  ✓ pushback.mp4 (copied — re-encode with ffmpeg for WebM)`);
  }

  console.log('\n✅ Asset optimization complete!');
  console.log(`   Brand assets → public/assets/brand/`);
  console.log(`   Images       → public/assets/images/`);
}

main().catch((err) => {
  console.error('❌ Asset optimization failed:', err);
  process.exit(1);
});
