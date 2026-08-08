import React from 'react';

/**
 * Schema: injects one or more JSON-LD graph nodes into the document head as
 * <script type="application/ld+json">. Invisible (functional SEO), Core30 Rule 5.
 * Build nodes with the helpers in ./schema.js (buildLocalBusiness, buildService,
 * buildFaqPage). aggregateRating is omitted until real reviews exist.
 *
 * Usage:
 *   <Schema nodes={[buildService({...}), buildFaqPage(faqs)]} />
 */
export function Schema({ nodes = [] }) {
  const graph = Array.isArray(nodes) ? nodes : [nodes];
  return (
    <>
      {graph.map((n, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(n, null, 2) }} />
      ))}
    </>
  );
}
