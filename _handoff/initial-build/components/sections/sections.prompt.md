Mid-page content blocks that add depth while staying scannable. Each does one job; compose them between hero and lead form.

```jsx
<ProcessSteps />                       {/* assess → load calc → install → service */}
<SizingExplainer />                    {/* load-calc explainer + reference table */}
<WhyMeridian />                        {/* differentiator cards, amber top-border */}
<ComparisonTable />                    {/* air-cooled vs liquid; one recommended column */}
<CostIncluded />                       {/* fixed-bid what's-included, no invented price */}
<RelatedServices items={[...]} />      {/* Mirror-Link grid, Rule 3 */}
```

Recommended service-page order: Hero → TrustBar(strip) → ProcessSteps → SizingExplainer → SpecTable + Faq → WhyMeridian → ComparisonTable → CostIncluded → Testimonial → RelatedServices → LeadForm. All figures (sizes, cost, comparison claims) are SAFE RANGES / references inside `VERIFY` notes until the truth doc lands. Alternate backgrounds (`--bg` / `--bg2` / `--slab`) so sections read as distinct bands.
