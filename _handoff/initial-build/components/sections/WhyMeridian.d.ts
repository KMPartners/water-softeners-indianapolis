import * as React from 'react';
export interface WhyCard { k: string; d: string; }
export interface WhyMeridianProps {
  eyebrow?: string;
  title?: string;
  cards?: WhyCard[];
}
/**
 * Differentiator cards with the amber top-border treatment.
 * @startingPoint section="Sections" subtitle="Why-us differentiator cards" viewport="1140x300"
 */
export function WhyMeridian(props: WhyMeridianProps): JSX.Element;
