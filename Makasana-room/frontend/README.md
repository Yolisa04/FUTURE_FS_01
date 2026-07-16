# Makasana Room — Frontend

React 19 + Vite + Tailwind CSS.

## Setup

```bash
npm install
cp .env.example .env    # VITE_API_URL, defaults to http://localhost:8000
npm run dev
```

## Build

```bash
npm run build
npm run preview   # serve the production build locally to check it
```

## Pages

| Route          | What's there                                           |
|----------------|---------------------------------------------------------|
| `/`            | Landing page — hero, services, team, gallery, testimonials, membership, contact form |
| `/booking`     | Four-step booking flow with live availability           |
| `/admin/login` | Admin sign-in                                            |
| `/admin`       | Protected dashboard — stats, booking table, cancel action|
| `/pitch`       | Sales page for prospective salon owners                  |

## Notes

- The landing page's services/team sections fetch from the API but fall
  back to hardcoded demo content if the request fails, so the page never
  looks broken if the backend isn't running yet.
- Auth token lives in `localStorage` under `ochre_admin_token` and is
  attached to requests automatically by the Axios instance in `src/api/client.js`.
- The calendar in the booking flow is a small hand-built component (see
  `src/components/booking/StepDateTime.jsx`) rather than a third-party
  date-picker library, to keep the dependency footprint light.
