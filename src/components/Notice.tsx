// The notice banner from content/hours.json, at the top of every page, Links and Thanks included.
import { hours } from '@/lib/content'

export function Notice() {
  if (!hours.notice.show || !hours.notice.text.trim()) return null
  return (
    <div className="notice" role="status">
      <p>{hours.notice.text}</p>
    </div>
  )
}
