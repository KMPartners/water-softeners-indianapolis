import React from 'react';

/**
 * RelatedServices: the Mirror-Link grid (Core30 Rule 3). Links sideways to
 * sibling services and up/down the taxonomy so every page connects. Plain
 * hairline cards with a mono kicker.
 */
export function RelatedServices({
  eyebrow = 'Related services',
  title = 'Explore the rest of what we do.',
  items = [
    { kicker: 'Standby', label: '24–26 kW Installation', href: '/24kw' },
    { kicker: 'Electrical', label: 'Automatic Transfer Switch', href: '/ats' },
    { kicker: 'Service', label: 'Generac Take-Over Service', href: '/take-over' },
    { kicker: 'Diagnostics', label: 'Yellow-Light Diagnostic', href: '/yellow-light' },
  ],
}) {
  return (
    <section style={{ background: 'var(--bg2)', borderTop: '1px solid var(--rule)' }}>
      <div style={{ maxWidth: 'var(--container)', margin: '0 auto', padding: 'clamp(44px,6vw,72px) var(--container-pad)' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 14, marginBottom: 26 }}>
          <div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '.2em', textTransform: 'uppercase', color: 'var(--accent-deep)', marginBottom: 10 }}>{eyebrow}</div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--fs-h3)', letterSpacing: '-.01em', margin: 0 }}>{title}</h2>
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: 1, background: 'var(--rule)', border: '1px solid var(--rule)', borderRadius: 'var(--radius)', overflow: 'hidden' }}>
          {items.map((it, i) => (
            <a key={i} href={it.href} style={{ background: '#fff', padding: '24px 22px', display: 'flex', flexDirection: 'column', gap: 10, minHeight: 116 }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10.5, letterSpacing: '.14em', textTransform: 'uppercase', color: 'var(--accent-deep)' }}>{it.kicker}</span>
              <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 17, color: 'var(--ink)', letterSpacing: '-.01em' }}>{it.label}</span>
              <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 13, color: 'var(--accent-deep)', marginTop: 'auto' }}>View →</span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
