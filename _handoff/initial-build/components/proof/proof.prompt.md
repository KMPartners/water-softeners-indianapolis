Honest social proof for a zero-review launch. Per CLAUDE.md we never fabricate ratings.

```jsx
// Trust claims + authority marks (below hero, quiet + credible)
<TrustBar variant="strip" />
// Lean inline version inside a dark hero
<TrustBar variant="compact" onDark />

// Reviews: empty renders the trust empty state; pass items once real reviews exist
<Testimonial items={[]} />
<Testimonial items={[{ quote: '…', name: 'J. Miller', location: 'Fishers', detail: '22 kW install' }]} />
```

**TrustBar** carries claims (authorized dealer, warranty-compliant, named local-utility service area) and optional authority marks (Generac, NFPA) as labeled placeholder tiles, swap in official logo assets per trademark rules (VERIFY). **Testimonial**'s empty state shows the authorized/warranty-compliant claim; while it's empty, callers must OMIT `aggregateRating` from schema. Real reviews render as amber-top-border cards.
