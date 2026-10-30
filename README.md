# Kismet website

The website for Kismet, seasonal fine dining at 909 Main Street, Vancouver, Washington.

- **Code:** this repository, in Kismet's GitHub organization.
- **Hosting:** Vercel. Every change pushed to `main` goes live in about a minute. Every other branch gets its own private preview link.
- **Editing:** Claude Code. Every change is made on a branch, so it gets a preview link before it goes live.

## How editing works

### For Arthur: Claude

Open this repository with Claude and ask in plain words, for example:

- "Here's the new menu PDF. Update the menu, the photos and the PDF link."
- "We're closed November 26 for Thanksgiving. Add the closed date and a notice."
- "Add the new article from The Columbian to the press list."

Claude edits the content files on a branch and checks the build, so every change gets a preview link before it goes live.

## Common jobs

**A new menu**

The menu changes when ingredients come and go, not on a schedule. The site shows the date it was last updated, so there's no month to change.

1. Upload the new menu PDF (and wine list PDF if it changed).
2. In `content/menu.json`: change the date updated, the dishes and, if needed, the photos and captions.
3. Check the home page menu preview and the Menus page on your phone.
4. The Links and Thanks pages show the crab cake and the crème brûlée. If either leaves the menu, ask Claude to swap the photo.

**A holiday or a private buyout**

1. Add the date to the closed dates in `content/hours.json`. The open/closed line and the booking buttons skip it.
2. Turn on the **notice** with a short line, like "Closed Thanksgiving Day. Back Friday at 5 pm." It shows at the top of every page, Links and Thanks included. Turn it off afterward.
3. Block the date in Resy and update Google Business Profile too. The website doesn't change either of those.

**Hours change**

Change the weekly hours in `content/hours.json`. Every place on the site that shows hours, plus the live "Open now" line and Google's structured data, comes from there. Update Resy and Google Business Profile to match.

## Where things live

| What | Where |
| --- | --- |
| Menu, drinks, hours, details | `content/menu.json`, `content/drinks.json`, `content/hours.json`, `content/site.json` |
| Photos | `public/photos` |
| Menu and wine list PDFs | `public/pdf` |
| Pages | `src/app` (home, menus, story, private dining, privacy, links, thanks) |
| Shared pieces | `src/components` |
| Hours logic, content types, HubSpot, structured data | `src/lib` |
| The people on Our story (names, roles, bios) | `src/lib/people.ts` |
| The plain-text summary for AI assistants, at /llms.txt | `src/app/llms.txt/route.ts` (built from the content files) |
| Styles | `src/app/globals.css` |
| Fonts (Newsreader and Archivo, SIL Open Font License) | `src/app/fonts` |
| Notes that tell Claude how this site works | `CLAUDE.md` |

Two pages are for guests who arrive from somewhere specific and are hidden from search engines:

- `/links` is the page the Instagram bio links to.
- `/thanks` is for the QR code on the card that comes with the check. It asks for a Google review.

## Settings in Vercel

Set these in Vercel under **Project → Settings → Environment Variables**:

| Name | What it is |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | `https://www.kismetvancouver.com` |
| `HUBSPOT_PORTAL_ID` | The HubSpot account ID |
| `HUBSPOT_SIGNUP_FORM_ID` | The HubSpot form for "Notes from the kitchen" |
| `HUBSPOT_INQUIRY_FORM_ID` | The HubSpot form for private dining inquiries |

Until the HubSpot values are set, both forms show a friendly line asking guests to email instead. Nothing is lost silently.

## Resy

Every Reserve button is a normal link to Kismet's page on Resy, so it works even if Resy's script doesn't load. When `resy.useWidget` is `true` in `content/site.json`, the site also loads Resy's booking window so guests can book without leaving the page. To switch the booking window off and use plain links only, set it to `false`.

The quick date buttons on the home page ("Tonight", "Tomorrow" and so on) open Resy with that date and a party of two already chosen.

## Check on the first preview

- [ ] On a phone and a laptop, tap **Reserve**. Resy's booking window should open over the page, and the button should keep Kismet's own look. If the button changes or nothing opens, set `resy.useWidget` to `false` and tell Claude.
- [ ] Tap a quick date button. Resy should open on that date.
- [ ] Add `?service=before`, `?service=open`, `?service=after` or `?service=closed` to the home page address to see each version of the live headline.
- [ ] Try the email sign-up and the private dining form. Before HubSpot is connected, each should show the line asking guests to email instead.
- [ ] Open `/links` and `/thanks` on a phone.

## Before launch

- Point the domain at Vercel (the steps are in the build checklist).

## Run it on a computer

You need Node.js 22.

```bash
npm install
npm run dev     # http://localhost:3000
npm run build   # the same check Vercel runs before publishing
```

Most photos are by Ashley Courter. Kismet has full rights to all of them.
