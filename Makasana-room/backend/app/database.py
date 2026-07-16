from motor.motor_asyncio import AsyncIOMotorClient
from app.config import settings


class Database:
    client: AsyncIOMotorClient = None
    db = None


database = Database()


async def connect_to_mongo():
    database.client = AsyncIOMotorClient(settings.MONGO_URL)
    database.db = database.client[settings.DB_NAME]
    # helpful indexes - not strictly required but keeps lookups fast
    # and stops us from double-booking the same stylist/slot.
    await database.db.bookings.create_index(
        [("stylist_id", 1), ("date", 1), ("time", 1)],
        unique=True,
        partialFilterExpression={"status": {"$ne": "cancelled"}},
    )
    await database.db.users.create_index("email", unique=True)


async def close_mongo_connection():
    if database.client:
        database.client.close()


def get_db():
    return database.db
