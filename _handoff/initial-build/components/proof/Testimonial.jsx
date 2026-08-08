import React from 'react';

/**
 * Testimonial: social proof for reviews. IMPORTANT (CLAUDE.md): a new IASD
 * launches at ZERO reviews, so we never fabricate ratings. When `items` is
 * empty this renders the honest EMPTY STATE: the authorized / warranty-compliant
 * trust claim plus an invitation, and callers must OMIT aggregateRating schema.
 * Once real reviews exist, pass them in and the quotes render instead.
 */
export function Testimonial({
  eyebrow = 'What you can count on',
  items = [],
  emptyHeadline = 'Newly launched, backed by the factory.',
  emptyBody = "We're a brand-new authorized Generac dealer in Fishers, so we're earning our first reviews now. What that means for you today: factory-trained installs, warranty-compliant service, and a written fixed-bid quote before any work starts.",
}) {
  const hasReviews = items && items.length > 0;
  return (
    <section style={{ maxWidth: 'var(--container)', margin: '0 auto', padding: 'clamp(36px,5vw,64px) var(--container-pad)' }}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 14, marginBottom: 26 }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '.2em', textTransform: 'uppercase', color: 'var(--accent-deep)' }}>{eyebrow}</span>
        <div style={{ flex: 1, height: 1, background: 'var(--rule)' }} />
      </div>

      {hasReviews ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: 20 }}>
          {items.map((t, i) => (
            <figure key={i} style={{ margin: 0, background: '#fff', border: '1px solid var(--rule)', borderTop: '3px solid var(--accent)', borderRadius: 'var(--radius)', padding: '26px 24px', display: 'flex', flexDirection: 'column', gap: 16 }}>
              <blockquote style={{ margin: 0, fontFamily: 'var(--font-body)', fontSize: 16, lineHeight: 1.55, color: 'var(--ink)' }}>“{t.quote}”</blockquote>
              <figcaption style={{ marginTop: 'auto', fontFamily: 'var(--font-mono)', fontSize: 11.5, color: 'var(--ink3)', letterSpacing: '.02em' }}>
                <span style={{ color: 'var(--ink)', fontWeight: 500 }}>{t.name}</span>{t.location ? ' · ' + t.location : ''}{t.detail ? ' · ' + t.detail : ''}
              </figcaption>
            </figure>
          ))}
        </div>
      ) : (
        <div style={{ background: 'var(--slab)', borderRadius: 'var(--radius)', padding: 'clamp(28px,4vw,44px)', display: 'grid', gridTemplateColumns: '1.3fr 1fr', gap: 'clamp(24px,4vw,44px)', alignItems: 'center' }}>
          {/* VERIFY: replace empty state with real testimonials once reviews exist; then re-add aggregateRating schema */}
          <div>
            <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'clamp(22px,2.8vw,30px)', letterSpacing: '-.015em', color: '#fff', margin: '0 0 14px', lineHeight: 1.1 }}>{emptyHeadline}</h3>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--fs-lede)', color: '#B9C2CE', lineHeight: 1.6, margin: 0, maxWidth: '54ch' }}>{emptyBody}</p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {['Authorized Generac dealer', 'Warranty-compliant service', 'Fixed-bid quote in writing'].map((t, i) => (
              <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'center', background: 'var(--slab2)', border: '1px solid var(--slab-rule)', borderRadius: 'var(--radius)', padding: '14px 16px' }}>
                <span style={{ color: 'var(--accent)', fontFamily: 'var(--font-display)', fontWeight: 800 }} aria-hidden="true">✓</span>
                <span style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 14, color: '#fff' }}>{t}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
