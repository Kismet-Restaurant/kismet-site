import type { MetadataRoute } from 'next'
import { menu } from '@/lib/content'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.kismetvancouver.com'

export default function sitemap(): MetadataRoute.Sitemap {
  const updated = new Date(`${menu.updated}T12:00:00Z`)
  return [
    { url: `${siteUrl}/`, lastModified: updated, changeFrequency: 'weekly', priority: 1 },
    { url: `${siteUrl}/menus`, lastModified: updated, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${siteUrl}/private-dining`, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${siteUrl}/story`, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${siteUrl}/privacy`, changeFrequency: 'yearly', priority: 0.2 },
  ]
}
