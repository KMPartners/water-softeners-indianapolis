import * as React from 'react';

export interface ButtonProps {
  children: React.ReactNode;
  /** primary = amber fill · secondary = ink outline · ghost = text · call = mono phone chip */
  variant?: 'primary' | 'secondary' | 'ghost' | 'call';
  size?: 'sm' | 'md' | 'lg';
  /** renders an <a> when set, otherwise a <button> */
  href?: string;
  onClick?: React.MouseEventHandler;
  /** trailing glyph, e.g. "→" or "↗" */
  iconRight?: React.ReactNode;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
}

/**
 * Primary action atom for Meridian. Amber is the workhorse CTA; use exactly one
 * primary per view. `call` renders the phone-number chip pattern.
 * @startingPoint section="Actions" subtitle="Amber CTA, outline, ghost, call chip" viewport="700x160"
 */
export function Button(props: ButtonProps): JSX.Element;
