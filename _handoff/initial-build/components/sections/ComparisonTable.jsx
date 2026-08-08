import React from 'react';

/**
 * ComparisonTable: an honest side-by-side to help a homeowner choose. Two or
 * three columns; one column can be highlighted (`recommended`). Rows are plain
 * labels with a value per column. Use for air-cooled vs liquid, or Meridian vs
 * big-box, keeping every claim defensible.
 */
export function ComparisonTable({
  eyebrow = 'Which is right for you',
  title = 'Air-cooled vs liquid-cooled standby.',
  columns = [
    { name: 'Air-cooled 22 kW', tag: 'Most homes', recommended: true },
    { name: 'Liquid-cooled 30 kW+', tag: 'Large / high-load' },
  ],
  rows = [
    { label: 'Best for', values: ['Most Fishers and Noblesville homes', 'Large homes, high continuous load'] },
    { label: 'Fuel', values: ['Natural gas / LP', 'Natural gas / LP'] },
    { label: 'Footprint', values: ['Compact side-yard pad', 'Larger pad, more clearance'] },
    { label: 'Relative cost', values: ['Lower installed cost', 'Higher installed cost'] },
    { label: 'Noise', values: ['Low-dB enclosure', 'Larger enclosure'] },
  ],
}) {
  const cols = columns.length;
  return (
    <section style={{ maxWidth: 'var(--container)', margin: '0 auto', padding: 'clamp(44px,6vw,72px) var(--container-pad)' }}>
      <div style={{ marginBottom: 28 }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '.2em', textTransform: 'uppercase', color: 'var(--accent-deep)', marginBottom: 14 }}>{eyebrow}</div>
        <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--fs-h2)', letterSpacing: '-.015em', margin: 0 }}>{title}</h2>
      </div>
      {/* VERIFY: comparison claims are general; confirm cost/noise/footprint against truth doc */}
      <div style={{ border: '1px solid var(--rule)', borderRadius: 'var(--radius)', overflow: 'hidden', background: '#fff' }}>
        <div style={{ display: 'grid', gridTemplateColumns: `1.1fr repeat(${cols}, 1fr)` }}>
          <div style={{ background: 'var(--slab)' }} />
          {columns.map((c, i) => (
            <div key={i} style={{ background: c.recommended ? 'var(--accent)' : 'var(--slab)', color: c.recommended ? 'var(--accent-ink)' : '#fff', padding: '18px 20px', borderLeft: '1px solid ' + (c.recommended ? 'var(--accent-deep)' : 'var(--slab-rule)') }}>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 16, letterSpacing: '-.01em' }}>{c.name}</div>
              {c.tag && <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '.1em', textTransform: 'uppercase', marginTop: 5, color: c.recommended ? 'var(--accent-ink)' : 'var(--accent)' }}>{c.tag}</div>}
            </div>
          ))}
        </div>
        {rows.map((r, ri) => (
          <div key={ri} style={{ display: 'grid', gridTemplateColumns: `1.1fr repeat(${cols}, 1fr)`, borderTop: '1px solid var(--rule)' }}>
            <div style={{ padding: '15px 20px', fontFamily: 'var(--font-mono)', fontSize: 11.5, letterSpacing: '.04em', color: 'var(--ink3)', background: 'var(--bg2)', display: 'flex', alignItems: 'center' }}>{r.label}</div>
            {r.values.map((v, vi) => (
              <div key={vi} style={{ padding: '15px 20px', fontFamily: 'var(--font-body)', fontSize: 14, color: 'var(--ink2)', lineHeight: 1.45, borderLeft: '1px solid var(--rule)', background: columns[vi] && columns[vi].recommended ? 'rgba(242,164,12,.06)' : '#fff' }}>{v}</div>
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}
