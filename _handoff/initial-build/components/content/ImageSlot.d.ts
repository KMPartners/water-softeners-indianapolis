import * as React from 'react';
export interface ImageSlotProps {
  /** short bracketed hint shown inside the placeholder */
  label?: string;
  /** optional mono caption below the image */
  caption?: string;
  /** CSS aspect-ratio, e.g. "16 / 7" */
  ratio?: string;
}
/**
 * Striped placeholder for a real photo with a mono caption. Never hand-drawn art.
 */
export function ImageSlot(props: ImageSlotProps): JSX.Element;
