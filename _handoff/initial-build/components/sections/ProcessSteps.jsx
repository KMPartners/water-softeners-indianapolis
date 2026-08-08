import React from 'react';

/**
 * ProcessSteps: the "how it works" spine. Numbered steps on a hairline grid;
 * the connecting rail reads as one continuous process. Default is the Meridian
 * flow: assess, load calc, install, service.
 */
export function ProcessSteps({
  eyebrow = 'How it works',
  title = 'From first call to first outage, handled.',
  steps = [
    { k: 'Free on-site assessment', d: 'We visit your home, look at the panel and gas service, and talk through what you want to keep running.' },
    { k: 'Load calculation & fixed bid', d: 'An NEC 220 load calc sizes the unit to your home, then you get a transparent, fixed-bid quote in writing.' },
    { k: 'Permitted install', d: 'We pull the local permit, file the 811 locate, set the pad, and commission the unit, usually in one to two days.' },
    { k: 'Ongoing service', d: 'Load test, Mobile Link setup, and warranty registration, then we maintain and repair it, warranty-compliant.' },
  ],
}) {
  return (
    <section style={{ maxWidth: 'var(--container)', margin: '0 auto', padding: 'clamp(44px,6vw,72px) var(--container-pad)' }}>
      <div style={{ marginBottom: 30 }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '.2em', textTransform: 'uppercase', color: 'var(--accent-deep)', marginBottom: 14 }}>{eyebrow}</div>
        <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--fs-h2)', letterSpacing: '-.015em', margin: 0, maxWidth: '20ch' }}>{title}</h2>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: `repeat(${steps.length}, 1fr)`, gap: 1, background: 'var(--rule)', border: '1px solid var(--rule)', borderRadius: 'var(--radius)', overflow: 'hidden' }}>
        {steps.map((s, i) => (
          <div key={i} style={{ background: '#fff', padding: '28px 24px', display: 'flex', flexDirection: 'column', minHeight: 200 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
              <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 15, color: 'var(--accent-ink)', background: 'var(--accent)', width: 30, height: 30, borderRadius: 'var(--radius)', display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 'none' }}>{i + 1}</span>
              <span style={{ flex: 1, height: 1, background: 'var(--rule)' }} />
            </div>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 17, color: 'var(--ink)', marginBottom: 10, letterSpacing: '-.01em' }}>{s.k}</div>
            <div style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: 'var(--ink2)', lineHeight: 1.55 }}>{s.d}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
