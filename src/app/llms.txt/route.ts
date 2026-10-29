// /llms.txt: the whole site in one plain-text page for AI assistants (ChatGPT, Claude, Perplexity, Gemini and
// others), in the llms.txt format (https://llmstxt.org). It's built from the content files at each deploy, so it
// always matches the hours, menu and details on the site. Nothing here needs editing by hand.
import { bookingNote, bottleCount, drinks, hours, longDate, menu, site, tel, type PricedItem } from '@/lib/content'
import { clockFull, groupHours } from '@/lib/hours'
import { CHEF, TEAM } from '@/lib/people'

export const dynamic = 'force-static'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.kismetvancouver.com'

const price = (p: string) => (/^\d+(\.\d{1,2})?$/.test(p.trim()) ? `$${p.trim()}` : p)
const priced = (it: PricedItem) =>
  `- ${it.name}${it.size ? `, ${it.size}` : ''} (${price(it.price)})${it.description ? `: ${it.description}` : ''}`

export function GET() {
  const { street, city, state, stateName, zip, directionsNote } = site.address
  const call = hours.booking.callFromPartySize
  const { longTableMax, roomSeats } = site.privateDining
  const today = new Date().toISOString().slice(0, 10)
  const closures = hours.closedDates.filter((d) => d >= today)

  const lines: string[] = [
    `# ${site.name}`,
    '',
    `> ${site.description}`,
    '',
    `${site.name} is a restaurant at ${street} in downtown ${city}, ${stateName}, just across the Columbia River from Portland, Oregon (not Vancouver, British Columbia). Chef ${CHEF.name} and Kim Sinclair own it, and it opened in December 2025. It's one room on historic Main Street, with a small team and a three-course menu that follows the Northwest harvest.`,
    '',
    '## Visit',
    '',
    `- Address: ${street}, ${city}, ${state} ${zip}. ${directionsNote}`,
    `- Phone: ${site.phone}`,
    `- Email: ${site.email}`,
    '- Hours:',
    ...groupHours(hours.week).map((g) =>
      g.open ? `  - ${g.label}: opens ${clockFull(g.firstTable)}, last seating ${clockFull(g.lastTable)}` : `  - ${g.label}: closed`,
    ),
    ...(hours.closingNote ? [`- ${hours.closingNote}`] : []),
    ...(closures.length ? [`- Closed on ${closures.map((d) => longDate(d)).join(', ')}.`] : []),
    ...(hours.notice.show ? [`- Notice: ${hours.notice.text}`] : []),
    ...site.gettingHere.map((r) => `- ${r.title}: ${r.text}`),
    `- Directions: ${site.links.directions}`,
    '',
    '## Reservations',
    '',
    `- Reserve on Resy: ${site.links.resy}`,
    `- ${bookingNote(hours.booking)}`,
    ...(call > 1 ? [`- For ${call - 1} people or fewer, reserve on Resy. For ${call} people or more, call ${site.phone}.`] : []),
    `- ${site.runningLate}`,
    '',
    '## The menu',
    '',
    `Updated ${longDate(menu.updated)}. ${menu.intro} ${menu.dayOfNote}`,
    '',
    `- [Menus page](${siteUrl}/menus)`,
    ...(menu.menuPdf ? [`- [Dinner menu PDF](${siteUrl}${menu.menuPdf})`] : []),
    ...(menu.dessertPdf ? [`- [Dessert menu PDF](${siteUrl}${menu.dessertPdf})`] : []),
    '',
    ...(
      [
        ['First course', menu.first],
        ['Second course', menu.second],
        ['Dessert', menu.dessert],
      ] as const
    ).flatMap(([title, dishes]) => [
      `### ${title} (choose one)`,
      '',
      ...dishes.map((d) => `- ${d.name}${d.description ? `: ${d.description}` : ''}`),
      '',
    ]),
    ...menu.notes.map((n) => `- ${n.title}: ${n.text}`),
    '',
    '## The bar and cellar',
    '',
    drinks.barIntro,
    '',
    '### Cocktails',
    '',
    ...drinks.cocktails.map(priced),
    '',
    `### Wine by the glass (${drinks.byTheGlassNote})`,
    '',
    ...drinks.byTheGlass.flatMap((g) => g.wines.map((w) => priced({ ...w, name: `${g.type}: ${w.name}` }))),
    '',
    `### Beer and cider (${drinks.beerNote})`,
    '',
    ...drinks.beer.map((b) => `- ${b.name}`),
    '',
    '### Bottles',
    '',
    `${bottleCount} bottles. ${drinks.bottleIntro} The full list is on the [Menus page](${siteUrl}/menus#wine) and in the [wine list PDF](${siteUrl}${drinks.wineListPdf}).`,
    '',
    drinks.corkage,
    '',
    '## Private dining',
    '',
    `- A long table for ${call || 7} to ${longTableMax} guests during regular service. Everyone chooses from the three-course menu. Call ${site.phone} to book it.`,
    `- The whole room for up to ${roomSeats} seated guests, with a menu Chef Eric plans around the evening.`,
    '- Good for rehearsal dinners, milestone birthdays, business dinners, holiday parties and anniversaries.',
    `- To plan one, use the [inquiry form](${siteUrl}/private-dining#inquiry), call ${site.phone} or write to ${site.email}. We reply by the end of the next business day.`,
    '- Celebrating at a regular table? Let us know ahead, and you’re welcome to bring the birthday cake, as long as the chef gets a slice.',
    '',
    '## Gift certificates',
    '',
    `${site.giftCertificates} There are no online gift cards.`,
    '',
    '## The people',
    '',
    `- Chef ${CHEF.name}, ${CHEF.role.toLowerCase()}. ${CHEF.bio.join(' ')}`,
    ...TEAM.map((p) => `- ${p.name}, ${p.role.toLowerCase()}. ${p.bio}`),
    '',
    '## Ratings and press',
    '',
    ...site.ratings.map((r) => `- ${r.score} out of 5 on ${r.source}`),
    ...site.press.map((p) => `- ${p.outlet}, ${p.date}: [${p.headline}](${p.url})`),
    '',
    '## Pages and links',
    '',
    `- [Home](${siteUrl}/): reserve, hours, the menu in brief, the bar and how to find us`,
    `- [Menus](${siteUrl}/menus): dinner, dessert, cocktails and the wine list`,
    `- [Our story](${siteUrl}/story): Chef ${CHEF.name}, the team, the room and the press`,
    `- [Private dining](${siteUrl}/private-dining): the long table, the whole room and the inquiry form`,
    `- [Reserve on Resy](${site.links.resy})`,
    `- [Instagram](${site.links.instagram})`,
    `- [Facebook](${site.links.facebook})`,
    `- [Google Maps](${site.links.googleMaps})`,
    `- [Call ${site.phone}](${tel})`,
  ]

  // Times in the content carry a non-breaking space ("5 pm") for the web pages; plain spaces read better here.
  const text = lines.join('\n').replace(/ /g, ' ').replace(/\n{3,}/g, '\n\n')
  return new Response(`${text}\n`, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } })
}
