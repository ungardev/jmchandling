/**
 * scripts/generate-favicon.mjs
 *
 * Generates favicon assets from isotipo-jmc-blanco.png:
 *   - favicon.ico       (multi-size: 16, 32, 48)
 *   - favicon.svg       (SVG with embedded PNG as data URI)
 *   - favicon-32.png     (32x32 PNG)
 *   - apple-touch-icon.png (180x180 Apple touch icon)
 *
 * Usage: node scripts/generate-favicon.mjs
 */

import sharp from 'sharp';
import pngToIco from 'png-to-ico';
import { writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const SRC = join(ROOT, 'public', 'assets', 'brand', 'isotipo-jmc-blanco.png');
const OUT = ROOT;

const SIZES = [16, 32, 48];

async function toPngBuffer(inputPath, size) {
  return sharp(inputPath)
    .resize(size, size, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toBuffer();
}

async function main() {
  console.log('\n🔖 JMC Favicon Generator');
  console.log('========================\n');

  if (!existsSync(SRC)) {
    console.error(`  ❌ Source not found: ${SRC}`);
    process.exit(1);
  }

  // Load source PNG
  const srcBuffer = await sharp(SRC).toBuffer();
  const srcMeta = await sharp(srcBuffer).metadata();
  console.log(`  Source: ${srcMeta.width}x${srcMeta.height} PNG`);

  // 1. Generate PNG buffers at each size
  const pngBuffers = {};
  for (const size of SIZES) {
    pngBuffers[size] = await toPngBuffer(srcBuffer, size);
    console.log(`  ✓ ${size}x${size} PNG buffer ready`);
  }

  // 2. Generate ICO from the 32x32 and 48x48 PNGs
  //    (ICO spec: include 16x16, 32x32, 48x48 for best Windows support)
  const icoBuffer = await pngToIco([pngBuffers[32], pngBuffers[48]]);
  await writeFile(join(OUT, 'public', 'favicon.ico'), icoBuffer);
  console.log(`  ✓ favicon.ico (16+32+48 embedded)`);

  // 3. Generate favicon-32.png
  await writeFile(join(OUT, 'public', 'favicon-32.png'), pngBuffers[32]);
  console.log(`  ✓ favicon-32.png`);

  // 4. Generate apple-touch-icon.png (180x180)
  const appleBuffer = await toPngBuffer(srcBuffer, 180);
  await writeFile(join(OUT, 'public', 'apple-touch-icon.png'), appleBuffer);
  console.log(`  ✓ apple-touch-icon.png (180x180)`);

  // 5. Generate favicon.svg with PNG embedded as data URI
  const base64 = srcBuffer.toString('base64');
  const dataUri = `data:image/png;base64,${base64}`;
  const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${srcMeta.width} ${srcMeta.height}">
  <image width="${srcMeta.width}" height="${srcMeta.height}" href="${dataUri}" />
</svg>`;
  await writeFile(join(OUT, 'public', 'favicon.svg'), svgContent, 'utf-8');
  console.log(`  ✓ favicon.svg (vector + PNG fallback)`);

  console.log('\n✅ Favicon generation complete!');
  console.log('   public/favicon.ico');
  console.log('   public/favicon.svg');
  console.log('   public/favicon-32.png');
  console.log('   public/apple-touch-icon.png');
}

main().catch((err) => {
  console.error('❌ Failed:', err);
  process.exit(1);
});
