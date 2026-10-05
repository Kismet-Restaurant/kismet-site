// The frame around every main page: header, phone action bar and footer. The notice banner is in Notice.tsx.
import Link from 'next/link'
import { PrimaryLogo } from './Logo'
import { Icon } from './Icons'
import { ReserveButton } from './Bits'
import { MobileMenu, NavLinks, type NavItem } from './Nav'
import { hours, site, tel, mailto } from '@/lib/content'
import { groupHours, hoursSummary } from '@/lib/hours'

export const NAV: NavItem[] = [
  { label: 'Menus', href: '/menus' },
  { label: 'Our story', href: '/story' },
  { label: 'Private dining', href: '/private-dining' },
  { label: 'Visit', href: '/#visit' },
]

const EXTRAS: NavItem[] = [
  { label: 'Gift certificates', href: '/#gift-certificates' },
  { label: 'Instagram', href: site.links.instagram },
]

export function Header() {
  const address = `${site.address.street}, ${site.address.city}, ${site.address.state}`
  return (
    <header className="site-header">
      <div className="site-header__inner">
        <Link href="/" className="site-header__logo" aria-label={`${site.name}, home`}>
          <PrimaryLogo decorative />
        </Link>
        <NavLinks items={NAV} />
        <div className="site-header__right">
          <p className="site-header__hours">{hoursSummary(hours.week)}</p>
          {/* Hidden on phones, where the action bar has the Reserve button */}
          <ReserveButton size="sm" className="site-header__reserve">
            Reserve
          </ReserveButton>
          <MobileMenu
            items={NAV}
            extras={EXTRAS}
            phone={site.phone}
            tel={tel}
            address={address}
            reserve={<ReserveButton block />}
          />
        </div>
      </div>
    </header>
  )
}

/** Reserve, menu, call and directions, pinned to the bottom of the screen on phones. */
export function ActionBar() {
  return (
    <nav className="action-bar" aria-label="Quick actions">
      <a href={site.links.resy} data-resy="" className="action-bar__reserve">
        <Icon name="calendar" size={16} />
        <span>Reserve</span>
      </a>
      <Link href="/menus" className="action-bar__item">
        <Icon name="list" size={18} />
        <span>Menu</span>
      </Link>
      <a href={tel} className="action-bar__item">
        <Icon name="phone" size={18} />
        <span>Call</span>
      </a>
      <a href={site.links.directions} className="action-bar__item" target="_blank" rel="noopener noreferrer">
        <Icon name="pin" size={18} />
        <span>Directions</span>
      </a>
    </nav>
  )
}

export function Footer() {
  const year = new Date().getFullYear()
  return (
    <footer className="site-footer">
      <div className="wrap">
        <div className="site-footer__top">
          <PrimaryLogo title={site.name} className="site-footer__logo" />
          <div className="site-footer__cta">
            <p className="site-footer__tagline">{site.tagline}</p>
            <ReserveButton />
          </div>
        </div>
        <div className="site-footer__cols">
          <div className="site-footer__col">
            <h2 className="eyebrow eyebrow--brass">Visit</h2>
            <p>{site.address.street}</p>
            <p>
              {site.address.city}, {site.address.state} {site.address.zip}
            </p>
            <a href={site.links.directions} target="_blank" rel="noopener noreferrer">
              Get directions
            </a>
          </div>
          <div className="site-footer__col">
            <h2 className="eyebrow eyebrow--brass">Hours</h2>
            <ul className="footer-hours">
              {groupHours(hours.week).map((g) => (
                <li key={g.label}>
                  <span className="footer-hours__days">{g.short}</span>
                  {/* seatingText, "5 pm, last seating 8 pm": the room stays open later, so the footer never says "5 to 8" */}
                  <span className="footer-hours__time">{g.text}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="site-footer__col">
            <h2 className="eyebrow eyebrow--brass">Contact</h2>
            <a href={tel}>{site.phone}</a>
            <a href={mailto}>{site.email}</a>
          </div>
          <div className="site-footer__col">
            <h2 className="eyebrow eyebrow--brass">Explore</h2>
            <Link href="/menus">Menus</Link>
            <Link href="/story">Our story</Link>
            <Link href="/private-dining">Private dining</Link>
            <Link href="/#gift-certificates">Gift certificates</Link>
            <Link href="/story#press">Press</Link>
          </div>
          <div className="site-footer__col">
            <h2 className="eyebrow eyebrow--brass">Follow</h2>
            <a href={site.links.instagram} target="_blank" rel="noopener noreferrer">
              Instagram
            </a>
            <a href={site.links.facebook} target="_blank" rel="noopener noreferrer">
              Facebook
            </a>
            <a href={site.links.resy} target="_blank" rel="noopener noreferrer">
              Resy
            </a>
          </div>
        </div>
        <div className="site-footer__legal">
          <p>
            © {year} {site.legalName} <Link href="/privacy">Privacy</Link>
          </p>
        </div>
      </div>
    </footer>
  )
}
