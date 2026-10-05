// Hours, the live "are we open" line and the quick booking dates, all worked out from content/hours.json.
// Times are "HH:MM" in 24-hour form, in Vancouver, Washington time (America/Los_Angeles).

export type DayKey = 'sunday' | 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday'
export const DAY_KEYS: DayKey[] = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']
const LONG = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
const SHORT = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const LONG_MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
const WORDS = ['twelve', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven']
export const TIME_ZONE = 'America/Los_Angeles'

export type DayHours = { open: boolean; firstTable: string; lastTable: string }
export type Week = Record<DayKey, DayHours>

export function minutes(hhmm: string): number {
  const [h, m] = hhmm.split(':').map(Number)
  return (h || 0) * 60 + (m || 0)
}

/** "17:00" -> "5", "20:30" -> "8:30" */
export function clock(hhmm: string): string {
  const t = minutes(hhmm)
  const h = Math.floor(t / 60) % 24
  const m = t % 60
  const h12 = h % 12 === 0 ? 12 : h % 12
  return m ? `${h12}:${String(m).padStart(2, '0')}` : String(h12)
}

function meridiem(hhmm: string): 'am' | 'pm' {
  return Math.floor(minutes(hhmm) / 60) % 24 >= 12 ? 'pm' : 'am'
}

/** "20:30" -> "8:30 pm", with a non-breaking space so "8:30" and "pm" never split across lines. */
export function clockFull(hhmm: string): string {
  return `${clock(hhmm)}\u00a0${meridiem(hhmm)}`
}

/** "5 pm, last seating 8:30 pm". The room stays open after the last seating, so hours never read as "5 to 8". */
export function seatingText(day: DayHours): string {
  return `${clockFull(day.firstTable)}, last seating ${clockFull(day.lastTable)}`
}

/** "17:00" -> "five", "20:30" -> "half past eight", "17:10" -> "5:10 pm" */
export function spoken(hhmm: string): string {
  const t = minutes(hhmm)
  const h = Math.floor(t / 60) % 12
  const m = t % 60
  if (m === 0) return WORDS[h]
  if (m === 30) return `half past ${WORDS[h]}`
  if (m === 15) return `quarter past ${WORDS[h]}`
  if (m === 45) return `quarter to ${WORDS[(h + 1) % 12]}`
  return clockFull(hhmm)
}

function same(a: DayHours, b: DayHours): boolean {
  return a.open === b.open && (!a.open || (a.firstTable === b.firstTable && a.lastTable === b.lastTable))
}

export type HoursGroup = {
  days: number[]
  label: string
  short: string
  open: boolean
  text: string
  firstTable: string
  lastTable: string
}

/** Days with the same hours, grouped: "Tuesday to Thursday · 5 pm, last seating 8 pm", "Sunday and Monday · Closed". */
export function groupHours(week: Week): HoursGroup[] {
  const days = DAY_KEYS.map((k) => week[k])
  // Start at the first open day that follows a change, so closed days on either side of Sunday stay together.
  let start = 0
  for (let i = 0; i < 7; i++) {
    if (days[i].open && !same(days[(i + 6) % 7], days[i])) {
      start = i
      break
    }
  }
  const runs: number[][] = []
  for (let n = 0; n < 7; n++) {
    const d = (start + n) % 7
    const last = runs[runs.length - 1]
    if (last && same(days[last[last.length - 1]], days[d])) last.push(d)
    else runs.push([d])
  }
  return runs.map((run) => {
    const a = run[0]
    const z = run[run.length - 1]
    const name = (names: string[]) =>
      run.length === 1 ? names[a] : run.length === 2 ? `${names[a]} and ${names[z]}` : `${names[a]} to ${names[z]}`
    const d = days[a]
    return {
      days: run,
      label: name(LONG),
      short: name(SHORT),
      open: d.open,
      text: d.open ? seatingText(d) : 'Closed',
      firstTable: d.firstTable,
      lastTable: d.lastTable,
    }
  })
}

/** "Last seating is at 8 pm, or 8:30 pm on Friday and Saturday." */
export function lastTableNote(week: Week): string {
  const byTime = new Map<string, HoursGroup[]>()
  for (const g of groupHours(week).filter((g) => g.open)) {
    byTime.set(g.lastTable, [...(byTime.get(g.lastTable) || []), g])
  }
  const times = [...byTime.keys()]
  if (!times.length) return ''
  if (times.length === 1) return `Last seating is at ${clockFull(times[0])}.`
  const [first, ...rest] = times
  const others = rest
    .map((t) => `${clockFull(t)} on ${byTime.get(t)!.map((g) => g.label).join(' and ')}`)
    .join(', or ')
  return `Last seating is at ${clockFull(first)}, or ${others}.`
}

/** "Tue to Sat · from 5 pm", for the header. */
export function hoursSummary(week: Week): string {
  const open = groupHours(week).filter((g) => g.open)
  if (!open.length) return 'Closed'
  const earliest = open.map((g) => g.firstTable).sort((a, b) => minutes(a) - minutes(b))[0]
  const ordered = open.flatMap((g) => g.days)
  const all = groupHours(week).flatMap((g) => g.days)
  const firstIdx = all.indexOf(ordered[0])
  const contiguous = ordered.every((d, i) => all[firstIdx + i] === d)
  const days = !contiguous
    ? open.map((g) => g.short).join(', ')
    : ordered.length === 1
      ? SHORT[ordered[0]]
      : `${SHORT[ordered[0]]} to ${SHORT[ordered[ordered.length - 1]]}`
  return `${days} · from ${clockFull(earliest)}`
}

/** Opening time in words, for the version of the headline served before the page knows the time. */
export function openingWords(week: Week): string {
  const open = groupHours(week).filter((g) => g.open)
  if (!open.length) return ''
  return spoken(open.map((g) => g.firstTable).sort((a, b) => minutes(a) - minutes(b))[0])
}

export type LocalNow = { year: number; month: number; day: number; dow: number; min: number }

/** The current date and time in Vancouver, Washington. */
export function localNow(date: Date = new Date()): LocalNow {
  const parts: Record<string, string> = {}
  new Intl.DateTimeFormat('en-US', {
    timeZone: TIME_ZONE,
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    hourCycle: 'h23',
  })
    .formatToParts(date)
    .forEach((p) => {
      parts[p.type] = p.value
    })
  const year = Number(parts.year)
  const month = Number(parts.month)
  const day = Number(parts.day)
  const dow = new Date(Date.UTC(year, month - 1, day)).getUTCDay()
  return { year, month, day, dow, min: (Number(parts.hour) % 24) * 60 + Number(parts.minute) }
}

export type ServiceState = 'before' | 'open' | 'after' | 'closed'
export type Service = { state: ServiceState; status: string; headline: string; live: boolean }

/** The calendar date `offset` days after `now`, with its weekday. */
function dayAt(now: LocalNow, offset: number) {
  const dt = new Date(Date.UTC(now.year, now.month - 1, now.day) + offset * 86400000)
  return { iso: dt.toISOString().slice(0, 10), dow: dt.getUTCDay(), month: dt.getUTCMonth(), date: dt.getUTCDate() }
}

/** Hours for the night `offset` days from now, or null if we're closed that night (a closed weekday or a closed date). */
function openNight(now: LocalNow, week: Week, closed: Set<string>, offset: number): DayHours | null {
  const d = dayAt(now, offset)
  const day = week[DAY_KEYS[d.dow]]
  return day.open && !closed.has(d.iso) ? day : null
}

/**
 * The open/closed line and the hero headline for this moment.
 * `closedDates` are one-off closures ("2026-11-26"); those nights count as closed.
 */
export function service(now: LocalNow, week: Week, closedDates: string[] = []): Service {
  const closed = new Set(closedDates)
  const today = openNight(now, week, closed, 0)
  let state: ServiceState = 'closed'
  if (today) {
    state = now.min < minutes(today.firstTable) ? 'before' : now.min < minutes(today.lastTable) ? 'open' : 'after'
  }
  if (state === 'before' && today) {
    return {
      state,
      live: true,
      status: `Opens tonight at ${clockFull(today.firstTable)} · last seating ${clockFull(today.lastTable)}`,
      headline: `Tonight, the lamps come on at ${spoken(today.firstTable)}.`,
    }
  }
  if (state === 'open' && today) {
    return {
      state,
      live: true,
      status: `Open now · last seating ${clockFull(today.lastTable)}`,
      headline: `The lamps are lit. Last seating at ${spoken(today.lastTable)}.`,
    }
  }
  // No more seatings now: find the next open night, up to about two months out.
  let ahead = 0
  for (let i = 1; i <= 62; i++) {
    if (openNight(now, week, closed, i)) {
      ahead = i
      break
    }
  }
  // After the last seating the room is still open (guests stay until 9:30 or 10),
  // so that line talks about seating rather than closing.
  const after = state === 'after'
  const lead = after ? 'Last seating has passed' : 'Closed today'
  if (!ahead) {
    return {
      state,
      live: false,
      status: lead,
      headline: after ? 'Seating is done for tonight.' : 'The lamps are off for now. We’ll be back soon.',
    }
  }
  const next = openNight(now, week, closed, ahead)!
  const d = dayAt(now, ahead)
  // "tomorrow", "Tuesday", or for a longer break "Tuesday, Oct 13"
  const whenShort = ahead === 1 ? 'tomorrow' : ahead < 7 ? LONG[d.dow] : `${LONG[d.dow]}, ${MONTHS[d.month]} ${d.date}`
  const whenLong = ahead === 1 ? 'tomorrow' : ahead < 7 ? LONG[d.dow] : `${LONG[d.dow]}, ${LONG_MONTHS[d.month]} ${d.date},`
  return {
    state,
    live: false,
    status: `${lead} · open ${whenShort} from ${clockFull(next.firstTable)}`,
    headline: after
      ? `Seating is done for tonight. See you ${whenLong} at ${spoken(next.firstTable)}.`
      : `The lamps come on again ${whenLong} at ${spoken(next.firstTable)}.`,
  }
}

export type QuickDate = { label: string; sub: string; iso: string }

/** The next few nights we're open, starting tonight if the last seating hasn't passed yet. */
export function quickDates(now: LocalNow, week: Week, count = 4, windowDays = 60, closedDates: string[] = []): QuickDate[] {
  const closed = new Set(closedDates)
  const out: QuickDate[] = []
  for (let i = 0; i <= windowDays && out.length < count; i++) {
    const day = openNight(now, week, closed, i)
    if (!day) continue
    if (i === 0 && now.min >= minutes(day.lastTable)) continue
    const d = dayAt(now, i)
    out.push({
      label: i === 0 ? 'Tonight' : i === 1 ? 'Tomorrow' : SHORT[d.dow],
      sub: `${MONTHS[d.month]} ${d.date}`,
      iso: d.iso,
    })
  }
  return out
}
