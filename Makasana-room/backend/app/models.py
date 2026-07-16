from pydantic import BaseModel, EmailStr, Field, field_validator
from typing import Optional, List
from datetime import datetime
import uuid


def new_id() -> str:
    return str(uuid.uuid4())


# ---------- Services ----------

class Service(BaseModel):
    id: str = Field(default_factory=new_id)
    name: str
    description: Optional[str] = ""
    duration_minutes: int
    price: float
    category: Optional[str] = "General"
    image_url: Optional[str] = None


# ---------- Stylists ----------

class Stylist(BaseModel):
    id: str = Field(default_factory=new_id)
    name: str
    role: str
    bio: Optional[str] = ""
    specialties: List[str] = []
    photo_url: Optional[str] = None
    working_days: List[int] = [1, 2, 3, 4, 5, 6]  # 0=Mon ... 6=Sun, default closed Monday


# ---------- Bookings ----------

class CustomerInfo(BaseModel):
    name: str
    email: EmailStr
    phone: str
    notes: Optional[str] = ""


class BookingCreate(BaseModel):
    service_id: str
    stylist_id: str
    date: str  # YYYY-MM-DD
    time: str  # HH:MM 24h
    customer: CustomerInfo

    @field_validator("date")
    @classmethod
    def validate_date_format(cls, v):
        datetime.strptime(v, "%Y-%m-%d")
        return v

    @field_validator("time")
    @classmethod
    def validate_time_format(cls, v):
        datetime.strptime(v, "%H:%M")
        return v


class Booking(BaseModel):
    id: str = Field(default_factory=new_id)
    booking_ref: str
    service_id: str
    stylist_id: str
    date: str
    time: str
    customer: CustomerInfo
    status: str = "confirmed"  # confirmed | cancelled
    deposit_paid: bool = False
    deposit_amount: float = 0.0
    created_at: datetime = Field(default_factory=datetime.utcnow)


class BookingStatusUpdate(BaseModel):
    status: str  # confirmed | cancelled


# ---------- Contact ----------

class ContactMessageCreate(BaseModel):
    name: str
    email: EmailStr
    message: str


class ContactMessage(ContactMessageCreate):
    id: str = Field(default_factory=new_id)
    created_at: datetime = Field(default_factory=datetime.utcnow)


# ---------- Auth ----------

class UserLogin(BaseModel):
    email: EmailStr
    password: str


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"


class AdminUser(BaseModel):
    id: str = Field(default_factory=new_id)
    email: EmailStr
    password_hash: str
    role: str = "admin"
