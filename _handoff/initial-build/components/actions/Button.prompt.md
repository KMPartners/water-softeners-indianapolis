Primary action atom: amber CTA, ink outline, ghost link, and mono "call" chip. Use one primary per view.

```jsx
<Button variant="primary" size="lg" href="#contact" iconRight="→">Get a fixed-bid quote</Button>
<Button variant="secondary">View sizing guide</Button>
<Button variant="call" href="tel:#">(463) 283-5939</Button>
```

Variants: `primary` (amber, `--accent-ink` text), `secondary` (1px `--ink` outline), `ghost` (amber-deep text), `call` (mono chip with signal dot). Sizes `sm|md|lg`. Hover darkens amber to `--accent-deep`; disabled drops opacity to .45.
