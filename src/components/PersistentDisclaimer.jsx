/**
 * Spec rule #3: a persistent, NON-dismissible disclaimer visible on every page.
 * Deliberately has no close button and no dismiss state.
 */
export default function PersistentDisclaimer() {
  return (
    <div className="persistent-disclaimer" role="note" aria-label="Site disclaimer">
      <span className="persistent-disclaimer-icon" aria-hidden="true">
        ⚕
      </span>
      <span>
        Historical reference archive — <strong>not medical advice</strong>.
        Remedies reflect what old texts claimed, not what is safe or effective
        today. For any health concern, consult a healthcare professional.
      </span>
    </div>
  );
}
