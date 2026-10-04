import type { ReactNode } from 'react'
import { Notice } from '@/components/Chrome'

// The link page and the thank-you page: no header or footer, but the notice still shows.
export default function BareLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Notice />
      {children}
    </>
  )
}
