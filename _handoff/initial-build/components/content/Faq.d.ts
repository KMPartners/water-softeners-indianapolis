import * as React from 'react';
export interface FaqItem { q: string; a: React.ReactNode; }
export interface FaqProps { items: FaqItem[]; open?: boolean; columns?: number; }
/**
 * Q&A list; ships open by default and should mirror the FAQPage JSON-LD.
 * @startingPoint section="Content" subtitle="FAQ, all open" viewport="700x340"
 */
export function Faq(props: FaqProps): JSX.Element;
