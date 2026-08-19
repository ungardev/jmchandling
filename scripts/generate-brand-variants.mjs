/**
 * scripts/generate-brand-variants.mjs
 *
 * Extracts brand components from the full LOGO JMC BLANCO .png
 * to create: isotipo, wordmark, and logo-complete variants.
 *
 * Usage: node scripts/generate-brand-variants.mjs
 */

import sharp from 'sharp';
import { mkdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const BRAND_SRC = join(ROOT, 'LOGOS', 'PNG', 'LOGO JMC BLANCO .png');
const BRAND_OUT = join(ROOT, 'public', 'assets', 'brand');

const SIZES = [256, 512, 1024, 2048];

async function ensureDir(path) {
  await mkdir(path, { recursive: true });
}

async function extractAndConvert(inputBuffer, outputPath, width) {
  await sharp(inputBuffer)
    .resize(width, undefined, { fit: 'contain', withoutEnlargement: true, background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .webp({ quality: 90 })
    .toFile(outputPath);
}

async function main() {
  console.log('\n🎨 JMC Brand Variant Generator');
  console.log('===============================\n');

  if (!existsSync(BRAND_SRC)) {
    console.error(`  ❌ Source not found: ${BRAND_SRC}`);
    process.exit(1);
  }

  await ensureDir(BRAND_OUT);

  const image = sharp(BRAND_SRC);
  const metadata = await image.metadata();
  console.log(`  Source: ${BRAND_SRC}`);
  console.log(`  Dimensions: ${metadata.width}x${metadata.height}\n`);

  const fullBuffer = await sharp(BRAND_SRC).toBuffer();

  const cropConfigs = [
    {
      name: 'wordmark',
      top: Math.round(metadata.height * 0.28),
      left: 0,
      width: metadata.width,
      height: Math.round(metadata.height * 0.22),
      desc: 'JMC wordmark only',
    },
    {
      name: 'logo-complete',
      top: 0,
      left: 0,
      width: metadata.width,
      height: Math.round(metadata.height * 0.82),
      desc: 'Isotipo + JMC + tagline (compact)',
    },
  ];

  for (const config of cropConfigs) {
    console.log(`  Processing ${config.name}...`);
    const cropped = await sharp(fullBuffer)
      .extract({ top: config.top, left: config.left, width: config.width, height: config.height })
      .toBuffer();

    for (const size of SIZES) {
      const outPath = join(BRAND_OUT, `${config.name}-white-${size}.webp`);
      await extractAndConvert(cropped, outPath, size);
      console.log(`    ✓ ${config.name}-white-${size}.webp`);
    }
  }

  const isotipoBuffer = await sharp(fullBuffer)
    .extract({ top: 0, left: 0, width: metadata.width, height: Math.round(metadata.height * 0.30) })
    .toBuffer();

  console.log(`  Processing isotipo...`);
  for (const size of SIZES) {
    const outPath = join(BRAND_OUT, `isotipo-white-${size}.webp`);
    await extractAndConvert(isotipoBuffer, outPath, size);
    console.log(`    ✓ isotipo-white-${size}.webp`);
  }

  console.log('\n✅ Brand variant generation complete!');
  console.log(`   Output → public/assets/brand/`);
}

main().catch((err) => {
  console.error('❌ Failed:', err);
  process.exit(1);
});
