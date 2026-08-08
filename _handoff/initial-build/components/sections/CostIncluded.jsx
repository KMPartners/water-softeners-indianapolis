import React from 'react';
import { Button } from '../actions/Button.jsx';

/**
 * CostIncluded: fixed-bid transparency. A checklist of what the quoted price
 * includes (and a short "not surprise-billed" note), rather than an invented
 * dollar figure. Price shows as a VERIFY range or stays omitted until the truth
 * doc lands. This is a trust block, not a pricing table.
 */
export function CostIncluded({
  eyebrow = "What's included",
  title = 'One fixed bid. No surprise line items.',
  lede = 'Your written quote is the price. It covers the unit, the transfer switch, and everything it takes to get you running and warrantied, not a teaser number that grows on install day.',
  included = [
    'Generac standby unit, sized by load calc',
    'Automatic transfer switch',
    'Pad, set, and anchoring',
    'Electrical tie-in and gas connection',
    'Local permit and 811 locate',
    'Startup, load test, and commissioning',
    'Mobile Link setup and warranty registration',
  ],
  priceNote = 'Installed pricing depends on unit size, transfer switch, and site conditions. You get an exact fixed bid after the free assessment.',
  ctaHref = '#contact',
}) {
  return (
    <section style={{ background: 'var(--slab)', color: '#fff' }}>
      <div style={{ maxWidth: 'var(--container)', margin: '0 auto', padding: 'clamp(44px,6vw,72px) var(--container-pad)', display: 'grid', gridTemplateColumns: '1fr 1.1fr', gap: 'clamp(32px,5vw,56px)', alignItems: 'start' }}>
        <div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '.2em', textTransform: 'uppercase', color: 'var(--accent)', marginBottom: 14 }}>{eyebrow}</div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--fs-h2)', letterSpacing: '-.015em', margin: '0 0 18px', maxWidth: '16ch' }}>{title}</h2>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--fs-lede)', color: '#B9C2CE', lineHeight: 1.6, margin: '0 0 24px', maxWidth: '50ch' }}>{lede}</p>
          {/* VERIFY: installed price range pending truth doc; keep as note until confirmed */}
          <div style={{ borderLeft: '2px solid var(--accent)', paddingLeft: 16, marginBottom: 26 }}>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: '#9BA6B4', lineHeight: 1.6, margin: 0 }}>{priceNote}</p>
          </div>
          <Button variant="primary" size="lg" href={ctaHref} iconRight="→">Get your fixed bid</Button>
        </div>
        <div style={{ background: 'var(--slab2)', border: '1px solid var(--slab-rule)', borderRadius: 'var(--radius)', padding: 'clamp(24px,3vw,32px)' }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '.18em', textTransform: 'uppercase', color: '#6E7A89', marginBottom: 18 }}>Every quote includes</div>
          <div style={{ display: 'grid', gap: 1, background: 'var(--slab-rule)' }}>
            {included.map((it, i) => (
              <div key={i} style={{ background: 'var(--slab2)', display: 'flex', gap: 12, alignItems: 'center', padding: '13px 4px' }}>
                <span style={{ color: 'var(--accent)', fontFamily: 'var(--font-display)', fontWeight: 800, flex: 'none' }} aria-hidden="true">✓</span>
                <span style={{ fontFamily: 'var(--font-body)', fontSize: 14.5, color: '#DCE2EA' }}>{it}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
