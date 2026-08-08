import * as React from 'react';
export interface CompareColumn { name: string; tag?: string; recommended?: boolean; }
export interface CompareRow { label: string; values: React.ReactNode[]; }
export interface ComparisonTableProps {
  eyebrow?: string;
  title?: string;
  columns?: CompareColumn[];
  rows?: CompareRow[];
}
/**
 * Honest side-by-side; one column can be `recommended` (amber header).
 * @startingPoint section="Sections" subtitle="Comparison table" viewport="1140x420"
 */
export function ComparisonTable(props: ComparisonTableProps): JSX.Element;
