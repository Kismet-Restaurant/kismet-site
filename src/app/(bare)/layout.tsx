import type { ReactNode } from 'react'
import { Notice } from '@/components/Notice'

// The Links and Thanks pages have no header or footer, but they show the notice, so a holiday closure
// reaches guests who come from Instagram or the card with the check.
export default function BareLayout({ children }: { children: ReactNode }) {
  return (
    <div className="site">
      <Notice />
      {children}
    </div>
  )
}
