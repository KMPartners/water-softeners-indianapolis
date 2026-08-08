import * as React from 'react';
export interface BylineProps {
  register?: 'eyebrow' | 'micro' | 'spoken' | 'display';
  onDark?: boolean;
  first?: string;
  value?: string;
}
/**
 * Locked positioning line, two-tone. Never in title/H1/URL.
 * @startingPoint section="Content" subtitle="Held byline, all registers" viewport="700x120"
 */
export function Byline(props: BylineProps): JSX.Element;
