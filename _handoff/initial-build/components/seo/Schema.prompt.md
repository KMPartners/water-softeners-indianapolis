JSON-LD structured data (Core30 Rule 5). Emits `<script type="application/ld+json">` into the page head. Build nodes with the helpers in `schema.js`.

```jsx
import { Schema } from '../seo/Schema.jsx';
import { buildService, buildFaqPage } from '../seo/schema.js';

<Schema nodes={[
  buildService({ serviceType: '22 kW Generator Installation', description: 'A 22 kW Generac Guardian…', city: 'Fishers' }),
  buildFaqPage(faqItems),
]} />
```

Rules baked in:
- Homepage = `buildLocalBusiness()` (Electrician). Category + Service = `buildService()` with serviceType, provider, areaServed, offers.
- The `provider` block is byte-identical across pages; `provider["@type"] = "Electrician"`.
- **aggregateRating is omitted** until you pass a real `{ ratingValue, reviewCount }` (new IASD launches at zero reviews, never fabricate).
- NAP, phone, url, price are `VERIFY` placeholders until the truth doc lands.
- One external authority per page (NEC 702 / NFPA 70) is referenced in `knowsAbout`.
