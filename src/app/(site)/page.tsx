import Link from 'next/link'
import { Fragment } from 'react'
import { ButtonLink, Eyebrow, Mirror, ReserveButton, Stars, TextLink } from '@/components/Bits'
import { EmailSignup } from '@/components/Forms'
import { Icon } from '@/components/Icons'
import { LiveHeadline, QuickDates, StatusChip } from '@/components/Live'
import { Brandmark } from '@/components/Logo'
import { Photo } from '@/components/Photo'
import { bookingNote, drinks, hours, longDate, mailto, menu, numberWord, shortDate, site, tel } from '@/lib/content'
import { clockFull, groupHours } from '@/lib/hours'
import { restaurantJsonLd } from '@/lib/schema'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.kismetvancouver.com'

export const metadata = { alternates: { canonical: '/' } }

export default function Home() {
  const party = numberWord(site.resy.partySize)
  const courses = [
    { key: 'first', title: 'First course', dishes: menu.first, photo: menu.photos.first },
    { key: 'second', title: 'Second course', dishes: menu.second, photo: menu.photos.second },
    { key: 'dessert', title: 'Dessert', dishes: menu.dessert, photo: menu.photos.dessert },
  ] as const
  const igTiles = [
    {
      src: '/photos/dining-room-evening-sm.jpg',
      alt: 'The dining room during dinner, with brass lamps along the banquette tables and guests out of focus beyond',
    },
    { src: '/photos/tomato-salad-sm.jpg', alt: 'Heirloom tomato salad with blue cheese, shaved shallots and saba' },
    { src: '/photos/amuse-sm.jpg', alt: 'Watermelon and feta on porcelain spoons' },
    { src: '/photos/trout-sm.jpg', alt: 'Rainbow trout with brown butter and lemon' },
    { src: '/photos/bar-sm.jpg', alt: 'Late afternoon sun across the Kismet bar' },
    { src: '/photos/lamb-sm.jpg', alt: 'Grilled lamb chops with a vegetable brochette' },
  ]

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(restaurantJsonLd(siteUrl)) }} />

      {/* ---------------------------------------------------------------- hero */}
      <section className="hero" aria-labelledby="hero-title">
        <div className="hero__text">
          <StatusChip week={hours.week} closed={hours.closedDates} />
          <LiveHeadline week={hours.week} closed={hours.closedDates} className="display" id="hero-title" />
          <p className="lede hero__lede">
            Seasonal fine dining on historic Main Street in downtown {site.address.city}, {site.address.stateName}. Three courses, your
            choice at each, for ${menu.price}.
          </p>
          <div className="actions hero__actions">
            <ReserveButton />
            <TextLink href="#menu">See the menu</TextLink>
          </div>
          <div className="hero__book">
            <Eyebrow tone="muted">A table for {party}</Eyebrow>
            <QuickDates
              week={hours.week}
              closed={hours.closedDates}
              resyUrl={site.links.resy}
              seats={site.resy.partySize}
              windowDays={hours.booking.windowDays}
            />
            <TextLink href={site.links.resy} tone="ink2" className="hero__more">
              More dates and party sizes
            </TextLink>
          </div>
          <p className="small hero__near">
            <Icon name="pin" size={15} />
            <span>Just across the river from Portland. Free parking behind the restaurant.</span>
          </p>
        </div>
        <Photo
          src="/photos/table-lamp.jpg"
          alt="A brass table lamp glowing over a set table in the Kismet dining room"
          className="hero__photo"
          sizes="(min-width: 1080px) 53vw, 100vw"
          position="56% 50%"
          priority
        />
      </section>

      {/* ---------------------------------------------------------------- intro */}
      <section className="section bg-linen" style={{ borderTop: '1px solid var(--rule)' }}>
        <div className="wrap intro">
          <div className="intro__mirror">
            <Mirror>
              <Photo
                src="/photos/place-setting-sm.jpg"
                alt="A chambray napkin in a brass ring beside gold flatware on white linen"
                sizes="432px"
                position="50% 62%"
              />
            </Mirror>
          </div>
          <div className="stack intro__text">
            <Brandmark decorative className="intro__mark" />
            <p className="intro__statement">Seasonal fine dining, thoughtfully prepared and genuinely welcoming.</p>
            <p className="body">
              Kismet is Chef Eric Gallanter and Kim Sinclair’s restaurant on historic Main Street: one room, a small team and a menu
              that follows the Northwest harvest.
            </p>
            <TextLink href="/story">Read our story</TextLink>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------------- menu teaser */}
      <section id="menu" className="section bg-paper" aria-labelledby="menu-title">
        <div className="wrap">
          <div className="teaser__head">
            <div className="stack" style={{ ['--gap' as string]: '14px' }}>
              <Eyebrow>
                Now serving · updated <span className="no-phone">{longDate(menu.updated)}</span>
                <span className="phone-only">{shortDate(menu.updated)}</span>
              </Eyebrow>
              <h2 id="menu-title" className="h2">
                Three courses. Your choice at each.
              </h2>
            </div>
            <div className="teaser__price">
              <p className="teaser__amount nums">${menu.price}</p>
              <p className="small">{menu.priceNote}</p>
            </div>
          </div>
          <div className="courses">
            {courses.map((c) => (
              <div className="course" key={c.key}>
                <Photo src={c.photo.image} alt={c.photo.alt} className="course__photo" sizes="(min-width: 1080px) 400px, 290px" />
                <div className="course__head">
                  <h3 className="course__title">
                    <Link href={`/menus#${c.key}`}>{c.title}</Link>
                  </h3>
                  <span className="eyebrow eyebrow--muted course__count">
                    <span className="course__count--short">{c.dishes.length} choices</span>
                    <span className="course__count--long">Choose one of {c.dishes.length}</span>
                  </span>
                </div>
                <ul className="course__names">
                  {c.dishes.map((d) => (
                    <li key={d.name}>{d.name}</li>
                  ))}
                </ul>
                <p className="caption course__caption">{c.photo.caption}</p>
              </div>
            ))}
          </div>
          <div className="teaser__foot">
            <p className="body teaser__note">
              The menu follows the season, so dishes change as ingredients come and go. Questions about the menu? We welcome
              your <a href={tel}>call</a> or <a href={mailto}>email</a> anytime.
            </p>
            <div className="actions">
              <TextLink href="/menus">Full menu and wine list</TextLink>
              <ReserveButton className="no-phone" />
            </div>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------------- the room and private dining */}
      <section className="bg-linen" aria-labelledby="private-title">
        <Photo
          src="/photos/dining-room.jpg"
          alt="The long dining room at Kismet, with a leather banquette, round walnut mirrors and brass lamps on white tablecloths"
          className="room__photo"
          sizes="100vw"
          position="50% 55%"
        />
        <div className="wrap room__body" style={{ maxWidth: 'calc(var(--content) + 2 * var(--gutter))' }}>
          <div className="stack room__aside" style={{ ['--gap' as string]: '20px' }}>
            <p className="italic room__caption">
              One room on Main Street, with walnut mirrors, brass lamps and a blue bench out front that came from the Portland airport.
            </p>
            <p className="italic no-phone">
              Celebrating at a regular table? Let us know ahead, and you’re welcome to bring the birthday cake, as long as the
              chef gets a slice.
            </p>
          </div>
          <div className="stack room__private" style={{ ['--gap' as string]: '18px' }}>
            <Eyebrow>Private dining</Eyebrow>
            <h2 id="private-title" className="h2">
              Have the whole room.
            </h2>
            <p className="body">
              Rehearsal dinners, milestone birthdays, business dinners and holiday parties. Tell us the date, the headcount and the
              occasion, and we’ll plan the evening with you.
            </p>
            <div>
              <ButtonLink href="/private-dining" variant="outline">
                Plan a private dinner
              </ButtonLink>
            </div>
            <p className="italic phone-only">
              Celebrating at a regular table? Let us know ahead, and you’re welcome to bring the birthday cake, as long as the
              chef gets a slice.
            </p>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------------- the bar */}
      <section className="section bg-esp" aria-labelledby="bar-title">
        <div className="wrap split">
          <Photo
            src="/photos/bar.jpg"
            alt="Late afternoon sun across the Kismet bar as a bartender polishes glasses"
            className="split__a bar__photo"
            sizes="(min-width: 1080px) 40vw, 100vw"
            position="45% 50%"
          />
          <div className="split__b stack bar__text">
            <Eyebrow tone="brass">The bar and cellar</Eyebrow>
            <h2 id="bar-title" className="h2">
              A glass of something good.
            </h2>
            <p className="body">{drinks.barIntro}</p>
            <ul className="cocktail-list">
              {drinks.cocktails.map((c) => (
                <li key={c.name}>
                  <span className="cocktail-list__name">{c.name}</span>
                  <span className="cocktail-list__price">{c.price}</span>
                  <span className="cocktail-list__desc">{c.description}</span>
                </li>
              ))}
            </ul>
            <p className="body">{drinks.corkage}</p>
            <TextLink href="/menus#cocktails" tone="brass">
              See the wine list
            </TextLink>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------------- reviews, Instagram, press */}
      <section className="section bg-sand" aria-labelledby="proof-title">
        <div className="wrap stack proof">
          <div className="proof__top">
            <div className="stack" style={{ ['--gap' as string]: '14px' }}>
              <Eyebrow>What guests say</Eyebrow>
              <h2 id="proof-title" className="h2">
                Word is getting around.
              </h2>
            </div>
            <div className="proof__ratings">
              {site.ratings.map((r) => (
                <div className="rating" key={r.source}>
                  <p className="rating__score nums">{r.score}</p>
                  <Stars label={`${r.score} out of 5 stars`} />
                  <p className="small" style={{ color: 'var(--ink2)' }}>
                    on {r.source}
                  </p>
                  <TextLink href={r.url} newTab>
                    Read reviews
                  </TextLink>
                </div>
              ))}
            </div>
          </div>
          <div className="ig">
            <div className="ig__head">
              <p className="ig__line">
                {site.links.instagramHandle} <span>New dishes, the farms behind them and the room at golden hour.</span>
              </p>
              <TextLink href={site.links.instagram} newTab className="ig__follow-top">
                Follow on Instagram
              </TextLink>
            </div>
            <div className="ig__grid">
              {igTiles.map((t) => (
                <a key={t.src} href={site.links.instagram} target="_blank" rel="noopener noreferrer" aria-label={`${t.alt}, on Instagram`}>
                  <Photo src={t.src} alt="" sizes="(min-width: 1080px) 200px, 33vw" />
                </a>
              ))}
            </div>
            <TextLink href={site.links.instagram} newTab className="ig__follow-bottom">
              Follow on Instagram
            </TextLink>
          </div>
          <div className="proof__bottom">
            <div className="proof__press">
              <Eyebrow tone="muted">As featured by</Eyebrow>
              <p className="proof__outlets">
                {site.featuredBy.map((o, i) => (
                  <Fragment key={o.name}>
                    <span className="nowrap">
                      {o.name}
                      {i < site.featuredBy.length - 1 ? ' ·' : ''}
                    </span>{' '}
                  </Fragment>
                ))}
              </p>
            </div>
            <div className="proof__review">
              <p className="body">Dined with us recently? A Google review helps a new restaurant more than anything.</p>
              <div>
                <ButtonLink href={site.links.googleReview} variant="outline" size="sm" newTab>
                  Write a Google review
                </ButtonLink>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------------- visit */}
      <section id="visit" className="section bg-paper" aria-labelledby="visit-title">
        <div className="wrap split split--top">
          <div className="split__a stack visit__main">
            <Eyebrow>Visit</Eyebrow>
            <h2 id="visit-title" className="h2">
              {site.address.street}
            </h2>
            <p className="body">
              {site.address.city}, {site.address.stateName} {site.address.zip}. {site.address.directionsNote}
            </p>
            <div className="visit__hours">
              <table className="hours-table">
                <caption className="visually-hidden">Hours</caption>
                <thead>
                  <tr>
                    <td />
                    <th scope="col">Opens</th>
                    <th scope="col">Last seating</th>
                  </tr>
                </thead>
                <tbody>
                  {groupHours(hours.week).map((g) => (
                    <tr key={g.label}>
                      <th scope="row">{g.label}</th>
                      {g.open ? (
                        <>
                          <td>{clockFull(g.firstTable)}</td>
                          <td>{clockFull(g.lastTable)}</td>
                        </>
                      ) : (
                        <td colSpan={2}>Closed</td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
              {hours.closingNote ? <p className="small">{hours.closingNote}</p> : null}
            </div>
            <div className="visit__booking">
              <Eyebrow tone="muted">Reservations</Eyebrow>
              <p className="body">{bookingNote(hours.booking)}</p>
            </div>
            <div className="visit__buttons">
              <ButtonLink href={site.links.directions} icon="pin" newTab>
                Get directions
              </ButtonLink>
              <ButtonLink href={tel} variant="outline" icon="phone">
                Call us
              </ButtonLink>
            </div>
          </div>
          <div className="split__b visit__aside">
            <Eyebrow tone="muted">Before you come</Eyebrow>
            <div className="rows">
              {site.gettingHere.map((r) => (
                <div className="row-pair" key={r.title}>
                  <p className="row-pair__title">{r.title}</p>
                  <p className="body">{r.text}</p>
                </div>
              ))}
              <div className="row-pair">
                <p className="row-pair__title">Contact</p>
                <div className="stack" style={{ ['--gap' as string]: '10px' }}>
                  <div className="contact-links">
                    <a href={tel}>{site.phone}</a>
                    <a href={mailto}>{site.email}</a>
                  </div>
                  <p className="small">{site.runningLate}</p>
                </div>
              </div>
              <div className="row-pair" id="gift-certificates">
                <p className="row-pair__title">Gift certificates</p>
                <p className="body">{site.giftCertificates}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------------- email list */}
      <section id="notes" className="section bg-chambray" aria-labelledby="notes-title">
        <div className="wrap notes">
          <div className="stack notes__text" style={{ ['--gap' as string]: '14px' }}>
            <Eyebrow tone="ink2">Notes from the kitchen</Eyebrow>
            <h2 id="notes-title" className="h2 h2--sm">
              Hear about the new menu first.
            </h2>
            <p className="body">A short note from Chef Eric about once a season, with what’s new on the menu. Nothing more.</p>
          </div>
          <div className="notes__form">
            <EmailSignup email={site.email} />
          </div>
        </div>
      </section>
    </>
  )
}
