/**
 * Locked legal constants — ENGINE, DEPENDENCY-FREE.
 *
 * Split out from legal.js on purpose: this module imports nothing, so both the
 * Astro build (via legal.js) AND scripts/core30-lint.mjs (plain node, no
 * import-assertion machinery) can read the exact same bytes. If the lint
 * imported legal.js it would pull in site.js → site.config.json and fail under
 * node; here the canonical strings live where both sides agree.
 *
 * Do NOT paraphrase NO_SHARE_SENTENCE — A2P brand review checks for this exact
 * wording, "we do not sell your data" is not a substitute, and core30-lint fails
 * the build if a privacy page on an SMS-enabled site omits it (task §2.1).
 */

export const NO_SHARE_SENTENCE =
  'We do not share your mobile information with third parties or affiliates for marketing or promotional purposes. No exceptions.';

export const PRIVACY_ROUTE = '/privacy-policy/';
export const TERMS_ROUTE = '/terms-of-service/';
