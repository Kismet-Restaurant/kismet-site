// Structured data for search engines and AI assistants (see src/lib/schema.ts).
// "<" is escaped so nothing in a content file can close the script tag early.
export function JsonLd({ data }: { data: object }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, '\\u003c') }} />
}
