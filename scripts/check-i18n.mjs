/**
 * scripts/check-i18n.mjs
 *
 * Verifica la integridad del sistema i18n:
 *  1. Los arboles de claves de es.json y en.json deben ser identicos.
 *  2. Toda clave referenciada con t('...') debe existir en AMBOS diccionarios.
 *  3. Toda altKey del mapa de medios debe existir en ambos diccionarios.
 *  4. Reporta claves huerfanas (definidas pero nunca referenciadas).
 *
 * Uso: npm run i18n:check
 */

import { readFile, readdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const SRC = join(ROOT, 'src');

const errors = [];
const warnings = [];

function flatten(obj, prefix = '', out = new Set()) {
  for (const [key, value] of Object.entries(obj)) {
    const path = prefix ? `${prefix}.${key}` : key;
    if (value && typeof value === 'object' && !Array.isArray(value)) flatten(value, path, out);
    else out.add(path);
  }
  return out;
}

async function walk(dir) {
  const files = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) files.push(...(await walk(full)));
    else if (/\.(astro|ts|tsx|jsx)$/.test(entry.name)) files.push(full);
  }
  return files;
}

/* 1. arboles identicos ------------------------------------------------ */
const es = JSON.parse(await readFile(join(ROOT, 'src/i18n/es.json'), 'utf8'));
const en = JSON.parse(await readFile(join(ROOT, 'src/i18n/en.json'), 'utf8'));
const esKeys = flatten(es);
const enKeys = flatten(en);

for (const key of esKeys) {
  if (!enKeys.has(key)) errors.push(`clave solo en es.json: ${key}`);
}
for (const key of enKeys) {
  if (!esKeys.has(key)) errors.push(`clave solo en en.json: ${key}`);
}

/* 2. claves referenciadas -------------------------------------------- */
const files = await walk(SRC);
const referenced = new Set();
const literalKeys = new Set();
const dottedLiterals = new Set();
const dynamicPrefixes = new Set();

for (const file of files) {
  if (file.includes(`${'i18n'}/`)) continue;
  const content = await readFile(file, 'utf8');

  for (const match of content.matchAll(/\bt\(\s*'([^']+)'\s*\)/g)) referenced.add(match[1]);
  for (const match of content.matchAll(/\bt\(\s*"([^"]+)"\s*\)/g)) referenced.add(match[1]);
  // Plantillas: t(`ns.${var}Key`) -> se verifica solo el prefijo del namespace.
  for (const match of content.matchAll(/\bt\(\s*`([^`$]+)\$\{/g)) dynamicPrefixes.add(match[1]);

  // Claves referenciadas de forma indirecta:
  //   titleKey: 'services.families.rampTitle'
  //   'ramp-gse': 'home.actionGse'
  //   getLocalizedArray(locale, 'about.valuesList')
  // Se recoge todo literal con puntos y se filtra contra el diccionario, de
  // modo que 'es.json' o 'index.astro' no se confundan con claves i18n.
  for (const match of content.matchAll(/'([A-Za-z][\w]*(?:\.[\w]+)+)'/g)) {
    dottedLiterals.add(match[1]);
  }
  for (const match of content.matchAll(/"([A-Za-z][\w]*(?:\.[\w]+)+)"/g)) {
    dottedLiterals.add(match[1]);
  }
}

for (const key of referenced) {
  if (!esKeys.has(key)) errors.push(`clave referenciada inexistente: ${key}`);
  if (!enKeys.has(key)) errors.push(`clave referenced ausente en en.json: ${key}`);
}

// Un literal con puntos solo cuenta como referencia si es una clave real.
for (const key of dottedLiterals) {
  if (esKeys.has(key) || enKeys.has(key)) literalKeys.add(key);
}

for (const prefix of dynamicPrefixes) {
  const base = prefix.replace(/\.$/, '');
  const hit = [...esKeys].some((k) => k.startsWith(base));
  if (!hit) errors.push(`prefijo dinamico sin coincidencia: ${prefix}*`);
}

/* 3. altKeys del mapa de medios --------------------------------------- */
const mapPath = join(ROOT, 'scripts/media-map.json');
if (existsSync(mapPath)) {
  const map = JSON.parse(await readFile(mapPath, 'utf8'));
  for (const item of map.items) {
    if (!item.altKey) {
      errors.push(`medio sin altKey: ${item.id}`);
      continue;
    }
    if (!esKeys.has(item.altKey)) errors.push(`altKey ausente en es.json: ${item.altKey} (${item.id})`);
    if (!enKeys.has(item.altKey)) errors.push(`altKey ausente en en.json: ${item.altKey} (${item.id})`);
  }
}

/* 4. claves huerfanas -------------------------------------------------- */
const orphans = [...esKeys].filter(
  (key) => !referenced.has(key) && !literalKeys.has(key)
);
const dynamicCovered = (key) =>
  [...dynamicPrefixes].some((p) => key.startsWith(p.replace(/\.$/, '')));

for (const key of orphans) {
  if (dynamicCovered(key)) continue;
  // Las claves de media.* se validan via el mapa de medios.
  if (key.startsWith('media.')) continue;
  if (key.startsWith('meta.')) continue;
  warnings.push(`clave definida pero no referenciada: ${key}`);
}

/* resultado ------------------------------------------------------------ */
console.log(`\ni18n check — ${esKeys.size} claves por diccionario`);
console.log(`  ${referenced.size} claves referenciadas en el codigo`);

if (warnings.length) {
  console.log(`\n  ${warnings.length} advertencias:`);
  for (const w of warnings.slice(0, 40)) console.log(`    ! ${w}`);
  if (warnings.length > 40) console.log(`    ... y ${warnings.length - 40} mas`);
}

if (errors.length) {
  console.log(`\n  ${errors.length} ERRORES:`);
  for (const e of errors) console.log(`    x ${e}`);
  console.log('');
  process.exit(1);
}

console.log('\n  OK — arboles identicos, sin claves inexistentes\n');
