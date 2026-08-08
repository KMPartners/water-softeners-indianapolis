/**
 * Meridian chrome behavior — the ONLY chrome JS on the site (build-spec §2.1).
 * Ported from the locked archetype's componentDidMount. Three jobs:
 *   1. Mobile drawer: open/close via hamburger, close button, overlay tap, Esc,
 *      and any link click; toggles aria-expanded/aria-hidden/.open + body
 *      scroll-lock; moves focus into the drawer on open, back to the burger on close.
 *   2. ONE passive scroll listener at 480px toggling `.show` on BOTH the scroll
 *      mini-menu (desktop) and the mobile bottom bar. Do not add a second listener.
 *   3. Keyboard-hide: while the on-screen keyboard is up, set body.keyboard-open
 *      so the bottom bar doesn't sit over the keyboard (engine.css hides it).
 */
(function () {
  const q = (s) => document.querySelector(s);
  const burger = q('.hamburger');
  const nav = q('#mobile-nav');
  const overlay = q('#mobile-nav-overlay');
  const closeBtn = q('.mobile-nav-close');
  const bar = q('.mobile-bottom-bar');
  const mini = q('.scroll-mini');

  /* 1 · drawer */
  if (nav && overlay && burger) {
    const open = () => {
      nav.classList.add('open');
      overlay.classList.add('open');
      burger.setAttribute('aria-expanded', 'true');
      nav.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
      const f = nav.querySelector('a, button');
      if (f) setTimeout(() => f.focus(), 60);
    };
    const close = () => {
      nav.classList.remove('open');
      overlay.classList.remove('open');
      burger.setAttribute('aria-expanded', 'false');
      nav.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    };
    const toggle = () => (nav.classList.contains('open') ? close() : open());

    burger.addEventListener('click', toggle);
    overlay.addEventListener('click', close);
    if (closeBtn) closeBtn.addEventListener('click', () => { close(); burger.focus(); });
    nav.querySelectorAll('a').forEach((a) => a.addEventListener('click', close));
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && nav.classList.contains('open')) { close(); burger.focus(); }
    });
  }

  /* 2 · one passive scroll listener → mini-menu + bottom bar at 480px */
  if (bar || mini) {
    const onScroll = () => {
      const y = window.scrollY || document.documentElement.scrollTop || 0;
      const show = y > 480;
      if (bar) bar.classList.toggle('show', show);
      if (mini) mini.classList.toggle('show', show);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* 3 · keyboard-hide (visualViewport is the authoritative signal on iOS) */
  if (bar && window.visualViewport) {
    const vv = window.visualViewport;
    let baseline = vv.height;
    const THRESHOLD = 150;
    const check = () => {
      if (vv.height > baseline) baseline = vv.height;
      document.body.classList.toggle('keyboard-open', baseline - vv.height > THRESHOLD);
    };
    vv.addEventListener('resize', check);
    window.addEventListener('orientationchange', () => {
      setTimeout(() => { baseline = vv.height; check(); }, 300);
    });
    check();
  }
})();
