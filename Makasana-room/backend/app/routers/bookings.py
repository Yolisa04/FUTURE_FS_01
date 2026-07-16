import random
import string
from datetime import datetime
from fastapi import APIRouter, HTTPException, Depends, BackgroundTasks, Query
from pymongo.errors import DuplicateKeyError
from typing import Optional, List

from app.database import get_db
from app.models import BookingCreate, Booking, BookingStatusUpdate
from app.auth_utils import get_current_admin
from app.notifications import send_booking_email, send_booking_sms, booking_confirmation_html
from app.config import settings

router = APIRouter(prefix="/api/bookings", tags=["bookings"])


def generate_booking_ref() -> str:
    year = datetime.utcnow().year
    suffix = "".join(random.choices(string.digits, k=4))
    return f"BKG-{year}-{suffix}"


async def send_confirmation(booking: dict, service_name: str):
    html = booking_confirmation_html(
        booking["customer"]["name"], service_name, booking["date"], booking["time"]
    )
    await send_booking_email(booking["customer"]["email"], "Your Makasana Room appointment is confirmed", html)
    await send_booking_sms(
        booking["customer"]["phone"],
        f"Your appointment is confirmed for {booking['date']} at {booking['time']}.",
    )


@router.post("", response_model=Booking, status_code=201)
async def create_booking(payload: BookingCreate, background_tasks: BackgroundTasks):
    db = get_db()

    service = await db.services.find_one({"id": payload.service_id})
    if not service:
        raise HTTPException(status_code=400, detail="Selected service does not exist")

    stylist = await db.stylists.find_one({"id": payload.stylist_id})
    if not stylist:
        raise HTTPException(status_code=400, detail="Selected stylist does not exist")

    requested_date = datetime.strptime(payload.date, "%Y-%m-%d")
    if requested_date.date() < datetime.utcnow().date():
        raise HTTPException(status_code=400, detail="Cannot book a date in the past")

    if requested_date.weekday() == settings.CLOSED_WEEKDAY:
        raise HTTPException(status_code=400, detail="Salon is closed on this day")

    # Check the slot is actually free (defends against races via the unique index too)
    existing = await db.bookings.find_one({
        "stylist_id": payload.stylist_id,
        "date": payload.date,
        "time": payload.time,
        "status": {"$ne": "cancelled"},
    })
    if existing:
        raise HTTPException(status_code=409, detail="This time slot has just been booked. Please choose another.")

    booking = Booking(
        booking_ref=generate_booking_ref(),
        service_id=payload.service_id,
        stylist_id=payload.stylist_id,
        date=payload.date,
        time=payload.time,
        customer=payload.customer,
    )

    try:
        await db.bookings.insert_one(booking.model_dump())
    except DuplicateKeyError:
        raise HTTPException(status_code=409, detail="This time slot has just been booked. Please choose another.")

    background_tasks.add_task(send_confirmation, booking.model_dump(), service["name"])

    return booking


@router.get("", response_model=List[Booking])
async def list_bookings(
    status_filter: Optional[str] = Query(None, alias="status"),
    date: Optional[str] = None,
    admin=Depends(get_current_admin),
):
    db = get_db()
    query = {}
    if status_filter and status_filter != "all":
        query["status"] = status_filter
    if date:
        query["date"] = date
    docs = await db.bookings.find(query, {"_id": 0}).sort([("date", 1), ("time", 1)]).to_list(1000)
    return docs


@router.get("/stats")
async def booking_stats(admin=Depends(get_current_admin)):
    db = get_db()
    today = datetime.utcnow().strftime("%Y-%m-%d")

    today_count = await db.bookings.count_documents({"date": today, "status": {"$ne": "cancelled"}})
    confirmed = await db.bookings.count_documents({"status": "confirmed"})
    cancelled = await db.bookings.count_documents({"status": "cancelled"})
    total = await db.bookings.count_documents({})

    return {"today": today_count, "confirmed": confirmed, "cancelled": cancelled, "total": total}


@router.get("/{booking_id}", response_model=Booking)
async def get_booking(booking_id: str):
    db = get_db()
    doc = await db.bookings.find_one({"id": booking_id}, {"_id": 0})
    if not doc:
        raise HTTPException(status_code=404, detail="Booking not found")
    return doc


@router.patch("/{booking_id}/status", response_model=Booking)
async def update_booking_status(booking_id: str, payload: BookingStatusUpdate, admin=Depends(get_current_admin)):
    if payload.status not in ("confirmed", "cancelled"):
        raise HTTPException(status_code=400, detail="Status must be 'confirmed' or 'cancelled'")

    db = get_db()
    result = await db.bookings.update_one({"id": booking_id}, {"$set": {"status": payload.status}})
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Booking not found")

    doc = await db.bookings.find_one({"id": booking_id}, {"_id": 0})
    return doc
