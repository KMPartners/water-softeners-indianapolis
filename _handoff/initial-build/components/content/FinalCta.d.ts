import * as React from 'react';
export interface FinalCtaProps {
  eyebrow?: string;
  title?: string;
  lede?: string;
  primaryCta?: { label: string; href: string };
  phone?: string;
  phoneHref?: string;
}
/**
 * Dark closing CTA band. Do not override the slab treatment.
 * @startingPoint section="Content" subtitle="Dark closing CTA" viewport="1140x300"
 */
export function FinalCta(props: FinalCtaProps): JSX.Element;
