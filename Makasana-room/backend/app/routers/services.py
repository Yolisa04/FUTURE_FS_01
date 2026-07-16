from fastapi import APIRouter, Depends, HTTPException
from typing import List
from app.database import get_db
from app.models import Service
from app.auth_utils import get_current_admin

router = APIRouter(prefix="/api/services", tags=["services"])


@router.get("", response_model=List[Service])
async def list_services():
    db = get_db()
    docs = await db.services.find({}, {"_id": 0}).to_list(200)
    return docs


@router.get("/{service_id}", response_model=Service)
async def get_service(service_id: str):
    db = get_db()
    doc = await db.services.find_one({"id": service_id}, {"_id": 0})
    if not doc:
        raise HTTPException(status_code=404, detail="Service not found")
    return doc


@router.post("", response_model=Service)
async def create_service(service: Service, admin=Depends(get_current_admin)):
    db = get_db()
    await db.services.insert_one(service.model_dump())
    return service


@router.put("/{service_id}", response_model=Service)
async def update_service(service_id: str, service: Service, admin=Depends(get_current_admin)):
    db = get_db()
    service.id = service_id
    result = await db.services.update_one({"id": service_id}, {"$set": service.model_dump()})
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Service not found")
    return service


@router.delete("/{service_id}")
async def delete_service(service_id: str, admin=Depends(get_current_admin)):
    db = get_db()
    result = await db.services.delete_one({"id": service_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Service not found")
    return {"deleted": True}
