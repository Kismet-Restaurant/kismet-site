'use client'
// Google Analytics, on the live site only: preview links and local copies load nothing.
// It also sends reserve_click when a guest taps a Reserve button (links marked data-resy) or a quick date.
import { useEffect } from 'react'

declare global {
  interface Window {
    dataLayer?: unknown[]
    gtag?: (...args: unknown[]) => void
  }
}

const LIVE_HOST = 'www.kismetvancouver.com'

export function Analytics({ id }: { id: string }) {
  useEffect(() => {
    if (!id || window.location.hostname !== LIVE_HOST) return
    const src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(id)}`
    if (!document.querySelector(`script[src="${src}"]`)) {
      const dataLayer = (window.dataLayer = window.dataLayer || [])
      window.gtag = function gtag() {
        // gtag.js reads the arguments object itself, not a copy of it
        dataLayer.push(arguments)
      }
      window.gtag('js', new Date())
      window.gtag('config', id)
      const script = document.createElement('script')
      script.src = src
      script.async = true
      document.head.appendChild(script)
    }
    const onClick = (e: MouseEvent) => {
      const link = e.target instanceof Element ? e.target.closest('a[data-resy], a.date-chip') : null
      // beacon, so the event still goes out when a quick date leaves the page for Resy
      if (link) window.gtag?.('event', 'reserve_click', { transport_type: 'beacon' })
    }
    // Listen while the click is on its way down, before Resy's booking window can take it.
    document.addEventListener('click', onClick, true)
    return () => document.removeEventListener('click', onClick, true)
  }, [id])

  return null
}
