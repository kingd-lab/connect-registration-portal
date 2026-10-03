# The Connect Retreat Registration

Next.js app for registering attendees for the Ministers and Workers Retreat 2026.

## Setup

1. `npm install`
2. Copy `.env.example` to `.env.local` and set `NEXT_PUBLIC_GOOGLE_SCRIPT_URL`
   to your deployed Google Apps Script Web App URL. The script should accept
   a POST with JSON body `{ name, email, gender, denomination, health, expectation }`,
   write it to a Google Sheet, and respond with JSON such as
   `{ "success": true, "code": "MWR-0001" }`.
3. Add your event flyer image to `public/flyer.jpg` (it will be displayed at
   the top of the registration form; if the file is missing it's simply
   skipped, so the form still works without it).
4. `npm run dev`

## Flow

- `/` — registration form. Submits to `/api/register`, which forwards the
  data to your Google Apps Script, then redirects to `/confirmation` with
  the submitted details and the registration code in the URL.
- `/confirmation` — shows a ticket with a QR code encoding the registrant's
  details, and a "Download Ticket" button that saves the ticket as a PNG.

To close registration again, set `REGISTRATION_OPEN = false` in `app/page.jsx`.

## Transportation

The transportation section below the registration form includes a WhatsApp
group link and a scannable QR code. Change `TRANSPORTATION_GROUP_URL` in
`app/TransportationSection.jsx` if the group invitation changes.
