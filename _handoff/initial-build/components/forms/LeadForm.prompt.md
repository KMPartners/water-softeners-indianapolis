The GoHighLevel quote form, styled as the dark `#contact` section.

```jsx
<LeadForm action="https://your-ghl-webhook-url" phone="(463) 283-5939" />
```

Field `name` attributes map 1:1 to GHL: `full_name`, `phone`, `email`, `street_address`, `city`, `service_needed`, `message`. Wire `action` to your GHL webhook POST URL, or replace the `<form>` with the GHL hosted iframe (see docs/integration-notes.md). Inputs use the shared `.ks-field` style (amber focus ring).
