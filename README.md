# The Home Apothecary Archive

A searchable digital archive of home remedies drawn from named, public-domain
historical texts.

> **This is a historical reference tool, not a medical advice product.**
> Every remedy shown reflects *what an old text claimed* — not what is safe or
> effective today. Always consult a qualified healthcare professional for any
> real health concern.

## Phase 1 sources (only these two)

1. **The Complete Herbal** — Nicholas Culpeper, 1653 (1850 edition).
   Public domain. [Project Gutenberg #49513](https://www.gutenberg.org/files/49513/49513-h/49513-h.htm)
2. **A Book of Simples** — transcribed by Henry William Lewer (manuscript
   c.1600s, published 1908). Public domain, Gutenberg edition specifically.
   [Project Gutenberg #53951](https://www.gutenberg.org/files/53951/53951-h/53951-h.htm)

No other sources are added without re-running the same public-domain
verification and safety-flagging process. No Scribd, no unverified uploads, no
living / recently-deceased authors' work without explicit copyright clearance.

## Safety model — the non-negotiable part

This archive is built around one rule above all others:

> **Symptom and ingredient search must never be the path that hands a worried,
> vulnerable searcher a dangerous historical remedy.**

How that is enforced in code:

1. **Search suppresses `high` and `critical` entries by default.**
   `searchBySymptom()` and `searchByIngredient()` filter these out entirely.
   They are reachable *only* by deliberately using **Browse by source**.
   See `src/data/remedyService.js` (`SUPPRESSED_LEVELS`) and the tests in
   `src/data/remedyService.test.js`.
2. **`high` / `critical` entries render structurally differently**, not just
   with a colored badge (`src/components/WarningRemedyView.jsx`):
   - a full-width warning block above the entry, in its own distinct style;
   - preparation shown as a flat quoted historical passage, **not** structured,
     copy-pasteable ingredient/amount/step data;
   - **no** "similar remedies" / "alternatives" cross-links out of the entry.
3. **A persistent, non-dismissible disclaimer** is shown on every page
   (`src/components/PersistentDisclaimer.jsx`).
4. **No dosing is ever framed as a recommendation.** All UI copy says *"the
   historical text states X"*, never *"you should take X."*

### Flag-level criteria

| Level | Meaning |
| --- | --- |
| `critical` | Known fatal / serious-harm risk; no safe modern home use exists. |
| `high` | Meaningful harm risk under plausible use (toxic at common doses, serious interactions, unsupervised abortifacient/uterine-stimulant herbs, etc.). |
| `medium` | Contraindicated for specific groups (pregnancy, children, anticoagulant users) but not broadly dangerous. |
| `low` | Mild traditional / culinary-strength use, no known significant risk. |

Every entry gets a flag; when uncertain we default to the more cautious level.

## Data model

Remedy data is a static JSON file: `src/data/remedies.json`. Five worked
examples (spanning flag levels) are mirrored in `sample_entries.json` at the
repo root. Each entry:

```jsonc
{
  "id": "culpeper-fennel",
  "name": "Fennel",
  "category": "digestive",              // digestive | skin | respiratory
  "source": { "title", "author", "year", "url", "license" },
  "ingredients": [
    { "historical_name": "...", "modern_equivalent": "..." }
  ],
  "preparation_as_written": "...",       // paraphrased, not a long verbatim quote
  "symptoms_addressed_as_written": "...",// what the text claims it treats
  "symptom_tags": ["wind", "bloating"],  // search keywords
  "modern_caution": {
    "flag_level": "low",                 // low | medium | high | critical
    "notes": "...",                      // plain-language, for a non-expert
    "modern_evidence_status": "..."      // does modern evidence support this use
  }
}
```

Where modern identification of an ingredient is ambiguous, the
`modern_equivalent` field says so explicitly rather than guessing.

Phase 1 corpus: **22 entries** (10 low / 4 medium / 5 high / 3 critical) across
digestive, skin, and respiratory categories — the validation set called for in
the build order before scaling up the full corpus.

## Stack

React + Vite. Remedy data as a static JSON file (no database needed for
Phase 1).

## Run

```bash
npm install
npm run dev        # dev server
npm run build      # production build
npm run preview    # preview the production build
npm test           # run the safety / data-integrity test suite
```

## Tests

`src/data/remedyService.test.js` is the safety harness. It asserts, among other
things, that:

- a symptom search for `"induce miscarriage"` / `"constipation"` does **not**
  return the `critical`/`high` entries tagged with those exact phrases;
- ingredient search never surfaces a suppressed remedy, and substitution
  lookups never offer one;
- warning entries expose **no** cross-links out;
- Browse-by-source *can* still reach suppressed entries (the deliberate path);
- every entry has a valid flag and all required fields, and only the two
  approved sources are used.

## Build order (per spec) — status

1. ✅ Finalize JSON schema (`sample_entries.json` + `remedies.json`).
2. ✅ Transcribe & flag a validation set from Culpeper (plus a few Lewer
   entries) covering digestive / skin / respiratory.
3. ✅ Build search/browse UI with the suppression behavior, and **verify** a
   symptom search does not surface a critical entry (unit tests + an automated
   browser pass).
4. ⏭️ Scale up the corpus from both sources (next phase).
