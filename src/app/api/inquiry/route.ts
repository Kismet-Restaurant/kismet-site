// Private dining inquiry. It lands in HubSpot as a contact, with the event details in the message.
import { clean, isEmail, submitToHubSpot } from '@/lib/hubspot'

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as Record<string, unknown> | null
  if (!body) return Response.json({ ok: false, message: 'Something went wrong. Please try again.' }, { status: 400 })
  if (clean(body.company)) return Response.json({ ok: true })
  const name = clean(body.name, 200)
  if (!name) return Response.json({ ok: false, message: 'Please add your name.' }, { status: 400 })
  if (!isEmail(body.email)) return Response.json({ ok: false, message: 'Please check your email address.' }, { status: 400 })
  const [firstname, ...rest] = name.split(/\s+/)
  const message = [
    'Private dining inquiry',
    `Preferred date: ${clean(body.date, 40) || 'not given'}`,
    `Guests: ${clean(body.guests, 40) || 'not given'}`,
    `Occasion: ${clean(body.occasion, 80) || 'not given'}`,
    `Notes: ${clean(body.notes) || 'none'}`,
  ].join('\n')
  return submitToHubSpot(process.env.HUBSPOT_INQUIRY_FORM_ID, {
    fields: [
      { name: 'firstname', value: firstname },
      { name: 'lastname', value: rest.join(' ') },
      { name: 'email', value: clean(body.email, 254) },
      { name: 'phone', value: clean(body.phone, 40) },
      { name: 'message', value: message },
    ],
    pageUri: clean(body.pageUri, 500),
    pageName: clean(body.pageName, 200),
  })
}
