'use client'
// Loads Resy's booking widget once and attaches it to every Reserve button (links marked data-resy).
// Without the script, or if it fails to load, the buttons still go straight to Kismet's page on Resy.
import { usePathname } from 'next/navigation'
import { useEffect } from 'react'

type ResyWidget = { addButton: (el: Element, options: { venueId: number; apiKey: string; replace: boolean }) => void }
declare global {
  interface Window {
    resyWidget?: ResyWidget
  }
}

const SRC = 'https://widgets.resy.com/embed.js'

export function ResyLoader({ venueId, apiKey, enabled }: { venueId: number; apiKey: string; enabled: boolean }) {
  const pathname = usePathname()

  useEffect(() => {
    if (!enabled) return
    const bind = () => {
      const widget = window.resyWidget
      if (!widget) return
      document.querySelectorAll('a[data-resy]:not([data-resy-bound])').forEach((el) => {
        try {
          // replace: false keeps Kismet's own button styling and opens Resy's booking window on click
          widget.addButton(el, { venueId, apiKey, replace: false })
          el.setAttribute('data-resy-bound', '')
        } catch {
          // leave the plain link in place
        }
      })
    }
    if (window.resyWidget) {
      bind()
      return
    }
    let script = document.querySelector<HTMLScriptElement>(`script[src="${SRC}"]`)
    if (!script) {
      script = document.createElement('script')
      script.src = SRC
      script.async = true
      document.body.appendChild(script)
    }
    script.addEventListener('load', bind)
    return () => script?.removeEventListener('load', bind)
  }, [pathname, venueId, apiKey, enabled])

  return null
}
