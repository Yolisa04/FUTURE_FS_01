# Makasana Room — Backend

FastAPI service backing the Makasana Room booking platform.

## Setup

```bash
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
```

Edit `.env` — at minimum set `MONGO_URL` if you're not running Mongo locally
on the default port. Everything else has a working default for local dev.

Seed the database (services, stylists, one admin user):

```bash
python -m app.seed
```

Run it:

```bash
uvicorn app.main:app --reload --port 8000
```

Docs: `http://localhost:8000/docs`

## Project layout

```
app/
  main.py           FastAPI app, CORS, router registration
  config.py         env-driven settings
  database.py       Motor client + index setup
  models.py         Pydantic schemas
  auth_utils.py     JWT + password hashing
  notifications.py  Resend email / Twilio SMS helpers
  seed.py           demo data loader
  routers/
    services.py     service catalog CRUD
    stylists.py     stylist CRUD
    availability.py slot calculation
    bookings.py     booking creation, listing, stats, cancellation
    contact.py      contact form
    auth.py         admin login
```

## Notes on the availability engine

Business hours are fixed at 10:00–18:00 in 30-minute increments
(`app/routers/availability.py`) — change `BUSINESS_START`, `BUSINESS_END`,
or `SLOT_MINUTES` there if your salon runs different hours. The salon is
closed on `CLOSED_WEEKDAY` (Monday by default, set in `.env`), and each
stylist has their own `working_days` on top of that.

## Double-booking protection

Two layers:
1. The booking endpoint checks for an existing non-cancelled booking at the
   same stylist/date/time before inserting.
2. A partial unique index on `bookings` (`stylist_id`, `date`, `time`, where
   `status != "cancelled"`) catches the race condition if two requests land
   at the same instant.

## Testing

There's no bundled test suite, but the app is a standard FastAPI app and
plays nicely with `TestClient` from `fastapi.testclient`. If you don't have
MongoDB running locally, `mongomock-motor` is a drop-in way to test the
routes without a real database — swap `database.connect_to_mongo` for a
version that points at `mongomock_motor.AsyncMongoMockClient()`.
