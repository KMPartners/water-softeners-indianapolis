SiteHeader, Breadcrumb, SiteFooter, and MobileNav, the shared page chrome, stamped once per template.

```jsx
<SiteHeader navItems={nav} phone="(463) 283-5939" onMenu={() => setOpen(true)} />
<Breadcrumb items={[{label:'Home',href:'/'},{label:'Standby Generators',href:'/gen'},{label:'22 kW Install'}]} />
<MobileNav open={open} onClose={() => setOpen(false)} categories={cats} areas={areas} />
<SiteFooter columns={cols} phone="(463) 283-5939" />
```

Header/footer hold the logo lockup ONLY (no byline in the header; R1 micro byline in the footer). MobileNav is controlled via `open`; the drawer/overlay/bottom-bar behavior comes from mobile-chrome.css at ≤1024px. Breadcrumb's last item is the current page (unlinked).
