from fastapi import APIRouter, Depends
from typing import List
from app.database import get_db
from app.models import ContactMessageCreate, ContactMessage
from app.auth_utils import get_current_admin

router = APIRouter(prefix="/api/contact", tags=["contact"])


@router.post("", response_model=ContactMessage, status_code=201)
async def submit_contact_message(payload: ContactMessageCreate):
    db = get_db()
    message = ContactMessage(**payload.model_dump())
    await db.contact_messages.insert_one(message.model_dump())
    return message


@router.get("", response_model=List[ContactMessage])
async def list_contact_messages(admin=Depends(get_current_admin)):
    db = get_db()
    docs = await db.contact_messages.find({}, {"_id": 0}).sort("created_at", -1).to_list(500)
    return docs
