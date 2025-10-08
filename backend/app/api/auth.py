# app/api/auth.py

from fastapi import APIRouter, HTTPException, Depends, Request, Response
from pydantic import BaseModel, EmailStr
from app.repositories.auth_repository import (
    get_user_by_email,
    create_user,
    update_refresh_token,
    clear_refresh_token,
)
from app.core.security import (
    verify_password,
    create_access_token,
    create_refresh_token,
    decode_token,
)

router = APIRouter(prefix="/auth", tags=["Auth"])

class SignUpRequest(BaseModel):
  first_name: str
  last_name: str
  email: EmailStr
  password: str
@router.post("/sign-up")
async def sign_up(payload: SignUpRequest):
  existing_user = await get_user_by_email(payload.email)
  if existing_user:
    raise HTTPException(status_code=400, detail="Email already registered")

  user = await create_user(payload.first_name, payload.last_name, payload.email, payload.password)
  return {"message": "User created successfully", "user": {"fullname": user["fullname"], "email": user["email"]}}


class SignInRequest(BaseModel):
  email: EmailStr
  password: str
@router.post("/sign-in")
async def sign_in(payload: SignInRequest, response: Response):
  user = await get_user_by_email(payload.email)
  if not user or not verify_password(payload.password, user["password"]):
    raise HTTPException(status_code=401, detail="Invalid credentials")

  access_token = create_access_token({"sub": str(user["_id"])})
  refresh_token = create_refresh_token({"sub": str(user["_id"])})

  await update_refresh_token(payload.email, refresh_token)

  # Set cookies (optional, depends on frontend)
  response.set_cookie(key="access_token", value=access_token, httponly=True, secure=True)
  response.set_cookie(key="refresh_token", value=refresh_token, httponly=True, secure=True)

  return {
    "message": "Login successful",
    "access_token": access_token,
    "refresh_token": refresh_token,
  }


@router.patch("/sign-out")
async def sign_out(request: Request, response: Response):
  refresh_token = request.cookies.get("refresh_token")
  if not refresh_token:
    raise HTTPException(status_code=400, detail="No refresh token found")

  payload = decode_token(refresh_token)
  if not payload:
    raise HTTPException(status_code=401, detail="Invalid refresh token")

  user_id = payload.get("sub")
  user = await get_user_by_email(payload.get("email", ""))
  if user:
    await clear_refresh_token(user["email"])

  response.delete_cookie("access_token")
  response.delete_cookie("refresh_token")

  return {"message": "User logged out successfully"}


@router.patch("/refresh-access-token")
async def refresh_access_token(request: Request, response: Response):
  refresh_token = request.cookies.get("refresh_token")
  if not refresh_token:
    raise HTTPException(status_code=400, detail="No refresh token found")

  payload = decode_token(refresh_token)
  if not payload:
    raise HTTPException(status_code=401, detail="Invalid or expired refresh token")

  user = await get_user_by_email(payload.get("email", ""))
  if not user or user["refresh_token"] != refresh_token:
    raise HTTPException(status_code=403, detail="Unauthorized")

  new_access_token = create_access_token({"sub": str(user["_id"])})
  response.set_cookie(key="access_token", value=new_access_token, httponly=True, secure=True)

  return {"message": "Access token refreshed", "access_token": new_access_token}
