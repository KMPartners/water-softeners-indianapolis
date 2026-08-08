import React from 'react';

/**
 * ImageSlot: striped placeholder for a real photo (per kit doc 06-image-spec)
 * with a mono caption. Never ship hand-drawn SVG imagery; drop a real photo here.
 */
export function ImageSlot({ label = 'photo', caption, ratio = '16 / 7' }) {
  return (
    <div style={{ border: '1px solid var(--rule)', borderRadius: 'var(--radius)', overflow: 'hidden', background: 'var(--bg)' }}>
      <div style={{
        aspectRatio: ratio,
        background: 'repeating-linear-gradient(135deg,#E4E8EE,#E4E8EE 14px,#EDF0F4 14px,#EDF0F4 28px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--ink3)', letterSpacing: '.06em', background: '#fff', border: '1px solid var(--rule)', padding: '8px 14px', borderRadius: 'var(--radius)' }}>[ {label} ]</span>
      </div>
      {caption && <div style={{ padding: '12px 18px', fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--ink3)', borderTop: '1px solid var(--rule)' }}>{caption}</div>}
    </div>
  );
}
