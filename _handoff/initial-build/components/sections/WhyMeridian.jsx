import React from 'react';

/**
 * WhyMeridian: differentiator cards with the amber top-border treatment.
 * Each card is one reason to choose Meridian, kept concrete (no fluff).
 */
export function WhyMeridian({
  eyebrow = 'Why Meridian',
  title = 'A dealer-grade install, at owner-direct pricing.',
  cards = [
    { k: 'Factory-authorized', d: 'An authorized Generac dealer, so your install and every repair stay warranty-compliant. Cross-brand units are welcome as take-over service.' },
    { k: 'Owner-direct pricing', d: 'You deal with the people doing the work, not a call center or a commissioned closer. Fixed-bid quotes in writing, sized to your home.' },
    { k: 'We service what we install', d: 'Maintenance, diagnostics, and repairs come from the same team, so nobody hands you off when the yellow light comes on.' },
    { k: 'Local and specific', d: 'We work Fishers, Noblesville, Carmel, and the Hamilton and Madison County area every week, and we know the Duke, AES, and AML&P territories.' },
  ],
}) {
  return (
    <section style={{ maxWidth: 'var(--container)', margin: '0 auto', padding: 'clamp(44px,6vw,72px) var(--container-pad)' }}>
      <div style={{ marginBottom: 30 }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '.2em', textTransform: 'uppercase', color: 'var(--accent-deep)', marginBottom: 14 }}>{eyebrow}</div>
        <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--fs-h2)', letterSpacing: '-.015em', margin: 0, maxWidth: '22ch' }}>{title}</h2>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(240px,1fr))', gap: 20 }}>
        {cards.map((c, i) => (
          <div key={i} style={{ background: '#fff', border: '1px solid var(--rule)', borderTop: '3px solid var(--accent)', borderRadius: 'var(--radius)', padding: '26px 24px', minHeight: 180 }}>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 18, color: 'var(--ink)', marginBottom: 12, letterSpacing: '-.01em' }}>{c.k}</div>
            <div style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: 'var(--ink2)', lineHeight: 1.6 }}>{c.d}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
