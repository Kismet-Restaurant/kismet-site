// Restaurant details in the format search engines read (schema.org JSON-LD), built from the content files.
import { hours, site, tel } from './content'
import { groupHours } from './hours'

const SCHEMA_DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

export function restaurantJsonLd(siteUrl: string) {
  const today = new Date().toISOString().slice(0, 10)
  const upcomingClosures = hours.closedDates.filter((d) => d >= today)
  return {
    '@context': 'https://schema.org',
    '@type': 'Restaurant',
    name: site.name,
    url: siteUrl,
    image: `${siteUrl}/opengraph-image.jpg`,
    description: site.description,
    telephone: tel.replace('tel:', ''),
    email: site.email,
    priceRange: '$$$',
    acceptsReservations: site.links.resy,
    hasMenu: `${siteUrl}/menus`,
    address: {
      '@type': 'PostalAddress',
      streetAddress: site.address.street,
      addressLocality: site.address.city,
      addressRegion: site.address.state,
      postalCode: site.address.zip,
      addressCountry: 'US',
    },
    geo: { '@type': 'GeoCoordinates', latitude: site.geo.latitude, longitude: site.geo.longitude },
    openingHoursSpecification: groupHours(hours.week)
      .filter((g) => g.open)
      .map((g) => ({
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: g.days.map((d) => `https://schema.org/${SCHEMA_DAYS[d]}`),
        opens: g.firstTable,
        // Closes at the last seating, by choice (Oct 2026), to match Google Business Profile: the room stays
        // open later, but listing 9:30 or 10 would bring in walk-ins after the last table is seated.
        closes: g.lastTable,
      })),
    // One-off closures (holidays and so on), in the form Google reads: open and close both at midnight.
    ...(upcomingClosures.length
      ? {
          specialOpeningHoursSpecification: upcomingClosures.map((d) => ({
            '@type': 'OpeningHoursSpecification',
            validFrom: d,
            validThrough: d,
            opens: '00:00',
            closes: '00:00',
          })),
        }
      : {}),
    sameAs: [site.links.instagram, site.links.facebook, site.links.resy],
  }
}
