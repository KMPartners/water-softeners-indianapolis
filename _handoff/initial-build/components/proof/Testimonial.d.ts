import * as React from 'react';
export interface TestimonialItem {
  quote: string;
  name: string;
  location?: string;
  detail?: string;
}
export interface TestimonialProps {
  eyebrow?: string;
  /** real reviews; when empty the honest zero-review trust empty state renders */
  items?: TestimonialItem[];
  emptyHeadline?: string;
  emptyBody?: string;
}
/**
 * Review social proof. Empty = honest launch trust claim (omit aggregateRating).
 * @startingPoint section="Proof" subtitle="Testimonials + zero-review empty state" viewport="1140x300"
 */
export function Testimonial(props: TestimonialProps): JSX.Element;
