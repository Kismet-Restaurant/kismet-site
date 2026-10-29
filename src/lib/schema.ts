// Restaurant details in the format search engines and AI assistants read (schema.org JSON-LD), built from the
// content files, so a change in Pages CMS reaches Google the next time the site builds.
//
// Every main page carries the same Restaurant under one @id, so a crawler that reads a single page still gets the
// address, hours, phone and booking link. The Menus page adds the menu and drinks; Our story adds the people.
// Test a page at https://search.google.com/test/rich-results or https://validator.schema.org after a change.
import { bottleCount, drinks, hours, menu, site, tel, type PricedItem, type WineGroup } from './content'
import { groupHours } from './hours'
import { CHEF, TEAM } from './people'

const SCHEMA_DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

// Other names the restaurant goes by: its Google Maps listing and its Facebook page. With the address, they help
// search engines tell this Kismet apart from other places of the same name.
const ALTERNATE_NAMES = ['Kismet Restaurant', 'Kismet Vancouver']
const CUISINE = ['Seasonal', 'Pacific Northwest']
const OPENED = '2025-12'

function ids(siteUrl: string) {
  return {
    website: `${siteUrl}/#website`,
    restaurant: `${siteUrl}/#restaurant`,
    dinner: `${siteUrl}/menus#dinner-menu`,
    drinks: `${siteUrl}/menus#drinks-menu`,
    story: `${siteUrl}/story#page`,
    person: (name: string) => `${siteUrl}/story#${name.toLowerCase().replace(/[^a-z]+/g, '-')}`,
  }
}

/** "August 2026" -> "2026-08"; anything else is left out. */
function isoMonth(label: string): string | undefined {
  const m = label.trim().match(/^([A-Za-z]+)\s+(\d{4})$/)
  const i = m ? MONTHS.indexOf(m[1]) : -1
  return m && i >= 0 ? `${m[2]}-${String(i + 1).padStart(2, '0')}` : undefined
}

/** A price as editors type it ("15") becomes an Offer; anything that isn't a plain number is left out. */
function offer(price?: string) {
  const p = String(price ?? '').trim()
  return /^\d+(\.\d{1,2})?$/.test(p) ? { '@type': 'Offer', price: p, priceCurrency: 'USD' } : undefined
}

function item(it: PricedItem) {
  return {
    '@type': 'MenuItem',
    name: it.name,
    ...(it.description || it.size ? { description: it.description || it.size } : {}),
    ...(offer(it.price) ? { offers: offer(it.price) } : {}),
  }
}

function wineSections(groups: WineGroup[]) {
  return groups.map((g) => ({ '@type': 'MenuSection', name: g.type, hasMenuItem: g.wines.map(item) }))
}

const owners = [{ name: CHEF.name, role: CHEF.role }, ...TEAM.filter((p) => /co-owner/i.test(p.role))]

/** The restaurant itself: the same on every page. */
function restaurant(siteUrl: string) {
  const id = ids(siteUrl)
  const today = new Date().toISOString().slice(0, 10)
  const upcomingClosures = hours.closedDates.filter((d) => d >= today)
  return {
    '@type': 'Restaurant',
    '@id': id.restaurant,
    name: site.name,
    alternateName: ALTERNATE_NAMES,
    legalName: site.legalName,
    slogan: site.tagline,
    description: site.description,
    url: `${siteUrl}/`,
    image: [
      `${siteUrl}/opengraph-image.jpg`,
      `${siteUrl}/photos/dining-room.jpg`,
      `${siteUrl}/photos/table-lamp.jpg`,
      `${siteUrl}/photos/bar.jpg`,
    ],
    logo: `${siteUrl}/apple-icon.png`,
    telephone: tel.replace('tel:', ''),
    email: site.email,
    priceRange: '$$$',
    servesCuisine: CUISINE,
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
    hasMap: site.links.googleMaps,
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
    // The whole room seats this many for a buyout.
    maximumAttendeeCapacity: site.privateDining.roomSeats,
    foundingDate: OPENED,
    founder: owners.map((p) => ({ '@type': 'Person', '@id': id.person(p.name), name: p.name, jobTitle: p.role })),
    potentialAction: {
      '@type': 'ReserveAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: site.links.resy,
        actionPlatform: ['https://schema.org/DesktopWebPlatform', 'https://schema.org/MobileWebPlatform'],
      },
      result: { '@type': 'FoodEstablishmentReservation', name: `A table at ${site.name}` },
    },
    // Press coverage, so search engines and AI assistants can connect Kismet to what's been written about it.
    subjectOf: site.press.map((p) => ({
      '@type': 'Article',
      headline: p.headline,
      url: p.url,
      ...(isoMonth(p.date) ? { datePublished: isoMonth(p.date) } : {}),
      publisher: { '@type': 'Organization', name: p.outlet },
    })),
    sameAs: [site.links.instagram, site.links.facebook, site.links.resy, site.links.googleMaps],
  }
}

function graph(nodes: object[]) {
  return { '@context': 'https://schema.org', '@graph': nodes }
}

/** Home page: the website (so Google shows "Kismet" as the site name) and the restaurant. */
export function homeJsonLd(siteUrl: string) {
  const id = ids(siteUrl)
  return graph([
    {
      '@type': 'WebSite',
      '@id': id.website,
      url: `${siteUrl}/`,
      name: site.name,
      alternateName: ALTERNATE_NAMES,
      inLanguage: 'en-US',
      publisher: { '@id': id.restaurant },
    },
    restaurant(siteUrl),
  ])
}

/** Private dining, Privacy and any other page: just the restaurant. */
export function pageJsonLd(siteUrl: string) {
  return graph([restaurant(siteUrl)])
}

/** Menus page: the restaurant plus the dinner menu and the drinks, item by item. */
export function menusJsonLd(siteUrl: string) {
  const id = ids(siteUrl)
  const course = (name: string, dishes: typeof menu.first) => ({
    '@type': 'MenuSection',
    name,
    description: 'Choose one',
    hasMenuItem: dishes.map((d) => ({ '@type': 'MenuItem', name: d.name, ...(d.description ? { description: d.description } : {}) })),
  })
  const dinner = {
    '@type': 'Menu',
    '@id': id.dinner,
    name: 'Dinner',
    url: `${siteUrl}/menus`,
    description: menu.intro,
    dateModified: menu.updated,
    inLanguage: 'en-US',
    offers: {
      '@type': 'Offer',
      price: String(menu.price),
      priceCurrency: 'USD',
      description: `Three courses, ${menu.priceNote.replace(/\s*·\s*/g, ', ')}`,
    },
    hasMenuSection: [course('First course', menu.first), course('Second course', menu.second), course('Dessert', menu.dessert)],
  }
  const drinksMenu = {
    '@type': 'Menu',
    '@id': id.drinks,
    name: 'Drinks',
    url: `${siteUrl}/menus#cocktails`,
    description: drinks.barIntro,
    inLanguage: 'en-US',
    hasMenuSection: [
      { '@type': 'MenuSection', name: 'Cocktails', hasMenuItem: drinks.cocktails.map(item) },
      {
        '@type': 'MenuSection',
        name: 'Wine by the glass',
        description: drinks.byTheGlassNote,
        hasMenuSection: wineSections(drinks.byTheGlass),
      },
      {
        '@type': 'MenuSection',
        name: 'Beer and cider',
        description: drinks.beerNote,
        hasMenuItem: drinks.beer.map((b) => ({ '@type': 'MenuItem', name: b.name })),
      },
      {
        '@type': 'MenuSection',
        name: 'The bottle list',
        description: `${bottleCount} bottles. ${drinks.bottleIntro}`,
        hasMenuSection: wineSections(drinks.bottles),
      },
      {
        '@type': 'MenuSection',
        name: 'After dinner',
        hasMenuSection: [
          { '@type': 'MenuSection', name: 'Dessert wines', hasMenuItem: drinks.dessertWines.map(item) },
          { '@type': 'MenuSection', name: 'Fortified wines', description: drinks.fortifiedNote, hasMenuItem: drinks.fortified.map(item) },
          { '@type': 'MenuSection', name: 'Brandy and grappa', description: drinks.brandiesNote, hasMenuItem: drinks.brandies.map(item) },
        ],
      },
    ],
  }
  return graph([{ ...restaurant(siteUrl), hasMenu: [{ '@id': id.dinner }, { '@id': id.drinks }] }, dinner, drinksMenu])
}

/** Our story page: the restaurant plus the chef, the owners and the team members named in full. */
export function storyJsonLd(siteUrl: string) {
  const id = ids(siteUrl)
  const chef = {
    '@type': 'Person',
    '@id': id.person(CHEF.name),
    name: CHEF.name,
    jobTitle: CHEF.role,
    description: CHEF.bio.join(' '),
    image: `${siteUrl}${CHEF.photo.src}`,
    url: `${siteUrl}/story`,
    alumniOf: { '@type': 'CollegeOrUniversity', name: 'The Culinary Institute of America' },
    worksFor: { '@id': id.restaurant },
  }
  // Only people shown with a full name; first names alone don't help a search engine.
  const people = TEAM.filter((p) => p.name.includes(' ')).map((p) => ({
    '@type': 'Person',
    '@id': id.person(p.name),
    name: p.name,
    jobTitle: p.role,
    description: p.bio,
    ...(p.photo ? { image: `${siteUrl}${p.photo.src}` } : {}),
    ...(p.award ? { award: p.award } : {}),
    worksFor: { '@id': id.restaurant },
  }))
  return graph([
    {
      '@type': 'AboutPage',
      '@id': id.story,
      url: `${siteUrl}/story`,
      name: 'Our story',
      about: { '@id': id.restaurant },
      mentions: [chef, ...people].map((p) => ({ '@id': p['@id'] })),
    },
    restaurant(siteUrl),
    chef,
    ...people,
  ])
}
