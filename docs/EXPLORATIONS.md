# Explorations — speculative integrations (not scheduled)

Ideas worth a look *someday*. Unlike [`ROADMAP.md`](ROADMAP.md) (concrete deferred
engine work), nothing here is committed or scoped — these are pointers for future
evaluation, each with an honest note on fit. Add one when it's worth remembering
but not yet worth scheduling.

---

## 21st.dev — UI component marketplace + AI generation

- **Link:** https://21st.dev (pricing: https://21st.dev/pricing)
- **What it is:** a marketplace of **React / Tailwind** UI components, themes, and
  templates, plus AI code generation ("Magic MCP" — multi-model UI generation from
  a prompt, with a live React sandbox). Components are consumed via copy-paste, a
  CLI, or the **MCP** protocol. Tagline: "keep the web free of AI slop."
- **Pricing (as of 2026-08, subject to change):** Builder ~$6/mo (marketplace +
  MCP component retrieval, no AI credits) · Builder + AI ~$15/mo (adds ~500–2,000
  monthly AI credits, multi-model generation) · Team ~$7.50/seat/mo (shared
  collections, admin controls, optional per-seat credits).
- **Why it could help core30-starter:** faster access to polished UI section ideas,
  and Magic MCP could speed up building the "shared trust / local / CTA section
  library" the feedback log floats — or assist during the Step-1 design phase.
- **⚠ Fit tension — read before adopting:** core30-starter is **Astro + a
  tokens-only CSS design system**, *not* React/Tailwind. 21st.dev components are
  React/Tailwind, so using them means (a) adding a React-island runtime
  (`@astrojs/react`) for any interactive bits, and (b) reconciling Tailwind utility
  classes with the engine's semantic token contract (`--accent`, `--surface`, the
  `--on-slab*` scale, …). The charter also deliberately keeps layout/structure in
  the engine (Trinity, schema, mirror-linking, the lint) and forbids bespoke
  per-page layouts — so a 21st.dev component would be a **skin / section source**
  adapted onto the token system, never a wholesale layout.
- **Most plausible use:** mine it for *design ideas* and one-off marketing sections
  (re-expressed in tokens), or try **Magic MCP during design**, rather than
  importing components verbatim. Evaluate the free/low tier MCP retrieval before any
  paid plan; confirm current pricing at the link above.

---

*Speculative — not a commitment. Promote an item to `ROADMAP.md` only once it has a
concrete, scoped plan.*
