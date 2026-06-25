import { FLAG_DESCRIPTIONS } from './FlagBadge.jsx';

/**
 * Detail view for high/critical entries. Spec rule #2 — these render
 * STRUCTURALLY differently from safe entries, not just with a colored badge:
 *
 *  1. A full-width warning block ABOVE the entry, in its own distinct visual
 *     style (not the normal card style).
 *  2. Preparation shown as a flat, quoted historical passage — NOT structured,
 *     copy-pasteable ingredient/amount/step data.
 *  3. NO "similar remedies" / "alternatives" cross-links out of this entry.
 */
export default function WarningRemedyView({ remedy }) {
  const caution = remedy.modern_caution;
  const level = caution.flag_level;

  return (
    <div className="warning-remedy">
      {/* 1. Full-width, visually distinct warning block, above everything. */}
      <aside className={`warning-banner warning-banner-${level}`} role="alert">
        <div className="warning-banner-tag">
          <span className="warning-banner-icon" aria-hidden="true">
            ⚠
          </span>
          {level === 'critical'
            ? 'CRITICAL SAFETY WARNING'
            : 'HIGH-CAUTION HISTORICAL ENTRY'}
        </div>
        <p className="warning-banner-lead">{FLAG_DESCRIPTIONS[level]}.</p>
        <p>{caution.notes}</p>
        <p className="warning-banner-evidence">
          <strong>Modern evidence:</strong> {caution.modern_evidence_status}
        </p>
        <p className="warning-banner-foot">
          This page is shown because you reached it by browsing the original
          source. It is reproduced for historical reference only. Do not attempt
          this. For any health concern, consult a healthcare professional.
        </p>
      </aside>

      <article className="warning-body">
        <p className="detail-category">
          {remedy.category} · from the original source text
        </p>
        <h1>{remedy.name}</h1>

        <p className="source-line">
          From <em>{remedy.source.title}</em> — {remedy.source.author},{' '}
          {remedy.source.year}.{' '}
          <a
            href={remedy.source.url}
            target="_blank"
            rel="noopener noreferrer"
          >
            View original source
          </a>{' '}
          · {remedy.source.license}
        </p>

        <h2>Historical ingredient(s) named</h2>
        {/* Flat list, not a structured/copyable amounts table. */}
        <p className="flat-ingredients">
          {remedy.ingredients
            .map((i) => `${i.historical_name} (${i.modern_equivalent})`)
            .join('; ')}
          .
        </p>

        {/* 2. Preparation as a flat quoted passage — no steps/amounts structure. */}
        <h2>As recorded in the source</h2>
        <blockquote className="historical-passage">
          {remedy.preparation_as_written}
        </blockquote>

        <h2>What the text claimed</h2>
        <blockquote className="historical-passage">
          {remedy.symptoms_addressed_as_written}
        </blockquote>

        {/* 3. No related-remedies / alternatives cross-links rendered here. */}
      </article>
    </div>
  );
}
