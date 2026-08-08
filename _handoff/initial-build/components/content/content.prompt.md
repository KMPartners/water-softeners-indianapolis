Content blocks: PageHero, SpecTable, Faq, Byline, FinalCta, ImageSlot.

```jsx
<PageHero eyebrow="Whole-Home Standby" title="22 kW Generator Installation" city="Fishers, IN"
  lede={<><strong>A 22 kW Guardian restores your whole home in seconds.</strong> Factory-authorized and warranty-compliant.</>}
  specs={[{label:'Output',value:'22 kW air-cooled'},{label:'Transfer switch',value:'200A ATS'}]} />
<SpecTable rows={[{label:'Rated output',value:'22 kW @ natural gas',strong:true}]} />
<Faq items={[{q:'How long does it take?',a:'One to two days.'}]} />
<Byline register="spoken" />
<FinalCta primaryCta={{label:'Schedule a free assessment',href:'#contact'}} />
```

PageHero and FinalCta own their dark-slab treatment. SpecTable's `strong` accents the value. Byline `register` picks the treatment; set `onDark` on slab surfaces. ImageSlot is a placeholder for real photography only.
