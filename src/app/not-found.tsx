import Link from 'next/link'
import { Footer, Header } from '@/components/Chrome'

export default function NotFound() {
  return (
    <div className="site">
      <Header />
      <main id="main" className="section bg-linen">
        <div className="wrap not-found">
          <p className="eyebrow eyebrow--ember">Page not found</p>
          <h1 className="display">This table isn’t set.</h1>
          <p className="lede">The page you were looking for has moved or never existed.</p>
          <Link href="/" className="btn btn--primary btn--lg">
            Back to the home page
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  )
}
