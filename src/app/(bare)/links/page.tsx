import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import Link from 'next/link'
import { ReserveButton } from '@/components/Bits'
import { Icon, Star, type IconName } from '@/components/Icons'
import { StatusChip } from '@/components/Live'
import { PrimaryLogo } from '@/components/Logo'
import { Photo } from '@/components/Photo'
import { hours, menu, site, tel } from '@/lib/content'

// The page Kismet's Instagram bio links to.
export const metadata: Metadata = {
  title: 'Links',
  description: 'Reserve, see the menu, plan a private dinner or find us on Main Street.',
  robots: { index: false, follow: true },
}

function Row({ href, icon, children, external = false }: { href: string; icon: IconName; children: ReactNode; external?: boolean }) {
  const inner = (
    <>
      <span>
        <Icon name={icon} size={18} />
        {children}
      </span>
      <Icon name="arrow" size={16} />
    </>
  )
  return external || href.startsWith('tel:') ? (
    <a className="link-row" href={href} {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>
      {inner}
    </a>
  ) : (
    <Link className="link-row" href={href}>
      {inner}
    </Link>
  )
}

export default function LinksPage() {
  return (
    <main className="bare">
      <div className="bare__col">
        <div className="bare__head">
          <h1>
            <PrimaryLogo title={site.name} className="bare__logo" />
          </h1>
          <div className="bare__tagline">
            <p className="eyebrow eyebrow--muted">Seasonal fine dining</p>
            <p className="eyebrow eyebrow--muted">
              {site.address.street.replace('Street', 'St')} · {site.address.city}, {site.address.state}
            </p>
          </div>
          <StatusChip week={hours.week} closed={hours.closedDates} />
        </div>
        <Link href="/menus" className="menu-card">
          <Photo src="/photos/crab-cake-sm.jpg" alt="Dungeness crab cake with herbs and sauce gribiche" sizes="430px" priority />
          <span className="menu-card__text">
            <span className="eyebrow eyebrow--brass">Now serving</span>
            <span className="menu-card__title">The menu</span>
            <span className="menu-card__sub">Three courses, your choice at each, ${menu.price}</span>
          </span>
        </Link>
        <div style={{ height: 6 }} />
        <ReserveButton block />
        <Row href="/menus" icon="list">
          See the menu
        </Row>
        <Row href="/private-dining" icon="users">
          Private dining
        </Row>
        <Row href="/#notes" icon="mail">
          Notes from the kitchen
        </Row>
        <Row href={site.links.directions} icon="pin" external>
          Get directions
        </Row>
        <Row href={tel} icon="phone">
          Call {site.phone}
        </Row>
        <Row href="/#gift-certificates" icon="gift">
          Gift certificates
        </Row>
        <p className="bare__ratings">
          <Star size={14} />
          <span>{site.ratings.map((r) => `${r.score} on ${r.source}`).join(' · ')}</span>
        </p>
        <p className="eyebrow eyebrow--muted bare__foot">
          <Link href="/" style={{ textDecoration: 'none' }}>
            kismetvancouver.com
          </Link>
        </p>
      </div>
    </main>
  )
}
