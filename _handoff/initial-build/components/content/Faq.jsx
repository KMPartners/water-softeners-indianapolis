import React from 'react';

/**
 * Faq: accessible Q&A list. Ships every item open by default (crawlable);
 * the same data should feed the FAQPage JSON-LD. `columns` lays items into a grid.
 */
export function Faq({ items = [], open = true, columns = 1 }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: `repeat(${columns}, minmax(0,1fr))`, gap: '14px 32px' }}>
      {items.map((it, i) => (
        <details key={i} open={open} style={{ borderBottom: '1px solid var(--rule)', padding: '0 0 14px' }}>
          <summary style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 16, color: 'var(--ink)', display: 'flex', justifyContent: 'space-between', gap: 16, alignItems: 'center', cursor: 'pointer', listStyle: 'none' }}>
            {it.q}
            <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 400, fontSize: 18, color: 'var(--accent)', lineHeight: 1 }} aria-hidden="true">+</span>
          </summary>
          <p style={{ fontSize: 14.5, color: 'var(--ink2)', lineHeight: 1.65, margin: '12px 0 0' }}>{it.a}</p>
        </details>
      ))}
    </div>
  );
}
