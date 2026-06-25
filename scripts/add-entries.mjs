// Reusable transcription merge tool. Reads a batch file of compact entries
// (each with a `src` key referencing scripts/sources.mjs), attaches the full
// source record, validates against the live corpus for id/name collisions, and
// appends the new entries to src/data/remedies.json.
//
// Usage: node scripts/add-entries.mjs <batch.json>
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import { SOURCES, APPROVED_SOURCE_TITLES } from './sources.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA = resolve(__dirname, '../src/data/remedies.json');
const FLAGS = ['low', 'medium', 'high', 'critical'];

const batchPath = process.argv[2];
if (!batchPath) {
  console.error('Usage: node scripts/add-entries.mjs <batch.json>');
  process.exit(1);
}

const existing = JSON.parse(readFileSync(DATA, 'utf8'));
const batch = JSON.parse(readFileSync(resolve(process.cwd(), batchPath), 'utf8'));

const ids = new Set(existing.map((r) => r.id));
const names = new Set(existing.map((r) => r.name.toLowerCase()));
const errors = [];
const expanded = [];

for (const e of batch) {
  const id = e.id || '(missing id)';
  const source = SOURCES[e.src];
  if (!source) {
    errors.push(`${id}: unknown src "${e.src}" (expected one of ${Object.keys(SOURCES).join('|')})`);
    continue;
  }
  if (ids.has(e.id)) errors.push(`${id}: id already exists in corpus`);
  if (names.has((e.name || '').toLowerCase()))
    errors.push(`${id}: name "${e.name}" already exists in corpus`);
  if (!FLAGS.includes(e.modern_caution?.flag_level))
    errors.push(`${id}: bad flag_level "${e.modern_caution?.flag_level}"`);
  if (!Array.isArray(e.symptom_tags) || !e.symptom_tags.length)
    errors.push(`${id}: missing symptom_tags`);
  if (!Array.isArray(e.ingredients) || !e.ingredients.length)
    errors.push(`${id}: missing ingredients`);
  if (!APPROVED_SOURCE_TITLES.includes(source.title))
    errors.push(`${id}: source not approved`);

  const { src, ...rest } = e;
  expanded.push({
    id: rest.id,
    name: rest.name,
    category: rest.category,
    source,
    ingredients: rest.ingredients,
    preparation_as_written: rest.preparation_as_written,
    symptoms_addressed_as_written: rest.symptoms_addressed_as_written,
    symptom_tags: rest.symptom_tags,
    modern_caution: rest.modern_caution,
  });
  ids.add(e.id);
  names.add((e.name || '').toLowerCase());
}

if (errors.length) {
  console.error(`\n✗ batch rejected — ${errors.length} error(s):\n`);
  for (const e of errors) console.error('  - ' + e);
  process.exit(1);
}

const merged = existing.concat(expanded);
writeFileSync(DATA, JSON.stringify(merged, null, 2) + '\n');
console.log(`✓ added ${expanded.length} entries (corpus: ${existing.length} → ${merged.length})`);
