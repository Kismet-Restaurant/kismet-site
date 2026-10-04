'use client'
// On phones the menu splits into Dinner, Dessert and Drinks tabs; on wider screens all three show in a row.
import { useEffect, useState, type ReactNode } from 'react'

const TABS = [
  { key: 'dinner', label: 'Dinner' },
  { key: 'dessert', label: 'Dessert' },
  { key: 'drinks', label: 'Drinks' },
] as const

type Key = (typeof TABS)[number]['key']

export function MenuTabs({ dinner, dessert, drinks }: Record<Key, ReactNode>) {
  const [tab, setTab] = useState<Key>('dinner')
  const panels: Record<Key, ReactNode> = { dinner, dessert, drinks }

  // A link like /menus#cocktails opens the tab that holds that section, then scrolls to it.
  useEffect(() => {
    const openFromHash = () => {
      const id = decodeURIComponent(window.location.hash.slice(1))
      const target = id ? document.getElementById(id) : null
      const key = target?.closest<HTMLElement>('.menu-panel')?.id.replace('menu-', '')
      const match = TABS.find((t) => t.key === key)
      if (!target || !match) return
      setTab(match.key)
      requestAnimationFrame(() => requestAnimationFrame(() => target.scrollIntoView({ block: 'start', behavior: 'instant' })))
    }
    const timer = window.setTimeout(openFromHash, 0)
    window.addEventListener('hashchange', openFromHash)
    return () => {
      window.clearTimeout(timer)
      window.removeEventListener('hashchange', openFromHash)
    }
  }, [])
  return (
    <div className="menu-tabs" data-tab={tab}>
      <div className="menu-tabs__bar wrap">
        <div className="menu-tabs__buttons">
          {TABS.map((t) => (
            <button
              key={t.key}
              type="button"
              aria-pressed={tab === t.key}
              aria-controls={`menu-${t.key}`}
              onClick={() => {
                setTab(t.key)
                // back to the top of the menu if the reader had scrolled down into the last tab
                const top = document.getElementById('menu-tabs-top')
                if (top && top.getBoundingClientRect().top < 0) top.scrollIntoView({ block: 'start' })
              }}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>
      {TABS.map((t) => (
        <div key={t.key} id={`menu-${t.key}`} className="menu-panel" data-active={tab === t.key ? '' : undefined}>
          {panels[t.key]}
        </div>
      ))}
    </div>
  )
}
