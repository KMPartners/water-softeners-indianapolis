# Prompt — design the brand skin (Step 1)

Copy everything in the fenced block below into Claude (claude.ai for a visual
mockup artifact, or Claude Code). Fill the four `{{...}}` inputs first. Iterate on
the result until the palette and type feel right; the thing you carry to Step 2 is
the **Skin Spec** block Claude produces at the end.

> **What this does and doesn't do.** It designs a *brand skin* — color, type,
> tone — that maps onto a fixed, Core30-proven layout system. It deliberately does
> **not** design a new layout: the site's structure (hero, dark feature slabs,
> cards, spec tables, the numbered content spine, footer) is the engine's and is
> what passes the linter. You're skinning that structure, not replacing it.

---

```text
You are a brand and UI designer. I'm building a local-service website on a fixed,
proven layout system (a "Core30" static-site engine). Your job is NOT to invent a
new layout — it is to design the BRAND SKIN that will be applied to the engine's
existing structure via CSS design tokens.

BUSINESS
- Name / working name: {{BUSINESS_NAME}}
- Industry: {{INDUSTRY}}
- City / region: {{CITY_REGION}}
- Personality in 3–5 words: {{TONE_WORDS}}   (e.g. "trustworthy, local, no-nonsense")

THE ENGINE'S STRUCTURE (design within this — do not redesign it)
- A hero with a headline, a lede sentence, a phone CTA + a primary button, and a
  small "at a glance" spec card.
- Full-width sections that alternate light and a dark "feature slab".
- A numbered content spine (01, 02, 03…) with a side-label and body per section.
- Cards (service/listing), spec tables, FAQ accordions, an external-authority
  link, a final call-to-action band, and a footer.
- One accent color used sparingly for CTAs and emphasis — never neon, never
  decorative. High contrast, accessible, honest (no fake glows).

THE TOKEN CONTRACT (your output must map cleanly onto these)
The engine reskins by swapping a small base palette that everything inherits:
  - BRAND color — one primary color, used for dark slabs, headings, the footer.
    Expressed as a 6-step scale from deepest to muted.
  - ACCENT color — one action color, for CTAs / emphasis. A 5-step scale.
  - NEUTRALS — a warm-or-cool "paper" surface family and an "ink" text family.
  - STATUS — success (green), pending, sold/muted, alert (red). Usually standard;
    only change if the brand demands it.
  - TYPE — three Google Fonts: a DISPLAY face (headlines), a BODY face
    (paragraphs/UI), and a MONO face (labels, spec numbers).

WHAT TO PRODUCE
1. A short rationale (2–3 sentences) for the direction, tied to the industry and
   tone — why this color and type read as {{TONE_WORDS}} for this business.
2. If you can render visuals: a one-screen mockup of the hero + one dark slab +
   a card row, using the palette and type, so I can react to it. Keep the LAYOUT
   matching the engine structure above; only the skin is yours.
3. Accessibility check: confirm body text on paper and text on the dark slab both
   meet WCAG AA (≥ 4.5:1), and that accent-on-its-ink pairing is legible.
4. Finally, output this exact SKIN SPEC block, filled in — this is what I feed to
   the next step:

--- SKIN SPEC ---
brand_primary_hex:   #______   (the main brand color; mid-dark)
accent_hex:          #______   (the CTA/action color)
neutral_temperature: warm | cool | neutral
paper_hex:           #______   (the light page surface)
ink_hex:             #______   (primary text color)
status_overrides:    none | { go:#__, alert:#__, ... }
font_display:        <Google Font name>
font_body:           <Google Font name>
font_mono:           <Google Font name>
feel_notes:          one line — e.g. "sharp corners, low-blur shadows, generous space"
--- END SKIN SPEC ---

Ask me at most 2 clarifying questions ONLY if you genuinely can't proceed;
otherwise make confident choices and show me the result.
```

---

**After you run it:** if the mockup isn't right, tell Claude what to change
("warmer", "the accent competes with the brand", "try a serif display") and
re-run. When you're happy, copy the **SKIN SPEC** block and go to
[`design-to-tokens.md`](design-to-tokens.md).
