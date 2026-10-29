import type { MetadataRoute } from 'next'
import { menu } from '@/lib/content'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.kismetvancouver.com'
const photo = (p: string) => `${siteUrl}${p}`

// The main photos on each page are listed too, so they can turn up in Google Images and image results.
export default function sitemap(): MetadataRoute.Sitemap {
  const updated = new Date(`${menu.updated}T12:00:00Z`)
  return [
    {
      url: `${siteUrl}/`,
      lastModified: updated,
      changeFrequency: 'weekly',
      priority: 1,
      images: [
        '/photos/table-lamp.jpg',
        '/photos/dining-room.jpg',
        '/photos/bar.jpg',
        menu.photos.first.image,
        menu.photos.second.image,
        menu.photos.dessert.image,
      ].map(photo),
    },
    {
      url: `${siteUrl}/menus`,
      lastModified: updated,
      changeFrequency: 'weekly',
      priority: 0.9,
      images: [photo(menu.photos.dessert.image)],
    },
    {
      url: `${siteUrl}/private-dining`,
      changeFrequency: 'monthly',
      priority: 0.7,
      images: [photo('/photos/table-lamps.jpg')],
    },
    {
      url: `${siteUrl}/story`,
      changeFrequency: 'monthly',
      priority: 0.6,
      images: [photo('/photos/eric-portrait.jpg'), photo('/photos/patio.jpg')],
    },
    { url: `${siteUrl}/privacy`, changeFrequency: 'yearly', priority: 0.2 },
  ]
}
