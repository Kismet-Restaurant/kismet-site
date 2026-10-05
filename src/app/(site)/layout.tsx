import type { ReactNode } from 'react'
import { ActionBar, Footer, Header } from '@/components/Chrome'
import { Notice } from '@/components/Notice'

export default function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <div className="site site--bar">
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <Notice />
      <Header />
      <main id="main">{children}</main>
      <Footer />
      <ActionBar />
    </div>
  )
}
