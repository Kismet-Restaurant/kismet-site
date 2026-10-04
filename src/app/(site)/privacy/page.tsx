import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import { Eyebrow, Placeholder } from '@/components/Bits'
import { mailto, site } from '@/lib/content'

export const metadata: Metadata = {
  title: 'Privacy',
  description: 'What Kismet keeps about you, and why.',
  alternates: { canonical: '/privacy' },
}

export default function PrivacyPage() {
  const email = <a href={mailto}>{site.email}</a>
  const rows: { title: string; body: ReactNode }[] = [
    {
      title: 'Reservations',
      body: 'Reservations are made through Resy, which handles your booking under its own privacy policy. We see your name, contact details, party size and any notes, so we can prepare for your visit.',
    },
    {
      title: 'Notes from the kitchen',
      body: 'If you join our email list, we keep your email address with our email service and use it only for notes from the kitchen, about once a season. Every email has an unsubscribe link.',
    },
    {
      title: 'Private dining inquiries',
      body: 'When you send an inquiry, we use your name, email, phone, date, party size and notes to plan your event and reply to you.',
    },
    {
      title: 'Site visits',
      body: (
        <>
          <Placeholder>Analytics tool, once chosen</Placeholder> counts page visits so we can see which pages help guests.
        </>
      ),
    },
    {
      title: 'What we don’t do',
      body: 'We don’t sell or rent your information, and we share it only with the services above that help us run the restaurant.',
    },
    {
      title: 'Your choices',
      body: <>Unsubscribe from any email with one click. To see, correct or delete what we hold about you, write to {email}.</>,
    },
    {
      title: 'Questions',
      body: (
        <>
          Write to {email} or call {site.phone}. {site.name}, {site.address.street}, {site.address.city}, {site.address.stateName}{' '}
          {site.address.zip}.
        </>
      ),
    },
  ]
  return (
    <>
      <section className="section bg-linen" style={{ paddingBottom: 'clamp(32px, 4.5vw, 64px)' }}>
        <div className="wrap stack">
          <Eyebrow>Privacy</Eyebrow>
          <h1 className="display">What we keep, and why.</h1>
          <p className="lede" style={{ maxWidth: 760 }}>
            We collect only what we need to seat you, answer you and send the notes you ask for. We never sell it.
          </p>
          <p className="small">
            Last updated <Placeholder>date of launch</Placeholder>
          </p>
        </div>
      </section>
      <section className="section bg-linen" style={{ paddingTop: 0 }}>
        <div className="wrap policy">
          {rows.map((r) => (
            <div key={r.title}>
              <h2>{r.title}</h2>
              <p className="body">{r.body}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  )
}
