import * as React from 'react';
export interface CostIncludedProps {
  eyebrow?: string;
  title?: string;
  lede?: string;
  included?: string[];
  priceNote?: string;
  ctaHref?: string;
}
/**
 * Fixed-bid transparency: what's-included checklist, no invented price.
 * @startingPoint section="Sections" subtitle="Fixed-bid / what's included" viewport="1140x420"
 */
export function CostIncluded(props: CostIncludedProps): JSX.Element;
