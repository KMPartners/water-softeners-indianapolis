import * as React from 'react';
export interface RelatedItem { kicker?: string; label: string; href: string; }
export interface RelatedServicesProps {
  eyebrow?: string;
  title?: string;
  items?: RelatedItem[];
}
/**
 * Mirror-Link grid (Rule 3): sideways/up/down links across the taxonomy.
 * @startingPoint section="Sections" subtitle="Mirror-link related grid" viewport="1140x240"
 */
export function RelatedServices(props: RelatedServicesProps): JSX.Element;
