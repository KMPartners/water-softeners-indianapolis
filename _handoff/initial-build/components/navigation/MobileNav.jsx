import React from 'react';
import { Byline } from '../content/Byline.jsx';

/**
 * MobileNav: Variant B vanilla-style side drawer (controlled). Renders the
 * overlay + drawer using mobile-chrome.css classes: status eyebrow, numbered
 * secondary categories, quick links, service-area pills, sticky call CTA.
 * Controlled via `open`; call `onClose` from the overlay / close button.
 */
export function MobileNav({
  open = false,
  onClose,
  categories = [],
  quickLinks = [],
  areas = [],
  phone = '(463) 283-5939',
  phoneHref = 'tel:#',
  logoHref = '#',
}) {
  return (
    <>
      <div className={'mobile-nav-overlay' + (open ? ' open' : '')} onClick={onClose} />
      <nav id="mobile-nav" className={'mobile-nav' + (open ? ' open' : '')} aria-label="Mobile navigation" aria-hidden={!open}>
        <div className="mobile-nav-header">
          <a href={logoHref} style={{ display: 'flex', alignItems: 'center', gap: 11 }}>
            <span className="logo-mark logo-mark--invert logo-mark--34" aria-hidden="true"></span>
            <span style={{ lineHeight: 1 }}>
              <span style={{ display: 'block', fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 16, color: '#fff' }}>MER<span className="mrd">I</span>DIAN</span>
              <span style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: 8, letterSpacing: '.22em', color: 'var(--accent)', marginTop: 5 }}>GENERATOR &amp; ELECTRIC</span>
            </span>
          </a>
          <button className="mobile-nav-close" aria-label="Close menu" onClick={onClose}>✕</button>
        </div>
        <Byline register="micro" onDark />
        <div className="mobile-menu-eyebrow"><span className="dot"></span><span>Open · Mon–Fri · 24/7 Storm Response</span></div>
        <ul className="mobile-menu-primary">
          {categories.map((c, i) => (
            <li key={i}><a href={c.href}><span className="mm-num">{c.num}</span><span className="mm-label">{c.label}</span><span className="mm-meta">{c.meta}</span></a></li>
          ))}
        </ul>
        {quickLinks.length > 0 && (
          <div className="mobile-menu-section">
            <div className="mm-section-label">Quick links</div>
            <div className="mobile-menu-secondary">
              {quickLinks.map((q, i) => <a key={i} href={q.href}>{q.label}</a>)}
            </div>
          </div>
        )}
        {areas.length > 0 && (
          <div className="mobile-menu-section">
            <div className="mm-section-label">Service area</div>
            <div className="mobile-menu-areas">{areas.map((a, i) => <span key={i} className="mm-area">{a}</span>)}</div>
          </div>
        )}
        <div className="mobile-menu-cta">
          <a href={phoneHref} className="mm-call"><span className="mm-call-label">Tap to call · 7 days</span><span className="mm-call-number">{phone}</span></a>
          <div className="mm-license">Authorized Generac Dealer · Licensed &amp; insured · Free assessments</div>
        </div>
      </nav>
    </>
  );
}
