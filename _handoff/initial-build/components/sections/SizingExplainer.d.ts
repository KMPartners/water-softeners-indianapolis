import * as React from 'react';
export interface SizingRow { home: string; size: string; note?: string; }
export interface SizingExplainerProps {
  eyebrow?: string;
  title?: string;
  body?: string;
  rows?: SizingRow[];
  ctaHref?: string;
}
/**
 * Load-calc explainer with a common-home reference table (SAFE RANGES, VERIFY).
 * @startingPoint section="Sections" subtitle="Sizing / load-calc explainer" viewport="1140x360"
 */
export function SizingExplainer(props: SizingExplainerProps): JSX.Element;
