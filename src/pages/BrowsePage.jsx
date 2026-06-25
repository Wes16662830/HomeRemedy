import { useState, useMemo } from 'react';
import { getRemediesBySource, FLAG_LEVELS } from '../data/remedyService.js';
import RemedyCard from '../components/RemedyCard.jsx';

/**
 * "Browse by source" — the deliberate-reference path. Unlike search, this DOES
 * surface high/critical entries (clearly flagged), because someone here is
 * specifically seeking the historical reference, organised by source text.
 */
export default function BrowsePage() {
  const groups = useMemo(() => getRemediesBySource(), []);
  const [activeSource, setActiveSource] = useState('all');

  const visibleGroups =
    activeSource === 'all'
      ? groups
      : groups.filter((g) => g.source.title === activeSource);

  return (
    <div className="browse-page">
      <section className="browse-hero">
        <h1>Browse by source</h1>
        <p>
          The full structure of each source text, including entries withheld
          from search. Entries flagged <strong>high</strong> or{' '}
          <strong>critical</strong> are shown here for historical reference and
          are marked accordingly — read the safety notes before anything else.
        </p>
      </section>

      <div className="source-filter">
        <button
          className={`source-pill${activeSource === 'all' ? ' source-pill-active' : ''}`}
          onClick={() => setActiveSource('all')}
        >
          All sources
        </button>
        {groups.map((g) => (
          <button
            key={g.source.title}
            className={`source-pill${activeSource === g.source.title ? ' source-pill-active' : ''}`}
            onClick={() => setActiveSource(g.source.title)}
          >
            {g.source.title}
          </button>
        ))}
      </div>

      {visibleGroups.map((group) => (
        <SourceSection key={group.source.title} group={group} />
      ))}
    </div>
  );
}

function SourceSection({ group }) {
  const order = { critical: 0, high: 1, medium: 2, low: 3 };
  // Keep a stable, category-then-flag ordering so the structure reads like a text.
  const byCategory = {};
  for (const r of group.entries) {
    (byCategory[r.category] ||= []).push(r);
  }

  return (
    <section className="source-section">
      <div className="source-section-head">
        <h2>{group.source.title}</h2>
        <p className="source-section-meta">
          {group.source.author}, {group.source.year} ·{' '}
          <a href={group.source.url} target="_blank" rel="noopener noreferrer">
            original text
          </a>{' '}
          · {group.source.license}
        </p>
        <FlagLegend entries={group.entries} />
      </div>

      {Object.entries(byCategory).map(([category, entries]) => (
        <div key={category} className="browse-category">
          <h3 className="browse-category-title">{category}</h3>
          <div className="results-grid">
            {entries
              .slice()
              .sort(
                (a, b) =>
                  order[a.modern_caution.flag_level] -
                  order[b.modern_caution.flag_level]
              )
              .map((r) => (
                <RemedyCard key={r.id} remedy={r} />
              ))}
          </div>
        </div>
      ))}
    </section>
  );
}

function FlagLegend({ entries }) {
  const counts = FLAG_LEVELS.map((level) => ({
    level,
    n: entries.filter((e) => e.modern_caution.flag_level === level).length,
  })).filter((c) => c.n > 0);

  return (
    <p className="flag-legend">
      {counts.map((c) => (
        <span key={c.level} className={`flag-legend-item flag-${c.level}`}>
          <span className="flag-dot" aria-hidden="true" /> {c.n} {c.level}
        </span>
      ))}
    </p>
  );
}
