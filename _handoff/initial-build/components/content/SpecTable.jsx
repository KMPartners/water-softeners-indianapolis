import React from 'react';

/**
 * SpecTable: white bordered rows, mono label left, value right. Set `strong`
 * on a row to accent the value in amber-deep. 6 to 10 rows.
 */
export function SpecTable({ rows = [] }) {
  return (
    <div style={{ background: '#fff', border: '1px solid var(--rule)', borderRadius: 'var(--radius)', overflow: 'hidden' }}>
      {rows.map((r, i) => (
        <div key={i} style={{
          display: 'flex', justifyContent: 'space-between', gap: 16, padding: '13px 20px',
          borderBottom: i < rows.length - 1 ? '1px solid var(--rule)' : 'none',
        }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--ink3)', letterSpacing: '.04em' }}>{r.label}</span>
          <span style={{ fontSize: 14, color: 'var(--ink)', textAlign: 'right' }}>
            {r.strong ? <strong style={{ color: 'var(--accent-deep)' }}>{r.value}</strong> : r.value}
          </span>
        </div>
      ))}
    </div>
  );
}
