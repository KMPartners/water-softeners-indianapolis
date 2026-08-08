import React from 'react';
import { Byline } from './Byline.jsx';
import { Button } from '../actions/Button.jsx';

/**
 * PageHero: H1 (Service + City, amber city span) plus an at-a-glance spec card.
 * Sentence one of the lede completes the page goal (Rule 2). `variant="dark"`
 * renders on the slab; "light" renders on a white card.
 */
export function PageHero({
  eyebrow,
  byline = false,
  title,
  city,
  lede,
  specTitle = 'Service specifications',
  specs = [],
  primaryCta = { label: 'Get a fixed-bid quote', href: '#contact' },
  phone = '(463) 283-5939',
  phoneHref = 'tel:#',
  variant = 'dark',
  heroExtra,
}) {
  const dark = variant === 'dark';
  const wrap = {
    background: dark ? 'var(--slab)' : '#fff',
    color: dark ? '#fff' : 'var(--ink)',
    border: dark ? 'none' : '1px solid var(--rule)',
    borderRadius: dark ? 0 : 'var(--radius)',
    padding: dark ? 'clamp(44px,6vw,80px) var(--container-pad)' : 'clamp(28px,4vw,48px)',
  };
  return (
    <section style={wrap}>
      <div style={{ maxWidth: 'var(--container)', margin: '0 auto', display: 'grid', gridTemplateColumns: '1.55fr .9fr', gap: 'clamp(32px,5vw,56px)', alignItems: 'center' }}>
        <div>
          {byline && <div style={{ marginBottom: 14 }}><Byline register="eyebrow" onDark={dark} /></div>}
          {eyebrow && <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '.2em', textTransform: 'uppercase', color: dark ? 'var(--accent)' : 'var(--accent-deep)', marginBottom: 18 }}>{eyebrow}</div>}
          <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--fs-h1)', lineHeight: 1, letterSpacing: '-.02em', margin: '0 0 20px' }}>
            {title} {city && <span style={{ color: 'var(--accent)' }}>{city}</span>}
          </h1>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--fs-lede)', color: dark ? '#B9C2CE' : 'var(--ink2)', margin: '0 0 26px', maxWidth: '54ch', lineHeight: 1.55 }}>{lede}</p>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <Button variant="primary" size="lg" href={primaryCta.href} iconRight="→">{primaryCta.label}</Button>
            <Button variant="call" href={phoneHref}>{phone}</Button>
          </div>
          {heroExtra}
        </div>
        {specs.length > 0 && (
          <aside style={{ background: dark ? 'var(--slab2)' : 'var(--slab)', border: dark ? '1px solid var(--slab-rule)' : 'none', borderRadius: 'var(--radius)', padding: '26px 24px', color: '#fff' }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '.2em', textTransform: 'uppercase', color: 'var(--accent)', marginBottom: 16 }}>{specTitle}</div>
            {specs.map((s, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '11px 0', borderBottom: i < specs.length - 1 ? '1px solid var(--slab-rule)' : 'none', fontSize: 13 }}>
                <span style={{ color: '#9BA6B4' }}>{s.label}</span>
                <span style={{ fontFamily: 'var(--font-mono)' }}>{s.value}</span>
              </div>
            ))}
          </aside>
        )}
      </div>
    </section>
  );
}
