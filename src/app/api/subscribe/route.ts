// Email sign-up for "Notes from the kitchen".
import { clean, isEmail, submitToHubSpot } from '@/lib/hubspot'

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as Record<string, unknown> | null
  if (!body) return Response.json({ ok: false, message: 'Something went wrong. Please try again.' }, { status: 400 })
  // the hidden "company" field is a trap for spam bots; people never see it
  if (clean(body.company)) return Response.json({ ok: true })
  if (!isEmail(body.email)) return Response.json({ ok: false, message: 'Please check your email address.' }, { status: 400 })
  return submitToHubSpot(process.env.HUBSPOT_SIGNUP_FORM_ID, {
    fields: [{ name: 'email', value: clean(body.email, 254) }],
    pageUri: clean(body.pageUri, 500),
    pageName: clean(body.pageName, 200),
  })
}
