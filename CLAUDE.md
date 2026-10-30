# Notes for Claude

This is the website for Kismet, a seasonal fine-dining restaurant at 909 Main Street, Vancouver, Washington. Chef Eric Gallanter and Kim Sinclair own it. Arthur looks after the site.

## How the site works

- Next.js (App Router) with TypeScript. Every page is static; the only server code is `src/app/api/subscribe` and `src/app/api/inquiry`, which pass form entries to HubSpot.
- Vercel deploys `main` to production. Other branches get preview links.
- Content lives in `content/*.json`. When you add, rename or remove a field in a content file, update the types in `src/lib/content.ts` to match.
- Hours are never typed into pages. `content/hours.json` drives the hours table, the header summary, the footer hours, the live "Open now" line on the Home and Links pages, the quick booking dates, the booking rules line, the notice at the top of every page (Links and Thanks included) and the structured data for Google. A day only counts as open when "Open this day" is ticked and both times are filled in. `closedDates` holds one-off closures.
- The logo lives in `src/components/Logo.tsx`: the primary logo and the brandmark, drawn from the designer's official files. Use those components, never retype "Kismet" in a font, and don't use the designer's Primary Logo V2. The logo is Kismet orange on light backgrounds and white on Espresso.
- Search engines and AI assistants read three things built from the content files: the structured data in `src/lib/schema.ts` (one Restaurant, `@id` `/#restaurant`, on every main page, plus the menu on Menus and the people on Our story), `/llms.txt` (`src/app/llms.txt/route.ts`, the site's facts in plain text) and the sitemap. Keep them fed from `content/*.json` and `src/lib/people.ts` rather than typing facts into them. Page titles end in "· Kismet in Vancouver, WA" through the template in `src/app/layout.tsx`, because other places share the name.
- The people on Our story (names, roles, bios, photos) live in `src/lib/people.ts`.
- Reserve buttons are links to Resy marked `data-resy`; `src/components/Resy.tsx` attaches Resy's booking window to them. Leave the venue ID and API key in `content/site.json` alone.

## Common requests

- **New menu:** the menu changes when ingredients come and go, not monthly. Update `content/menu.json` (`updated`, the three courses, photos and captions, PDF path). Put the new PDF in `public/pdf` and new photos in `public/photos`. Check whether `content/drinks.json` should change too. The Links and Thanks pages show the crab cake and the crème brûlée; swap those photos if the dishes leave the menu.
- **Closed for a holiday:** add the date to `closedDates` in `content/hours.json`, and turn on `notice` with a short line if Kim wants one.
- **Press:** add the article to `press` in `content/site.json`, newest first, and the outlet to `featuredBy` if it's new.

## Writing for this site

- US English. Warm, plain and brief, the way Kim and Eric would say it to a guest.
- Avoid em dashes and exclamation marks. Use commas, colons or a new sentence.
- Times read "5 pm" and "8:30 pm"; days read "Tuesday to Thursday". Prices are plain numbers.
- Hours are an opening time and a last seating. The room stays open until about 9:30 or 10, so never write hours as "5 to 8 pm".
- Google Business Profile, and the structured data in `src/lib/schema.ts`, list closing time as the last seating on purpose, so nobody arrives at 9 expecting a table. Keep it that way.
- Party sizes in a range use numerals and say "people" or "guests" ("5 to 7 people"), so they can't be mistaken for times.
- Gift certificates are the old-school paper kind, bought at the restaurant or by phone and mailed. There are no online gift cards.
- Never put a month in menu headings. The site shows the date the menu was last updated instead.
- Don't name growers or suppliers on the website or printed menus; Eric prefers it that way. No photo credit is needed on the site.
- Notes from the kitchen goes out about once a season.
- Every photo needs a short, literal description in its `alt` text.

## Before you push

1. `npm run build` passes.
2. Look at each changed page at 320, 360, 390 and 1440 px wide, including each tab on the Menus page. Nothing should scroll sideways.
3. Work on a branch for every change, content included, and send Arthur the Vercel preview link.
