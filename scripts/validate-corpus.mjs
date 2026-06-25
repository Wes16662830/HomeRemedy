// Standalone corpus QA. Validates every entry in src/data/remedies.json against
// the schema and the safety rules, independent of the React app or vitest.
// Run: npm run validate
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import { APPROVED_SOURCE_TITLES } from './sources.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA = resolve(__dirname, '../src/data/remedies.json');

const FLAGS = ['low', 'medium', 'high', 'critical'];
const remedies = JSON.parse(readFileSync(DATA, 'utf8'));
const errors = [];
const seenIds = new Set();
const seenNames = new Set();

const err = (id, msg) => errors.push(`${id}: ${msg}`);

for (const r of remedies) {
  const id = r.id || '(missing id)';
  if (!r.id) err(id, 'missing id');
  if (seenIds.has(r.id)) err(id, 'duplicate id');
  seenIds.add(r.id);

  if (!r.name) err(id, 'missing name');
  const nameKey = (r.name || '').toLowerCase();
  if (seenNames.has(nameKey)) err(id, `duplicate name "${r.name}"`);
  seenNames.add(nameKey);

  if (!r.category) err(id, 'missing category');

  if (!r.source || !APPROVED_SOURCE_TITLES.includes(r.source.title))
    err(id, `source "${r.source?.title}" is not an approved Phase 1 source`);
  if (!r.source?.author) err(id, 'missing source.author');
  if (!/^https?:\/\//.test(r.source?.url || '')) err(id, 'invalid source.url');
  if (!r.source?.license) err(id, 'missing source.license');

  if (!Array.isArray(r.ingredients) || r.ingredients.length === 0)
    err(id, 'ingredients must be a non-empty array');
  for (const ing of r.ingredients || []) {
    if (!ing.historical_name) err(id, 'ingredient missing historical_name');
    if (!ing.modern_equivalent) err(id, 'ingredient missing modern_equivalent');
  }

  if (!r.preparation_as_written) err(id, 'missing preparation_as_written');
  if (!r.symptoms_addressed_as_written)
    err(id, 'missing symptoms_addressed_as_written');
  if (!Array.isArray(r.symptom_tags) || r.symptom_tags.length === 0)
    err(id, 'symptom_tags must be a non-empty array');

  const c = r.modern_caution || {};
  if (!FLAGS.includes(c.flag_level))
    err(id, `flag_level "${c.flag_level}" is not one of ${FLAGS.join('|')}`);
  if (!c.notes) err(id, 'missing modern_caution.notes');
  if (!c.modern_evidence_status)
    err(id, 'missing modern_caution.modern_evidence_status');
}

const dist = remedies.reduce((a, r) => {
  const f = r.modern_caution?.flag_level;
  a[f] = (a[f] || 0) + 1;
  return a;
}, {});

if (errors.length) {
  console.error(`\n✗ ${errors.length} validation error(s):\n`);
  for (const e of errors) console.error('  - ' + e);
  process.exit(1);
}

console.log(`✓ ${remedies.length} entries valid.`);
console.log(`  flags: ${JSON.stringify(dist)}`);
console.log(
  `  suppressed (high+critical): ${(dist.high || 0) + (dist.critical || 0)}`
);
