/**
 * Trinity helpers (Core30 rule 1) — ENGINE.
 *
 * Rule 1 requires the `<title>` keyphrase, the `<h1>` lead text, and the URL slug
 * keyphrase to agree. The title and H1 are the pair that silently drift: a
 * template composes `title = ${service} ${city}` by hand while the H1 renders the
 * city as an accent span, and a stray "in", an `&nbsp;` vs a space, or a comma
 * makes them mismatch — the lint catches it only after build. Generate both from
 * ONE source here so they cannot.
 *
 *   trinityTitle({ service: 'Drywall Repair', city: 'Anytown' }) === 'Drywall Repair Anytown'
 *
 * `<TrinityH1 service city />` (src/components/TrinityH1.astro) renders the SAME
 * text with the city as an accent span, so `stripTags(<h1>)` === the `<title>`
 * keyphrase and `core30-lint` compares them equal by construction.
 */

/** Collapse runs of whitespace (including `&nbsp;`) to single ASCII spaces; trim. */
export function normalizeTrinity(s) {
  return String(s == null ? '' : s).replace(/[\s ]+/g, ' ').trim();
}

/**
 * The canonical Trinity string from its parts. `city` is optional (a homepage or
 * a hub may be city-less). Each part is normalized, then joined with one space —
 * the single source both the `<title>` and the `<h1>` read from.
 */
export function trinityTitle({ service, city } = {}) {
  return normalizeTrinity([service, city].filter(Boolean).map(normalizeTrinity).join(' '));
}
