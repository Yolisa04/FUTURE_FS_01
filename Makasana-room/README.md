# Makasana Room

A premium salon booking platform: a marketing site plus a full appointment
system, built for independent salons, studios, spas, and barbershops.

This repo has two apps:

```
makasana-room/
  backend/    FastAPI + MongoDB API
  frontend/   React 19 + Tailwind CSS site and booking flow
```

## Quick start

You'll need Python 3.12+, Node 18+, and a MongoDB instance (local or Atlas).

### 1. Backend

```bash
cd backend
python3 -m venv venv
source venv/bin/activate          # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env              # then edit .env with your Mongo URL, etc.
python -m app.seed                # loads demo services, stylists, admin user
uvicorn app.main:app --reload --port 8000
```

The API is now live at `http://localhost:8000`. Interactive docs are at
`http://localhost:8000/docs`.

Default admin login (created by the seed script):

```
email:    admin@makasanaroom.com
password: MakasanaAdmin123!
```

### 2. Frontend

In a second terminal:

```bash
cd frontend
npm install
cp .env.example .env              # points at http://localhost:8000 by default
npm run dev
```

Visit `http://localhost:5173`.

- `/` — landing page (services, team, gallery, testimonials, membership, contact)
- `/booking` — the four-step booking flow
- `/admin/login` — admin sign in
- `/admin` — booking dashboard (protected)
- `/pitch` — sales page aimed at salon owners

## What's actually implemented

- **Booking flow**: service → stylist → date/time → customer details, with
  a live availability check against the backend before a slot can be picked.
- **Double-booking protection**: the API checks the slot server-side and
  also enforces it with a unique MongoDB index, so two people can't grab the
  same slot even if they submit at the same moment.
- **Admin dashboard**: stats (today's appointments, confirmed, cancelled,
  total), a filterable booking table, and the ability to cancel a booking.
- **JWT auth** for the admin area.
- **Contact form** that writes to MongoDB.
- **Email + SMS hooks** via Resend and Twilio — these are wired up and will
  fire automatically once you add API keys to `backend/.env`. Without keys,
  they no-op and log to the console instead of failing the request.

## What's stubbed out

Stripe deposits, Google Calendar sync, loyalty points, and gift cards are
described in the original spec as things worth adding later — they aren't
built here. The `future enhancements` section in the project brief covers
these; wiring up Stripe Checkout on top of the existing `deposit_amount`
field on bookings would be the natural next step.

## Tech stack

**Frontend:** React 19, React Router, Tailwind CSS, Axios, Sonner, Lucide icons
**Backend:** FastAPI, Motor (async MongoDB driver), Pydantic, python-jose (JWT), Passlib (bcrypt)
**Database:** MongoDB

## Deployment notes

The original brief calls for Vercel (frontend), Render (backend), and
MongoDB Atlas. Nothing here is tied to those specifically — any static host
works for the Vite build output, and any ASGI-friendly host works for the
FastAPI app. Just make sure `CORS_ORIGINS` in the backend `.env` includes
your deployed frontend URL.
