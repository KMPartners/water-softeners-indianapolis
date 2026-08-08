import * as React from 'react';

export interface MobileCategory { num: string; label: string; meta: string; href: string; }
export interface MobileLink { label: string; href: string; }
export interface MobileNavProps {
  open: boolean;
  onClose: () => void;
  categories?: MobileCategory[];
  quickLinks?: MobileLink[];
  areas?: string[];
  phone?: string;
  phoneHref?: string;
  logoHref?: string;
}
/**
 * Controlled Variant B side drawer (overlay + drawer) built on mobile-chrome.css:
 * status eyebrow, numbered categories, quick links, area pills, sticky call CTA.
 */
export function MobileNav(props: MobileNavProps): JSX.Element;
