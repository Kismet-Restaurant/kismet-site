import type { Metadata } from 'next'
import { ButtonLink, Eyebrow, TextLink } from '@/components/Bits'
import { InquiryForm } from '@/components/Forms'
import { Photo } from '@/components/Photo'
import { hours, site, tel } from '@/lib/content'

const { longTableMax, roomSeats } = site.privateDining

export const metadata: Metadata = {
  title: 'Private dining',
  description: `Rehearsal dinners, milestone birthdays, business dinners and holiday parties at Kismet in Vancouver, Washington. The whole room for up to ${roomSeats} seated guests, or a long table for up to ${longTableMax} during service.`,
  alternates: { canonical: '/private-dining' },
}

const STEPS = [
  { num: 'i.', title: 'Tell us about it', text: 'Send the date, headcount and occasion with the form below, or call us.' },
  { num: 'ii.', title: 'Plan it together', text: 'Chef Eric plans a menu around your evening; we’ll work out the wine and timing with you.' },
  { num: 'iii.', title: 'Hold the date', text: 'We confirm the details in writing and hold your table or the room.' },
]

export default function PrivateDiningPage() {
  // Parties of callFromPartySize or more call; smaller parties book on Resy. With 7 in content/hours.json:
  // "A long table for 7 to 16 guests ... Call us to book it; for 6 people or fewer, reserve on Resy."
  const large = hours.booking.callFromPartySize || 7
  return (
    <>
      <section className="pd-hero bg-linen" aria-labelledby="pd-title">
        <div className="pd-hero__text stack">
          <Eyebrow>Private dining</Eyebrow>
          <h1 id="pd-title" className="display display--xl">
            The whole room is yours.
          </h1>
          <p className="lede">
            Kismet is one intimate room on Main Street, which makes it a natural fit for rehearsal dinners, milestone birthdays,
            business dinners and holiday parties.
          </p>
          <div className="actions">
            <ButtonLink href="#inquiry">Start an inquiry</ButtonLink>
            <TextLink href={tel}>Call {site.phone}</TextLink>
          </div>
        </div>
        <Photo
          src="/photos/table-lamps.jpg"
          alt="Brass lamps glowing along a row of set tables beside the banquette"
          className="pd-hero__photo"
          sizes="(min-width: 1080px) 50vw, 100vw"
          position="40% 50%"
          priority
        />
      </section>

      <section className="section bg-paper" aria-labelledby="formats-title">
        <div className="wrap stack" style={{ ['--gap' as string]: 'clamp(28px, 4vw, 56px)' }}>
          <div className="stack" style={{ ['--gap' as string]: '16px' }}>
            <Eyebrow>Two ways to gather</Eyebrow>
            <h2 id="formats-title" className="h2">
              A long table, or the room to yourselves.
            </h2>
          </div>
          <div className="formats">
            <div className="format">
              <Eyebrow>Large party</Eyebrow>
              <h3>A long table</h3>
              <p className="body">
                A long table for {large} to {longTableMax} guests during regular service. Everyone chooses from the three-course menu.
                Call us to book it
                {large > 2 ? `; for ${large - 1} people or fewer, reserve on Resy.` : '.'}
              </p>
            </div>
            <div className="format">
              <Eyebrow>Buyout</Eyebrow>
              <h3>The whole room</h3>
              <p className="body">
                The dining room to yourselves for up to {roomSeats} seated guests, with a menu Chef Eric plans around your evening.
              </p>
            </div>
          </div>
          <p className="good-for">Good for rehearsal dinners · milestone birthdays · business dinners · holiday parties · anniversaries</p>
        </div>
      </section>

      <section className="section bg-linen" aria-labelledby="steps-title">
        <div className="wrap stack" style={{ ['--gap' as string]: 'clamp(28px, 4vw, 56px)' }}>
          <div className="stack" style={{ ['--gap' as string]: '16px' }}>
            <Eyebrow>How it works</Eyebrow>
            <h2 id="steps-title" className="h2">
              Three steps to the evening.
            </h2>
          </div>
          <ol className="steps">
            {STEPS.map((s) => (
              <li className="step" key={s.num}>
                <p className="step__num" aria-hidden="true">
                  {s.num}
                </p>
                <h3>{s.title}</h3>
                <p className="body">{s.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section id="inquiry" className="section bg-paper" aria-labelledby="inquiry-title">
        <div className="wrap inquiry-wrap">
          <div className="stack">
            <Eyebrow>Inquiry</Eyebrow>
            <h2 id="inquiry-title" className="h2 h2--sm">
              Tell us about your evening.
            </h2>
            <p className="body">
              We’ll reply by the end of our next business day. Prefer to talk? Call {site.phone} or write to {site.email}.
            </p>
          </div>
          <InquiryForm email={site.email} phone={site.phone} maxGuests={roomSeats} />
        </div>
      </section>

      <section className="bg-paper" style={{ padding: '0 var(--gutter) var(--section)' }} aria-hidden="true">
        <div className="wrap photo-strip">
          <Photo src="/photos/lamb-sm.jpg" alt="" sizes="(min-width: 720px) 33vw, 33vw" />
          <Photo src="/photos/tenderloin-sm.jpg" alt="" sizes="(min-width: 720px) 33vw, 33vw" />
          <Photo
            src="/photos/dining-room-evening-sm.jpg"
            alt="The dining room during dinner, with brass lamps along the banquette tables and guests out of focus beyond"
            sizes="(min-width: 720px) 33vw, 33vw"
          />
        </div>
      </section>
    </>
  )
}
