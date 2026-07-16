from fastapi import APIRouter, HTTPException, Depends
from app.database import get_db
from app.models import UserLogin, Token
from app.auth_utils import verify_password, create_access_token, get_current_admin

router = APIRouter(prefix="/api/auth", tags=["auth"])


@router.post("/login", response_model=Token)
async def login(payload: UserLogin):
    db = get_db()
    user = await db.users.find_one({"email": payload.email})
    if not user or not verify_password(payload.password, user["password_hash"]):
        raise HTTPException(status_code=401, detail="Incorrect email or password")

    token = create_access_token({"sub": user["email"], "role": user.get("role", "admin")})
    return Token(access_token=token)


@router.get("/me")
async def me(admin=Depends(get_current_admin)):
    return admin
