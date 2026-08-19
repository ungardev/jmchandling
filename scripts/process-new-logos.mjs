/**
 * scripts/process-new-logos.mjs
 *
 * Trims padding from isotipo-jmc-blanco.png and fuente-jmc-blanco.png,
 * generates WebP variants with srcset support, and copies original PNGs.
 *
 * Usage: node scripts/process-new-logos.mjs
 */

import sharp from 'sharp';
import { mkdir, copyFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const SRC_DIR = join(ROOT, 'LOGOS', 'PNG');
const OUT_DIR = join(ROOT, 'public', 'assets', 'brand');

const logos = [
  {
    name: 'isotipo-logo',
    src: 'isotipo-jmc-blanco.png',
    crop: { top: 155, left: 136, width: 228, height: 191 },
    sizes: [
      { suffix: '', width: 228, height: 191 },
      { suffix: '-sm', width: 114, height: 96 },
    ],
  },
  {
    name: 'fuente-logo',
    src: 'fuente-jmc-blanco.png',
    crop: { top: 205, left: 90, width: 320, height: 111 },
    sizes: [
      { suffix: '', width: 320, height: 111 },
      { suffix: '-sm', width: 160, height: 56 },
    ],
  },
];

async function ensureDir(path) {
  await mkdir(path, { recursive: true });
}

async function toWebP(inputPath, outputPath, width, height) {
  await sharp(inputPath)
    .resize(width, height, { fit: 'contain', withoutEnlargement: true, background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .webp({ quality: 90 })
    .toFile(outputPath);
}

async function main() {
  console.log('\n🎨 JMC New Logo Processor');
  console.log('=========================\n');

  await ensureDir(OUT_DIR);

  for (const logo of logos) {
    const srcPath = join(SRC_DIR, logo.src);
    if (!existsSync(srcPath)) {
      console.error(`  ❌ Source not found: ${srcPath}`);
      continue;
    }

    // Copy original PNG to brand folder for reference
    const pngOut = join(OUT_DIR, logo.src);
    await copyFile(srcPath, pngOut);
    console.log(`  ✓ Copied ${logo.src} → public/assets/brand/`);

    // Extract trimmed content
    const trimmedBuffer = await sharp(srcPath)
      .extract(logo.crop)
      .toBuffer();

    // Generate WebP variants
    for (const size of logo.sizes) {
      const outPath = join(OUT_DIR, `${logo.name}${size.suffix}.webp`);
      await toWebP(trimmedBuffer, outPath, size.width, size.height);

      const meta = await sharp(outPath).metadata();
      console.log(`  ✓ ${logo.name}${size.suffix}.webp → ${meta.width}x${meta.height} (src: ${size.width}x${size.height})`);
    }

    console.log('');
  }

  console.log('✅ New logo processing complete!');
}

main().catch((err) => {
  console.error('❌ Failed:', err);
  process.exit(1);
});
