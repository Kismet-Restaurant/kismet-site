// The notice banner from content/hours.json, at the top of every page, Links and Thanks included.
// It can end with a link ("See the menu"), and with `until` set it hides itself after that day.
import Link from 'next/link'
import { hours } from '@/lib/content'
import { ShowUntil } from './ShowUntil'

export function Notice() {
  const { show, text, link, until } = hours.notice
  if (!show || !text.trim()) return null
  return (
    <ShowUntil until={until}>
      <div className="notice" role="status">
        <p>
          {text}
          {link ? (
            <>
              {' '}
              <Link href={link.href} className="notice__link">
                {link.text}
              </Link>
            </>
          ) : null}
        </p>
      </div>
    </ShowUntil>
  )
}
