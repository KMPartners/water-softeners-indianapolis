import * as React from 'react';
export interface HeroSpec { label: string; value: React.ReactNode; }
export interface HeroCta { label: string; href: string; }
export interface PageHeroProps {
  eyebrow?: string;
  byline?: boolean;
  title: string;
  city?: string;
  lede: React.ReactNode;
  specTitle?: string;
  specs?: HeroSpec[];
  primaryCta?: HeroCta;
  phone?: string;
  phoneHref?: string;
  variant?: 'dark' | 'light';
  /** optional node rendered under the hero CTAs (e.g. a compact TrustBar) */
  heroExtra?: React.ReactNode;
}
/**
 * Page hero with Service+City H1 (amber city) and an at-a-glance spec card.
 * @startingPoint section="Content" subtitle="Hero + spec card" viewport="1140x420"
 */
export function PageHero(props: PageHeroProps): JSX.Element;
