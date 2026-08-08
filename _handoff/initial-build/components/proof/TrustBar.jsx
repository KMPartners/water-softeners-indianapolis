import React from 'react';

/**
 * TrustBar: the honest social-proof strip. At launch (zero reviews) this
 * carries trust CLAIMS, not ratings: authorized-dealer badge, warranty-compliant
 * service, and named local-utility service-area proof, plus optional authority
 * marks (Generac, NFPA) as labeled placeholder tiles until real logo assets land.
 *
 * variant="compact" is the lean inline row for inside a hero (mono, amber dots).
 * variant="strip" is the full hairline-bordered band for below the hero.
 */
export function TrustBar({
  variant = 'strip',
  claims = [
    { label: 'Authorized Generac Dealer', meta: 'Factory-trained · IASD' },
    { label: 'Warranty-Compliant Service', meta: 'We service what we install' },
    { label: 'Serving Fishers & Noblesville', meta: 'Duke Energy / AES Indiana areas' },
  ],
  authorities = [
    { name: 'Generac', note: 'Authorized Dealer' },
    { name: 'NFPA 70', note: 'NEC 702 compliant' },
  ],
  showAuthorities = true,
  onDark = false,
}) {
  const dim = onDark ? '#9BA6B4' : 'var(--ink3)';
  const strong = onDark ? '#fff' : 'var(--ink)';

  if (variant === 'compact') {
    return (
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px 18px', alignItems: 'center' }}>
        {claims.map((c, i) => (
          <React.Fragment key={i}>
            {i > 0 && <span style={{ color: 'var(--accent)', fontWeight: 700 }} aria-hidden="true">·</span>}
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '.08em', textTransform: 'uppercase', color: onDark ? '#DCE2EA' : 'var(--ink2)' }}>
              <span style={{ width: 6, height: 6, background: 'var(--accent)', flex: 'none' }} aria-hidden="true" />{c.label}
            </span>
          </React.Fragment>
        ))}
      </div>
    );
  }

  return (
    <section style={{ background: onDark ? 'var(--slab)' : 'var(--bg2)', borderTop: '1px solid ' + (onDark ? 'var(--slab-rule)' : 'var(--rule)'), borderBottom: '1px solid ' + (onDark ? 'var(--slab-rule)' : 'var(--rule)') }}>
      <div style={{ maxWidth: 'var(--container)', margin: '0 auto', padding: '24px var(--container-pad)', display: 'grid', gridTemplateColumns: showAuthorities ? '1.6fr 1fr' : '1fr', gap: 'clamp(24px,4vw,48px)', alignItems: 'center' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(190px,1fr))', gap: '18px 28px' }}>
          {claims.map((c, i) => (
            <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
              <span style={{ color: 'var(--accent)', fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 16, lineHeight: 1.2 }} aria-hidden="true">✓</span>
              <span>
                <span style={{ display: 'block', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 14.5, color: strong, lineHeight: 1.25 }}>{c.label}</span>
                {c.meta && <span style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: 11, color: dim, marginTop: 4 }}>{c.meta}</span>}
              </span>
            </div>
          ))}
        </div>
        {showAuthorities && (
          <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', flexWrap: 'wrap', borderLeft: '1px solid ' + (onDark ? 'var(--slab-rule)' : 'var(--rule2)'), paddingLeft: 'clamp(16px,3vw,32px)' }}>
            {/* VERIFY: replace placeholder tiles with official Generac / NFPA logo assets (respect trademark usage) */}
            {authorities.map((a, i) => (
              <div key={i} style={{ background: onDark ? 'var(--slab2)' : '#fff', border: '1px solid ' + (onDark ? 'var(--slab-rule)' : 'var(--rule)'), borderRadius: 'var(--radius)', padding: '12px 16px', minWidth: 118, textAlign: 'center' }}>
                <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 15, letterSpacing: '.02em', color: strong }}>{a.name}</div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9.5, letterSpacing: '.08em', textTransform: 'uppercase', color: dim, marginTop: 4 }}>{a.note}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
