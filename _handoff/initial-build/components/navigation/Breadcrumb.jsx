import React from 'react';

/**
 * Breadcrumb: Home / Category / Current, Mirror-Link UP (Core30 Rule 3).
 * The last item is the current page and renders without a link.
 */
export function Breadcrumb({ items = [], background = 'var(--bg)' }) {
  return (
    <nav aria-label="Breadcrumb" style={{
      background,
      border: '1px solid var(--rule)',
      borderRadius: 'var(--radius)',
      padding: '14px 22px',
      fontFamily: 'var(--font-mono)',
      fontSize: 12,
      letterSpacing: '.04em',
    }}>
      {items.map((it, i) => {
        const last = i === items.length - 1;
        return (
          <React.Fragment key={i}>
            {last || !it.href
              ? <span style={{ color: 'var(--ink2)' }}>{it.label}</span>
              : <a href={it.href} style={{ color: 'var(--accent-deep)' }}>{it.label}</a>}
            {!last && <span style={{ opacity: 0.4, margin: '0 6px' }}>/</span>}
          </React.Fragment>
        );
      })}
    </nav>
  );
}
