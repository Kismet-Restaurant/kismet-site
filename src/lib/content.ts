// Typed access to the content files in /content. Every page reads them from here, so a change shows up
// everywhere at once.
import menuJson from '../../content/menu.json'
import drinksJson from '../../content/drinks.json'
import hoursJson from '../../content/hours.json'
import siteJson from '../../content/site.json'
import nyeJson from '../../content/new-years-eve.json'
import { DAY_KEYS, type DayHours, type SpecialNight, type Week } from './hours'

export type Dish = { name: string; description: string }
export type CoursePhoto = { image: string; alt: string; caption: string }
export type Note = { title: string; text: string }

export type Menu = {
  updated: string
  price: number
  priceNote: string
  intro: string
  dayOfNote: string
  menuPdf: string
  dessertPdf: string
  first: Dish[]
  second: Dish[]
  dessert: Dish[]
  photos: { first: CoursePhoto; second: CoursePhoto; dessert: CoursePhoto }
  notes: Note[]
  galetteNote: string
}

export type PricedItem = { name: string; price: string; size?: string; description?: string }
export type WineGroup = { type: string; wines: PricedItem[] }

export type Drinks = {
  wineListPdf: string
  barIntro: string
  bottleIntro: string
  corkage: string
  cocktails: Required<Pick<PricedItem, 'name' | 'description' | 'price'>>[]
  byTheGlassNote: string
  byTheGlass: WineGroup[]
  beerNote: string
  beer: { name: string }[]
  bottles: WineGroup[]
  dessertWines: PricedItem[]
  fortifiedNote: string
  fortified: PricedItem[]
  brandiesNote: string
  brandies: PricedItem[]
}

export type Booking = { windowDays: number; depositFromPartySize: number; callFromPartySize: number }

export type Notice = {
  show: boolean
  text: string
  /** Optional link after the text, like "See the menu" */
  link?: { href: string; text: string }
  /** Optional last day to show it ("YYYY-MM-DD"); after that day the notice hides itself */
  until?: string
}

export type Hours = {
  notice: Notice
  week: Week
  /** The line under the hours table, about staying open after the last seating */
  closingNote: string
  /** One-off closures, "YYYY-MM-DD" */
  closedDates: string[]
  /** One-off evenings with their own times and page, like New Year's Eve */
  specialNights: SpecialNight[]
  booking: Booking
}

/** A special evening with its own page and menu (content/new-years-eve.json). */
export type SpecialEvening = {
  name: string
  /** "YYYY-MM-DD" */
  date: string
  /** The home page section and the Links page row hide themselves after this day */
  hideAfter: string
  eyebrow: string
  title: string
  metaTitle: string
  metaDescription: string
  lede: string
  price: number
  priceNote: string
  /**
   * What's paid on the night, like "Wine, other drinks and gratuity are paid at the table."
   * If an evening ever adds a service charge, Washington law asks that any menu showing it says how much goes to staff.
   */
  tableNote: string
  reserveUrl: string
  /** Times guests can arrive, "HH:MM" */
  seatings: { name: string; from: string; until: string }[]
  seatingNote: string
  courses: { title: string; choose?: boolean; dishes: Dish[] }[]
  wine: { title: string; price: number; text: string }
  photo: { image: string; alt: string; caption: string }
  notes: Note[]
  home: { title: string; text: string; button: string }
}

export type Site = {
  name: string
  legalName: string
  tagline: string
  description: string
  address: { street: string; city: string; state: string; stateName: string; zip: string; directionsNote: string }
  geo: { latitude: number; longitude: number }
  phone: string
  email: string
  runningLate: string
  links: {
    resy: string
    instagram: string
    instagramHandle: string
    facebook: string
    googleMaps: string
    googleReview: string
    directions: string
  }
  resy: { useWidget: boolean; venueId: number; apiKey: string; partySize: number }
  /** Google Analytics measurement ID; it only loads on the live site */
  googleAnalyticsId: string
  ratings: { source: string; score: string; url: string }[]
  featuredBy: { name: string }[]
  press: { outlet: string; date: string; headline: string; url: string }[]
  gettingHere: { title: string; text: string }[]
  giftCertificates: string
  privateDining: { longTableMax: number; roomSeats: number }
}

/**
 * Every string in a content file, with a non-breaking space between a number and "am" or "pm",
 * so times like "6 pm" that editors type never split across lines.
 */
function keepTimesTogether<T>(value: T): T {
  if (typeof value === 'string') return value.replace(/(\d) (am|pm)\b/g, '$1\u00a0$2') as T
  if (Array.isArray(value)) return value.map(keepTimesTogether) as T
  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, keepTimesTogether(v)])) as T
  }
  return value
}

const TIME = /^([01]?\d|2[0-3]):[0-5]\d$/
const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/

/**
 * The hours as editors left them, made safe: a day only counts as open when it is ticked open
 * and both times are filled in as HH:MM.
 */
function normalizeHours(raw: Record<string, unknown>): Hours {
  const rawWeek = (raw.week ?? {}) as Record<string, Partial<DayHours> | undefined>
  const week = {} as Week
  for (const key of DAY_KEYS) {
    const d = rawWeek[key] ?? {}
    const first = String(d.firstTable ?? '').trim()
    const last = String(d.lastTable ?? '').trim()
    const open = Boolean(d.open) && TIME.test(first) && TIME.test(last)
    week[key] = { open, firstTable: open ? first : '', lastTable: open ? last : '' }
  }
  const closedDates = (Array.isArray(raw.closedDates) ? raw.closedDates : [])
    .map((v) => String(typeof v === 'object' && v ? (v as { date?: unknown }).date ?? '' : v).slice(0, 10))
    .filter((v) => ISO_DATE.test(v))
  const notice = (raw.notice ?? {}) as Partial<Notice>
  const link = notice.link && String(notice.link.href ?? '').trim() && String(notice.link.text ?? '').trim() ? notice.link : undefined
  const until = String(notice.until ?? '').slice(0, 10)
  const specialNights = (Array.isArray(raw.specialNights) ? (raw.specialNights as Partial<SpecialNight>[]) : [])
    .map((n) => ({
      date: String(n.date ?? '').slice(0, 10),
      name: String(n.name ?? '').trim(),
      firstTable: String(n.firstTable ?? '').trim(),
      lastTable: String(n.lastTable ?? '').trim(),
      href: String(n.href ?? '').trim(),
    }))
    .filter((n) => ISO_DATE.test(n.date) && TIME.test(n.firstTable) && TIME.test(n.lastTable))
  const booking = (raw.booking ?? {}) as Partial<Booking>
  return {
    notice: {
      show: Boolean(notice.show && String(notice.text ?? '').trim()),
      text: String(notice.text ?? '').trim(),
      ...(link ? { link: { href: link.href.trim(), text: link.text.trim() } } : {}),
      ...(ISO_DATE.test(until) ? { until } : {}),
    },
    week,
    closingNote: String(raw.closingNote ?? '').trim(),
    closedDates,
    specialNights,
    booking: {
      windowDays: Number(booking.windowDays) || 60,
      depositFromPartySize: Number(booking.depositFromPartySize) || 0,
      callFromPartySize: Number(booking.callFromPartySize) || 0,
    },
  }
}

export const menu = keepTimesTogether(menuJson) as Menu
export const drinks = keepTimesTogether(drinksJson) as Drinks
export const hours = normalizeHours(keepTimesTogether(hoursJson) as Record<string, unknown>)
export const site = keepTimesTogether(siteJson) as Site
export const newYearsEve = keepTimesTogether(nyeJson) as SpecialEvening

/** tel: link from the display phone number */
export const tel = `tel:+1${site.phone.replace(/\D/g, '')}`
export const mailto = `mailto:${site.email}`
export const bottleCount = drinks.bottles.reduce((n, g) => n + g.wines.length, 0)

/** "September 30, 2026" */
export function longDate(iso: string): string {
  const [y, m, d] = iso.split('-').map(Number)
  return new Date(Date.UTC(y, m - 1, d)).toLocaleDateString('en-US', {
    timeZone: 'UTC',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })
}

/** "2026-09-30" → "Sep 30", for tight spaces on phones. */
export function shortDate(iso: string): string {
  const [y, m, d] = iso.split('-').map(Number)
  return new Date(Date.UTC(y, m - 1, d)).toLocaleDateString('en-US', { timeZone: 'UTC', month: 'short', day: 'numeric' })
}

const NUMBER_WORDS = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve']

/** 8 -> "eight" (or "Eight"); numbers past twelve stay as digits */
export function numberWord(n: number, capital = false): string {
  const w = NUMBER_WORDS[n] ?? String(n)
  return capital ? w.charAt(0).toUpperCase() + w.slice(1) : w
}

/** "Book up to 60 days ahead. Parties of five or more hold their table with a deposit; for seven or more, please call." */
export function bookingNote(b: Booking): string {
  const parts: string[] = []
  if (b.windowDays) parts.push(`Book up to ${b.windowDays} days ahead.`)
  const deposit = b.depositFromPartySize
  const call = b.callFromPartySize
  if (deposit && call) parts.push(`Parties of ${numberWord(deposit)} or more hold their table with a deposit; for ${numberWord(call)} or more, please call.`)
  else if (deposit) parts.push(`Parties of ${numberWord(deposit)} or more hold their table with a deposit.`)
  else if (call) parts.push(`For parties of ${numberWord(call)} or more, please call.`)
  return parts.join(' ')
}

/** Resy link for a given night and party size; the quick date buttons use these. */
export function resyDateUrl(iso: string, seats = site.resy.partySize): string {
  return `${site.links.resy}?date=${iso}&seats=${seats}`
}
