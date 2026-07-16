"""
Run with: python -m app.seed
Populates services, stylists, and a default admin account so the app
has something to show right after setup. Safe to re-run - it clears
the relevant collections first instead of piling up duplicates.
"""
import asyncio
from app.database import connect_to_mongo, close_mongo_connection, get_db
from app.models import Service, Stylist, AdminUser
from app.auth_utils import hash_password

SERVICES = [
    dict(name="Chiskop", description="Clean, close shave-down cut.",
         duration_minutes=20, price=50, category="Hair"),
    dict(name="Fade", description="Classic tapered fade, blended to your preferred length.",
         duration_minutes=45, price=120, category="Hair"),
    dict(name="Tapper Fade", description="Skin-tight taper fade with a sharp, defined line-up.",
         duration_minutes=70, price=110, category="Hair"),
    dict(name="Tinted Fade", description="Fade finished with a semi-permanent tint for extra contrast.",
         duration_minutes=80, price=150, category="Color"),
    dict(name="Tinted Tapper Fade", description="Tapper fade plus a full tint finish.",
         duration_minutes=70, price=130, category="Color"),
    dict(name="Brush Cut", description="Short, even, low-maintenance all-over cut.",
         duration_minutes=30, price=80, category="Hair"),
]

STYLISTS = [
    dict(name="Kasi Jonasi", role="Master Barber", bio="Known for precision fades and sharp line-ups.",
         specialties=["Fade", "Tapper Fade", "Line-Up"], working_days=[1, 2, 3, 4, 5, 6]),
]

DEFAULT_ADMIN_EMAIL = "admin@makasanaroom.com"
DEFAULT_ADMIN_PASSWORD = "MakasanaAdmin123!"


async def seed():
    await connect_to_mongo()
    db = get_db()

    await db.services.delete_many({})
    await db.stylists.delete_many({})

    service_docs = [Service(**s).model_dump() for s in SERVICES]
    stylist_docs = [Stylist(**s).model_dump() for s in STYLISTS]

    await db.services.insert_many(service_docs)
    await db.stylists.insert_many(stylist_docs)

    existing_admin = await db.users.find_one({"email": DEFAULT_ADMIN_EMAIL})
    if not existing_admin:
        admin = AdminUser(
            email=DEFAULT_ADMIN_EMAIL,
            password_hash=hash_password(DEFAULT_ADMIN_PASSWORD),
        )
        await db.users.insert_one(admin.model_dump())
        print(f"Created default admin -> {DEFAULT_ADMIN_EMAIL} / {DEFAULT_ADMIN_PASSWORD}")
    else:
        print("Admin user already exists, skipping.")

    print(f"Seeded {len(service_docs)} services and {len(stylist_docs)} stylists.")
    await close_mongo_connection()


if __name__ == "__main__":
    asyncio.run(seed())
