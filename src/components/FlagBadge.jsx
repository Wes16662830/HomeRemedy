const LABELS = {
  low: 'Low caution',
  medium: 'Medium caution',
  high: 'High caution',
  critical: 'Critical — serious harm risk',
};

const DESCRIPTIONS = {
  low: 'Mild traditional use, no known significant risk',
  medium: 'Contraindicated for some groups (e.g. pregnancy, children)',
  high: 'Meaningful harm risk under plausible use',
  critical: 'Known risk of serious harm or death; no safe modern home use',
};

/**
 * Flag level is shown on every result and detail view, prominently.
 * Note: the badge is necessary but NOT sufficient for high/critical — spec
 * rule #2 also requires a structurally different layout (see WarningRemedyView).
 */
export default function FlagBadge({ level, withText = true }) {
  return (
    <span
      className={`flag-badge flag-${level}`}
      title={DESCRIPTIONS[level]}
      aria-label={`${LABELS[level]}: ${DESCRIPTIONS[level]}`}
    >
      <span className="flag-dot" aria-hidden="true" />
      {withText ? LABELS[level] : level.toUpperCase()}
    </span>
  );
}

export { LABELS as FLAG_LABELS, DESCRIPTIONS as FLAG_DESCRIPTIONS };
