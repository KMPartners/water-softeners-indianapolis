# Hero plate sources: licence and provenance

Three photographs, used as the background texture of every hero on the site.
Keep this file with the sources. If the client is ever asked where the imagery
came from, this is the answer, and it is the reason nobody has to go and find
out later.

## Licence

All three are from **Pexels**, under the **Pexels License**
(<https://www.pexels.com/license/>), verified 2026-10-29:

- Free to use for commercial and non-commercial work.
- **Attribution is not required** (so nothing on the site has to carry a credit
  line, and nothing breaks if a page is rebuilt without one).
- Modification is explicitly allowed, which is what makes the grayscale-and-grade
  pipeline in `scripts/build-hero-plates.mjs` legitimate.

The licence's four restrictions and how this site stays inside them:

| Restriction | Status here |
|---|---|
| Identifiable people may not be shown in a bad light | **No people appear in any of the three.** This was a selection criterion, not luck. See "Why no people" below. |
| Don't sell unaltered copies | Not sold; and every shipped plate is cropped, desaturated, graded and re-encoded. |
| Don't imply endorsement by people or brands | Nothing branded or human is depicted, so there is nobody to imply endorsement. |
| Don't use as a trade mark or business name | Used only as a background texture; the wordmark is type. |

## The files

| Plate | Pexels ID | Source page | Used by |
|---|---|---|---|
| `caustics` | 9866870 | <https://www.pexels.com/photo/9866870/> | Homepage hero |
| `surface` | 28011161 | <https://www.pexels.com/photo/28011161/> | Money-page heroes (`.page-hero`) |
| `ripple` | 12810804 | <https://www.pexels.com/photo/12810804/> | Supporting-guide heroes (`.sup-hero`) |

Legal pages carry **no** plate, deliberately. `LegalDoc.astro` is plain by design
and a Privacy Policy that has been dressed up reads as marketing.

## Why no people, and why this is a compliance decision

Every national competitor (Culligan, Kinetico, SpringWell, Aquasana, Leaf Home)
runs a photograph of a technician or a family in the hero. That option is closed
here, and not for aesthetic reasons:

A stock photograph of a uniformed technician on *this* site asserts that the
business has uniformed technicians, in the same way a badge asserts a
certification. `site.config.json → compliance.claimGates` holds every such claim
at `false` until the client produces proof. A model in a branded shirt would walk
straight through that gate in an image, where no lint rule can see it.

**CONSEQUENCE:** if the client later supplies real photographs of their own crew,
vans and installs, those should replace these plates. Until then, abstract water
is the only honest subject: it illustrates the topic without making a claim
about the company. Do not swap in stock people later "just as a placeholder";
a placeholder claim is still a claim once it is published.

## Regenerating

```bash
node scripts/build-hero-plates.mjs
```

Reads this directory, writes `public/img/hero/`. The outputs are committed, so a
normal `npm run build` never runs this and never needs `sharp`.
