import React from 'react';

/**
 * LeadForm: the GoHighLevel quote form inside the dark #contact section.
 * Field `name` attributes map 1:1 to GHL: full_name, phone, email,
 * street_address, city, service_needed, message. Set `action` to your GHL
 * webhook POST URL (or swap the <form> for the GHL hosted iframe).
 */
export function LeadForm({
  eyebrow = 'Get your fixed-bid quote',
  heading = 'Tell us about your home.',
  lede = "Send the basics and we'll set up a free on-site assessment, run the load calc, and come back with a transparent, fixed bid, no obligation.",
  phone = '(463) 283-5939',
  phoneHref = 'tel:#',
  action = '#',
  onSubmit,
  cities = ['Fishers', 'Noblesville', 'Carmel', 'Westfield', 'Pendleton', 'Anderson', 'Other'],
  services = [
    'New whole-house generator install',
    'Take-over service / repair (existing unit)',
    '"Bought a house with a generator" inspection',
    'Transfer switch or electrical',
    'Commercial / light-commercial',
    "Not sure yet, help me figure it out",
  ],
}) {
  const lbl = { display: 'block', fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '.14em', textTransform: 'uppercase', color: 'var(--ink3)', marginBottom: 7 };
  return (
    <section id="contact" style={{ background: 'var(--slab)' }}>
      <div style={{ maxWidth: 'var(--container)', margin: '0 auto', padding: 'clamp(44px,6vw,80px) var(--container-pad)', display: 'grid', gridTemplateColumns: '1fr 1.05fr', gap: 'clamp(32px,4vw,56px)', alignItems: 'start' }}>
        <div style={{ color: '#fff' }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '.24em', textTransform: 'uppercase', color: 'var(--accent)', marginBottom: 18 }}>{eyebrow}</div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'clamp(28px,4vw,46px)', lineHeight: 1.02, letterSpacing: '-.02em', margin: '0 0 18px', maxWidth: '16ch' }}>{heading}</h2>
          <p style={{ fontSize: 'var(--fs-lede)', color: '#B9C2CE', lineHeight: 1.6, margin: '0 0 28px', maxWidth: '46ch' }}>{lede}</p>
          <div style={{ borderTop: '1px solid var(--slab-rule)', paddingTop: 22 }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '.2em', textTransform: 'uppercase', color: '#6E7A89', marginBottom: 10 }}>Prefer to call?</div>
            <a href={phoneHref} style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'clamp(22px,2.4vw,30px)', color: '#fff', display: 'inline-flex', alignItems: 'center', gap: 12 }}>
              <span style={{ width: 9, height: 9, borderRadius: '50%', background: 'var(--signal)' }} aria-hidden="true" />{phone}
            </a>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: '#8A95A4', marginTop: 8 }}>Mon–Fri · 24/7 storm response</div>
          </div>
        </div>
        <div style={{ background: '#fff', borderRadius: 'var(--radius)', padding: 'clamp(24px,3vw,36px)' }}>
          <form action={action} method="post" onSubmit={onSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <label htmlFor="lf-name" style={lbl}>Full name</label>
              <input id="lf-name" name="full_name" type="text" required autoComplete="name" placeholder="Jordan Miller" className="ks-field" />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div><label htmlFor="lf-phone" style={lbl}>Phone</label><input id="lf-phone" name="phone" type="tel" required autoComplete="tel" placeholder="(317) 555-0142" className="ks-field" /></div>
              <div><label htmlFor="lf-email" style={lbl}>Email</label><input id="lf-email" name="email" type="email" required autoComplete="email" placeholder="you@email.com" className="ks-field" /></div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 16 }}>
              <div><label htmlFor="lf-addr" style={lbl}>Street address</label><input id="lf-addr" name="street_address" type="text" autoComplete="street-address" placeholder="123 Maple Dr" className="ks-field" /></div>
              <div><label htmlFor="lf-city" style={lbl}>City</label>
                <select id="lf-city" name="city" className="ks-field" defaultValue="">
                  <option value="" disabled>Select…</option>
                  {cities.map((c, i) => <option key={i}>{c}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label htmlFor="lf-need" style={lbl}>What do you need?</label>
              <select id="lf-need" name="service_needed" className="ks-field" defaultValue="">
                <option value="" disabled>Select…</option>
                {services.map((s, i) => <option key={i}>{s}</option>)}
              </select>
            </div>
            <div>
              <label htmlFor="lf-msg" style={lbl}>Anything else? <span style={{ textTransform: 'none', letterSpacing: 0, color: 'var(--ink3)' }}>(optional)</span></label>
              <textarea id="lf-msg" name="message" rows={3} placeholder="Outage history, panel size, HOA notes…" className="ks-field" style={{ resize: 'vertical' }} />
            </div>
            <button type="submit" style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 15, background: 'var(--accent)', color: 'var(--accent-ink)', border: 'none', borderRadius: 'var(--radius)', padding: '16px 22px', cursor: 'pointer' }}>Request my fixed-bid quote →</button>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--ink3)', lineHeight: 1.5, margin: 0, textAlign: 'center' }}>No spam. We use your details only to prepare your quote.</p>
          </form>
        </div>
      </div>
    </section>
  );
}
