from fastapi import APIRouter, Depends, HTTPException
from typing import List
from app.database import get_db
from app.models import Stylist
from app.auth_utils import get_current_admin

router = APIRouter(prefix="/api/stylists", tags=["stylists"])


@router.get("", response_model=List[Stylist])
async def list_stylists():
    db = get_db()
    docs = await db.stylists.find({}, {"_id": 0}).to_list(200)
    return docs


@router.get("/{stylist_id}", response_model=Stylist)
async def get_stylist(stylist_id: str):
    db = get_db()
    doc = await db.stylists.find_one({"id": stylist_id}, {"_id": 0})
    if not doc:
        raise HTTPException(status_code=404, detail="Stylist not found")
    return doc


@router.post("", response_model=Stylist)
async def create_stylist(stylist: Stylist, admin=Depends(get_current_admin)):
    db = get_db()
    await db.stylists.insert_one(stylist.model_dump())
    return stylist


@router.put("/{stylist_id}", response_model=Stylist)
async def update_stylist(stylist_id: str, stylist: Stylist, admin=Depends(get_current_admin)):
    db = get_db()
    stylist.id = stylist_id
    result = await db.stylists.update_one({"id": stylist_id}, {"$set": stylist.model_dump()})
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Stylist not found")
    return stylist


@router.delete("/{stylist_id}")
async def delete_stylist(stylist_id: str, admin=Depends(get_current_admin)):
    db = get_db()
    result = await db.stylists.delete_one({"id": stylist_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Stylist not found")
    return {"deleted": True}
