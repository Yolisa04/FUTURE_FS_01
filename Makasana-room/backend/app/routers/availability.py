from fastapi import APIRouter, HTTPException, Query
from datetime import datetime
from app.database import get_db
from app.config import settings

router = APIRouter(prefix="/api/availability", tags=["availability"])

# Business hours: 10:00 - 18:30, 30 minute slots. Kept simple on purpose -
# a real system would let each stylist override this, but this covers
# the default salon schedule fine.
BUSINESS_START = "10:00"
BUSINESS_END = "18:00"
SLOT_MINUTES = 30


def generate_slots():
    from datetime import timedelta
    start = datetime.strptime(BUSINESS_START, "%H:%M")
    end = datetime.strptime(BUSINESS_END, "%H:%M")
    slots = []
    current = start
    while current <= end:
        slots.append(current.strftime("%H:%M"))
        current += timedelta(minutes=SLOT_MINUTES)
    return slots


@router.get("")
async def get_availability(
    stylist_id: str = Query(...),
    date: str = Query(..., description="YYYY-MM-DD"),
):
    db = get_db()

    try:
        requested_date = datetime.strptime(date, "%Y-%m-%d")
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid date format, expected YYYY-MM-DD")

    if requested_date.date() < datetime.utcnow().date():
        return {"date": date, "stylist_id": stylist_id, "available_slots": []}

    # weekday(): Monday=0 ... Sunday=6
    if requested_date.weekday() == settings.CLOSED_WEEKDAY:
        return {"date": date, "stylist_id": stylist_id, "available_slots": [], "reason": "closed"}

    stylist = await db.stylists.find_one({"id": stylist_id})
    if not stylist:
        raise HTTPException(status_code=404, detail="Stylist not found")

    if requested_date.weekday() not in stylist.get("working_days", []):
        return {"date": date, "stylist_id": stylist_id, "available_slots": [], "reason": "stylist_off"}

    all_slots = generate_slots()

    booked_cursor = db.bookings.find(
        {"stylist_id": stylist_id, "date": date, "status": {"$ne": "cancelled"}},
        {"time": 1, "_id": 0},
    )
    booked_times = {b["time"] async for b in booked_cursor}

    available = [s for s in all_slots if s not in booked_times]

    return {"date": date, "stylist_id": stylist_id, "available_slots": available}
