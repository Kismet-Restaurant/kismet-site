// Sends form entries to HubSpot's Forms API. Nothing is sent until the HubSpot keys are set in Vercel
// (HUBSPOT_PORTAL_ID plus a form ID); until then the routes answer that sign-ups open soon.
import { site } from './content'

type Field = { name: string; value: string }

export type Submission = { fields: Field[]; pageUri?: string; pageName?: string }

export function isEmail(value: unknown): value is string {
  return typeof value === 'string' && value.length <= 254 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
}

export function clean(value: unknown, max = 2000): string {
  return typeof value === 'string' ? value.trim().slice(0, max) : ''
}

export async function submitToHubSpot(formId: string | undefined, submission: Submission): Promise<Response> {
  const portalId = process.env.HUBSPOT_PORTAL_ID
  if (!portalId || !formId) {
    return Response.json(
      { ok: false, message: `This form switches on when our email service is connected. In the meantime, write to ${site.email}.` },
      { status: 503 },
    )
  }
  const res = await fetch(`https://api.hsforms.com/submissions/v3/integration/submit/${portalId}/${formId}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      submittedAt: Date.now(),
      fields: submission.fields.filter((f) => f.value).map((f) => ({ objectTypeId: '0-1', name: f.name, value: f.value })),
      context: { pageUri: submission.pageUri, pageName: submission.pageName },
    }),
  })
  if (!res.ok) {
    console.error('HubSpot form submission failed', res.status, await res.text().catch(() => ''))
    return Response.json(
      { ok: false, message: `That didn’t go through. Please try again, or write to ${site.email}.` },
      { status: 502 },
    )
  }
  return Response.json({ ok: true })
}
