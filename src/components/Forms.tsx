'use client'
// The email sign-up and the private dining inquiry. Both post to the site's own /api routes,
// which pass them to HubSpot once its keys are set in Vercel.
import { useEffect, useId, useState, type FormEvent } from 'react'

type Status = { kind: 'idle' | 'sending' | 'done' | 'error'; message?: string }

async function send(url: string, data: Record<string, string>): Promise<Status> {
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...data, pageUri: window.location.href, pageName: document.title }),
    })
    const body = (await res.json().catch(() => ({}))) as { message?: string }
    return res.ok ? { kind: 'done', message: body.message } : { kind: 'error', message: body.message }
  } catch {
    return { kind: 'error' }
  }
}

function fields(form: HTMLFormElement): Record<string, string> {
  const out: Record<string, string> = {}
  new FormData(form).forEach((value, key) => {
    out[key] = String(value)
  })
  return out
}

export function EmailSignup({ email }: { email: string }) {
  const id = useId()
  const [status, setStatus] = useState<Status>({ kind: 'idle' })

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget
    setStatus({ kind: 'sending' })
    const result = await send('/api/subscribe', fields(form))
    setStatus(result)
    if (result.kind === 'done') form.reset()
  }

  if (status.kind === 'done') {
    return (
      <div className="signup signup--done" role="status">
        <p className="signup__thanks">You’re on the list.</p>
        <p className="small">The next note arrives with the change of season.</p>
      </div>
    )
  }

  return (
    <form className="signup" onSubmit={onSubmit} noValidate={false}>
      <label htmlFor={`${id}-email`} className="eyebrow eyebrow--ink2">
        Email address
      </label>
      <div className="signup__row">
        <input id={`${id}-email`} name="email" type="email" autoComplete="email" required placeholder="you@example.com" className="input" />
        <button type="submit" className="btn btn--primary btn--lg" disabled={status.kind === 'sending'}>
          {status.kind === 'sending' ? 'Signing up…' : 'Sign up'}
        </button>
      </div>
      <input type="text" name="company" tabIndex={-1} autoComplete="off" className="hp" aria-hidden="true" />
      <p className="small" role={status.kind === 'error' ? 'alert' : undefined}>
        {status.kind === 'error'
          ? status.message || `That didn’t go through. Please try again, or write to ${email}.`
          : 'Unsubscribe anytime.'}
      </p>
    </form>
  )
}

/** Today's date in Vancouver, WA, as YYYY-MM-DD, so the date picker starts at today. */
function todayInVancouver(): string {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Los_Angeles', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date())
}

export function InquiryForm({ email, phone, maxGuests }: { email: string; phone: string; maxGuests: number }) {
  const [status, setStatus] = useState<Status>({ kind: 'idle' })
  const [minDate, setMinDate] = useState<string>()
  useEffect(() => setMinDate(todayInVancouver()), [])

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setStatus({ kind: 'sending' })
    setStatus(await send('/api/inquiry', fields(e.currentTarget)))
  }

  if (status.kind === 'done') {
    return (
      <div className="inquiry inquiry--done" role="status">
        <p className="inquiry__thanks">Thank you. We’ll reply by the end of our next business day.</p>
        <p className="body">If your date is soon, call us at {phone}.</p>
      </div>
    )
  }

  return (
    <form className="inquiry" onSubmit={onSubmit}>
      <div className="field">
        <label htmlFor="pd-name" className="eyebrow eyebrow--ink2">
          Name
        </label>
        <input id="pd-name" name="name" type="text" autoComplete="name" required className="input" />
      </div>
      <div className="field">
        <label htmlFor="pd-email" className="eyebrow eyebrow--ink2">
          Email
        </label>
        <input id="pd-email" name="email" type="email" autoComplete="email" required className="input" />
      </div>
      <div className="field">
        <label htmlFor="pd-phone" className="eyebrow eyebrow--ink2">
          Phone
        </label>
        <input id="pd-phone" name="phone" type="tel" autoComplete="tel" className="input" />
      </div>
      <div className="field">
        <label htmlFor="pd-date" className="eyebrow eyebrow--ink2">
          Preferred date
        </label>
        <input id="pd-date" name="date" type="date" min={minDate} className="input" />
      </div>
      <div className="field">
        <label htmlFor="pd-guests" className="eyebrow eyebrow--ink2">
          Number of guests
        </label>
        <input id="pd-guests" name="guests" type="number" inputMode="numeric" min={1} max={maxGuests} step={1} className="input" />
      </div>
      <div className="field">
        <label htmlFor="pd-occasion" className="eyebrow eyebrow--ink2">
          Occasion
        </label>
        <select id="pd-occasion" name="occasion" className="input" defaultValue="">
          <option value="">Choose one</option>
          {['Birthday', 'Anniversary', 'Rehearsal dinner', 'Business dinner', 'Holiday party', 'Something else'].map((o) => (
            <option key={o}>{o}</option>
          ))}
        </select>
      </div>
      <div className="field field--wide">
        <label htmlFor="pd-notes" className="eyebrow eyebrow--ink2">
          Anything else we should know
        </label>
        <textarea id="pd-notes" name="notes" rows={5} className="input input--area" />
      </div>
      <input type="text" name="company" tabIndex={-1} autoComplete="off" className="hp" aria-hidden="true" />
      <div className="field field--wide inquiry__send">
        <p className="small" role={status.kind === 'error' ? 'alert' : undefined}>
          {status.kind === 'error'
            ? status.message || `That didn’t go through. Please call ${phone} or write to ${email}.`
            : 'We’ll only use your details to plan your event.'}
        </p>
        <button type="submit" className="btn btn--primary btn--lg" disabled={status.kind === 'sending'}>
          {status.kind === 'sending' ? 'Sending…' : 'Send inquiry'}
        </button>
      </div>
    </form>
  )
}
