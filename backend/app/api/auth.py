# app/api/auth.py

from fastapi import APIRouter, HTTPException, Depends, Request, Response, status
from pydantic import BaseModel, EmailStr, field_validator
import re
from app.repositories.auth_repository import (
    get_user_by_email,
    create_user,
    update_refresh_token,
    clear_refresh_token,
    get_user_by_id
)
from app.core.security import (
    verify_password,
    create_access_token,
    create_refresh_token,
    decode_token,
)
from app.core.config import ACCESS_TOKEN_EXPIRE_MINUTES, REFRESH_TOKEN_EXPIRE_DAYS
from app.api.consts import AUTH_API_PREFIX
from app.dependencies.auth import verify_jwt_and_get_user


router = APIRouter(prefix=AUTH_API_PREFIX, tags=["Auth"])

def set_token_cookies(response: Response, access_token: str, refresh_token: str):
  response.set_cookie(
    key="access_token",
    value=access_token,
    httponly=True,
    secure=True,  
    samesite="strict",
    max_age=ACCESS_TOKEN_EXPIRE_MINUTES * 60
  )
  response.set_cookie(
    key="refresh_token",
    value=refresh_token,
    httponly=True,
    secure=True,
    samesite="strict",
    max_age=REFRESH_TOKEN_EXPIRE_DAYS * 24 * 60 * 60
  )

class SignUpRequest(BaseModel):
  first_name: str
  last_name: str
  email: EmailStr
  password: str

  @field_validator("password")
  @classmethod
  def validate_password(cls, v):
    if len(v) < 8:
      raise ValueError("Password must be at least 8 characters long.")
    if not re.search(r"[A-Z]", v):
      raise ValueError("Password must contain at least one uppercase letter.")
    if not re.search(r"[a-z]", v):
      raise ValueError("Password must contain at least one lowercase letter.")
    if not re.search(r"\d", v):
      raise ValueError("Password must contain at least one number.")

@router.post("/sign-up", status_code=status.HTTP_201_CREATED)
async def sign_up(payload: SignUpRequest, response: Response):
  existing_user = await get_user_by_email(payload.email)
  if existing_user:
    raise HTTPException(status_code=400, detail="Email already registered")

  user = await create_user(payload.first_name, payload.last_name, payload.email, payload.password)
  # Create tokens immediately upon signup
  access_token = create_access_token({
    "sub": str(user["_id"]),
    "email": user["email"],
    "first_name": user["first_name"],
    "last_name": user["last_name"]
})
  refresh_token = create_refresh_token(str(user["_id"]))

  # Save refresh token in DB
  await update_refresh_token(user["email"], refresh_token)

  set_token_cookies(response, access_token, refresh_token)

  return {
    "message": "User created and logged in successfully",
    "user": {
        "first_name": user["first_name"],
        "last_name": user["last_name"],
        "email": user["email"],
    },
    "access_token": access_token,
    "refresh_token": refresh_token,
  }



class SignInRequest(BaseModel):
  email: EmailStr
  password: str

@router.post("/sign-in", status_code=status.HTTP_200_OK)
async def sign_in(payload: SignInRequest, response: Response):
  user = await get_user_by_email(payload.email)
  if not user or not verify_password(payload.password, user["password"]):
    raise HTTPException(status_code=401, detail="Invalid credentials")

  access_token = create_access_token({
    "sub": str(user["_id"]),
    "email": user["email"],
    "first_name": user["first_name"],
    "last_name": user["last_name"]
  })
  refresh_token = create_refresh_token(str(user["_id"]))

  await update_refresh_token(payload.email, refresh_token)

  set_token_cookies(response, access_token, refresh_token)

  return {
    "message": "Login successful",
    "access_token": access_token,
    "refresh_token": refresh_token,
  }



@router.post("/sign-out", status_code=status.HTTP_204_NO_CONTENT)
async def sign_out(user = Depends(verify_jwt_and_get_user), response: Response = None):
  await clear_refresh_token(user["email"])

  response.delete_cookie("access_token")
  response.delete_cookie("refresh_token")

  return {"message": "User logged out successfully"}



@router.post("/refresh-access-token")
async def refresh_access_token(request: Request, response: Response):
  refresh_token = request.cookies.get("refresh_token")
  if not refresh_token:
    raise HTTPException(status_code=400, detail="No refresh token found")

  payload = decode_token(refresh_token)
  if not payload:
    raise HTTPException(status_code=401, detail="Invalid or expired refresh token")

  user_id = payload.get("sub")
  if not user_id:
    raise HTTPException(status_code=401, detail="Invalid refresh token payload")

  # Fetch user by ID instead of email
  user = await get_user_by_id(user_id)
  if not user or user["refresh_token"] != refresh_token:
    raise HTTPException(status_code=403, detail="Unauthorized")

  # Create a new access token with user info
  new_access_token = create_access_token({
    "sub": str(user["_id"]),
    "email": user["email"],
    "first_name": user["first_name"],
    "last_name": user["last_name"]
  })

  # Set access token cookie
  response.set_cookie(
    key="access_token",
    value=new_access_token,
    httponly=True,
    secure=True
  )

  return {"message": "Access token refreshed", "access_token": new_access_token}

@router.get("/me")
async def auth_me(current_user: dict = Depends(verify_jwt_and_get_user)):
  """Return the currently logged-in user."""
  return {
    "user": {
      "id": current_user["id"],
      "first_name": current_user["first_name"],
      "last_name": current_user["last_name"],
      "email": current_user["email"],
    }
  }