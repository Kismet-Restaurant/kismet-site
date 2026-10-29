import type { MetadataRoute } from 'next'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.kismetvancouver.com'

// Every search engine and AI assistant is welcome to read the site, so Kismet can show up in Google, Bing,
// ChatGPT, Claude, Perplexity and the rest. The Links and Thanks pages stay out of results with a noindex tag
// on the page itself; crawlers have to be allowed in to see that tag, so they aren't blocked here.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: '*', allow: '/', disallow: ['/api/'] },
    sitemap: `${siteUrl}/sitemap.xml`,
  }
}
