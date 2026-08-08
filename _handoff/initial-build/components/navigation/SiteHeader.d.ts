import * as React from 'react';

export interface NavItem { label: string; href: string; }
export interface SiteHeaderProps {
  navItems?: NavItem[];
  phone?: string;
  phoneHref?: string;
  logoHref?: string;
  utilityLeft?: string;
  utilityRight?: string;
  /** open the mobile drawer (wire to MobileNav) */
  onMenu?: () => void;
}
/**
 * Shared site header: dark utility strip + white main bar (logo, desktop nav,
 * phone CTA) + hamburger. Identical on every page.
 * @startingPoint section="Navigation" subtitle="Full site header chrome" viewport="1140x120"
 */
export function SiteHeader(props: SiteHeaderProps): JSX.Element;
