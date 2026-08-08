import * as React from 'react';
export interface TrustClaim { label: string; meta?: string; }
export interface AuthorityMark { name: string; note?: string; }
export interface TrustBarProps {
  /** compact = lean inline row for a hero; strip = full hairline band below hero */
  variant?: 'compact' | 'strip';
  claims?: TrustClaim[];
  authorities?: AuthorityMark[];
  showAuthorities?: boolean;
  onDark?: boolean;
}
/**
 * Honest social-proof strip: trust CLAIMS (not ratings) + authority marks.
 * @startingPoint section="Proof" subtitle="Trust claims + authority marks" viewport="1140x120"
 */
export function TrustBar(props: TrustBarProps): JSX.Element;
