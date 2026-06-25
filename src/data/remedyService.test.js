import { describe, it, expect } from 'vitest';
import {
  getAllRemedies,
  searchBySymptom,
  searchByIngredient,
  findSubstitutions,
  getRelatedRemedies,
  getRemediesBySource,
  isSuppressed,
  getRemedyById,
} from './remedyService.js';

describe('data integrity', () => {
  const remedies = getAllRemedies();

  it('every entry has a valid flag level (spec: every entry must get a flag)', () => {
    const valid = ['low', 'medium', 'high', 'critical'];
    for (const r of remedies) {
      expect(valid).toContain(r.modern_caution.flag_level);
    }
  });

  it('every entry has all required fields', () => {
    for (const r of remedies) {
      expect(r.id).toBeTruthy();
      expect(r.name).toBeTruthy();
      expect(r.source.title).toBeTruthy();
      expect(r.source.author).toBeTruthy();
      expect(r.source.url).toMatch(/^https?:\/\//);
      expect(r.source.license).toBeTruthy();
      expect(Array.isArray(r.ingredients)).toBe(true);
      expect(r.preparation_as_written).toBeTruthy();
      expect(r.symptoms_addressed_as_written).toBeTruthy();
      expect(r.modern_caution.notes).toBeTruthy();
      expect(r.modern_caution.modern_evidence_status).toBeTruthy();
    }
  });

  it('only uses the two approved Phase 1 sources', () => {
    const approved = ['The Complete Herbal', 'A Book of Simples'];
    for (const r of remedies) {
      expect(approved).toContain(r.source.title);
    }
  });
});

describe('SAFETY-CRITICAL: search suppresses high/critical entries by default', () => {
  it('symptom search NEVER returns a critical entry, even on its own keywords', () => {
    // Pennyroyal is a critical entry tagged with these exact searcher phrases.
    for (const q of ['induce miscarriage', 'provoke courses', 'bring on menstruation', 'abortion']) {
      const results = searchBySymptom(q);
      expect(results.every((r) => r.modern_caution.flag_level !== 'critical')).toBe(true);
      expect(results.some((r) => r.id === 'culpeper-pennyroyal')).toBe(false);
    }
  });

  it('symptom search NEVER returns a high entry, even on its own keywords', () => {
    // "constipation" matches the high entry "aloes"; it must be suppressed.
    const results = searchBySymptom('constipation');
    expect(results.some((r) => r.id === 'culpeper-aloes')).toBe(false);
    expect(results.every((r) => !isSuppressed(r))).toBe(true);
    // ...but the safe/medium alternative (senna) IS allowed through.
    expect(results.some((r) => r.id === 'lewer-senna')).toBe(true);
  });

  it('a worried "cancer remedy" / dangerous search does not surface suppressed entries', () => {
    for (const q of ['cancer', 'tumour', 'pain', 'inflammation', 'worms']) {
      const results = searchBySymptom(q);
      expect(results.every((r) => !isSuppressed(r))).toBe(true);
    }
  });

  it('ingredient search suppresses high/critical by default', () => {
    // Searching the literal plant names of suppressed entries returns nothing.
    for (const q of ['pennyroyal', 'henbane', 'deadly nightshade', 'comfrey', 'coltsfoot']) {
      const results = searchByIngredient(q);
      expect(results.every((r) => !isSuppressed(r))).toBe(true);
    }
  });

  it('substitution lookups never offer a suppressed remedy', () => {
    const subs = findSubstitutions('mint', 'culpeper-peppermint');
    expect(subs.every((r) => !isSuppressed(r))).toBe(true);
  });

  it('safe symptom searches still work', () => {
    expect(searchBySymptom('cough').length).toBeGreaterThan(0);
    expect(searchBySymptom('wind').some((r) => r.id === 'culpeper-fennel')).toBe(true);
  });
});

describe('deliberate browse path CAN reach suppressed entries', () => {
  it('Browse by source includes high/critical entries', () => {
    const groups = getRemediesBySource();
    const allBrowse = groups.flatMap((g) => g.entries);
    expect(allBrowse.some((r) => r.id === 'culpeper-pennyroyal')).toBe(true);
    expect(allBrowse.some((r) => isSuppressed(r))).toBe(true);
  });

  it('opt-in includeSuppressed flag (used by browse search) reveals them', () => {
    const results = searchBySymptom('provoke courses', { includeSuppressed: true });
    expect(results.some((r) => r.id === 'culpeper-pennyroyal')).toBe(true);
  });
});

describe('SAFETY-CRITICAL: warning entries expose no cross-links out', () => {
  it('getRelatedRemedies returns [] for a critical entry', () => {
    expect(getRelatedRemedies(getRemedyById('culpeper-pennyroyal'))).toEqual([]);
    expect(getRelatedRemedies(getRemedyById('culpeper-henbane'))).toEqual([]);
  });

  it('getRelatedRemedies returns [] for a high entry', () => {
    expect(getRelatedRemedies(getRemedyById('culpeper-comfrey'))).toEqual([]);
  });

  it('safe entries do get related (safe-only) cross-links', () => {
    const related = getRelatedRemedies(getRemedyById('culpeper-fennel'));
    expect(related.length).toBeGreaterThan(0);
    expect(related.every((r) => !isSuppressed(r))).toBe(true);
  });
});
