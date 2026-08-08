import * as React from 'react';

export interface FooterLink { label: string; href?: string; }
export interface FooterColumn { title: string; links: FooterLink[]; }
export interface SiteFooterProps {
  columns?: FooterColumn[];
  areas?: string[];
  phone?: string;
  city?: string;
  logoHref?: string;
  year?: number;
}
/**
 * Shared dark footer with logo, R1 micro byline, link columns, service area,
 * contact, and the © / trademark line. NAP matches the GBP byte-for-byte.
 * @startingPoint section="Navigation" subtitle="Full site footer" viewport="1140x360"
 */
export function SiteFooter(props: SiteFooterProps): JSX.Element;
