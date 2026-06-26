import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  searchBySymptom,
  searchByIngredient,
  findSubstitutions,
} from '../data/remedyService.js';
import RemedyCard from '../components/RemedyCard.jsx';

const MODES = [
  { id: 'symptom', label: 'By symptom', placeholder: 'e.g. cough, indigestion, wounds, sore throat' },
  { id: 'ingredient', label: 'By ingredient on hand', placeholder: 'e.g. fennel, mint, chamomile, marigold' },
];

export default function SearchPage() {
  const [mode, setMode] = useState('symptom');
  const [query, setQuery] = useState('');
  const [submitted, setSubmitted] = useState('');

  const activeMode = MODES.find((m) => m.id === mode);

  const results = useMemo(() => {
    if (!submitted) return null;
    return mode === 'symptom'
      ? searchBySymptom(submitted)
      : searchByIngredient(submitted);
  }, [mode, submitted]);

  // For ingredient search: "what else was this used for" substitution lookups.
  const substitutions = useMemo(() => {
    if (!submitted || mode !== 'ingredient') return [];
    return findSubstitutions(submitted);
  }, [mode, submitted]);

  function onSubmit(e) {
    e.preventDefault();
    setSubmitted(query.trim());
  }

  return (
    <div className="search-page">
      <section className="search-hero">
        <h1>Search the archive</h1>
        <p>
          Find historical remedies by the symptom they claimed to address, or by
          an ingredient you have on hand.
        </p>
        <p className="search-safety-note">
          For your safety, symptom and ingredient searches only return milder
          entries. Remedies flagged <strong>high</strong> or{' '}
          <strong>critical</strong> are never surfaced through search — they are
          reachable only by deliberately{' '}
          <Link to="/browse">browsing a source text</Link>.
        </p>
      </section>

      <form className="search-form" onSubmit={onSubmit}>
        <div className="mode-toggle" role="tablist" aria-label="Search mode">
          {MODES.map((m) => (
            <button
              key={m.id}
              type="button"
              role="tab"
              aria-selected={mode === m.id}
              className={`mode-btn${mode === m.id ? ' mode-btn-active' : ''}`}
              onClick={() => {
                setMode(m.id);
                setSubmitted('');
              }}
            >
              {m.label}
            </button>
          ))}
        </div>
        <div className="search-input-row">
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={activeMode.placeholder}
            aria-label={activeMode.label}
          />
          <button type="submit" className="primary-btn">
            Search
          </button>
        </div>
      </form>

      {results && <Results query={submitted} results={results} mode={mode} substitutions={substitutions} />}
    </div>
  );
}

function Results({ query, results, mode, substitutions }) {
  if (results.length === 0) {
    return (
      <section className="results">
        <p className="results-empty">
          No milder remedies in the archive match “{query}”. (Some historical
          entries exist but are withheld from search because they carry a high
          or critical safety flag.)
        </p>
      </section>
    );
  }

  return (
    <section className="results">
      <p className="results-count">
        {results.length} {results.length === 1 ? 'remedy' : 'remedies'} for “
        {query}”
      </p>
      <div className="results-grid">
        {results.map((r) => (
          <RemedyCard key={r.id} remedy={r} />
        ))}
      </div>

      {mode === 'ingredient' && substitutions.length > 0 && (
        <div className="substitution-note">
          <h2>What else was this ingredient used for?</h2>
          <ul>
            {substitutions.map((r) => (
              <li key={r.id}>
                <Link to={`/remedy/${r.id}`}>{r.name}</Link> —{' '}
                {r.symptoms_addressed_as_written}
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}
