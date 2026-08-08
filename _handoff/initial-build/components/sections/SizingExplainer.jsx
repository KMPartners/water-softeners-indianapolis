import React from 'react';
import { Button } from '../actions/Button.jsx';

/**
 * SizingExplainer: the load-calc explainer that answers "what size do I need?"
 * without upselling. Prose column plus a compact reference table of common
 * home profiles. All figures are SAFE RANGES / references, VERIFY-flagged.
 */
export function SizingExplainer({
  eyebrow = 'How sizing works',
  title = 'Sized by load calculation, not by upsell.',
  body = "The right size is the one that carries what you actually run during an outage, no more. We do an NEC 220 load calculation on your panel, then match a Generac unit and, where the load runs high, add a Smart Management Module so you stay whole-home-capable without paying for a bigger machine than you need.",
  rows = [
    { home: 'Under 2,500 sq ft, gas heat', size: '18–22 kW', note: 'Essentials + HVAC' },
    { home: '2,500–4,000 sq ft, one AC', size: '22–24 kW', note: 'Most Fishers homes' },
    { home: '4,000+ sq ft, electric heat / two AC', size: '24–26 kW', note: 'Often + load module' },
  ],
  ctaHref = '#contact',
}) {
  return (
    <section style={{ background: 'var(--bg2)', borderTop: '1px solid var(--rule)', borderBottom: '1px solid var(--rule)' }}>
      <div style={{ maxWidth: 'var(--container)', margin: '0 auto', padding: 'clamp(44px,6vw,72px) var(--container-pad)', display: 'grid', gridTemplateColumns: '1fr 1.05fr', gap: 'clamp(32px,5vw,56px)', alignItems: 'center' }}>
        <div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '.2em', textTransform: 'uppercase', color: 'var(--accent-deep)', marginBottom: 14 }}>{eyebrow}</div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--fs-h2)', letterSpacing: '-.015em', margin: '0 0 18px', maxWidth: '18ch' }}>{title}</h2>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--fs-lede)', color: 'var(--ink2)', lineHeight: 1.6, margin: '0 0 24px', maxWidth: '58ch' }}>{body}</p>
          <Button variant="secondary" href={ctaHref}>Get your load calc</Button>
        </div>
        <div>
          {/* VERIFY: sizing ranges are general references; confirm against Generac sizing + truth doc */}
          <div style={{ background: '#fff', border: '1px solid var(--rule)', borderRadius: 'var(--radius)', overflow: 'hidden' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1.7fr .8fr', gap: 16, padding: '12px 20px', background: 'var(--slab)', color: '#fff' }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10.5, letterSpacing: '.14em', textTransform: 'uppercase', color: 'var(--accent)' }}>Your home</span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10.5, letterSpacing: '.14em', textTransform: 'uppercase', color: 'var(--accent)', textAlign: 'right' }}>Typical size</span>
            </div>
            {rows.map((r, i) => (
              <div key={i} style={{ display: 'grid', gridTemplateColumns: '1.7fr .8fr', gap: 16, padding: '15px 20px', borderBottom: i < rows.length - 1 ? '1px solid var(--rule)' : 'none', alignItems: 'center' }}>
                <span>
                  <span style={{ display: 'block', fontFamily: 'var(--font-body)', fontSize: 14, color: 'var(--ink)', fontWeight: 500 }}>{r.home}</span>
                  <span style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--ink3)', marginTop: 3 }}>{r.note}</span>
                </span>
                <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 16, color: 'var(--accent-deep)', textAlign: 'right' }}>{r.size}</span>
              </div>
            ))}
          </div>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--ink3)', margin: '12px 0 0', lineHeight: 1.5 }}>General reference only. Your exact size comes from an on-site load calculation.</p>
        </div>
      </div>
    </section>
  );
}
