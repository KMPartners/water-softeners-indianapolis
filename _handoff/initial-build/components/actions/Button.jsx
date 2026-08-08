import React from 'react';

/**
 * Meridian Button, the primary action atom.
 * Variants: primary (amber fill), secondary (ink outline), ghost (text),
 * call (mono phone chip with signal dot). Renders <a> when href is set,
 * otherwise <button>.
 */
export function Button({
  children,
  variant = 'primary',
  size = 'md',
  href,
  onClick,
  iconRight,
  disabled = false,
  type = 'button',
  ...rest
}) {
  const pad = { sm: '10px 16px', md: '13px 22px', lg: '15px 28px' }[size] || '13px 22px';
  const fs = { sm: 13, md: 14, lg: 15 }[size] || 14;

  const base = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 9,
    fontFamily: 'var(--font-display)',
    fontWeight: 700,
    fontSize: fs,
    lineHeight: 1,
    borderRadius: 'var(--radius)',
    padding: pad,
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.45 : 1,
    textDecoration: 'none',
    transition: 'background-color .12s ease, color .12s ease, transform .12s ease',
    border: '1px solid transparent',
  };

  const variants = {
    primary:   { background: 'var(--accent)', color: 'var(--accent-ink)' },
    secondary: { background: 'transparent', color: 'var(--ink)', borderColor: 'var(--ink)' },
    ghost:     { background: 'transparent', color: 'var(--accent-deep)', padding: '4px 2px' },
    call:      { background: 'transparent', color: 'var(--ink)', borderColor: 'var(--rule2)', fontFamily: 'var(--font-mono)', fontWeight: 500 },
  };

  const style = { ...base, ...(variants[variant] || variants.primary) };

  const content = (
    <>
      {variant === 'call' && (
        <span style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--signal)', flex: 'none' }} aria-hidden="true" />
      )}
      {children}
      {iconRight && <span style={{ color: variant === 'primary' ? 'var(--accent-ink)' : 'var(--accent-deep)' }} aria-hidden="true">{iconRight}</span>}
    </>
  );

  if (href && !disabled) {
    return <a href={href} style={style} onClick={onClick} {...rest}>{content}</a>;
  }
  return <button type={type} style={style} onClick={onClick} disabled={disabled} {...rest}>{content}</button>;
}
