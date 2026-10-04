// Small shared pieces: buttons, text links, labels, placeholders.
import Link from 'next/link'
import type { ReactNode } from 'react'
import { Icon, Star, type IconName } from './Icons'
import { Brandmark } from './Logo'
import { site } from '@/lib/content'

function isExternal(href: string) {
  return /^https?:\/\//.test(href)
}

type Tone = 'ink' | 'ink2' | 'brass' | 'cream'

export function TextLink({
  href,
  children,
  tone = 'ink',
  newTab = false,
  icon = 'arrow',
  className = '',
}: {
  href: string
  children: ReactNode
  tone?: Tone
  newTab?: boolean
  icon?: IconName
  className?: string
}) {
  const cls = `tlink tlink--${tone} ${className}`.trim()
  const inner = (
    <>
      <span>{children}</span>
      <Icon name={icon} size={14} />
    </>
  )
  if (isExternal(href) || href.startsWith('tel:') || href.startsWith('mailto:') || href.endsWith('.pdf')) {
    return (
      <a href={href} className={cls} {...(newTab ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>
        {inner}
      </a>
    )
  }
  return (
    <Link href={href} className={cls}>
      {inner}
    </Link>
  )
}

export function ButtonLink({
  href,
  children,
  variant = 'primary',
  size = 'lg',
  icon,
  block = false,
  newTab = false,
  className = '',
}: {
  href: string
  children: ReactNode
  variant?: 'primary' | 'outline' | 'outline-light'
  size?: 'lg' | 'sm'
  icon?: IconName
  block?: boolean
  newTab?: boolean
  className?: string
}) {
  const cls = `btn btn--${variant} btn--${size}${block ? ' btn--block' : ''} ${className}`.trim()
  const inner = (
    <>
      {icon ? <Icon name={icon} size={16} /> : null}
      <span>{children}</span>
    </>
  )
  if (isExternal(href) || href.startsWith('tel:') || href.startsWith('mailto:') || href.endsWith('.pdf')) {
    return (
      <a href={href} className={cls} {...(newTab ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>
        {inner}
      </a>
    )
  }
  return (
    <Link href={href} className={cls}>
      {inner}
    </Link>
  )
}

/** The Reserve button. Resy's booking window opens on top of the page when its script has loaded; otherwise it goes to Resy. */
export function ReserveButton({
  children = 'Reserve a table',
  size = 'lg',
  block = false,
  className = '',
}: {
  children?: ReactNode
  size?: 'lg' | 'sm'
  block?: boolean
  className?: string
}) {
  return (
    <a href={site.links.resy} data-resy="" className={`btn btn--primary btn--${size}${block ? ' btn--block' : ''} ${className}`.trim()}>
      <span>{children}</span>
    </a>
  )
}

export function Eyebrow({ children, tone = 'ember', as: Tag = 'p' }: { children: ReactNode; tone?: 'ember' | 'muted' | 'brass' | 'ink2'; as?: 'p' | 'span' | 'h2' | 'h3' }) {
  return <Tag className={`eyebrow eyebrow--${tone}`}>{children}</Tag>
}

/** A fact or asset still to confirm before launch, shown in brackets. */
export function Placeholder({ children }: { children: ReactNode }) {
  return <span className="ph">[{children}]</span>
}

export function Stars({ label }: { label: string }) {
  return (
    <span className="stars" role="img" aria-label={label}>
      {[0, 1, 2, 3, 4].map((i) => (
        <Star key={i} size={17} />
      ))}
    </span>
  )
}

/** A round photo inside a walnut ring, after the mirrors in the dining room. */
export function Mirror({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`mirror ${className}`.trim()}>{children}</div>
}

export function PortraitPlaceholder({ label, round = false }: { label: string; round?: boolean }) {
  return (
    <div className={`portrait-ph${round ? ' portrait-ph--round' : ''}`}>
      <Brandmark decorative className="portrait-ph__mark" />
      <span className="eyebrow eyebrow--muted">
        <Placeholder>{label}</Placeholder>
      </span>
    </div>
  )
}
