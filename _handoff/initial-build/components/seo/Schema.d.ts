import * as React from 'react';

export interface RatingInput { ratingValue: number; reviewCount: number; }
export interface SchemaProps {
  /** JSON-LD graph nodes, built with helpers from ./schema.js */
  nodes: object[] | object;
}
/**
 * Injects JSON-LD <script> tags (LocalBusiness / Service / FAQPage) into the page.
 * Core30 Rule 5. Omits aggregateRating until real reviews exist.
 */
export function Schema(props: SchemaProps): JSX.Element;

export const NAP: Record<string, any>;
export const AREA_SERVED: string[];
export function provider(): object;
export function buildLocalBusiness(opts?: { rating?: RatingInput }): object;
export function buildService(opts: { serviceType: string; name?: string; description: string; city?: string; price?: number | string; rating?: RatingInput }): object;
export function buildFaqPage(items: Array<{ q?: string; a?: string; question?: string; answer?: string }>): object;
