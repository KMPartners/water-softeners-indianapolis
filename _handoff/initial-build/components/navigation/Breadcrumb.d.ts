import * as React from 'react';

export interface BreadcrumbItem { label: string; href?: string; }
export interface BreadcrumbProps {
  /** ordered trail; the last item is the current page and renders unlinked */
  items: BreadcrumbItem[];
  background?: string;
}
/**
 * Home / Category / Current trail in mono. Enforces Mirror-Link UP (Rule 3).
 * @startingPoint section="Navigation" subtitle="Mono breadcrumb trail" viewport="700x80"
 */
export function Breadcrumb(props: BreadcrumbProps): JSX.Element;
