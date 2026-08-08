import React from 'react';

/**
 * Byline: the locked positioning line "Dealer-grade installs. Owner-direct pricing."
 * Positioning chrome, never SEO copy (never in <title>/H1/URL, never welded to the logo).
 * Registers: eyebrow/micro (mono, tick, amber dot, NO periods) and spoken/display
 * (sentence case WITH periods, two-tone). Set `onDark` on slab surfaces.
 */
export function Byline({
  register = 'eyebrow',
  onDark = false,
  first = 'Dealer-grade installs',
  value = 'Owner-direct pricing',
}) {
  const cls = `byline--${register}${onDark ? ' byline--on-dark' : ''}`;
  if (register === 'spoken' || register === 'display') {
    return (
      <p className={cls}>{first}. <span className="byline-value">{value}.</span></p>
    );
  }
  return (
    <p className={cls}>
      <span className="byline-tick" aria-hidden="true"></span>
      <span className="byline-clause">{first}</span>
      <span className="byline-sep" aria-hidden="true">·</span>
      <span className="byline-clause byline-value">{value}</span>
    </p>
  );
}
