'use client'
// Shows its children until the end of a given day in Vancouver, Washington, then hides them.
// The pages are built ahead of time, so the check runs in the visitor's browser: something dated
// (the New Year's Eve banner, say) disappears on its own the next morning, without a new deploy.
import { useEffect, useState, type ReactNode } from 'react'
import { isoDay, localNow } from '@/lib/hours'

export function ShowUntil({ until, children }: { until?: string; children: ReactNode }) {
  const [past, setPast] = useState(false)
  useEffect(() => {
    if (!until) return
    const check = () => setPast(isoDay(localNow()) > until)
    check()
    const id = window.setInterval(check, 60_000)
    return () => window.clearInterval(id)
  }, [until])
  return past ? null : <>{children}</>
}
