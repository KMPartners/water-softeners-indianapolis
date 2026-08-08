import React from 'react';
import { Byline } from '../content/Byline.jsx';

/**
 * SiteFooter: shared dark footer. Logo lockup + R1 micro byline + link columns
 * + service area + contact, then the © / Authorized Generac Dealer line.
 * NAP must match the Google Business Profile byte-for-byte.
 */
export function SiteFooter({
  columns = [],
  areas = ['Fishers · Noblesville', 'Carmel · Westfield', 'Pendleton · Anderson'],
  phone = '(463) 283-5939',
  city = 'Fishers, IN',
  logoHref = '#',
  year = 2026,
}) {
  return (
    <footer style={{ background: 'var(--slab)', color: '#fff', padding: 'clamp(36px,5vw,64px) var(--container-pad) 40px', borderTop: '1px solid var(--slab-rule)' }}>
      <div style={{ maxWidth: 'var(--container)', margin: '0 auto' }}>
        <a href={logoHref} style={{ display: 'flex', alignItems: 'center', gap: 13, marginBottom: 20 }}>
          <span className="logo-mark logo-mark--invert logo-mark--36" aria-hidden="true"></span>
          <span style={{ lineHeight: 1 }}>
            <span style={{ display: 'block', fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 18 }}>MER<span className="mrd">I</span>DIAN</span>
            <span style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '.22em', color: 'var(--accent)', marginTop: 5 }}>GENERATOR &amp; ELECTRIC</span>
          </span>
        </a>
        <div style={{ marginBottom: 26 }}><Byline register="micro" onDark /></div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(170px,1fr))', gap: 28, borderTop: '1px solid var(--slab-rule)', paddingTop: 28 }}>
          {columns.map((col, i) => (
            <div key={i}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '.18em', textTransform: 'uppercase', color: '#6E7A89', marginBottom: 14 }}>{col.title}</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: 14 }}>
                {col.links.map((l, j) => (
                  l.href ? <a key={j} href={l.href} style={{ color: '#B9C2CE' }}>{l.label}</a>
                         : <span key={j} style={{ color: '#B9C2CE' }}>{l.label}</span>
                ))}
              </div>
            </div>
          ))}
          <div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '.18em', textTransform: 'uppercase', color: '#6E7A89', marginBottom: 14 }}>Service area</div>
            <div style={{ fontSize: 14, color: '#B9C2CE', lineHeight: 2 }}>{areas.map((a, i) => <React.Fragment key={i}>{a}{i < areas.length - 1 && <br />}</React.Fragment>)}</div>
          </div>
          <div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '.18em', textTransform: 'uppercase', color: '#6E7A89', marginBottom: 14 }}>Contact</div>
            <div style={{ fontSize: 14, color: '#B9C2CE', lineHeight: 2 }}>{phone}<br />{city}<br />24/7 storm response</div>
          </div>
        </div>
        <div style={{ borderTop: '1px solid var(--slab-rule)', marginTop: 28, paddingTop: 18, display: 'flex', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap', fontFamily: 'var(--font-mono)', fontSize: 11, color: '#6E7A89' }}>
          <span>© {year} Meridian Generator &amp; Electric · Authorized Generac Dealer</span>
          <span style={{ color: '#566273' }}>Generac is a trademark of its owner</span>
        </div>
      </div>
    </footer>
  );
}
