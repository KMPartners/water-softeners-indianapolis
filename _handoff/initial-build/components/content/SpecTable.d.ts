import * as React from 'react';
export interface SpecRow { label: string; value: React.ReactNode; strong?: boolean; }
export interface SpecTableProps { rows: SpecRow[]; }
/**
 * White bordered spec table; `strong` accents a value in amber-deep.
 * @startingPoint section="Content" subtitle="Spec table, 6–10 rows" viewport="700x320"
 */
export function SpecTable(props: SpecTableProps): JSX.Element;
