'use client'
// Main navigation: inline links on wider screens, a full-screen menu on phones.
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useRef, useState, type ReactNode } from 'react'
import { Icon } from './Icons'

export type NavItem = { label: string; href: string }

function isActive(pathname: string, href: string) {
  if (href.includes('#')) return false
  return href === '/' ? pathname === '/' : pathname.startsWith(href)
}

export function NavLinks({ items }: { items: NavItem[] }) {
  const pathname = usePathname()
  return (
    <nav aria-label="Main" className="site-nav">
      <ul>
        {items.map((item) => (
          <li key={item.href}>
            <Link href={item.href} aria-current={isActive(pathname, item.href) ? 'page' : undefined}>
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  )
}

export function MobileMenu({
  items,
  extras,
  phone,
  tel,
  address,
  reserve,
}: {
  items: NavItem[]
  extras: NavItem[]
  phone: string
  tel: string
  address: string
  /** The Reserve button. The open menu covers the action bar, so it needs its own. */
  reserve: ReactNode
}) {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()
  const button = useRef<HTMLButtonElement>(null)
  const panel = useRef<HTMLDivElement>(null)

  useEffect(() => setOpen(false), [pathname])

  useEffect(() => {
    if (!open) return
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    panel.current?.querySelector<HTMLElement>('a, button')?.focus()
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false)
        button.current?.focus()
        return
      }
      if (e.key !== 'Tab' || !panel.current) return
      // keep keyboard focus inside the open menu
      const focusable = [...panel.current.querySelectorAll<HTMLElement>('a[href], button')]
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }
    document.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = previous
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  return (
    <div className="mobile-menu">
      <button
        ref={button}
        type="button"
        className="icon-button"
        aria-expanded={open}
        aria-controls="mobile-menu-panel"
        aria-label="Open menu"
        onClick={() => setOpen(true)}
      >
        <Icon name="menu" size={22} />
      </button>
      <div
        id="mobile-menu-panel"
        ref={panel}
        className="mobile-menu__panel"
        role="dialog"
        aria-modal="true"
        aria-label="Menu"
        hidden={!open}
      >
        <div className="mobile-menu__top">
          <button
            type="button"
            className="icon-button"
            aria-label="Close menu"
            onClick={() => {
              setOpen(false)
              button.current?.focus()
            }}
          >
            <Icon name="close" size={22} />
          </button>
        </div>
        <nav aria-label="Main">
          <ul className="mobile-menu__main">
            {[{ label: 'Home', href: '/' }, ...items].map((item) => (
              <li key={item.href}>
                <Link href={item.href} onClick={() => setOpen(false)} aria-current={isActive(pathname, item.href) ? 'page' : undefined}>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
          <ul className="mobile-menu__extras">
            {extras.map((item) => (
              <li key={item.href}>
                {item.href.startsWith('/') ? (
                  <Link href={item.href} onClick={() => setOpen(false)}>
                    {item.label}
                  </Link>
                ) : (
                  <a href={item.href} target="_blank" rel="noopener noreferrer">
                    {item.label}
                  </a>
                )}
              </li>
            ))}
          </ul>
        </nav>
        {/* Close the menu as Resy's booking window opens, so the window isn't left behind it */}
        <div className="mobile-menu__reserve" onClickCapture={() => setOpen(false)}>
          {reserve}
        </div>
        <div className="mobile-menu__contact">
          <a href={tel}>{phone}</a>
          <p>{address}</p>
        </div>
      </div>
    </div>
  )
}
