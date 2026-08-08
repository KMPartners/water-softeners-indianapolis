import React from 'react';

/**
 * SiteHeader: shared chrome on every page. Full-bleed dark utility strip +
 * white main bar (logo + desktop nav + phone CTA), content held in a 1140px
 * column. Includes the hamburger button (shown ≤1024px via mobile-chrome.css);
 * wire its onClick to open <MobileNav/>.
 */
export function SiteHeader({
  navItems = [],
  phone = '(463) 283-5939',
  phoneHref = 'tel:#',
  logoHref = '#',
  utilityLeft = 'Authorized Generac Dealer · Warranty-Compliant Service',
  utilityRight = 'Fishers · Noblesville · Hamilton & Madison Co.',
  onMenu,
}) {
  const wrap = { maxWidth: 'var(--container)', margin: '0 auto', padding: '0 var(--container-pad)' };
  return (
    <header>
      <div style={{ background: 'var(--slab)', color: '#fff' }}>
        <div style={{ ...wrap, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16, padding: '9px var(--container-pad)', flexWrap: 'wrap' }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10.5, letterSpacing: '.14em', textTransform: 'uppercase', color: 'var(--accent)' }}>{utilityLeft}</span>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10.5, letterSpacing: '.1em', color: '#9BA6B4' }}>{utilityRight}</span>
        </div>
      </div>
      <div style={{ background: '#fff', borderBottom: '1px solid var(--rule)' }}>
        <div style={{ ...wrap, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 20, padding: '14px var(--container-pad)', flexWrap: 'wrap' }}>
          <button className="hamburger" aria-label="Open menu" aria-expanded="false" aria-controls="mobile-nav" onClick={onMenu}>
            <span></span><span></span><span></span><span className="hamburger-label">Menu</span>
          </button>
          <a href={logoHref} style={{ display: 'flex', alignItems: 'center', gap: 13 }}>
            <span className="logo-mark" aria-hidden="true"></span>
            <span style={{ lineHeight: 1 }}>
              <span style={{ display: 'block', fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 18, letterSpacing: '.005em', color: 'var(--ink)' }}>MER<span className="mrd">I</span>DIAN</span>
              <span style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '.22em', color: 'var(--ink2)', marginTop: 5 }}>GENERATOR &amp; ELECTRIC</span>
            </span>
          </a>
          <nav className="desktop-nav" aria-label="Primary">
            {navItems.map((it, i) => (
              <a key={i} href={it.href} style={{ fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: 14, color: 'var(--ink)' }}>{it.label}</a>
            ))}
            <a href={phoneHref} style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 13, background: 'var(--accent)', color: 'var(--accent-ink)', padding: '11px 18px', borderRadius: 'var(--radius)' }}>{phone}</a>
          </nav>
        </div>
      </div>
    </header>
  );
}
