import React from 'react';
import { Button } from '../actions/Button.jsx';

/**
 * FinalCta: dark closing band. Amber eyebrow, display headline, lede, and a
 * primary CTA + phone. Do not override the slab treatment.
 */
export function FinalCta({
  eyebrow = 'Authorized Generac Dealer',
  title = 'We answer the phone, and we service what we install.',
  lede = 'Transparent, fixed-bid pricing, sized to your home.',
  primaryCta = { label: 'Schedule a free assessment', href: '#contact' },
  phone = '(463) 283-5939',
  phoneHref = 'tel:#',
}) {
  return (
    <section style={{ background: 'var(--slab)', borderRadius: 'var(--radius)', padding: 'clamp(36px,5vw,56px)', textAlign: 'center' }}>
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '.24em', textTransform: 'uppercase', color: 'var(--accent)', marginBottom: 16 }}>{eyebrow}</div>
      <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'clamp(24px,3.6vw,40px)', lineHeight: 1.04, letterSpacing: '-.02em', color: '#fff', margin: '0 0 14px' }}>{title}</h2>
      <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--fs-lede)', color: '#B9C2CE', maxWidth: '46ch', margin: '0 auto 26px' }}>{lede}</p>
      <div style={{ display: 'inline-flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
        <Button variant="primary" size="lg" href={primaryCta.href}>{primaryCta.label}</Button>
        <a href={phoneHref} style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 15, background: 'transparent', color: '#fff', border: '1px solid var(--slab-rule)', padding: '14px 28px', borderRadius: 'var(--radius)' }}>{phone}</a>
      </div>
    </section>
  );
}
