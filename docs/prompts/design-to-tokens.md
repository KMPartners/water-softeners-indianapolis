# Prompt — turn the skin into tokens (Step 2)

Paste the block below into Claude Code **from inside the project** (so it can read
the current token files and write the new ones). Paste your **SKIN SPEC** from
Step 1 where marked. It expands your two seed colors into the full base scales the
engine expects and writes valid `colors.css` + `fonts.css`.

> Prefer to do it by hand? The rules the prompt follows are written out below the
> block — you only ever touch the **base scale** hexes and the font `@import`; the
> semantic aliases underneath already map to them and must not change.

---

```text
You are working in the core30-starter repo. Regenerate the two brand-token files
from the SKIN SPEC below, following the engine's token contract EXACTLY. Do not
touch any other file. Do not rename or remove any CSS variable — only change hex
values, and the font @import + family names.

SKIN SPEC:
<paste your SKIN SPEC block from Step 1 here>

RULES
1. Read src/styles/tokens/colors.css first. It has a base-scale section
   (--navy-*, --amber-*, --paper*, --ink*, status) and a SEMANTIC ALIASES section
   (--brand, --accent, --surface, --text, --border, …) that reference the base.
   Keep every variable NAME and keep the aliases pointing where they point. Only
   the base-scale hex values change.

2. From brand_primary_hex, generate a 6-step brand scale replacing --navy-900
   (deepest) … --navy-400 (muted-on-dark). brand_primary_hex should land at the
   PRIMARY step (--navy-700). Keep even perceptual spacing (work in OKLCH),
   darker→lighter, so dark slabs and muted-on-dark text both read well.

3. From accent_hex, generate a 5-step accent scale replacing --amber-600
   (pressed) … --amber-100 (soft wash). accent_hex lands at --amber-500. Ensure
   --text-on-accent (currently the deepest brand step) meets AA on the accent.

4. Set --paper* from paper_hex (page / raised / deeper bands) and --ink* from
   ink_hex (primary / body / muted), honoring neutral_temperature. --white stays
   white unless the spec says otherwise.

5. Status colors (--go, --pending, --sold, --alert, --star): keep the engine's
   defaults unless status_overrides says otherwise. --star should equal the
   accent.

6. Update the header comment to name the new palette (replace "Steel & Brass").

7. Regenerate src/styles/tokens/fonts.css: one Google Fonts @import for
   font_display + font_body + font_mono (include the weights the engine uses:
   display 400–900, body 400/500/600/700 + italics, mono 400/500/600). Update the
   header comment to name the three families.

8. VERIFY before finishing:
   - `npm run build` is green and `core30-lint` is clean.
   - No variable was renamed or dropped (diff the variable NAME list against the
     original — it must be identical).
   - Print the contrast ratios for: --text on --paper, --text-on-slab on
     --surface-slab, and --text-on-accent on --accent. All ≥ 4.5:1.

Then show me the new colors.css and a one-line summary of the palette.
```

---

## Doing it by hand

You only edit the **base scale** at the top of
[`colors.css`](../../src/styles/tokens/colors.css) and the `@import` in
[`fonts.css`](../../src/styles/tokens/fonts.css). The semantic aliases
(`--brand`, `--accent`, `--surface`, `--text`, …) already reference the base
scale, so every component reskins automatically — that is the whole point of the
two-layer system. Do **not** rewire the aliases.

- **Brand** → `--navy-900 … --navy-400` (deepest to muted). Your main color sits
  at `--navy-700`.
- **Accent** → `--amber-600 … --amber-100`. Your CTA color sits at `--amber-500`.
- **Neutrals** → `--paper*` (surfaces) and `--ink*` (text).
- **Status** → keep `--go / --pending / --sold / --alert` unless the brand needs
  otherwise; `--star` = accent.
- **Fonts** → the one `@import` line in `fonts.css`.

Then `npm run build`. If it's green and lint is clean, the reskin is done — check
the built pages in `dist/` render with the new brand.

> The variable names are a contract the components depend on. Changing a *value*
> reskins the site; changing a *name* breaks it. Only ever change values.
