import * as React from 'react';
export interface LeadFormProps {
  eyebrow?: string;
  heading?: string;
  lede?: string;
  phone?: string;
  phoneHref?: string;
  /** GHL webhook POST URL */
  action?: string;
  onSubmit?: React.FormEventHandler;
  cities?: string[];
  services?: string[];
}
/**
 * GoHighLevel quote form in the dark #contact section. Field names map 1:1 to GHL.
 * @startingPoint section="Forms" subtitle="GHL quote form (dark contact)" viewport="1140x560"
 */
export function LeadForm(props: LeadFormProps): JSX.Element;
