import { useParams, Link } from 'react-router-dom';
import { getRemedyById, isWarningEntry } from '../data/remedyService.js';
import SafeRemedyView from '../components/SafeRemedyView.jsx';
import WarningRemedyView from '../components/WarningRemedyView.jsx';

export default function RemedyPage() {
  const { id } = useParams();
  const remedy = getRemedyById(id);

  if (!remedy) {
    return (
      <div className="remedy-page">
        <p>That remedy was not found.</p>
        <Link to="/">Back to search</Link>
      </div>
    );
  }

  return (
    <div className="remedy-page">
      <div className="remedy-page-back">
        <Link to="/browse">← Browse by source</Link>
        <Link to="/">Search</Link>
      </div>

      {/* Spec rule #2: high/critical entries get a structurally different view. */}
      {isWarningEntry(remedy) ? (
        <WarningRemedyView remedy={remedy} />
      ) : (
        <SafeRemedyView remedy={remedy} />
      )}
    </div>
  );
}
