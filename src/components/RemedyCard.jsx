import { Link } from 'react-router-dom';
import FlagBadge from './FlagBadge.jsx';
import { isSuppressed } from '../data/remedyService.js';

/**
 * Compact list card. Used in search results (safe entries only) and in the
 * Browse-by-source listing (where suppressed entries also appear, marked).
 * Source + flag level are always shown up top — never buried below the fold.
 */
export default function RemedyCard({ remedy }) {
  const suppressed = isSuppressed(remedy);
  return (
    <Link
      to={`/remedy/${remedy.id}`}
      className={`remedy-card${suppressed ? ' remedy-card-flagged' : ''}`}
    >
      <div className="remedy-card-top">
        <FlagBadge level={remedy.modern_caution.flag_level} />
        <span className="remedy-card-category">{remedy.category}</span>
      </div>
      <h3 className="remedy-card-name">{remedy.name}</h3>
      <p className="remedy-card-symptoms">
        {remedy.symptoms_addressed_as_written}
      </p>
      <p className="remedy-card-source">
        {remedy.source.title} · {remedy.source.author.split('(')[0].trim()},{' '}
        {remedy.source.year}
      </p>
    </Link>
  );
}
