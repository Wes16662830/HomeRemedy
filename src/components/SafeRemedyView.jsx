import { Link } from 'react-router-dom';
import FlagBadge from './FlagBadge.jsx';
import { getRelatedRemedies } from '../data/remedyService.js';

/**
 * Detail view for low/medium entries. Structured, readable layout.
 * Ingredients and preparation are shown as structured data here — which is
 * exactly what the spec FORBIDS for high/critical entries (see WarningRemedyView).
 */
export default function SafeRemedyView({ remedy }) {
  const caution = remedy.modern_caution;
  const related = getRelatedRemedies(remedy);

  return (
    <article className="remedy-detail safe-detail">
      <div className="detail-heading">
        <div>
          <p className="detail-category">{remedy.category} remedy</p>
          <h1>{remedy.name}</h1>
        </div>
        <FlagBadge level={caution.flag_level} />
      </div>

      <SourceLine source={remedy.source} />

      <section className="detail-section">
        <h2>Ingredients</h2>
        <table className="ingredient-table">
          <thead>
            <tr>
              <th>As written historically</th>
              <th>Modern equivalent</th>
            </tr>
          </thead>
          <tbody>
            {remedy.ingredients.map((ing, i) => (
              <tr key={i}>
                <td>{ing.historical_name}</td>
                <td>{ing.modern_equivalent}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className="detail-section">
        <h2>Preparation, as the historical text describes it</h2>
        <p>{remedy.preparation_as_written}</p>
      </section>

      <section className="detail-section">
        <h2>What the text claims it treats</h2>
        <p>{remedy.symptoms_addressed_as_written}</p>
      </section>

      <section className="detail-section caution-block">
        <h2>Modern caution</h2>
        <p className="caution-flag-line">
          <FlagBadge level={caution.flag_level} />
        </p>
        <p>{caution.notes}</p>
        <p className="evidence-line">
          <strong>Modern evidence:</strong> {caution.modern_evidence_status}
        </p>
      </section>

      {related.length > 0 && (
        <section className="detail-section related-section">
          <h2>Other remedies in this category</h2>
          <ul className="related-list">
            {related.map((r) => (
              <li key={r.id}>
                <Link to={`/remedy/${r.id}`}>{r.name}</Link>{' '}
                <FlagBadge level={r.modern_caution.flag_level} withText={false} />
              </li>
            ))}
          </ul>
        </section>
      )}
    </article>
  );
}

function SourceLine({ source }) {
  return (
    <p className="source-line">
      From <em>{source.title}</em> — {source.author}, {source.year}.{' '}
      <a href={source.url} target="_blank" rel="noopener noreferrer">
        View original source
      </a>{' '}
      · {source.license}
    </p>
  );
}
