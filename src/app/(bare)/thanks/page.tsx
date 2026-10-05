import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import Link from 'next/link'
import { ButtonLink, Mirror } from '@/components/Bits'
import { Icon, type IconName } from '@/components/Icons'
import { PrimaryLogo } from '@/components/Logo'
import { Photo } from '@/components/Photo'
import { mailto, site } from '@/lib/content'

// The page guests reach after dinner, from a QR code on a card with the check.
export const metadata: Metadata = {
  title: 'Thank you',
  description: 'Thank you for dining at Kismet.',
  robots: { index: false, follow: false },
}

function Row({ href, icon, children }: { href: string; icon: IconName; children: ReactNode }) {
  const external = /^https?:/.test(href)
  const inner = (
    <>
      <span>
        <Icon name={icon} size={18} />
        {children}
      </span>
      <Icon name="arrow" size={16} />
    </>
  )
  return external ? (
    <a className="link-row" href={href} target="_blank" rel="noopener noreferrer">
      {inner}
    </a>
  ) : (
    <Link className="link-row" href={href}>
      {inner}
    </Link>
  )
}

export default function ThanksPage() {
  return (
    <main className="bare">
      <div className="bare__col">
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <Link href="/" aria-label={`${site.name}, home`}>
            <PrimaryLogo decorative className="bare__logo" style={{ height: 56 }} />
          </Link>
        </div>
        <div className="thanks__mirror">
          <Mirror>
            <Photo
              src="/photos/creme-brulee-above-sm.jpg"
              alt="Crème brûlée on a paper liner stamped with the Kismet logo, seen from above"
              sizes="176px"
              priority
            />
          </Mirror>
        </div>
        <h1 className="thanks__title">Thank you for joining us.</h1>
        <p className="body thanks__body">
          Kismet is still new, and reviews help more than anything. If you have a minute, tell people about your evening.
        </p>
        <ButtonLink href={site.links.googleReview} block newTab>
          Leave a Google review
        </ButtonLink>
        <Row href={site.links.instagram} icon="camera">
          Tag {site.links.instagramHandle}
        </Row>
        <Row href="/#notes" icon="mail">
          Notes from the kitchen
        </Row>
        <Row href={site.links.resy} icon="calendar">
          Book your next evening
        </Row>
        <div className="thanks__foot">
          <p className="body" style={{ fontSize: 16 }}>
            Anything we should know? Write to us at <a href={mailto}>{site.email}</a>.
          </p>
          <p className="eyebrow eyebrow--muted" style={{ paddingTop: 10 }}>
            {site.address.street} · {site.address.city}, {site.address.state}
          </p>
        </div>
      </div>
    </main>
  )
}
