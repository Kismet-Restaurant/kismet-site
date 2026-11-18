// New Year's Eve: one evening, one five-course menu, two seatings, prepaid on Resy.
// Everything on the page comes from content/new-years-eve.json; the closed dates and hours come from content/hours.json.
import type { Metadata } from 'next'
import { Eyebrow, TextLink } from '@/components/Bits'
import { JsonLd } from '@/components/JsonLd'
import { Photo } from '@/components/Photo'
import { hours, newYearsEve as ev, site, tel, type Dish } from '@/lib/content'
import { clockFull } from '@/lib/hours'
import { eventJsonLd } from '@/lib/schema'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.kismetvancouver.com'
const PATH = '/new-years-eve'

export const metadata: Metadata = {
  title: ev.metaTitle,
  description: ev.metaDescription,
  alternates: { canonical: PATH },
  openGraph: {
    title: ev.title,
    description: ev.metaDescription,
    url: PATH,
    images: [{ url: '/photos/dining-room-evening.jpg', alt: 'The dining room set for dinner, with brass lamps along the banquette tables' }],
  },
}

/** The Resy link for the evening. data-reserve counts the tap in Analytics; it isn't Resy's pop-up, so the date stays set. */
function ReserveEvening({ className = '' }: { className?: string }) {
  return (
    <a href={ev.reserveUrl} data-reserve="" className={`btn btn--primary btn--lg ${className}`.trim()}>
      <span>Reserve on Resy</span>
    </a>
  )
}

function Dishes({ items }: { items: Dish[] }) {
  return (
    <ul className="dishes">
      {items.map((d) => (
        <li key={d.name}>
          <span className="dishes__name">{d.name}</span>
          {d.description ? <span className="dishes__desc">{d.description}</span> : null}
        </li>
      ))}
    </ul>
  )
}

export default function NewYearsEvePage() {
  const call = hours.booking.callFromPartySize || 7
  const notes = [
    ...ev.notes,
    { title: 'Larger parties', text: `Tables of ${call - 1} or fewer book on Resy. For ${call} or more, please call ${site.phone}.` },
    { title: 'Running late?', text: site.runningLate.replace(/^Running late\?\s*/, '') },
  ]

  return (
    <>
      <JsonLd data={eventJsonLd(siteUrl, ev, PATH)} />

      {/* ---------------------------------------------------------------- hero */}
      <section className="pd-hero bg-linen" aria-labelledby="nye-title">
        <div className="pd-hero__text stack">
          <Eyebrow>{ev.eyebrow}</Eyebrow>
          <h1 id="nye-title" className="display display--xl">
            {ev.title}
          </h1>
          <p className="lede">{ev.lede}</p>
          <div className="nye-price">
            <p className="nye-price__amount nums">${ev.price}</p>
            <p className="nye-price__note">{ev.priceNote}</p>
          </div>
          <div className="actions">
            <ReserveEvening />
            <TextLink href="#menu">See the menu</TextLink>
          </div>
        </div>
        <Photo
          src="/photos/dining-room-evening.jpg"
          alt="The dining room set for dinner, with brass lamps along the banquette tables and guests out of focus beyond"
          className="pd-hero__photo"
          sizes="(min-width: 1080px) 50vw, 100vw"
          position="45% 60%"
          priority
        />
      </section>

      {/* ---------------------------------------------------------------- seatings */}
      <section className="section bg-paper" aria-labelledby="seatings-title">
        <div className="wrap stack" style={{ ['--gap' as string]: 'clamp(28px, 4vw, 48px)' }}>
          <div className="stack" style={{ ['--gap' as string]: '16px' }}>
            <Eyebrow>The seatings</Eyebrow>
            <h2 id="seatings-title" className="h2">
              Two seatings, one evening.
            </h2>
          </div>
          <div className="formats">
            {ev.seatings.map((s) => (
              <div className="format" key={s.name}>
                <Eyebrow>{s.name}</Eyebrow>
                <h3 className="nums">{clockFull(s.from)}</h3>
                <p className="body">
                  Arrive between {clockFull(s.from)} and {clockFull(s.until)}.
                </p>
              </div>
            ))}
          </div>
          <p className="body nye-seating-note">{ev.seatingNote}</p>
        </div>
      </section>

      {/* ---------------------------------------------------------------- the menu */}
      <section id="menu" className="section bg-linen nye-menu" aria-labelledby="menu-title">
        <div className="wrap nye-menu__wrap">
          <div className="stack nye-menu__head" style={{ ['--gap' as string]: '14px' }}>
            <Eyebrow>The menu</Eyebrow>
            <h2 id="menu-title" className="h2">
              Five courses.
            </h2>
            <p className="body">
              ${ev.price} {ev.priceNote}. {ev.serviceNote}
            </p>
          </div>
          <div className="nye-menu__courses">
            {ev.courses.map((c) => (
              <div className="nye-course" key={c.title}>
                <div className="course-head">
                  <h3>{c.title}</h3>
                  {c.choose ? <span className="eyebrow eyebrow--muted">Choose one</span> : null}
                </div>
                <Dishes items={c.dishes} />
              </div>
            ))}
            <div className="nye-course nye-course--wine">
              <div className="course-head">
                <h3>{ev.wine.title}</h3>
                <span className="eyebrow eyebrow--muted nums">{ev.wine.price} per guest</span>
              </div>
              <p className="dishes__desc nye-wine">{ev.wine.text}</p>
            </div>
          </div>
          <figure className="nye-menu__photo">
            <Photo src={ev.photo.image} alt={ev.photo.alt} className="nye-menu__frame" sizes="(min-width: 1080px) 40vw, 100vw" />
            <figcaption className="caption">{ev.photo.caption}</figcaption>
          </figure>
        </div>
      </section>

      {/* ---------------------------------------------------------------- good to know */}
      <section className="section bg-paper" aria-labelledby="know-title">
        <div className="wrap stack" style={{ ['--gap' as string]: '20px' }}>
          <div className="stack" style={{ ['--gap' as string]: '16px' }}>
            <Eyebrow>Good to know</Eyebrow>
            <h2 id="know-title" className="h2 h2--sm">
              Before you book.
            </h2>
          </div>
          <div className="menu-notes nye-notes">
            {notes.map((n) => (
              <div key={n.title}>
                <h3>{n.title}</h3>
                <p>{n.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------------- book */}
      <section className="section bg-esp" aria-labelledby="book-title">
        <div className="wrap cta-band">
          <div className="stack" style={{ ['--gap' as string]: '14px' }}>
            <Eyebrow tone="brass">{ev.eyebrow}</Eyebrow>
            <h2 id="book-title" className="h2 h2--sm">
              See you on the last night of the year.
            </h2>
          </div>
          <div className="actions">
            <ReserveEvening className="btn--block" />
            <TextLink href={tel} tone="brass" icon="phone">
              Call {site.phone}
            </TextLink>
          </div>
        </div>
      </section>
    </>
  )
}
