'use client'
// The parts of the page that follow the clock: the open/closed line, the headline and the next open nights.
// They work out the time in Vancouver, Washington, in the visitor's browser and update every minute.
// Add ?service=before, open, after or closed to a page address to preview each version.
import { useEffect, useState } from 'react'
import {
  DAY_KEYS,
  hoursSummary,
  localNow,
  minutes,
  openingWords,
  quickDates,
  service,
  type LocalNow,
  type Week,
} from '@/lib/hours'

function forcedNow(state: string, week: Week): LocalNow | null {
  const now = localNow()
  const at = (dayOffset: number, min: number): LocalNow => {
    const dt = new Date(Date.UTC(now.year, now.month - 1, now.day) + dayOffset * 86400000)
    return { year: dt.getUTCFullYear(), month: dt.getUTCMonth() + 1, day: dt.getUTCDate(), dow: dt.getUTCDay(), min }
  }
  for (let i = 0; i < 7; i++) {
    const day = week[DAY_KEYS[(now.dow + i) % 7]]
    if (state === 'closed' && !day.open) return at(i, 12 * 60)
    if (state !== 'closed' && day.open) {
      if (state === 'before') return at(i, minutes(day.firstTable) - 120)
      if (state === 'open') return at(i, minutes(day.firstTable) + 60)
      if (state === 'after') return at(i, minutes(day.lastTable) + 30)
    }
  }
  return null
}

function useNow(week: Week): LocalNow | null {
  const [now, setNow] = useState<LocalNow | null>(null)
  useEffect(() => {
    const forced = new URLSearchParams(window.location.search).get('service')
    const tick = () => setNow((forced && forcedNow(forced, week)) || localNow())
    tick()
    const id = window.setInterval(tick, 60_000)
    return () => window.clearInterval(id)
  }, [week])
  return now
}

export function StatusChip({ week, closed = [], tone = 'ink2' }: { week: Week; closed?: string[]; tone?: 'ink2' | 'cream' }) {
  const now = useNow(week)
  const s = now ? service(now, week, closed) : null
  return (
    <p className={`status status--${tone}`} aria-live="polite">
      <span className={`status__dot${s?.live ? ' status__dot--live' : ''}`} aria-hidden="true" />
      <span className="eyebrow">{s ? s.status : hoursSummary(week)}</span>
    </p>
  )
}

export function LiveHeadline({ week, closed = [], className = '', id }: { week: Week; closed?: string[]; className?: string; id?: string }) {
  const now = useNow(week)
  const words = openingWords(week)
  const text = now ? service(now, week, closed).headline : words ? `The lamps come on at ${words}.` : 'The lamps are off for now.'
  return (
    <h1 className={className} id={id}>
      {text}
    </h1>
  )
}

export function QuickDates({
  week,
  closed = [],
  resyUrl,
  seats,
  windowDays,
}: {
  week: Week
  closed?: string[]
  resyUrl: string
  seats: number
  windowDays: number
}) {
  const now = useNow(week)
  const dates = now ? quickDates(now, week, 4, windowDays, closed) : []
  return (
    <ul className="quick-dates" aria-label={`Book a table for ${seats}`}>
      {dates.length
        ? dates.map((d) => (
            <li key={d.iso}>
              <a className="date-chip" href={`${resyUrl}?date=${d.iso}&seats=${seats}`}>
                <span className="date-chip__day">{d.label}</span>
                <span className="date-chip__date">{d.sub}</span>
              </a>
            </li>
          ))
        : [0, 1, 2, 3].map((i) => (
            <li key={i} aria-hidden="true">
              <span className="date-chip date-chip--empty" />
            </li>
          ))}
    </ul>
  )
}
