import type { Metadata, Viewport } from 'next'
import localFont from 'next/font/local'
import type { ReactNode } from 'react'
import { ResyLoader } from '@/components/Resy'
import { site } from '@/lib/content'
import './globals.css'

// Newsreader and Archivo, served from the site itself (both are open-source, SIL Open Font License).
const newsreader = localFont({
  src: [
    { path: './fonts/newsreader-latin-standard-normal.woff2', style: 'normal', weight: '200 800' },
    { path: './fonts/newsreader-latin-standard-italic.woff2', style: 'italic', weight: '200 800' },
  ],
  variable: '--font-newsreader',
  display: 'swap',
  fallback: ['Iowan Old Style', 'Palatino Linotype', 'Georgia', 'serif'],
})

const archivo = localFont({
  src: [{ path: './fonts/archivo-latin-standard-normal.woff2', style: 'normal', weight: '100 900' }],
  variable: '--font-archivo',
  display: 'swap',
  declarations: [{ prop: 'font-stretch', value: '62% 125%' }],
  fallback: ['Avenir Next', 'Segoe UI', 'sans-serif'],
})

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.kismetvancouver.com'

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Kismet · Seasonal fine dining in Vancouver, WA',
    template: '%s · Kismet',
  },
  description: site.description,
  applicationName: site.name,
  openGraph: { type: 'website', siteName: site.name, locale: 'en_US' },
  twitter: { card: 'summary_large_image' },
  formatDetection: { telephone: false, address: false, email: false },
}

export const viewport: Viewport = {
  themeColor: '#f6f0e6',
  viewportFit: 'cover',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${newsreader.variable} ${archivo.variable}`} data-scroll-behavior="smooth">
      <body>
        {children}
        <ResyLoader venueId={site.resy.venueId} apiKey={site.resy.apiKey} enabled={site.resy.useWidget} />
      </body>
    </html>
  )
}
