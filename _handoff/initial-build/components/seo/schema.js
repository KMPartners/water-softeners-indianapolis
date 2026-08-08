/* ============================================================================
   Meridian · JSON-LD schema builders (Core30 Rule 5)
   Plain business logic (no JSX). Rules from CLAUDE.md:
   - homepage      -> LocalBusiness
   - category/svc  -> Service (serviceType, provider, areaServed, offers)
   - FAQ           -> FAQPage
   - provider block is BYTE-IDENTICAL across pages; provider["@type"] = Electrician
   - New IASD launches at ZERO reviews -> OMIT aggregateRating until real reviews
     exist (never fabricate). Pass a real { ratingValue, reviewCount } to opt in.
   - NAP / phone / url are VERIFY placeholders until the truth doc lands.
   ============================================================================ */

// NAP is REAL as of the truth doc. Keep byte-for-byte identical to the GBP listing.
// Still outstanding: url (live domain), postal lat/lng, license #.
export const NAP = {
  name: 'Meridian Generator & Electric',
  telephone: '+1-463-283-5939',
  url: 'https://example.com',
  streetAddress: '12514 Reynolds Dr Ste. B',
  city: 'Fishers',
  region: 'IN',
  postalCode: '46038',
  country: 'US',
  latitude: null,  // VERIFY
  longitude: null, // VERIFY
};

export const AREA_SERVED = ['Fishers', 'Noblesville', 'Carmel', 'Westfield', 'Pendleton', 'Anderson'];

// Byte-identical provider block reused across every Service page.
export function provider() {
  return {
    '@type': 'Electrician',
    name: NAP.name,
    telephone: NAP.telephone,
    url: NAP.url,
    areaServed: AREA_SERVED.map((c) => ({ '@type': 'City', name: c })),
  };
}

export function buildLocalBusiness({ rating } = {}) {
  const node = {
    '@context': 'https://schema.org',
    '@type': 'Electrician',
    name: NAP.name,
    telephone: NAP.telephone,
    url: NAP.url,
    address: {
      '@type': 'PostalAddress',
      streetAddress: NAP.streetAddress,
      addressLocality: NAP.city,
      addressRegion: NAP.region,
      postalCode: NAP.postalCode,
      addressCountry: NAP.country,
    },
    areaServed: AREA_SERVED.map((c) => ({ '@type': 'City', name: c })),
    brand: { '@type': 'Brand', name: 'Generac' },
    knowsAbout: ['Standby generators', 'Automatic transfer switches', 'NEC 702', 'Generac installation'],
  };
  // Only attach aggregateRating when a REAL rating is supplied.
  if (rating && rating.reviewCount > 0) {
    node.aggregateRating = {
      '@type': 'AggregateRating',
      ratingValue: rating.ratingValue,
      reviewCount: rating.reviewCount,
    };
  }
  return node;
}

export function buildService({ serviceType, name, description, city = 'Fishers', price, rating } = {}) {
  const node = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    serviceType,
    name: name || serviceType,
    description,
    provider: provider(),
    areaServed: { '@type': 'City', name: city },
  };
  node.offers = {
    '@type': 'Offer',
    priceCurrency: 'USD',
    // VERIFY: fixed-bid price range from truth doc. No invented number ships.
    ...(price ? { price: String(price) } : { priceSpecification: { '@type': 'PriceSpecification', priceCurrency: 'USD' } }),
    availability: 'https://schema.org/InStock',
    seller: { '@type': 'Electrician', name: NAP.name },
  };
  if (rating && rating.reviewCount > 0) {
    node.aggregateRating = { '@type': 'AggregateRating', ratingValue: rating.ratingValue, reviewCount: rating.reviewCount };
  }
  return node;
}

export function buildFaqPage(items = []) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((it) => ({
      '@type': 'Question',
      name: typeof it.q === 'string' ? it.q : it.question,
      acceptedAnswer: { '@type': 'Answer', text: typeof it.a === 'string' ? it.a : it.answer },
    })),
  };
}
